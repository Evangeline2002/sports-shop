import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import MapPage from "../pages/MapPage";
import Dashboard from "../pages/Dashboard";
import DistrictDetails from "../pages/DistrictDetails";
import UploadExcel from "../pages/UploadExcel";
import AnalyticsPage from "../pages/AnalyticsPage";
import SettingsPage from "../pages/SettingsPage";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Root route → Map split-screen view (main feature) */}
        <Route path="/" element={<MapPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/districts/:districtId" element={<DistrictDetails />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadExcel />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<MapPage />} />
    </Routes>
  );
};

export default AppRoutes;
