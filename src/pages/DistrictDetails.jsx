import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useShops } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { districts, getDistrictName } from "../data/districts";
import { excelService } from "../services/excelService";
import ShopCard from "../components/ShopCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { 
  BiArrowBack, 
  BiDownload, 
  BiStats, 
  BiStore, 
  BiStar, 
  BiGlobe, 
  BiPhoneCall,
  BiMapPin 
} from "react-icons/bi";

const DistrictDetails = () => {
  const { districtId } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { shops, loading, deleteShop } = useShops();

  // Find static district info
  const districtInfo = useMemo(() => {
    return districts.find((d) => d.id === districtId.toLowerCase());
  }, [districtId]);

  // Filter shops for this district
  const districtShops = useMemo(() => {
    if (!districtInfo) return [];
    return shops.filter(
      (s) => s.district?.toLowerCase() === districtInfo.name.toLowerCase()
    );
  }, [shops, districtInfo]);

  // Compute stats for this district
  const stats = useMemo(() => {
    if (districtShops.length === 0) return { avgRating: 0, phoneCount: 0, webCount: 0 };
    
    const totalRating = districtShops.reduce((acc, curr) => acc + curr.rating, 0);
    const withPhone = districtShops.filter((s) => s.phone).length;
    const withWeb = districtShops.filter((s) => s.website).length;

    return {
      avgRating: totalRating / districtShops.length,
      phoneCount: withPhone,
      webCount: withWeb
    };
  }, [districtShops]);

  if (!districtInfo) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#0b0f19] space-y-4">
        <p className="text-slate-400 font-semibold">District not found.</p>
        <Link to="/settings" className="text-indigo-400 font-bold hover:underline">Back to Safety</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#0b0f19]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const handleExport = () => {
    excelService.exportToExcel(
      districtShops, 
      `SportsShops_${districtInfo.name}_District`
    );
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm(t("confirm_delete"))) {
      await deleteShop(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#0b0f19] min-h-[calc(100vh-80px)]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="text-left flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-md active:scale-95"
            title="Go Back"
          >
            <BiArrowBack className="text-lg" />
          </button>
          <div>
            <h1 className="font-extrabold text-white text-xl md:text-2xl tracking-tight font-display text-glow">
              {language === "ta" ? districtInfo.nameTa : districtInfo.name} District
            </h1>
            <p className="text-xs text-indigo-400 font-semibold tracking-wide uppercase mt-0.5">
              Tamil Nadu Sports Shop Directory Coverage
            </p>
          </div>
        </div>

        {districtShops.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
          >
            <BiDownload className="text-base" />
            <span>{t("export_excel")}</span>
          </button>
        )}
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Shops in District */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Shops</span>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-display">{districtShops.length}</p>
            <span className="text-[10px] text-slate-500 font-bold block mt-1">Inside boundaries</span>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400">
            <BiStore className="text-xl" />
          </div>
        </div>

        {/* Average Rating */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Average Rating</span>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-display">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "0.0"} <span className="text-sm text-slate-400 font-semibold">★</span>
            </p>
            <span className="text-[10px] text-slate-500 font-bold block mt-1">Customer feedback index</span>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
            <BiStar className="text-xl" />
          </div>
        </div>

        {/* Website Coverage */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Web Presence</span>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-display">
              {districtShops.length > 0 
                ? Math.round((stats.webCount / districtShops.length) * 100) 
                : 0}%
            </p>
            <span className="text-[10px] text-slate-500 font-bold block mt-1">{stats.webCount} of {districtShops.length} stores</span>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-400">
            <BiGlobe className="text-xl" />
          </div>
        </div>

        {/* Contact Index */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Phone Bookability</span>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-display">
              {districtShops.length > 0 
                ? Math.round((stats.phoneCount / districtShops.length) * 100) 
                : 0}%
            </p>
            <span className="text-[10px] text-slate-500 font-bold block mt-1">{stats.phoneCount} stores with phone</span>
          </div>
          <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-400">
            <BiPhoneCall className="text-xl" />
          </div>
        </div>
      </div>

      {/* Directory Listing Grid */}
      <div className="space-y-4 text-left">
        <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider flex items-center space-x-2 font-display">
          <BiStats className="text-indigo-400 text-lg" />
          <span>Shops Mapped in District ({districtShops.length})</span>
        </h2>

        {districtShops.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-500 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-2">
            <BiMapPin className="text-4xl text-slate-600 animate-pulse" />
            <p className="text-sm font-semibold">No sports shops registered in this district yet.</p>
            <Link to="/map" className="text-xs text-indigo-400 font-bold hover:underline">Go to map to add one</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districtShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onDelete={() => handleDeleteClick(shop.id)}
                onEdit={() => navigate(`/map`)} // Redirect to edit on map view
                onFocusClick={() => navigate(`/map`)} // Redirect to map view
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DistrictDetails;
