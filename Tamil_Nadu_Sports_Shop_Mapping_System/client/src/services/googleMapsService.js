import axios from 'axios';

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const getGeocode = async (address) => {
    try {
        const response = await axios.get(`${GOOGLE_MAPS_API_URL}/geocode/json`, {
            params: {
                address,
                key: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching geocode:', error);
        throw error;
    }
};

export const getPlaceDetails = async (placeId) => {
    try {
        const response = await axios.get(`${GOOGLE_MAPS_API_URL}/place/details/json`, {
            params: {
                place_id: placeId,
                key: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
};

export const getNearbyPlaces = async (location, radius, type) => {
    try {
        const response = await axios.get(`${GOOGLE_MAPS_API_URL}/place/nearbysearch/json`, {
            params: {
                location,
                radius,
                type,
                key: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        throw error;
    }
};