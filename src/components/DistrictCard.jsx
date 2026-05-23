import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { BiChevronRight, BiStore } from "react-icons/bi";

const DistrictCard = ({ district, onClick, maxCount = 1 }) => {
  const { language, t } = useLanguage();
  
  const percentage = maxCount > 0 ? (district.count / maxCount) * 100 : 0;

  return (
    <div 
      onClick={onClick}
      className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/5 cursor-pointer flex flex-col justify-between shadow-lg relative overflow-hidden group"
    >
      {/* Decorative gradient back-glow */}
      <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-lg pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base md:text-lg mb-0.5 tracking-tight group-hover:text-indigo-300 transition-colors font-display">
            {language === "ta" ? district.nameTa : district.name}
          </h3>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Tamil Nadu
          </span>
        </div>
        
        <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
          <BiStore className="text-lg md:text-xl" />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs text-slate-400 font-bold">Density Distribution</span>
          <span className="text-sm font-extrabold text-white">
            {district.count} <span className="text-xs text-slate-400 font-medium">shops</span>
          </span>
        </div>
        
        {/* Progress Bar representing relative count */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${Math.max(percentage, district.count > 0 ? 5 : 0)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
        <span>{t("details")}</span>
        <BiChevronRight className="text-base group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default DistrictCard;
