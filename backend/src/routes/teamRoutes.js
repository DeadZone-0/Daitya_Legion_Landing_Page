import express from 'express';
import Team from '../models/Team.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET team stats (public)
router.get('/', async (req, res) => {
  try {
    const team = await Team.findOne({ name: 'Daitya Legion' });
    if (!team) {
      return res.json({
        name: 'Daitya Legion',
        logo_url: 'https://cricheroes.com/assets/images/team-placeholder.png',
        total_matches: 0,
        total_runs: 0,
        total_wickets: 0
      });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// PATCH team settings (admin only) — update best_win, best_win_url, etc.
router.patch('/', protect, async (req, res) => {
  try {
    const allowed = ['best_win', 'best_win_url', 'best_win_margin', 'total_tournaments', 'win_percentage'];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const team = await Team.findOneAndUpdate(
      { name: 'Daitya Legion' },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
