import { db, isFirebaseConfigured } from "../firebase/config";
import sportsShops from "../data/sportsShops";
import { districts } from "../data/districts";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  query,
  where
} from "firebase/firestore";

const COLLECTION_NAME = "sports_shops";
const SEARCH_LOGS_KEY = "search_analytics_logs";
const DATA_VERSION = "v2-excel-689"; // bump this whenever seed data changes
const DATA_VERSION_KEY = "sports_shops_data_version";

// LocalStorage helpers
const getLocalShops = () => {
  // Version check: if data version doesn't match, re-seed with latest Excel data
  const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
  if (storedVersion !== DATA_VERSION) {
    console.log(`[dbService] Data version mismatch (${storedVersion} → ${DATA_VERSION}). Re-seeding with ${sportsShops.length} Excel shops.`);
    localStorage.setItem(COLLECTION_NAME, JSON.stringify(sportsShops));
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
    return sportsShops;
  }

  const local = localStorage.getItem(COLLECTION_NAME);
  if (!local) {
    // Seed database if empty
    localStorage.setItem(COLLECTION_NAME, JSON.stringify(sportsShops));
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
    return sportsShops;
  }
  try {
    return JSON.parse(local);
  } catch (e) {
    return sportsShops;
  }
};

const saveLocalShops = (shops) => {
  localStorage.setItem(COLLECTION_NAME, JSON.stringify(shops));
};

export const dbService = {
  // Check active mode
  isFirebaseActive: () => isFirebaseConfigured && db,

  // Get all shops
  getAllShops: async () => {
    if (dbService.isFirebaseActive()) {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const shops = [];
        querySnapshot.forEach((docSnapshot) => {
          shops.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });
        // If firestore is empty, seed it with mock shops for a premium initial experience
        if (shops.length === 0) {
          console.log(`Firestore empty. Seeding with ${sportsShops.length} Excel shops...`);
          const batch = writeBatch(db);
          sportsShops.forEach((shop) => {
            const docRef = doc(collection(db, COLLECTION_NAME));
            // remove id since firestore generates doc key
            const { id, ...shopData } = shop;
            batch.set(docRef, shopData);
            shops.push({ id: docRef.id, ...shopData });
          });
          await batch.commit();
          console.log(`✓ Firestore seeded with ${shops.length} shops. All will display on map.`);
        }
        return shops;
      } catch (err) {
        console.error("Firestore read error, fallback to LocalStorage", err);
        return getLocalShops();
      }
    } else {
      const localShops = getLocalShops();
      if (process.env.NODE_ENV === 'development') {
        console.log(`[dbService] Using localStorage. Loaded ${localShops.length} shops.`);
      }
      return localShops;
    }
  },

  // Add a shop
  addShop: async (shopData) => {
    const timestamp = new Date().toISOString();
    const newShop = {
      ...shopData,
      rating: parseFloat(shopData.rating) || 0,
      latitude: parseFloat(shopData.latitude) || 0,
      longitude: parseFloat(shopData.longitude) || 0,
      created_at: timestamp,
      updated_at: timestamp
    };

    if (dbService.isFirebaseActive()) {
      try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), newShop);
        return { id: docRef.id, ...newShop };
      } catch (err) {
        console.error("Firestore add error, fallback to LocalStorage", err);
        // Fallback to LocalStorage
        return dbService.addShopLocal(newShop);
      }
    } else {
      return dbService.addShopLocal(newShop);
    }
  },

  addShopLocal: (newShop) => {
    const shops = getLocalShops();
    const shopWithId = { ...newShop, id: "local-" + Date.now() };
    shops.push(shopWithId);
    saveLocalShops(shops);
    return shopWithId;
  },

  // Update a shop
  updateShop: async (id, shopData) => {
    const timestamp = new Date().toISOString();
    const updatedData = {
      ...shopData,
      rating: parseFloat(shopData.rating) || 0,
      latitude: parseFloat(shopData.latitude) || 0,
      longitude: parseFloat(shopData.longitude) || 0,
      updated_at: timestamp
    };

    // Remove firestore internal fields if updating
    delete updatedData.id;

    if (dbService.isFirebaseActive() && !id.startsWith("local-")) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updatedData);
        return { id, ...updatedData };
      } catch (err) {
        console.error("Firestore update error, fallback to LocalStorage", err);
        return dbService.updateShopLocal(id, updatedData);
      }
    } else {
      return dbService.updateShopLocal(id, updatedData);
    }
  },

  updateShopLocal: (id, updatedData) => {
    const shops = getLocalShops();
    const idx = shops.findIndex(s => s.id === id);
    if (idx !== -1) {
      shops[idx] = { ...shops[idx], ...updatedData, id };
      saveLocalShops(shops);
      return shops[idx];
    }
    throw new Error("Shop not found in local storage");
  },

  // Delete a shop
  deleteShop: async (id) => {
    if (dbService.isFirebaseActive() && !id.startsWith("local-")) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        return id;
      } catch (err) {
        console.error("Firestore delete error, fallback to LocalStorage", err);
        return dbService.deleteShopLocal(id);
      }
    } else {
      return dbService.deleteShopLocal(id);
    }
  },

  deleteShopLocal: (id) => {
    const shops = getLocalShops();
    const filtered = shops.filter(s => s.id !== id);
    saveLocalShops(filtered);
    return id;
  },

  // Bulk import with duplicate detection
  bulkImport: async (newShops, options = {}) => {
    const existingShops = await dbService.getAllShops();
    const importedShops = [];
    const duplicates = [];

    // Helper to normalise strings for comparison
    const normalise = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    const batch = dbService.isFirebaseActive() ? writeBatch(db) : null;
    const localShops = [...getLocalShops()];

    for (const shop of newShops) {
      // Check if duplicate (same name and district, or same phone/address)
      let isDuplicate = false;
      if (!options.force) {
        isDuplicate = existingShops.some(ex => {
          const sameName = normalise(ex.shop_name) === normalise(shop.shop_name);
          const sameDistrict = normalise(ex.district) === normalise(shop.district);
          const samePhone = shop.phone && ex.phone && normalise(ex.phone) === normalise(shop.phone);

          return (sameName && sameDistrict) || samePhone;
        });
      }

      if (isDuplicate) {
        duplicates.push(shop);
        continue;
      }

      const timestamp = new Date().toISOString();

      // Determine coordinates: prefer provided lat/lng, otherwise use district center with small jitter
      let lat = parseFloat(shop.latitude);
      let lng = parseFloat(shop.longitude);
      if (!lat || !lng) {
        const districtName = (shop.district || "").toString().toLowerCase();
        const distObj = districts.find(d => (d.name || "").toLowerCase() === districtName || (d.id || "") === districtName);

        if (distObj) {
          // small random offset within ~0.02 degrees (~2km)
          const jitter = () => (Math.random() - 0.5) * 0.02;
          lat = parseFloat((distObj.lat + jitter()).toFixed(6));
          lng = parseFloat((distObj.lng + jitter()).toFixed(6));
        } else {
          // fallback to Chennai center
          lat = 13.0827;
          lng = 80.2707;
        }
      }

      const shopToSave = {
        district: shop.district || "Chennai",
        shop_name: shop.shop_name,
        address: shop.address || "",
        latitude: lat,
        longitude: lng,
        phone: shop.phone || "",
        rating: parseFloat(shop.rating) || 4.0,
        website: shop.website || "",
        maps_url: shop.maps_url || `https://maps.google.com/?q=${encodeURIComponent(shop.shop_name + " " + (shop.district || ""))}`,
        created_at: timestamp,
        updated_at: timestamp
      };

      if (batch) {
        try {
          const docRef = doc(collection(db, COLLECTION_NAME));
          batch.set(docRef, shopToSave);
          importedShops.push({ id: docRef.id, ...shopToSave });
        } catch (err) {
          console.error("Batch write item prep failed, using local", err);
          const shopWithId = { ...shopToSave, id: "local-" + Math.random().toString(36).substr(2, 9) };
          localShops.push(shopWithId);
          importedShops.push(shopWithId);
        }
      } else {
        const shopWithId = { ...shopToSave, id: "local-" + Math.random().toString(36).substr(2, 9) };
        localShops.push(shopWithId);
        importedShops.push(shopWithId);
      }
    }

    if (batch && importedShops.length > 0) {
      try {
        await batch.commit();
      } catch (err) {
        console.error("Batch commit failed. Saving imported items to local storage.", err);
        // fallback
        saveLocalShops([...getLocalShops(), ...importedShops.map(s => ({ ...s, id: "local-" + s.id }))]);
      }
    } else if (importedShops.length > 0) {
      saveLocalShops(localShops);
    }

    return { imported: importedShops, duplicates };
  },

  // Bulk delete
  bulkDelete: async (ids) => {
    if (dbService.isFirebaseActive()) {
      try {
        const batch = writeBatch(db);
        let firebaseDeleted = false;
        ids.forEach(id => {
          if (!id.startsWith("local-")) {
            batch.delete(doc(db, COLLECTION_NAME, id));
            firebaseDeleted = true;
          }
        });
        if (firebaseDeleted) {
          await batch.commit();
        }
      } catch (err) {
        console.error("Firebase bulk delete error, using local fallback", err);
      }
    }

    // Always clean up local storage representation too
    const local = getLocalShops();
    const filtered = local.filter(s => !ids.includes(s.id));
    saveLocalShops(filtered);
    return ids;
  },

  // Search analytics query logger
  logSearchQuery: (queryText) => {
    if (!queryText || queryText.trim().length < 2) return;
    const logs = dbService.getSearchQueries();
    const cleanedQuery = queryText.trim().toLowerCase();

    const existingIndex = logs.findIndex(log => log.query === cleanedQuery);
    if (existingIndex !== -1) {
      logs[existingIndex].count += 1;
      logs[existingIndex].last_searched = new Date().toISOString();
    } else {
      logs.push({
        query: cleanedQuery,
        count: 1,
        last_searched: new Date().toISOString()
      });
    }
    localStorage.setItem(SEARCH_LOGS_KEY, JSON.stringify(logs));
  },

  getSearchQueries: () => {
    const raw = localStorage.getItem(SEARCH_LOGS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }
};
