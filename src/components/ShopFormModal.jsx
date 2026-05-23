import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { districts } from "../data/districts";
import { BiX, BiMapPin, BiGlobe, BiPhone, BiStar, BiTargetLock } from "react-icons/bi";

const ShopFormModal = ({ shop, isOpen, onClose, onSave }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    shop_name: "",
    district: "Chennai",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
    rating: "4.0",
    website: "",
    maps_url: ""
  });
  
  const [errors, setErrors] = useState({});
  const [geocoding, setGeocoding] = useState(false);

  // Set form if editing
  useEffect(() => {
    if (shop) {
      setFormData({
        shop_name: shop.shop_name || "",
        district: shop.district || "Chennai",
        address: shop.address || "",
        latitude: shop.latitude ? shop.latitude.toString() : "",
        longitude: shop.longitude ? shop.longitude.toString() : "",
        phone: shop.phone || "",
        rating: shop.rating ? shop.rating.toString() : "4.0",
        website: shop.website || "",
        maps_url: shop.maps_url || ""
      });
    } else {
      setFormData({
        shop_name: "",
        district: "Chennai",
        address: "",
        latitude: "",
        longitude: "",
        phone: "",
        rating: "4.0",
        website: "",
        maps_url: ""
      });
    }
    setErrors({});
  }, [shop, isOpen]);

  if (!isOpen) return null;

  // Run auto geocoding (Mock / fallback OpenStreetMap)
  const handleAutoGeocode = async () => {
    if (!formData.address) {
      setErrors(prev => ({ ...prev, address: "Please enter an address first to geocode" }));
      return;
    }
    setGeocoding(true);
    setErrors(prev => ({ ...prev, address: null }));

    try {
      // Mock Geocoding response: centers on selected district coordinates with small random offset
      const matchingDist = districts.find(d => d.name.toLowerCase() === formData.district.toLowerCase());
      const baseLat = matchingDist ? matchingDist.lat : 13.0827;
      const baseLng = matchingDist ? matchingDist.lng : 80.2707;
      
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const randomLat = baseLat + (Math.random() - 0.5) * 0.04;
      const randomLng = baseLng + (Math.random() - 0.5) * 0.04;

      setFormData(prev => ({
        ...prev,
        latitude: randomLat.toFixed(6),
        longitude: randomLng.toFixed(6),
        maps_url: prev.maps_url || `https://maps.google.com/?q=${encodeURIComponent(prev.shop_name + ", " + prev.address)}`
      }));
    } catch (e) {
      console.error(e);
      setErrors(prev => ({ ...prev, address: "Geocoding failed. Please input coordinates manually." }));
    } finally {
      setGeocoding(false);
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.shop_name.trim()) tempErrors.shop_name = "Shop Name is required";
    if (!formData.district) tempErrors.district = "District selection is required";
    if (!formData.address.trim()) tempErrors.address = "Street address is required";

    // Lat/Lng validations
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (formData.latitude && (isNaN(lat) || lat < -90 || lat > 90)) {
      tempErrors.latitude = "Latitude must be between -90 and 90";
    }
    if (formData.longitude && (isNaN(lng) || lng < -180 || lng > 180)) {
      tempErrors.longitude = "Longitude must be between -180 and 180";
    }
    
    // Optional phone validation (basic format check)
    if (formData.phone && !/^\+?[0-9\s-]{6,15}$/.test(formData.phone)) {
      tempErrors.phone = "Invalid phone number format";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Use geocode fallback coordinates if empty
    const matchingDist = districts.find(d => d.name.toLowerCase() === formData.district.toLowerCase());
    const finalLat = parseFloat(formData.latitude) || (matchingDist ? matchingDist.lat : 13.0827);
    const finalLng = parseFloat(formData.longitude) || (matchingDist ? matchingDist.lng : 80.2707);

    const submissionData = {
      ...formData,
      latitude: finalLat,
      longitude: finalLng,
      rating: parseFloat(formData.rating) || 4.0
    };

    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all"
        >
          <BiX className="text-xl" />
        </button>

        {/* Header */}
        <h2 className="font-extrabold text-white text-lg md:text-xl tracking-tight mb-6 font-display text-glow text-left">
          {shop ? t("edit_shop") : t("add_shop")}
        </h2>

        {/* Input Fields Form */}
        <form onSubmit={handleSave} className="space-y-4 text-left">
          
          {/* Shop Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shop Name *</label>
            <input
              type="text"
              required
              value={formData.shop_name}
              onChange={(e) => setFormData(prev => ({ ...prev, shop_name: e.target.value }))}
              placeholder="e.g. TN Sports Hub"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            {errors.shop_name && <p className="text-[10px] text-red-400 font-bold">{errors.shop_name}</p>}
          </div>

          {/* District Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">District *</label>
            <select
              value={formData.district}
              onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Address & Autogeocoding */}
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Street Address *</label>
              <button
                type="button"
                onClick={handleAutoGeocode}
                disabled={geocoding}
                className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center space-x-0.5"
              >
                <BiTargetLock />
                <span>{geocoding ? "Locating..." : "Auto Geocode Address"}</span>
              </button>
            </div>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Full shop address including PIN code..."
              rows={2}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            {errors.address && <p className="text-[10px] text-red-400 font-bold">{errors.address}</p>}
          </div>

          {/* Lat Lng Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latitude</label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                placeholder="e.g. 13.0827"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
              {errors.latitude && <p className="text-[10px] text-red-400 font-bold">{errors.latitude}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Longitude</label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                placeholder="e.g. 80.2707"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
              {errors.longitude && <p className="text-[10px] text-red-400 font-bold">{errors.longitude}</p>}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="e.g. +91 44 1234 5678"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              {errors.phone && <p className="text-[10px] text-red-400 font-bold">{errors.phone}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating (1 to 5)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="5.0">5.0 ★★★★★</option>
                <option value="4.5">4.5 ★★★★☆</option>
                <option value="4.0">4.0 ★★★★☆</option>
                <option value="3.5">3.5 ★★★☆☆</option>
                <option value="3.0">3.0 ★★★☆☆</option>
                <option value="2.0">2.0 ★★☆☆☆</option>
              </select>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Google Maps Link</label>
              <input
                type="url"
                value={formData.maps_url}
                onChange={(e) => setFormData(prev => ({ ...prev, maps_url: e.target.value }))}
                placeholder="https://maps.google.com/?q=..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/5 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all border border-white/5"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
            >
              {t("save")}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ShopFormModal;
