import React, { useMemo } from "react";
import { useShops } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import AnalyticsChart from "../components/AnalyticsChart";
import LoadingSpinner from "../components/LoadingSpinner";
import { 
  BiTrendingUp, 
  BiBarChartSquare, 
  BiPieChartAlt2, 
  BiLineChart, 
  BiInfoCircle 
} from "react-icons/bi";

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const { shops, loading, districtStats } = useShops();

  // Compute key analytical summaries
  const stats = useMemo(() => {
    if (shops.length === 0) return { avgRating: 0, mappedRatio: 0, withPhoneRatio: 0 };
    
    const avgRating = shops.reduce((acc, curr) => acc + curr.rating, 0) / shops.length;
    // shops that have valid lat/lng coords
    const mapped = shops.filter((s) => s.latitude && s.longitude).length;
    const mappedRatio = (mapped / shops.length) * 100;
    
    const withPhone = shops.filter((s) => s.phone).length;
    const withPhoneRatio = (withPhone / shops.length) * 100;

    return {
      avgRating,
      mappedRatio,
      withPhoneRatio
    };
  }, [shops]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#0b0f19]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#0b0f19] min-h-[calc(100vh-80px)] text-slate-300">
      
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-5 text-left">
        <h1 className="font-extrabold text-white text-xl md:text-2xl tracking-tight font-display text-glow">
          {t("analytics")}
        </h1>
        <p className="text-xs text-indigo-400 font-semibold tracking-wide uppercase mt-0.5">
          Advanced Charts & Registry Distributions
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Average Rating</span>
            <span className="text-2xl font-extrabold text-white font-display mt-1 block">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(2) : "0.00"} ★
            </span>
            <span className="text-[9px] text-slate-500 font-bold block mt-1">Across all 38 districts</span>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
            <BiPieChartAlt2 className="text-xl" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Map Coverage Ratio</span>
            <span className="text-2xl font-extrabold text-white font-display mt-1 block">
              {stats.mappedRatio.toFixed(1)}%
            </span>
            <span className="text-[9px] text-slate-500 font-bold block mt-1">Shops with active GPS coords</span>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400">
            <BiBarChartSquare className="text-xl" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Contact Registry</span>
            <span className="text-2xl font-extrabold text-white font-display mt-1 block">
              {stats.withPhoneRatio.toFixed(1)}%
            </span>
            <span className="text-[9px] text-slate-500 font-bold block mt-1">Shops with telephone details</span>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-400">
            <BiLineChart className="text-xl" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* District density chart */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-xl text-left">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider mb-5 flex items-center space-x-2 font-display">
            <BiBarChartSquare className="text-indigo-400 text-lg" />
            <span>{t("chart_shop_distribution")}</span>
          </h2>
          <AnalyticsChart shops={shops} type="district" />
        </div>

        {/* Rating Breakdown pie chart */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-xl text-left">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider mb-5 flex items-center space-x-2 font-display">
            <BiPieChartAlt2 className="text-indigo-400 text-lg" />
            <span>{t("chart_ratings")}</span>
          </h2>
          <AnalyticsChart shops={shops} type="ratings" />
        </div>

        {/* Shop registrations growth area chart */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-xl text-left lg:col-span-2">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider mb-5 flex items-center space-x-2 font-display">
            <BiLineChart className="text-indigo-400 text-lg" />
            <span>{t("chart_growth")}</span>
          </h2>
          <AnalyticsChart shops={shops} type="growth" />
        </div>

      </div>

      {/* Information Alert */}
      <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex items-center space-x-3 text-left">
        <BiInfoCircle className="text-indigo-400 text-xl flex-shrink-0 animate-pulse" />
        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
          The registry metrics compile in real-time on browser load by aggregating database schemas. Exporting spreadsheet files downloads full tabular data logs representing these charts.
        </p>
      </div>

    </div>
  );
};

export default AnalyticsPage;
