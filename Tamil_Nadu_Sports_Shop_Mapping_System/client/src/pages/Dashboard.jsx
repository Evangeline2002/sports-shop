import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import AnalyticsChart from '../components/AnalyticsChart/AnalyticsChart';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const Dashboard = () => {
    const [sportsShops, setSportsShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSportsShops = async () => {
            const shopsCollection = collection(db, 'sports_shops');
            const shopSnapshot = await getDocs(shopsCollection);
            const shopList = shopSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSportsShops(shopList);
            setLoading(false);
        };

        fetchSportsShops();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    const totalShops = sportsShops.length;
    const districtStats = sportsShops.reduce((acc, shop) => {
        acc[shop.district] = (acc[shop.district] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold">Total Sports Shops</h2>
                            <p className="text-2xl">{totalShops}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold">District-wise Statistics</h2>
                            <AnalyticsChart data={districtStats} />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold">Recently Added Shops</h2>
                            <ul>
                                {sportsShops.slice(-5).map(shop => (
                                    <li key={shop.id} className="border-b py-2">
                                        {shop.shop_name} - {shop.district}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;