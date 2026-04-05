import connectDB from "../../backend/config/db.js";
import {
    createPlayer,
    deletePlayer,
    getPlayers,
    updatePlayer,
} from "../../backend/controllers/playerController.js";
import { protect } from "../middleware/authMiddleware.js";

export default async function handler(req, res) {
  await connectDB();

  // GET all players (public)
  if (req.method === "GET") {
    try {
      return getPlayers(req, res);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  // Protect other methods
  const authResult = protect(req, res);
  if (authResult && authResult.statusCode) return;

  // POST create player
  if (req.method === "POST") {
    try {
      // Temp: skip multer, assume image_url in body
      req.file = null; // No file handling yet
      return createPlayer(req, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // PUT update player
  if (req.method === "PUT" && req.params?.id) {
    try {
      req.file = null;
      return updatePlayer(req, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // DELETE player
  if (req.method === "DELETE" && req.params?.id) {
    try {
      return deletePlayer(req, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
