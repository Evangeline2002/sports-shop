import { useState, useCallback, useRef, useEffect } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import { FaMapMarkerAlt, FaPhone, FaStore } from "react-icons/fa";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const defaultCenter = {
    lat: 11.1271,
    lng: 78.6569,
};

const mapOptions = {
    styles: [
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }, { lightness: 17 }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#dedede" }, { lightness: 21 }],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
        },
        {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
        },
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
};

function MapView({ shops, selectedShop, onMarkerClick }) {
    const [activeInfoWindow, setActiveInfoWindow] = useState(null);
    const mapRef = useRef(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    });

    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    // Pan to selected shop
    useEffect(() => {
        if (selectedShop && mapRef.current) {
            const pos = { lat: selectedShop.latitude, lng: selectedShop.longitude };
            mapRef.current.panTo(pos);
            mapRef.current.setZoom(15);
            setActiveInfoWindow(selectedShop.id);
        }
    }, [selectedShop]);

    const handleMarkerClick = (shop) => {
        setActiveInfoWindow(shop.id);
        if (onMarkerClick) onMarkerClick(shop);
        if (mapRef.current) {
            mapRef.current.panTo({ lat: shop.latitude, lng: shop.longitude });
            mapRef.current.setZoom(15);
        }
    };

    const handleInfoWindowClose = () => {
        setActiveInfoWindow(null);
    };

    if (loadError) {
        return (
            <div className="map-error">
                <FaMapMarkerAlt size={48} />
                <h3>Unable to load Google Maps</h3>
                <p>Please check your API key and internet connection.</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>Loading Map...</p>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={
                selectedShop
                    ? { lat: selectedShop.latitude, lng: selectedShop.longitude }
                    : defaultCenter
            }
            zoom={selectedShop ? 15 : 7}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {shops.map((shop) => (
                <Marker
                    key={shop.id}
                    position={{ lat: shop.latitude, lng: shop.longitude }}
                    onClick={() => handleMarkerClick(shop)}
                    animation={
                        selectedShop && selectedShop.id === shop.id
                            ? window.google.maps.Animation.BOUNCE
                            : undefined
                    }
                    icon={
                        selectedShop && selectedShop.id === shop.id
                            ? {
                                url:
                                    "data:image/svg+xml;charset=UTF-8," +
                                    encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
                      <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" fill="#1a73e8"/>
                      <circle cx="20" cy="18" r="10" fill="white"/>
                      <text x="20" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a73e8">⚽</text>
                    </svg>
                  `),
                                scaledSize: new window.google.maps.Size(48, 58),
                                anchor: new window.google.maps.Point(24, 58),
                            }
                            : {
                                url:
                                    "data:image/svg+xml;charset=UTF-8," +
                                    encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
                      <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26C32 7.2 24.8 0 16 0z" fill="#4285f4"/>
                      <circle cx="16" cy="14" r="7" fill="white"/>
                      <text x="16" y="18" text-anchor="middle" font-size="10" fill="#4285f4">🏪</text>
                    </svg>
                  `),
                                scaledSize: new window.google.maps.Size(36, 46),
                                anchor: new window.google.maps.Point(18, 46),
                            }
                    }
                >
                    {activeInfoWindow === shop.id && (
                        <InfoWindow
                            position={{ lat: shop.latitude, lng: shop.longitude }}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div className="info-window">
                                <div className="info-window-header">
                                    <FaStore className="info-icon" />
                                    <h3>{shop.name}</h3>
                                </div>
                                <p className="info-address">
                                    <FaMapMarkerAlt className="info-detail-icon" />
                                    {shop.address}
                                </p>
                                <p className="info-phone">
                                    <FaPhone className="info-detail-icon" />
                                    <a href={`tel:${shop.phone}`}>{shop.phone}</a>
                                </p>
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            ))}
        </GoogleMap>
    );
}

export default MapView;
