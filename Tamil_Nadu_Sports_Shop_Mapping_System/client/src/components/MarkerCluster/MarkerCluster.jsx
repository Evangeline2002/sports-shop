import React from 'react';
import { MarkerClusterGroup } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';

const MarkerCluster = ({ shops }) => {
    return (
        <MarkerClusterGroup>
            {shops.map((shop) => (
                <Marker
                    key={shop.id}
                    position={[shop.latitude, shop.longitude]}
                    icon={getMarkerIcon(shop.district)}
                >
                    <Popup>
                        <div className="popup-content">
                            <h3>{shop.shop_name}</h3>
                            <p>{shop.address}</p>
                            <p>Phone: {shop.phone}</p>
                            <p>Rating: {shop.rating}</p>
                            <a href={shop.maps_url} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                            <br />
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`} target="_blank" rel="noopener noreferrer">Get Directions</a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>
    );
};

const getMarkerIcon = (district) => {
    // Define different icons based on the district or other criteria
    // This is a placeholder function
    return null; // Replace with actual icon logic
};

export default MarkerCluster;