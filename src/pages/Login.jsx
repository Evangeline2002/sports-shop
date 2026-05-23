import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { BiLockOpenAlt, BiUser, BiArrowBack, BiInfoCircle } from "react-icons/bi";

const Login = () => {
  const { login, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("required_fields"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError(t("login_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#0b0f19] relative overflow-hidden">
      {/* Visual background flares */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

      {/* Main card panel */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-white/5 animate-fade-in relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-all group font-bold"
        >
          <BiArrowBack className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Directory</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-600 inline-block p-3 rounded-2xl text-white shadow-lg shadow-indigo-600/30 mb-3">
            <BiLockOpenAlt className="text-2xl" />
          </div>
          <h2 className="font-extrabold text-white text-2xl tracking-tight font-display text-glow">
            {t("admin_login")}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Sign in to manage database stores, upload spreadsheets, and view query tracking data.
          </p>
        </div>

        {/* Help banner for credentials fallback */}
        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex items-start space-x-3 mb-6">
          <BiInfoCircle className="text-indigo-400 text-lg mt-0.5 flex-shrink-0" />
          <div className="text-left text-[11px] leading-relaxed">
            <p className="font-extrabold text-white mb-0.5">Mock Login Ready</p>
            <p className="text-slate-400 font-medium">To test dashboard administrative functionality immediately, use:</p>
            <p className="text-indigo-300 font-mono mt-1 font-bold">admin@sportshop.tn</p>
            <p className="text-indigo-300 font-mono font-bold">adminpassword123</p>
          </div>
        </div>

        {/* Error Dialog */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold mb-5 leading-relaxed text-left">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("email")}</label>
            <div className="relative">
              <BiUser className="absolute left-3.5 top-3 text-slate-500 text-lg" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sportshop.tn"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("password")}</label>
            <div className="relative">
              <BiLockOpenAlt className="absolute left-3.5 top-3 text-slate-500 text-lg" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm mt-3 hover:-translate-y-0.5"
          >
            {loading ? "Signing in..." : t("submit_login")}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
