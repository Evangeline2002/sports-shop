import axios from 'axios';

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const fetchSportsShopsByDistrict = async (district) => {
    try {
        const response = await axios.get(GOOGLE_PLACES_API_URL, {
            params: {
                query: `Sports shop in ${district}, Tamil Nadu`,
                key: API_KEY,
            },
        });
        return response.data.results.map(shop => ({
            place_name: shop.name,
            full_address: shop.formatted_address,
            latitude: shop.geometry.location.lat,
            longitude: shop.geometry.location.lng,
            phone: shop.formatted_phone_number || 'N/A',
            rating: shop.rating || 'N/A',
            website: shop.website || 'N/A',
            place_id: shop.place_id,
        }));
    } catch (error) {
        console.error('Error fetching sports shops:', error);
        throw error;
    }
};