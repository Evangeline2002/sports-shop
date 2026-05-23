import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useShops } from "../context/ShopContext";
import { dbService } from "../services/dbService";
import {
  BiMapAlt,
  BiLogOutCircle,
  BiLogInCircle,
  BiMenu,
  BiX,
  BiGlobe,
  BiCloudLightning,
  BiCloudRain
} from "react-icons/bi";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFbActive = dbService.isFirebaseActive();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: t("dashboard"), path: "/" },
    { name: t("map_view"), path: "/map" },
    { name: t("analytics"), path: "/analytics" },
    ...(isAdmin ? [{ name: t("upload_excel"), path: "/upload" }] : []),
    { name: t("settings"), path: "/settings" }
  ];

  return (
    <nav className="glass-panel sticky top-0 z-[1000] px-6 py-2 flex items-center justify-between shadow-2xl border-b border-white/5 flex-shrink-0">
      {/* Title Logo */}
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30">
          <BiMapAlt className="text-2xl" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg md:text-xl tracking-tight text-white font-display text-glow">
            {language === "ta" ? "தமிழ்நாடு ஸ்போர்ட்ஸ்" : "Tamil Nadu Sports"}
          </span>
          <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase -mt-0.5">
            {t("app_subtitle")}
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Controls & User Portal */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Database Status Indicator */}
        <div
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isFbActive
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          title={isFbActive ? t("firebase_connected") : t("local_storage")}
        >
          {isFbActive ? (
            <>
              <BiCloudLightning className="animate-pulse text-sm" />
              <span>Firebase</span>
            </>
          ) : (
            <>
              <BiCloudRain className="text-sm" />
              <span>Offline/Local</span>
            </>
          )}
        </div>

        {/* Language Toggler */}
        <button
          onClick={() => setLanguage(language === "en" ? "ta" : "en")}
          className="flex items-center space-x-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 text-slate-300 hover:text-white transition-all text-xs font-bold"
        >
          <BiGlobe className="text-sm" />
          <span>{language === "en" ? "தமிழ்" : "English"}</span>
        </button>

        {/* Auth Gate */}
        {user ? (
          <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
            <div className="flex flex-col text-right">
              <span className="text-xs text-slate-400 font-semibold">{t("admin_portal")}</span>
              <span className="text-sm text-slate-200 font-bold max-w-[120px] truncate">{user.displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <BiLogOutCircle className="text-base" />
              <span>{t("logout")}</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <BiLogInCircle className="text-sm" />
            <span>{t("admin_login")}</span>
          </Link>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="lg:hidden flex items-center space-x-3">
        <button
          onClick={() => setLanguage(language === "en" ? "ta" : "en")}
          className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 text-slate-300 text-xs font-bold"
        >
          {language === "en" ? "தமிழ்" : "EN"}
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-2xl text-slate-300 hover:text-white focus:outline-none p-1 bg-white/5 rounded-lg border border-white/5"
        >
          {mobileMenuOpen ? <BiX /> : <BiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-panel border-t border-white/5 p-4 flex flex-col space-y-3 shadow-2xl animate-fade-in z-[1000]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white rounded-lg"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">{t("db_status")}:</span>
            <span className={`text-xs font-bold ${isFbActive ? "text-emerald-400" : "text-amber-400"}`}>
              {isFbActive ? "Firebase Firestore" : "LocalStorage Mode"}
            </span>
          </div>

          {user ? (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-sm text-slate-200 font-bold truncate max-w-[200px]">{user.displayName}</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-1 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <BiLogOutCircle />
                <span>{t("logout")}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold shadow-lg"
            >
              <BiLogInCircle />
              <span>{t("admin_login")}</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
