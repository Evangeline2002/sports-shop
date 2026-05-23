import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  useMap,
  Marker,
  Popup
} from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import { useShops } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { districts } from "../data/districts";
import {
  BiTargetLock,
  BiFullscreen,
  BiExitFullscreen,
  BiLayer
} from "react-icons/bi";

// Global popup action handlers
window.openDirections = (name, address) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name + ", " + address)}`;
  window.open(url, "_blank");
};
window.openGmaps = (name, address, mapsUrl) => {
  if (mapsUrl && mapsUrl !== "undefined" && mapsUrl !== "") {
    window.open(mapsUrl, "_blank");
  } else {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + address)}`, "_blank");
  }
};

// ── MapController: pans map when selectedShop or selectedDistrict changes ──
const MapController = ({ selectedDistrict }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedDistrict) {
      const dist = districts.find((d) => d.id === selectedDistrict.toLowerCase());
      if (dist) {
        map.setView([dist.lat, dist.lng], dist.zoom || 11, {
          animate: true,
          duration: 0.8,
        });
      }
    }
  }, [selectedDistrict, map]);

  return null;
};

// ── HeatmapOverlay ──
// (Heatmap feature removed)

// ── MarkerClusterer: builds markers, stores refs, opens popup on selection ──
const MarkerClusterer = ({ shops, onSelectShop, selectedShop }) => {
  const map = useMap();
  const mcgRef = useRef(null);
  const markersRef = useRef(new Map()); // shopId → L.marker

  // Build / rebuild the cluster whenever shops list changes
  useEffect(() => {
    if (!shops || shops.length === 0) return;

    // Log data being rendered (for debugging)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[MapContainer] Rendering ${shops.length} shops on map`);
    }

    const mcg = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = "small";
        if (count >= 50) sizeClass = "large";
        else if (count >= 20) sizeClass = "medium";
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster marker-cluster-${sizeClass}`,
          iconSize: L.point(40, 48),
          iconAnchor: L.point(20, 48),
        });
      },
    });

    mcgRef.current = mcg;
    markersRef.current.clear();

    shops.forEach((shop) => {
      if (!shop.latitude || !shop.longitude) return;

      const distIdx = districts.findIndex(
        (d) => d.name.toLowerCase() === shop.district?.toLowerCase()
      );
      const hue = distIdx !== -1 ? (distIdx * 23) % 360 : 220;

      const pinColor = `hsl(${hue},85%,48%)`;
      const customIcon = L.divIcon({
        html: `<div class="map-pin-wrapper">
                 <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46" class="map-pin-svg">
                   <defs>
                     <filter id="pinShadow${hue}" x="-20%" y="-10%" width="140%" height="130%">
                       <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
                     </filter>
                   </defs>
                   <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z"
                         fill="${pinColor}" filter="url(#pinShadow${hue})" />
                   <circle cx="18" cy="16" r="8" fill="white" opacity="0.95"/>
                 </svg>
               </div>`,
        className: "custom-div-icon",
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        popupAnchor: [0, -42],
      });

      // Safely escape values for inline HTML attributes
      const safeName = String(shop.shop_name || "").replace(/`/g, "\\`").replace(/'/g, "&#39;");
      const safeAddress = String(shop.address || "").replace(/`/g, "\\`").replace(/'/g, "&#39;");
      const safeMaps = String(shop.maps_url || "");
      const safePhone = String(shop.phone || "");
      const safeRating = (shop.rating || 4).toFixed(1);

      const popupHtml = `
        <div class="popup-container">
          <h4 class="popup-title">${safeName}</h4>
          <p class="popup-address">${safeAddress}</p>
          
          <button onclick="window.open('tel:${safePhone}')" class="popup-btn-outline">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
            CALL NOW
          </button>
          
          <button onclick="window.openDirections('${encodeURIComponent(safeName)}','${encodeURIComponent(safeAddress)}')" class="popup-btn-dark">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            GET DIRECTIONS
          </button>
          
          <div class="popup-badge-row">
            <span class="popup-badge popup-badge-others">${shop.category || "GENERAL"}</span>
            <span class="popup-badge ${shop.visited ? "popup-badge-verified" : "popup-badge-pending"}">${shop.visited ? "VISITED" : "PENDING"}</span>
          </div>
        </div>`;

      const marker = L.marker([shop.latitude, shop.longitude], { icon: customIcon });
      marker.bindPopup(popupHtml, {
        maxWidth: 260,
        minWidth: 220,
        autoClose: false,
        closeOnClick: false,
      });
      marker.on("click", () => onSelectShop(shop));

      mcg.addLayer(marker);
      markersRef.current.set(shop.id, marker);
    });

    map.addLayer(mcg);

    return () => {
      map.removeLayer(mcg);
      mcgRef.current = null;
      markersRef.current.clear();
    };
  }, [map, shops, onSelectShop]);

  // ── AUTO-OPEN popup when shop selected from sidebar "View on Map" ──
  useEffect(() => {
    if (!selectedShop || !mcgRef.current) return;
    const marker = markersRef.current.get(selectedShop.id);
    if (!marker) return;

    // zoomToShowLayer expands any cluster containing the marker,
    // then the callback opens its popup automatically
    mcgRef.current.zoomToShowLayer(marker, () => {
      marker.openPopup();
    });
  }, [selectedShop]);

  return null;
};

// ── Main MapContainer component ──
const MapContainer = () => {
  const { t } = useLanguage();
  const {
    filteredShops,
    selectedDistrict,
    selectedShop,
    setSelectedShop,
    userLocation,
    setUserLocation,
  } = useShops();

  const [mapType, setMapType] = useState("streets");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const defaultCenter = [11.1271, 78.6569];
  const defaultZoom = 7.5;

  const tileUrls = {
    streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          if (mapRef.current) {
            mapRef.current.setView([loc.lat, loc.lng], 13, { animate: true, duration: 1 });
          }
        },
        () => alert(t("gps_unavailable"))
      );
    } else {
      alert(t("gps_unavailable"));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#0f172a]"
      style={isFullscreen ? { position: "fixed", inset: 0, zIndex: 9999 } : {}}
    >
      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-[999] flex flex-col space-y-2">
        <button
          onClick={handleFullscreenToggle}
          className="p-3 bg-slate-950/85 hover:bg-slate-900 border border-white/10 text-white rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <BiExitFullscreen className="text-xl" /> : <BiFullscreen className="text-xl" />}
        </button>

        <button
          onClick={handleLocateUser}
          className="p-3 bg-slate-950/85 hover:bg-slate-900 border border-white/10 text-white rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95"
          title={t("gps_locate")}
        >
          <BiTargetLock className="text-xl" />
        </button>

        <button
          onClick={() => setMapType(mapType === "streets" ? "satellite" : "streets")}
          className={`p-3 bg-slate-950/85 hover:bg-slate-900 border border-white/10 rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95 ${mapType === "satellite" ? "text-indigo-400" : "text-white"
            }`}
          title="Toggle map view"
        >
          <BiLayer className="text-xl" />
        </button>
      </div>

      {/* Leaflet Map */}
      <LeafletMap
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
        minZoom={6}
        maxBounds={[[7.5, 75.5], [14.0, 81.0]]}
        maxBoundsViscosity={1.0}
        ref={mapRef}
        className="w-full h-full"
      >
        <TileLayer
          url={tileUrls[mapType]}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* GPS user location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              html: `<div class="relative flex items-center justify-center">
                       <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-sky-400 opacity-60"></span>
                       <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border border-white"></span>
                     </div>`,
              className: "user-loc-icon",
              iconSize: [24, 24],
            })}
          >
            <Popup>
              <div className="text-xs font-extrabold text-sky-400">My Location</div>
            </Popup>
          </Marker>
        )}

        {/* Clustered markers */}
        <MarkerClusterer
          shops={filteredShops}
          onSelectShop={setSelectedShop}
          selectedShop={selectedShop}
        />

        {/* Pan controller */}
        <MapController selectedDistrict={selectedDistrict} />
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
