import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api.js";

// Load configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend access
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api", apiRouter);

// Base index page
app.get("/", (req, res) => {
  res.send("Tamil Nadu Sports Shop Mapping System API Server is Running.");
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
