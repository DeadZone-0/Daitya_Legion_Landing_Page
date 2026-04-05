import mongoose from 'mongoose';

const playerPerformanceSchema = new mongoose.Schema({
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  player_name: { type: String, required: true },
  // Batting
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  strike_rate: { type: Number, default: 0 },
  how_out: { type: String, default: 'DNB' }, // e.g. "Caught", "Bowled", "Not Out", "DNB"
  // Bowling
  wickets: { type: Number, default: 0 },
  overs_bowled: { type: String, default: '0' },
  runs_conceded: { type: Number, default: 0 },
  economy: { type: Number, default: 0 },
  // Fielding
  catches: { type: Number, default: 0 },
  run_outs: { type: Number, default: 0 },
  // MVP
  mvp_points: { type: Number, default: 0, min: 0, max: 10 },
}, { _id: false });

const matchSchema = new mongoose.Schema({
  date: { type: String, required: true },
  opponent: { type: String, required: true },
  ground: { type: String, default: '' },
  city: { type: String, default: '' },
  match_type: { type: String, default: 'T20' },
  // Scores
  our_score: { type: String, default: '' },   // e.g. "142/6"
  opp_score: { type: String, default: '' },   // e.g. "138/9"
  our_overs: { type: String, default: '' },   // e.g. "20"
  opp_overs: { type: String, default: '' },   // e.g. "20"
  toss: { type: String, default: '' },         // e.g. "Daitya Legion won the toss and elected to bat"
  result: { type: String, enum: ['won', 'lost', 'no_result'], required: true },
  // Post-match analysis
  insights: { type: String, default: '' },     // "What we should have done differently..."
  highlights: { type: String, default: '' },   // "Key moments / what went well"
  // CricHeroes
  cricheroes_url: { type: String, default: '' },
  // Per-player data
  player_performances: [playerPerformanceSchema],
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
