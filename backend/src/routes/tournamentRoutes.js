import express from 'express';
import Tournament from '../models/Tournament.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all tournaments (public)
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find({}).populate('matches').sort({ year: -1, createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET single tournament by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST create tournament (admin)
router.post('/', protect, async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    const saved = await tournament.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH update tournament (admin)
router.patch('/:id', protect, async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE tournament (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tournament removed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
