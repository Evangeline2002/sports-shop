import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MapPage from '../pages/MapPage';
import DistrictDetails from '../pages/DistrictDetails';
import Upload from '../pages/Upload';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import AdminLayout from '../layouts/AdminLayout';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
                    <Route path="/map" element={<AdminLayout><MapPage /></AdminLayout>} />
                    <Route path="/district/:districtId" element={<AdminLayout><DistrictDetails /></AdminLayout>} />
                    <Route path="/upload" element={<AdminLayout><Upload /></AdminLayout>} />
                    <Route path="/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />
                    <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;