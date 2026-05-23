import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShops } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { districts } from "../data/districts";
import {
  BiMapPin,
  BiChevronRight,
  BiStore,
  BiX,
} from "react-icons/bi";

const Sidebar = () => {
  const { t, language } = useLanguage();
  const { districtStats, selectedDistrict, setSelectedDistrict, shops } = useShops();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const filtered = districtStats;

  const maxCount = Math.max(...districtStats.map((d) => d.count), 1);

  const handleDistrictClick = (distId) => {
    setSelectedDistrict(distId === selectedDistrict ? "" : distId);
  };

  return (
    <>
      {/* Sidebar panel */}
      <aside
        className={`flex-shrink-0 flex flex-col bg-slate-950/80 border-r border-white/5 transition-all duration-300 ${isOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <BiMapPin className="text-indigo-400 text-lg flex-shrink-0" />
            <span className="font-extrabold text-white text-sm font-display">
              {t("districts")}
            </span>
            <span className="text-[10px] bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              38
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/5 lg:hidden transition-all"
          >
            <BiX className="text-base" />
          </button>
        </div>

        {/* Active Filter indicator */}
        {selectedDistrict && (
          <div className="mx-3 mb-2 px-3 py-2 bg-indigo-600/15 border border-indigo-500/25 rounded-xl flex items-center justify-between">
            <span className="text-[10px] text-indigo-300 font-bold truncate">
              Filter: {districts.find((d) => d.id === selectedDistrict)?.name}
            </span>
            <button
              onClick={() => setSelectedDistrict("")}
              className="text-indigo-400 hover:text-white ml-2 flex-shrink-0"
            >
              <BiX className="text-xs" />
            </button>
          </div>
        )}

        {/* District list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-semibold">
              No districts found
            </div>
          ) : (
            filtered.map((dist) => {
              const pct = (dist.count / maxCount) * 100;
              const isActive = selectedDistrict === dist.id;
              return (
                <div
                  key={dist.id}
                  onClick={() => handleDistrictClick(dist.id)}
                  className={`group cursor-pointer p-2.5 rounded-xl border transition-all ${isActive
                      ? "bg-indigo-600/20 border-indigo-500/40 shadow-inner"
                      : "border-transparent hover:bg-white/5 hover:border-white/10"
                    }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold truncate ${isActive ? "text-indigo-300" : "text-slate-300 group-hover:text-white"
                        }`}
                    >
                      {language === "ta" ? dist.nameTa : dist.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${dist.count > 0
                            ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                            : "bg-slate-800 text-slate-500"
                          }`}
                      >
                        {dist.count}
                      </span>
                      <Link
                        to={`/districts/${dist.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-white transition-all"
                        title="View district details"
                      >
                        <BiChevronRight className="text-sm" />
                      </Link>
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isActive
                          ? "bg-indigo-400"
                          : "bg-indigo-600/50 group-hover:bg-indigo-500/70"
                        }`}
                      style={{ width: `${Math.max(pct, dist.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer stats */}
        <div className="p-3 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <BiStore className="text-indigo-500" />
              {shops.length} shops total
            </span>
            <span>{districtStats.filter((d) => d.count > 0).length}/38 districts</span>
          </div>
        </div>
      </aside>

      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-indigo-600 hover:bg-indigo-500 text-white px-1.5 py-4 rounded-r-xl shadow-lg transition-all"
          title="Open Districts Panel"
        >
          <BiMapPin className="text-base" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
