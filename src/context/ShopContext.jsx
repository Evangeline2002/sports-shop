import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { dbService } from "../services/dbService";
import { districts } from "../data/districts";
import { useLanguage } from "./LanguageContext";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { t } = useLanguage();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [nearbyFilter, setNearbyFilter] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState("name"); // name, rating, recent

  // Selection States
  const [selectedShop, setSelectedShop] = useState(null);

  // Local analytics state
  const [uploadCount, setUploadCount] = useState(() => {
    return parseInt(localStorage.getItem("excel_upload_count") || "0", 10);
  });

  const [searchAnalyticsCount, setSearchAnalyticsCount] = useState(0);

  // Initialize and load shops
  const fetchShops = async () => {
    setLoading(true);
    try {
      const data = await dbService.getAllShops();
      setShops(data);
      setError(null);

      // Log loaded data
      if (process.env.NODE_ENV === 'development') {
        console.log(`[ShopContext] Loaded ${data.length} shops from database`);
        console.log(`[ShopContext] All shops should display on map - no limits applied`);
      }
    } catch (err) {
      console.error("Failed to fetch shops", err);
      setError("Error loading sports shops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
    // Count search analytics
    setSearchAnalyticsCount(dbService.getSearchQueries().reduce((acc, q) => acc + q.count, 0));

    // Log data loading for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[ShopContext] Initialized. Excel data has 689 shops total from TN_38District file');
    }
  }, []);

  // CRUD Operations
  const addShop = async (shopData) => {
    try {
      const newShop = await dbService.addShop(shopData);
      setShops((prev) => [...prev, newShop]);
      return { success: true, shop: newShop };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const updateShop = async (id, shopData) => {
    try {
      const updatedShop = await dbService.updateShop(id, shopData);
      setShops((prev) => prev.map((s) => (s.id === id ? updatedShop : s)));
      if (selectedShop?.id === id) {
        setSelectedShop(updatedShop);
      }
      return { success: true, shop: updatedShop };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const deleteShop = async (id) => {
    try {
      await dbService.deleteShop(id);
      setShops((prev) => prev.filter((s) => s.id !== id));
      if (selectedShop?.id === id) {
        setSelectedShop(null);
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const bulkImport = async (newShops, options = {}) => {
    try {
      const { imported, duplicates } = await dbService.bulkImport(newShops, options);
      if (imported.length > 0) {
        setShops((prev) => [...prev, ...imported]);
        const newCount = uploadCount + 1;
        setUploadCount(newCount);
        localStorage.setItem("excel_upload_count", newCount.toString());
      }
      return { success: true, importedCount: imported.length, duplicatesCount: duplicates.length };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const toggleVisited = async (id) => {
    try {
      const shop = shops.find((s) => s.id === id);
      if (!shop) return { success: false, error: "Shop not found" };
      const updatedShop = await dbService.updateShop(id, {
        ...shop,
        visited: !shop.visited,
      });
      setShops((prev) => prev.map((s) => (s.id === id ? updatedShop : s)));
      if (selectedShop?.id === id) {
        setSelectedShop(updatedShop);
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const bulkDelete = async (ids) => {
    try {
      await dbService.bulkDelete(ids);
      setShops((prev) => prev.filter((s) => !ids.includes(s.id)));
      if (ids.includes(selectedShop?.id)) {
        setSelectedShop(null);
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const visitedCount = useMemo(() => {
    return shops.filter((s) => s.visited).length;
  }, [shops]);

  // Helper formula to compute geodistance in km (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Log queries with analytics tracker
  const logSearch = (queryText) => {
    if (queryText && queryText.trim().length > 1) {
      dbService.logSearchQuery(queryText);
      setSearchAnalyticsCount(dbService.getSearchQueries().reduce((acc, q) => acc + q.count, 0));
    }
  };

  // Filtered and Sorted Shops Memoization
  const filteredShops = useMemo(() => {
    let result = [...shops];

    // 1. District Filter
    if (selectedDistrict) {
      // Find district name
      const distObj = districts.find(d => d.id === selectedDistrict.toLowerCase());
      if (distObj) {
        result = result.filter(
          (s) => s.district?.toLowerCase() === distObj.name.toLowerCase()
        );
      }
    }

    // 2. Global Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          (s.shop_name && s.shop_name.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q)) ||
          (s.district && s.district.toLowerCase().includes(q))
      );
    }

    // 3. Rating Filter
    if (ratingFilter > 0) {
      result = result.filter((s) => s.rating >= ratingFilter);
    }

    // 4. GPS Distance Filter (within 50 km default)
    if (nearbyFilter && userLocation) {
      result = result.filter((s) => {
        if (!s.latitude || !s.longitude) return false;
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          s.latitude,
          s.longitude
        );
        return dist <= 50; // 50km radius
      });
    }

    // 5. Sorting
    if (sortBy === "name") {
      result.sort((a, b) => (a.shop_name || "").localeCompare(b.shop_name || ""));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [shops, searchQuery, selectedDistrict, ratingFilter, nearbyFilter, userLocation, sortBy]);

  // District wise statistics calculation
  const districtStats = useMemo(() => {
    const stats = {};
    districts.forEach((d) => {
      stats[d.name] = {
        id: d.id,
        name: d.name,
        nameTa: d.nameTa,
        count: 0,
        lat: d.lat,
        lng: d.lng
      };
    });

    shops.forEach((s) => {
      // Find matching district
      const match = districts.find(
        (d) => d.name.toLowerCase() === s.district?.toLowerCase()
      );
      if (match) {
        stats[match.name].count += 1;
      }
    });

    return Object.values(stats);
  }, [shops]);

  return (
    <ShopContext.Provider
      value={{
        shops,
        filteredShops,
        districtStats,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedDistrict,
        setSelectedDistrict,
        ratingFilter,
        setRatingFilter,
        nearbyFilter,
        setNearbyFilter,
        userLocation,
        setUserLocation,
        sortBy,
        setSortBy,
        selectedShop,
        setSelectedShop,
        uploadCount,
        searchAnalyticsCount,
        fetchShops,
        addShop,
        updateShop,
        deleteShop,
        bulkImport,
        bulkDelete,
        calculateDistance,
        logSearch,
        toggleVisited,
        visitedCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShops = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShops must be used within a ShopProvider");
  }
  return context;
};
