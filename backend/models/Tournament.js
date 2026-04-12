import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    short_name: { type: String, default: '' },
    type: { type: String, default: 'T20', enum: ['T20', 'T10', 'ODI', 'Test', 'Other'] },
    year: { type: Number, default: new Date().getFullYear() },
    status: { type: String, default: 'completed', enum: ['ongoing', 'completed', 'upcoming'] },
    matches_played: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    no_results: { type: Number, default: 0 },
    result: { type: String, default: '' }, // e.g. "Winners", "Runner-Up", "Group Stage"
    cricheroes_url: { type: String, default: '' },
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Tournament', tournamentSchema);
