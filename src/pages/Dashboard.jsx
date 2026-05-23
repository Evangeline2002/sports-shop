import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useShops } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import AnalyticsChart from "../components/AnalyticsChart";
import LoadingSpinner from "../components/LoadingSpinner";
import { 
  BiStore, 
  BiGridAlt, 
  BiCloudUpload, 
  BiSearchAlt,
  BiMapPin,
  BiTrendingUp,
  BiMapAlt
} from "react-icons/bi";

const Dashboard = () => {
  const { t } = useLanguage();
  const { 
    shops, 
    loading, 
    districtStats, 
    uploadCount, 
    searchAnalyticsCount 
  } = useShops();

  // Top Metrics calculation
  const totalShopsCount = shops.length;
  
  const activeDistrictsCount = useMemo(() => {
    return districtStats.filter(d => d.count > 0).length;
  }, [districtStats]);

  const recentShops = useMemo(() => {
    // Sort shops by created_at desc, take top 5
    return [...shops]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [shops]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#0b0f19]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Dashboard Stats card layout details
  const statsList = [
    {
      title: t("total_shops"),
      value: totalShopsCount,
      icon: <BiStore className="text-2xl" />,
      color: "from-indigo-500 to-indigo-600 shadow-indigo-500/10",
      desc: "Stores mapped across TN"
    },
    {
      title: t("active_districts"),
      value: `${activeDistrictsCount}/38`,
      icon: <BiGridAlt className="text-2xl" />,
      color: "from-emerald-500 to-emerald-600 shadow-emerald-500/10",
      desc: "Covered districts"
    },
    {
      title: t("excel_uploads"),
      value: uploadCount,
      icon: <BiCloudUpload className="text-2xl" />,
      color: "from-amber-500 to-amber-600 shadow-amber-500/10",
      desc: "Spreadsheet imports"
    },
    {
      title: t("search_queries"),
      value: searchAnalyticsCount,
      icon: <BiSearchAlt className="text-2xl" />,
      color: "from-purple-500 to-purple-600 shadow-purple-500/10",
      desc: "Search bar inputs logged"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#0b0f19] min-h-[calc(100vh-80px)]">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-white/5 rounded-3xl gap-4 shadow-xl">
        <div className="text-left">
          <h1 className="font-extrabold text-white text-xl md:text-2xl tracking-tight font-display text-glow">
            {t("app_title")}
          </h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wide uppercase mt-1">
            Tamil Nadu 38 Districts Directory & Visual Mapping Dashboard
          </p>
        </div>
        <Link
          to="/map"
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
        >
          <BiMapAlt className="text-base" />
          <span>Launch Interactive Map</span>
        </Link>
      </div>

      {/* Grid of stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsList.map((stat, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {stat.title}
              </span>
              <p className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-display">
                {stat.value}
              </p>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                {stat.desc}
              </span>
            </div>
            
            <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District shop distribution bar chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-white/5 shadow-2xl">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider mb-5 flex items-center space-x-2 font-display">
            <BiTrendingUp className="text-indigo-400 text-lg" />
            <span>{t("chart_shop_distribution")} (Top 10 Districts)</span>
          </h2>
          <AnalyticsChart shops={shops} type="district" />
        </div>

        {/* Rating Breakdown Pie chart */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-2xl">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider mb-5 flex items-center space-x-2 font-display">
            <BiTrendingUp className="text-indigo-400 text-lg" />
            <span>{t("chart_ratings")}</span>
          </h2>
          <AnalyticsChart shops={shops} type="ratings" />
        </div>
      </div>

      {/* District quick list & recent uploads summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Shops Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
            <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider flex items-center space-x-2 font-display">
              <BiStore className="text-indigo-400 text-lg" />
              <span>{t("recent_shops")}</span>
            </h2>
            <Link to="/map" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 font-bold border-b border-white/5">
                  <th className="p-3">Shop Name</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Address</th>
                  <th className="p-3 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-900/10 text-slate-300">
                {recentShops.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 font-semibold">
                      No shops found in database.
                    </td>
                  </tr>
                ) : (
                  recentShops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-semibold text-white truncate max-w-[150px]">
                        {shop.shop_name}
                      </td>
                      <td className="p-3 font-semibold text-indigo-400">
                        {shop.district}
                      </td>
                      <td className="p-3 truncate max-w-[200px]">
                        {shop.address}
                      </td>
                      <td className="p-3 text-center font-bold text-amber-400">
                        {shop.rating.toFixed(1)} ★
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Active Districts widget list */}
        <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-2xl">
          <h2 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider mb-4 flex items-center space-x-2 font-display border-b border-white/5 pb-3">
            <BiMapPin className="text-indigo-400 text-lg" />
            <span>{t("chart_most_active")}</span>
          </h2>

          <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
            {districtStats
              .filter(d => d.count > 0)
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((dist, idx) => (
                <div key={dist.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/20 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 flex items-center justify-center bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-500/20">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {dist.name}
                    </span>
                  </div>
                  <span className="text-xs bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-extrabold">
                    {dist.count} shops
                  </span>
                </div>
              ))}

            {activeDistrictsCount === 0 && (
              <div className="text-center text-xs text-slate-500 py-8 font-semibold">
                No active districts.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
