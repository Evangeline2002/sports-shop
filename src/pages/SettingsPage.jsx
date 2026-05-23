import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useShops } from "../context/ShopContext";
import { dbService } from "../services/dbService";
import { 
  BiCog, 
  BiGlobe, 
  BiShieldQuarter, 
  BiServer, 
  BiTrash, 
  BiKey,
  BiCheckCircle,
  BiXCircle
} from "react-icons/bi";

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const { authMode } = useAuth();
  const { fetchShops } = useShops();
  const isFbActive = dbService.isFirebaseActive();

  const isGmapsKeyConfigured = 
    !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && 
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== "your_google_maps_api_key_here" &&
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY.trim() !== "";

  const handleResetLocalDb = () => {
    if (window.confirm("Are you sure you want to RESET the local database? This will clear all local modifications and reseed with default mock shops.")) {
      localStorage.removeItem("sports_shops");
      localStorage.setItem("excel_upload_count", "0");
      fetchShops().then(() => {
        alert("Local database reset and re-seeded successfully!");
        window.location.reload();
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-[#0b0f19] min-h-[calc(100vh-80px)] text-slate-300">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5 text-left">
        <h1 className="font-extrabold text-white text-xl md:text-2xl tracking-tight font-display text-glow">
          {t("settings")}
        </h1>
        <p className="text-xs text-indigo-400 font-semibold tracking-wide uppercase mt-0.5">
          System Preferences & Connection status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* Language Selection Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider flex items-center space-x-2 font-display">
            <BiGlobe className="text-indigo-400 text-xl" />
            <span>{t("language")}</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Toggle the user interface localization between English and Tamil translations.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setLanguage("en")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                language === "en"
                  ? "bg-indigo-600/25 border-indigo-500 text-indigo-300 shadow-inner"
                  : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("ta")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                language === "ta"
                  ? "bg-indigo-600/25 border-indigo-500 text-indigo-300 shadow-inner"
                  : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>
        </div>

        {/* Database Status Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider flex items-center space-x-2 font-display">
            <BiServer className="text-indigo-400 text-xl" />
            <span>{t("db_status")}</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            View the synchronization pipeline parameters connecting the application.
          </p>

          <div className="p-3 bg-slate-950/40 rounded-2xl border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Database Engine:</span>
              <span className={`flex items-center space-x-1 ${isFbActive ? "text-emerald-400" : "text-amber-400"}`}>
                {isFbActive ? <BiCheckCircle /> : <BiXCircle />}
                <span>{isFbActive ? "Firebase Firestore" : "LocalStorage Fallback"}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Authentication Mode:</span>
              <span className="text-indigo-300 font-mono font-bold capitalize">{authMode} mode</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Project ID:</span>
              <span className="text-slate-300 font-mono font-bold truncate max-w-[150px]">
                {import.meta.env.VITE_FIREBASE_PROJECT_ID || "Mock-Mode"}
              </span>
            </div>
          </div>
        </div>

        {/* Google Maps API Configuration status */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider flex items-center space-x-2 font-display">
            <BiKey className="text-indigo-400 text-xl" />
            <span>Google Maps API Status</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Verification status of Google Places, JavaScript Maps, and Geocoding keys.
          </p>

          <div className="p-3 bg-slate-950/40 rounded-2xl border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">API Key Verified:</span>
              <span className={`flex items-center space-x-1 ${isGmapsKeyConfigured ? "text-emerald-400" : "text-amber-400"}`}>
                {isGmapsKeyConfigured ? <BiCheckCircle /> : <BiXCircle />}
                <span>{isGmapsKeyConfigured ? "Loaded (.env)" : "Not Set (Using mock APIs)"}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Fallback geocoder:</span>
              <span className="text-indigo-300 font-bold">{isGmapsKeyConfigured ? "Google Places API" : "Simulated Offset Geocoding"}</span>
            </div>
          </div>
        </div>

        {/* System Diagnostics & Resets */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider flex items-center space-x-2 font-display">
            <BiShieldQuarter className="text-indigo-400 text-xl" />
            <span>Local Database Maintenance</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Clear all cached store markers, logs, and spreadsheet uploads to reseed from template file.
          </p>
          
          <button
            onClick={handleResetLocalDb}
            className="w-full flex items-center justify-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <BiTrash className="text-base" />
            <span>Reset Local Database</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
