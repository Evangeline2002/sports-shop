import axios from "axios";

// Static mapping of district centers for mock fallback generation
const districtCoordinates = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  salem: { lat: 11.6643, lng: 78.1460 },
  erode: { lat: 11.3410, lng: 77.7172 },
  dindigul: { lat: 10.3673, lng: 77.9803 },
  tiruppur: { lat: 11.1085, lng: 77.3411 },
  tirunelveli: { lat: 8.7139, lng: 77.7567 },
  trichy: { lat: 10.7905, lng: 78.7047 },
  thanjavur: { lat: 10.7870, lng: 79.1378 },
  vellore: { lat: 12.9165, lng: 79.1325 }
};

export const placesService = {
  fetchShopsFromGoogle: async (districtName, apiKey) => {
    const isConfigured = !!apiKey && apiKey !== "your_google_maps_api_key_here" && apiKey.trim() !== "";

    if (!isConfigured) {
      console.log(`Places API key not configured. Simulating data collection for ${districtName}...`);
      return placesService.simulateFetch(districtName);
    }

    const searchQuery = `Sports shop in ${districtName} Tamil Nadu`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

    try {
      const response = await axios.get(searchUrl);
      if (response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
        throw new Error(`Google Places Search API error: ${response.data.status}`);
      }

      const rawPlaces = response.data.results || [];
      const detailedShops = [];

      // Limit to 5 results to save API quotas and avoid timeouts
      const placesToFetch = rawPlaces.slice(0, 5);

      for (const place of placesToFetch) {
        try {
          // Fetch place details for website and phone number
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,geometry,rating,website,url&key=${apiKey}`;
          const detailsResponse = await axios.get(detailsUrl);
          
          if (detailsResponse.data.status === "OK") {
            const d = detailsResponse.data.result;
            detailedShops.push({
              place_id: place.place_id,
              shop_name: d.name || place.name,
              address: d.formatted_address || place.formatted_address || "",
              latitude: d.geometry?.location?.lat || place.geometry?.location?.lat,
              longitude: d.geometry?.location?.lng || place.geometry?.location?.lng,
              phone: d.formatted_phone_number || "",
              rating: d.rating || 4.0,
              website: d.website || "",
              maps_url: d.url || `https://maps.google.com/?q=${encodeURIComponent(d.name)}`
            });
          } else {
            // Fallback to basic search results
            detailedShops.push({
              place_id: place.place_id,
              shop_name: place.name,
              address: place.formatted_address || "",
              latitude: place.geometry?.location?.lat,
              longitude: place.geometry?.location?.lng,
              phone: "",
              rating: place.rating || 4.0,
              website: "",
              maps_url: `https://maps.google.com/?q=${encodeURIComponent(place.name)}`
            });
          }
        } catch (detailError) {
          console.error(`Error fetching details for place ${place.place_id}:`, detailError.message);
        }
      }

      return detailedShops;
    } catch (err) {
      console.error("Google API search failure:", err.message);
      throw err;
    }
  },

  // Mock collector data generator
  simulateFetch: async (district) => {
    // Wait to simulate network query latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const key = district.toLowerCase();
    const coords = districtCoordinates[key] || { lat: 11.1271, lng: 78.6569 };
    
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
  }
};
