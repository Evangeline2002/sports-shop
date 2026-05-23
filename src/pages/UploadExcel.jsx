import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExcelUploader from "../components/ExcelUploader";
import { useShops } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { 
  BiSpreadsheet, 
  BiCheckDouble, 
  BiSkipNextCircle, 
  BiArrowBack,
  BiCheckCircle
} from "react-icons/bi";

const UploadExcel = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { bulkImport } = useShops();
  
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [forceImport, setForceImport] = useState(false);

  const handleImportComplete = async (parsedShops, options = {}) => {
    setError(null);
    setResults(null);
    
    // Call Context bulk import action
    const res = await bulkImport(parsedShops, options);
    
    if (res.success) {
      setResults({
        imported: res.importedCount,
        duplicates: res.duplicatesCount,
        total: parsedShops.length
      });
    } else {
      setError(res.error || "Batch import failed. Please verify spreadsheet formatting.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-[#0b0f19] min-h-[calc(100vh-80px)]">
      
      {/* Header Bar */}
      <div className="flex items-center space-x-4 border-b border-white/5 pb-5 text-left">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-md active:scale-95"
          title="Go Back"
        >
          <BiArrowBack className="text-lg" />
        </button>
        <div>
          <h1 className="font-extrabold text-white text-xl md:text-2xl tracking-tight font-display text-glow">
            {t("upload_excel")}
          </h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wide uppercase mt-0.5">
            Bulk spreadsheet database importer
          </p>
        </div>
      </div>

      {/* Stats summary of recent import */}
      {results && (
        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-left animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="font-extrabold text-white text-base md:text-lg flex items-center space-x-1.5 font-display">
              <BiCheckCircle className="text-emerald-400 text-xl" />
              <span>Import Summary Completed!</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              We parsed and ran geocoding coordinates validation against all records inside the file.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Added Widget */}
            <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <BiCheckDouble className="text-emerald-400 text-2xl" />
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Imported</span>
                <span className="text-base font-extrabold text-white font-mono">{results.imported}</span>
              </div>
            </div>
            {/* Skipped duplicates Widget */}
            <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <BiSkipNextCircle className="text-amber-500 text-2xl" />
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Duplicates Skipped</span>
                <span className="text-base font-extrabold text-white font-mono">{results.duplicates}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold text-left">
          {error}
        </div>
      )}

      {/* Main Upload Box Area */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
        <div className="text-left space-y-1">
          <h2 className="font-extrabold text-white text-base md:text-lg flex items-center space-x-2 font-display">
            <BiSpreadsheet className="text-indigo-400 text-xl" />
            <span>Select Import Spreadsheet</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Format your file columns mapping: <span className="font-bold text-slate-300">Shop Name, District, Address, Phone, Latitude, Longitude, Website</span>. Let coordinates stay empty to auto-geocode.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label className="inline-flex items-center space-x-2 text-xs">
              <input type="checkbox" checked={forceImport} onChange={(e) => setForceImport(e.target.checked)} className="form-checkbox" />
              <span className="text-slate-300">Force import (allow duplicates)</span>
            </label>
            <p className="text-xs text-slate-500">Enable to import all rows even if duplicates exist.</p>
          </div>
        </div>
        <ExcelUploader onImportComplete={handleImportComplete} forceImport={forceImport} />
      </div>

    </div>
  );
};

export default UploadExcel;
