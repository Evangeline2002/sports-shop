import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseService } from '../services/firebaseService';
import LoadingSpinner from '../components/LoadingSpinner';
import ShopCard from '../components/ShopCard';

const DistrictDetails = () => {
    const { districtName } = useParams();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const data = await firebaseService.getShopsByDistrict(districtName);
                setShops(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, [districtName]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{districtName} Sports Shops</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shops.map(shop => (
                    <ShopCard key={shop.id} shop={shop} />
                ))}
            </div>
        </div>
    );
};

export default DistrictDetails;