import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUpload, FaChartLine, FaCog } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-gray-800">
                    Tamil Nadu Sports Shop
                </div>
                <div className="flex space-x-4">
                    <Link to="/dashboard" className="text-gray-600 hover:text-blue-500">
                        <FaHome /> Dashboard
                    </Link>
                    <Link to="/upload" className="text-gray-600 hover:text-blue-500">
                        <FaUpload /> Upload
                    </Link>
                    <Link to="/analytics" className="text-gray-600 hover:text-blue-500">
                        <FaChartLine /> Analytics
                    </Link>
                    <Link to="/settings" className="text-gray-600 hover:text-blue-500">
                        <FaCog /> Settings
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;