import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import { fetchShopsByDistrict } from '../../services/placesService';
import MarkerCluster from '../MarkerCluster/MarkerCluster';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const MapContainer = ({ selectedDistrict }) => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const map = useMap();

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            const fetchedShops = await fetchShopsByDistrict(selectedDistrict);
            setShops(fetchedShops);
            setLoading(false);
        };

        if (selectedDistrict) {
            fetchShops();
        }
    }, [selectedDistrict]);

    return (
        <div className="w-full h-full">
            {loading ? (
                <LoadingSpinner />
            ) : (
                <LeafletMap center={[10.8505, 78.6950]} zoom={7} className="w-full h-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MarkerCluster>
                        {shops.map((shop) => (
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
                    </MarkerCluster>
                </LeafletMap>
            )}
        </div>
    );
};

export default MapContainer;