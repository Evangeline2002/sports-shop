import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsChart = ({ data }) => {
    return (
        <div className="w-full h-64">
            <h2 className="text-xl font-semibold mb-4">Sports Shop Analytics</h2>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="district" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="shopCount" fill="#4A90E2" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;