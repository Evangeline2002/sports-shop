import React from 'react';
import { Link } from 'react-router-dom';
import districts from '../../data/districts.json';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full p-5">
            <h2 className="text-xl font-bold mb-4">Tamil Nadu Sports Shops</h2>
            <h3 className="text-lg font-semibold mb-2">Districts</h3>
            <ul className="space-y-2">
                {districts.map((district) => (
                    <li key={district.id}>
                        <Link
                            to={`/district/${district.id}`}
                            className="block p-2 rounded hover:bg-gray-700"
                        >
                            {district.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;