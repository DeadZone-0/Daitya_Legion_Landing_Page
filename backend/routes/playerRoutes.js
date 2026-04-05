import express from "express";
import {
    createPlayer,
    deletePlayer,
    getPlayers,
    updatePlayer,
} from "../controllers/playerController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

// Public: Get all players
router.get("/", getPlayers);

// Public: Get single player with full match history
router.get("/:external_id/matches", async (req, res) => {
  try {
    const Player = (await import('../models/Player.js')).default;
    const player = await Player.findOne({ external_id: req.params.external_id }, 'name match_history batting bowling general');
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Protected: Admin CRUD
router.post("/", protect, upload.single('image'), createPlayer);
router.put("/:id", protect, upload.single('image'), updatePlayer);
router.delete("/:id", protect, deletePlayer);

export default router;
