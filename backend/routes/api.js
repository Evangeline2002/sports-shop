import express from "express";
import { placesService } from "../services/placesService.js";

const router = express.Router();

// Fetch sports shops from Google Places API for a given district
router.post("/fetch-district-shops", async (req, res) => {
  const { district, apiKey } = req.body;

  if (!district) {
    return res.status(400).json({ error: "District parameter is required." });
  }

  try {
    // API key could be passed from request or loaded from process.env
    const key = apiKey || process.env.GOOGLE_MAPS_API_KEY;
    const shops = await placesService.fetchShopsFromGoogle(district, key);

    return res.json({
      success: true,
      district,
      count: shops.length,
      shops
    });
  } catch (err) {
    console.error("API error during places retrieval:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch shops data."
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    apiKeysConfigured: {
      googleMaps: !!process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY !== "your_google_maps_api_key_here",
      firebase: !!process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== "your_project_id"
    }
  });
});

export default router;
