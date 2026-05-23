import React from "react";
import { useShops } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { districts } from "../data/districts";
import { 
  BiSearch, 
  BiSort, 
  BiStar, 
  BiCurrentLocation, 
  BiPlusCircle,
  BiRefresh
} from "react-icons/bi";

const SearchBar = ({ onAddClick }) => {
  const { isAdmin } = useAuth();
  const { language, t } = useLanguage();
  const {
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
    fetchShops
  } = useShops();

  // Handle Nearby Filter Toggle (Requests GPS permissions)
  const handleNearbyToggle = () => {
    if (!nearbyFilter) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setNearbyFilter(true);
          },
          (error) => {
            console.error("GPS error:", error);
            alert(t("gps_unavailable"));
          }
        );
      } else {
        alert(t("gps_unavailable"));
      }
    } else {
      setNearbyFilter(false);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl shadow-xl flex flex-col space-y-4 w-full">
      {/* First Row: Main Search Input & Add New Shop Button */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <BiSearch className="absolute left-4 top-3 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={fetchShops}
            className="p-2.5 bg-slate-900/60 border border-white/10 hover:border-white/20 rounded-xl text-slate-300 hover:text-white transition-all shadow-md"
            title="Refresh database"
          >
            <BiRefresh className="text-xl" />
          </button>

          {/* Add Shop (Admin only) */}
          {isAdmin && (
            <button
              onClick={onAddClick}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
            >
              <BiPlusCircle className="text-lg" />
              <span>{t("add_shop")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Second Row: Filters, Nearby Toggler, Sort Option */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* District Select Dropdown */}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-500 text-xs font-bold uppercase">{t("district_filter").split(" ")[0]}</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-16 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-all"
          >
            <option value="">{t("all_districts")}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {language === "ta" ? d.nameTa : d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Select Dropdown */}
        <div className="relative flex items-center">
          <BiStar className="absolute left-3 text-amber-500 text-lg" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-all"
          >
            <option value="0">{t("all_ratings")}</option>
            <option value="4.5">4.5+ ★</option>
            <option value="4.0">4.0+ ★</option>
            <option value="3.5">3.5+ ★</option>
            <option value="3.0">3.0+ ★</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative flex items-center">
          <BiSort className="absolute left-3 text-indigo-400 text-lg" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-all"
          >
            <option value="name">Alphabetical (A-Z)</option>
            <option value="rating">Highest Rating</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>

        {/* Geolocation Filter Toggler */}
        <button
          onClick={handleNearbyToggle}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
            nearbyFilter
              ? "bg-indigo-600/25 border-indigo-500 text-indigo-300 shadow-inner"
              : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20"
          }`}
        >
          <BiCurrentLocation className={`text-lg ${nearbyFilter ? "animate-pulse" : ""}`} />
          <span>{t("nearby_shops")}</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
