const admin = require('firebase-admin');
const Shop = require('../models/Shop'); // Assuming you have a Shop model defined

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const { shop_name, address, latitude, longitude, phone, rating, website, district } = req.body;

        const newShop = new Shop({
            shop_name,
            address,
            latitude,
            longitude,
            phone,
            rating,
            website,
            district,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        await newShop.save();
        res.status(201).json({ message: 'Shop created successfully', shop: newShop });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all shops
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get shops by district
exports.getShopsByDistrict = async (req, res) => {
    const { district } = req.params;
    try {
        const shops = await Shop.find({ district });
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a shop
exports.updateShop = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedShop = await Shop.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Shop updated successfully', shop: updatedShop });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
    const { id } = req.params;
    try {
        await Shop.findByIdAndDelete(id);
        res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};