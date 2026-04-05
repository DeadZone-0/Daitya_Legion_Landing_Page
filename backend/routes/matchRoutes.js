import express from 'express';
import { getMatches, createMatch, deleteMatch } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMatches);
router.post('/', protect, createMatch);
router.delete('/:id', protect, deleteMatch);

export default router;
