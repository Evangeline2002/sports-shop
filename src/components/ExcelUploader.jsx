import React, { useState, useRef } from "react";
import { excelService } from "../services/excelService";
import { useLanguage } from "../context/LanguageContext";
import { 
  BiCloudUpload, 
  BiFileBlank, 
  BiCheckCircle, 
  BiErrorCircle, 
  BiDownload,
  BiTrendingUp,
  BiListUl
} from "react-icons/bi";

const ExcelUploader = ({ onImportComplete, forceImport = false }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndProcessFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndProcessFile(selectedFile);
  };

  const validateAndProcessFile = async (fileToProcess) => {
    if (!fileToProcess) return;

    const extension = fileToProcess.name.split(".").pop().toLowerCase();
    if (extension !== "xlsx" && extension !== "xls" && extension !== "csv") {
      setError("Unsupported file format. Please upload .xlsx, .xls, or .csv spreadsheets.");
      setFile(null);
      setParsedData([]);
      return;
    }

    setFile(fileToProcess);
    setError(null);
    setLoading(true);

    try {
      const data = await excelService.parseFile(fileToProcess);
      setParsedData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to process file.");
      setFile(null);
      setParsedData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    setLoading(true);
    try {
      await onImportComplete(parsedData, { force: forceImport });
      // Reset uploader
      setFile(null);
      setParsedData([]);
    } catch (err) {
      setError("Import process failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Upload Drag/Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerSelectFile}
        className={`glass-panel border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all ${
          file 
            ? "border-emerald-500/40 bg-emerald-500/5" 
            : "border-white/10 hover:border-indigo-500/40 bg-slate-950/20"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${
            file ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400 animate-bounce"
          }`}>
            <BiCloudUpload className="text-4xl md:text-5xl" />
          </div>
          
          {file ? (
            <div>
              <p className="font-extrabold text-white text-base md:text-lg mb-1">
                {file.name}
              </p>
              <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1.5">
                <BiCheckCircle />
                <span>Parsed {parsedData.length} records successfully</span>
              </p>
            </div>
          ) : (
            <div>
              <p className="font-extrabold text-white text-base md:text-lg mb-2">
                {t("upload_file")}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Supports Excel (.xlsx, .xls) and CSV (.csv) files.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Template Download Option */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-2xl gap-3">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
            <BiFileBlank className="text-xl" />
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold text-white">Need a spreadsheet layout?</p>
            <p className="text-[10px] text-slate-400 font-medium">Download our preset schema with all district coordinates.</p>
          </div>
        </div>
        <button
          onClick={excelService.downloadTemplate}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/5"
        >
          <BiDownload className="text-sm" />
          <span>Download Template</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center space-x-3 text-sm font-semibold animate-shake">
          <BiErrorCircle className="text-xl flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Parsed Data Preview Grid */}
      {parsedData.length > 0 && (
        <div className="glass-panel border border-white/5 rounded-3xl p-5 shadow-2xl animate-fade-in">
          <h3 className="font-extrabold text-white text-sm md:text-base uppercase tracking-wider mb-4 flex items-center space-x-2 font-display border-b border-white/5 pb-3">
            <BiListUl className="text-indigo-400 text-xl" />
            <span>Parsed Record Preview (First 5 Rows)</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 font-bold border-b border-white/5">
                  <th className="p-3">Shop Name</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Full Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3 text-center">GPS Coordinates</th>
                  <th className="p-3 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-900/10 text-slate-300">
                {parsedData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white max-w-[150px] truncate">{row.shop_name}</td>
                    <td className="p-3 font-semibold text-indigo-400">{row.district || "N/A"}</td>
                    <td className="p-3 max-w-[200px] truncate">{row.address || "N/A"}</td>
                    <td className="p-3 font-medium">{row.phone || "N/A"}</td>
                    <td className="p-3 text-center text-slate-400 font-mono">
                      {row.latitude && row.longitude 
                        ? `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}` 
                        : "Pending Geocode"}
                    </td>
                    <td className="p-3 text-center font-bold text-amber-400">{row.rating?.toFixed(1) || "4.0"} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-end space-x-3">
            <button
              onClick={() => {
                setFile(null);
                setParsedData([]);
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-white/5 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <span>Importing...</span>
              ) : (
                <>
                  <BiTrendingUp className="text-base" />
                  <span>Bulk Import {parsedData.length} Shops</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
