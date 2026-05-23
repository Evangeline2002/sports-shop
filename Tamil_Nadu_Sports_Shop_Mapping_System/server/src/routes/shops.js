const express = require('express');
const router = express.Router();
const shopsController = require('../controllers/shopsController');

// Get all sports shops
router.get('/', shopsController.getAllShops);

// Get a specific shop by ID
router.get('/:id', shopsController.getShopById);

// Create a new shop
router.post('/', shopsController.createShop);

// Update an existing shop
router.put('/:id', shopsController.updateShop);

// Delete a shop
router.delete('/:id', shopsController.deleteShop);

// Bulk import shops from Excel
router.post('/import', shopsController.importShops);

// Export shops to Excel
router.get('/export', shopsController.exportShops);

module.exports = router;