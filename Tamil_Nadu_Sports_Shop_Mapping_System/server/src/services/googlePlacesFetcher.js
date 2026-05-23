const axios = require('axios');

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const fetchSportsShopsInDistrict = async (district) => {
    try {
        const response = await axios.get(GOOGLE_PLACES_API_URL, {
            params: {
                query: `Sports shop in ${district}, Tamil Nadu`,
                key: GOOGLE_PLACES_API_KEY,
            },
        });

        if (response.data && response.data.results) {
            return response.data.results.map(place => ({
                place_name: place.name,
                address: place.formatted_address,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                phone: place.formatted_phone_number || 'N/A',
                rating: place.rating || 'N/A',
                website: place.website || 'N/A',
                place_id: place.place_id,
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error fetching data from Google Places API: ${error.message}`);
        throw new Error('Failed to fetch sports shops data');
    }
};

module.exports = {
    fetchSportsShopsInDistrict,
};