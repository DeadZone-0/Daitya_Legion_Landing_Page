import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import startScraperJob from "./jobs/scraperJob.js";
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();
startScraperJob();

app.use("/api/players", playerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);

// Basic Route for testing
app.get("/", (req, res) => {
  res.send("Daitya Legion API is running");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
