import express from 'express';
import Team from '../models/Team.js';

const router = express.Router();

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

export default router;
