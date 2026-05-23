import React, { useEffect, useState } from 'react';
import { fetchAnalyticsData } from '../services/firebaseService';
import AnalyticsChart from '../components/AnalyticsChart/AnalyticsChart';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAnalyticsData = async () => {
            try {
                const data = await fetchAnalyticsData();
                setAnalyticsData(data);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        getAnalyticsData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            {analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnalyticsChart data={analyticsData.shopCountByDistrict} title="District-wise Shop Count" />
                    <AnalyticsChart data={analyticsData.monthlyAddedShops} title="Monthly Added Shops" />
                    <AnalyticsChart data={analyticsData.activeDistricts} title="Most Active Districts" />
                    <AnalyticsChart data={analyticsData.ratingAnalytics} title="Rating Analytics" />
                </div>
            )}
        </div>
    );
};

export default Analytics;