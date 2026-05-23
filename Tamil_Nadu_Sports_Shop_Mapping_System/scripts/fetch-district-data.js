const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('../path/to/your/serviceAccountKey.json'); // Update with your service account key path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const districts = [
  "Chennai", "Coimbatore", "Madurai", "Salem", "Erode", "Dindigul",
  "Tiruppur", "Tirunelveli", "Trichy", "Thanjavur", "Vellore", "Karur",
  "Namakkal", "Dharmapuri", "Krishnagiri", "Cuddalore", "Villupuram",
  "Kanchipuram", "Tiruvallur", "Ramanathapuram", "Sivagangai", "Pudukottai",
  "Ariyalur", "Perambalur", "Tenkasi", "Nilgiris", "Kanyakumari", "Ranipet",
  "Chengalpattu", "Tirupathur", "Mayiladuthurai", "Tiruvarur", "Theni",
  "Virudhunagar", "Thoothukudi", "Nagapattinam", "Kallakurichi"
];

const fetchDistrictData = async () => {
  for (const district of districts) {
    const query = `Sports shop in ${district} Tamil Nadu`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url);
      const shops = response.data.results.map(shop => ({
        district: district,
        shop_name: shop.name,
        address: shop.formatted_address,
        latitude: shop.geometry.location.lat,
        longitude: shop.geometry.location.lng,
        phone: shop.formatted_phone_number || 'N/A',
        rating: shop.rating || 'N/A',
        website: shop.website || 'N/A',
        maps_url: `https://www.google.com/maps/place/?q=place_id:${shop.place_id}`,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      }));

      const batch = admin.firestore().batch();
      shops.forEach(shop => {
        const shopRef = admin.firestore().collection('sports_shops').doc();
        batch.set(shopRef, shop);
      });

      await batch.commit();
      console.log(`Fetched and stored data for ${district}`);
    } catch (error) {
      console.error(`Error fetching data for ${district}:`, error);
    }
  }
};

fetchDistrictData();