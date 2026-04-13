import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import playerRoutes from "./src/routes/playerRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import matchRoutes from "./src/routes/matchRoutes.js";
import tournamentRoutes from "./src/routes/tournamentRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/tournaments", tournamentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Daitya Legion API is running");
});

const PORT = process.env.PORT || 5000;

// Start server AFTER DB connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(err);
  }
};

startServer();