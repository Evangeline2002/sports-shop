import React, { useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Premium Dark Theme Palette
const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#f43f5e", // Rose
  "#06b6d4"  // Cyan
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-white mb-1.5">{label}</p>
        {payload.map((p, index) => (
          <p key={index} className="text-xs font-semibold" style={{ color: p.color || p.fill }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsChart = ({ shops, type }) => {
  const { language, t } = useLanguage();

  // 1. Calculate District Shop Distribution Data
  const districtDistributionData = useMemo(() => {
    const counts = {};
    shops.forEach((s) => {
      const distName = s.district || "Unknown";
      counts[distName] = (counts[distName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Show top 10 for readability
  }, [shops]);

  // 2. Calculate Ratings Distribution Data
  const ratingsData = useMemo(() => {
    const brackets = {
      "4.5 - 5.0 ★": 0,
      "4.0 - 4.4 ★": 0,
      "3.5 - 3.9 ★": 0,
      "3.0 - 3.4 ★": 0,
      "Below 3.0 ★": 0
    };

    shops.forEach((s) => {
      const r = s.rating || 0;
      if (r >= 4.5) brackets["4.5 - 5.0 ★"] += 1;
      else if (r >= 4.0) brackets["4.0 - 4.4 ★"] += 1;
      else if (r >= 3.5) brackets["3.5 - 3.9 ★"] += 1;
      else if (r >= 3.0) brackets["3.0 - 3.4 ★"] += 1;
      else brackets["Below 3.0 ★"] += 1;
    });

    return Object.entries(brackets).map(([name, value]) => ({ name, value }));
  }, [shops]);

  // 3. Calculate Monthly Growth Data
  const growthData = useMemo(() => {
    const monthlyCounts = {};
    shops.forEach((s) => {
      const date = new Date(s.created_at || Date.now());
      // format to Month Year, e.g. "Jan 2026"
      const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    // Sort chronologically
    return Object.entries(monthlyCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));
  }, [shops]);

  if (shops.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-xs font-semibold">
        No shop data available for graphing.
      </div>
    );
  }

  // Render requested chart type
  if (type === "district") {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={districtDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="url(#indigoGrad)" radius={[6, 6, 0, 0]} name="Shops Count">
              {districtDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <defs>
              <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "ratings") {
    return (
      <div className="h-80 w-full flex flex-col md:flex-row items-center justify-center">
        <div className="h-64 w-full md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ratingsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {ratingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* custom legend grid for cleaner mobile layout */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 ml-0 md:ml-4 text-left w-full md:w-1/2 mt-4 md:mt-0">
          {ratingsData.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className="truncate">{item.name}: {item.value} shops</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "growth") {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={1} fill="url(#indigoGrad2)" name="Shops Added" />
            <defs>
              <linearGradient id="indigoGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default AnalyticsChart;
