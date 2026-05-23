import React from "react";

const LoadingSpinner = ({ size = "medium", type = "spinner" }) => {
  if (type === "skeleton") {
    return (
      <div className="animate-pulse space-y-4 w-full">
        <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-slate-800 rounded-md col-span-2"></div>
            <div className="h-4 bg-slate-800 rounded-md col-span-1"></div>
          </div>
          <div className="h-4 bg-slate-800 rounded-md"></div>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-10 w-10 border-3",
    large: "h-16 w-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent`}
      ></div>
      <span className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">
        Loading System Assets...
      </span>
    </div>
  );
};

export default LoadingSpinner;
