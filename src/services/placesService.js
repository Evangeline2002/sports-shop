import axios from "axios";
import { districts } from "../data/districts";

const BACKEND_URL = "http://localhost:5000/api";

const simulateFetchLocal = async (district) => {
  // Wait to simulate network query latency
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const key = district.toLowerCase();
  const distObj = districts.find(d => d.id === key || d.name.toLowerCase() === key);
  const coords = distObj ? { lat: distObj.lat, lng: distObj.lng } : { lat: 11.1271, lng: 78.6569 };
  
  // Generate 3 unique sport shops per district with coordinates slightly offset
  const shopNames = [
    "Royal Tamil Nadu Sports", 
    "Vetri Fitness Emporium", 
    "Cauvery Cricket Academy Shop"
  ];

  const addressPrefixes = [
    "22, Gandhi Road",
    "104, Temple Car Street",
    "5/12, Netaji Subhas Salai"
  ];

  return shopNames.map((name, idx) => {
    const offsetLat = coords.lat + (idx - 1) * 0.008 + (Math.random() - 0.5) * 0.002;
    const offsetLng = coords.lng + (idx - 1) * 0.008 + (Math.random() - 0.5) * 0.002;
    
    return {
      place_id: `mock-place-${key}-${idx + 1}-${Date.now()}`,
      shop_name: `${district} ${name}`,
      address: `${addressPrefixes[idx]}, Near Bus Stand, ${district}, Tamil Nadu`,
      latitude: parseFloat(offsetLat.toFixed(6)),
      longitude: parseFloat(offsetLng.toFixed(6)),
      phone: `+91 ${90000 + idx * 1000} ${10000 + idx * 555}`,
      rating: parseFloat((4.0 + idx * 0.3 + Math.random() * 0.2).toFixed(1)),
      website: `https://${key}${name.toLowerCase().replace(/\s/g, "")}.example.com`,
      maps_url: `https://maps.google.com/?q=${encodeURIComponent(district + " " + name)}`
    };
  });
};

export const placesService = {
  // Triggers the backend data collection for a specific district
  collectDistrictShops: async (districtName, customApiKey = "") => {
    try {
      const response = await axios.post(`${BACKEND_URL}/fetch-district-shops`, {
        district: districtName,
        apiKey: customApiKey
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          shops: response.data.shops
        };
      }
      throw new Error("Invalid response schema from data collector server.");
    } catch (error) {
      console.warn("Backend server not responding, falling back to local simulation inside client...", error.message);
      
      // Fallback: run simulated places collector directly on the client side
      try {
        const simulatedShops = await simulateFetchLocal(districtName);
        return {
          success: true,
          shops: simulatedShops
        };
      } catch (simErr) {
        return {
          success: false,
          error: "Failed to collect places data. Ensure backend is running or mock is valid."
        };
      }
    }
  }
};
export default placesService;
