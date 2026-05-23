import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { fetchShopsByDistrict } from '../services/firebaseService';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
    const { user } = useAuth();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState([11.1271, 78.6569]); // Center of Tamil Nadu

    useEffect(() => {
        const getShops = async () => {
            try {
                const data = await fetchShopsByDistrict();
                setShops(data);
            } catch (error) {
                console.error("Error fetching shops:", error);
            } finally {
                setLoading(false);
            }
        };

        getShops();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="h-full">
            <MapContainer center={center} zoom={7} className="h-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {shops.map(shop => (
                    <Marker key={shop.id} position={[shop.latitude, shop.longitude]}>
                        <Popup>
                            <div>
                                <h3>{shop.shop_name}</h3>
                                <p>{shop.address}</p>
                                <p>Phone: {shop.phone}</p>
                                <p>Rating: {shop.rating}</p>
                                <a href={shop.maps_url} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPage;