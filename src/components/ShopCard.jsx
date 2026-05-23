import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  BiMapPin,
  BiPhone,
  BiStar,
  BiStore,
  BiGlobe,
  BiEdit,
  BiTrash,
  BiTargetLock,
  BiDirections,
} from "react-icons/bi";

function ShopCard({ shop, onFocusClick, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const displayName = shop.shop_name || shop.name || "Unknown Shop";
  const rating = typeof shop.rating === "number" ? shop.rating : parseFloat(shop.rating) || 0;

  const handleCall = (e) => {
    e.stopPropagation();
    if (shop.phone) window.open(`tel:${shop.phone}`);
  };

  const handleDirections = (e) => {
    e.stopPropagation();
    const url = shop.maps_url
      ? shop.maps_url
      : `https://maps.google.com/?q=${encodeURIComponent(displayName + " " + (shop.address || ""))}`;
    window.open(url, "_blank");
  };

  const handleWebsite = (e) => {
    e.stopPropagation();
    if (shop.website) window.open(shop.website, "_blank");
  };

  return (
    <div
      className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col gap-4 cursor-pointer border border-white/5 shadow-lg"
      onClick={onFocusClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-indigo-500/15 p-2.5 rounded-xl text-indigo-400 flex-shrink-0">
            <BiStore className="text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-white text-sm leading-snug truncate font-display">
              {displayName}
            </h3>
            <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 mt-0.5">
              <BiMapPin className="text-xs" />
              {shop.district}
            </span>
          </div>
        </div>

        {/* Rating badge */}
        {rating > 0 && (
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl flex-shrink-0">
            <BiStar className="text-amber-400 text-xs" />
            <span className="text-amber-400 font-extrabold text-xs">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Address */}
      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
        {shop.address || "Address not available"}
      </p>

      {/* Action row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Focus on Map */}
        <button
          onClick={(e) => { e.stopPropagation(); onFocusClick && onFocusClick(); }}
          className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
          title="Focus on Map"
        >
          <BiTargetLock className="text-sm" />
          <span>Map</span>
        </button>

        {/* Directions */}
        <button
          onClick={handleDirections}
          className="flex items-center gap-1.5 bg-emerald-600/15 hover:bg-emerald-600 border border-emerald-500/25 text-emerald-400 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
          title="Get Directions"
        >
          <BiDirections className="text-sm" />
          <span>Directions</span>
        </button>

        {/* Phone */}
        {shop.phone && (
          <button
            onClick={handleCall}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
            title="Call"
          >
            <BiPhone className="text-sm" />
          </button>
        )}

        {/* Website */}
        {shop.website && (
          <button
            onClick={handleWebsite}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
            title="Website"
          >
            <BiGlobe className="text-sm" />
          </button>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="ml-auto flex items-center gap-1.5">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-1.5 bg-sky-500/10 hover:bg-sky-500/25 border border-sky-500/20 text-sky-400 rounded-lg transition-all"
                title={t("edit_shop")}
              >
                <BiEdit className="text-sm" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-lg transition-all"
                title={t("delete_shop")}
              >
                <BiTrash className="text-sm" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopCard;
