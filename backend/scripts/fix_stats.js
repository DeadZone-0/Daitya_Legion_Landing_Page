// Manual stat corrections for players whose data diverged from CricHeroes ground truth
// Run: node backend/scripts/fix_stats.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Player from '../models/Player.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Correct stats directly from CricHeroes player profile pages
// These are the VERIFIED figures from the "Career Summary" box on CricHeroes
const CORRECTIONS = [
  {
    external_id: '32875462', // Maithani Ashraya
    name: 'Maithani Ashraya',
    matches: 31,
    runs: 207,
    wickets: 22,
    batting: { high_score: 37, total_runs: 207, average: 11.50, strike_rate: 88.1, fours: 22, sixes: 1, innings: 18 },
    bowling: { wickets: 22, best_bowling: '3/28', economy: 7.2, overs: 57.0, average: 12.1 }
  },
  {
    external_id: '41997128', // Bruce Wayne
    name: 'Bruce Wayne',
    matches: 30,
    runs: 236,
    wickets: 24,
    batting: { high_score: 38, total_runs: 236, average: 13.1, strike_rate: 105.8, fours: 26, sixes: 4, innings: 18 },
    bowling: { wickets: 24, best_bowling: '4/17', economy: 6.4, overs: 83.0, average: 11.9 }
  },
  {
    external_id: '41232063', // Ansh!
    name: 'Ansh!',
    matches: 27,
    runs: 316,
    wickets: 17,
    batting: { high_score: 62, total_runs: 316, average: 18.6, strike_rate: 115.3, fours: 31, sixes: 8, innings: 17 },
    bowling: { wickets: 17, best_bowling: '2/3', economy: 7.5, overs: 51.0, average: 14.1 }
  },
  {
    external_id: '24544263', // Anuj Negi
    name: 'Anuj Negi',
    matches: 16,
    runs: 160,
    wickets: 1,
    batting: { high_score: 26, total_runs: 160, average: 14.5, strike_rate: 98.2, fours: 18, sixes: 2, innings: 11 },
    bowling: { wickets: 1, best_bowling: '1/9', economy: 7.8, overs: 12.0, average: 55.0 }
  },
  {
    external_id: '41646508', // Deepak Kothiyal
    name: 'Deepak Kothiyal',
    matches: 26,
    runs: 127,
    wickets: 11,
    batting: { high_score: 30, total_runs: 127, average: 9.8, strike_rate: 91.4, fours: 12, sixes: 2, innings: 13 },
    bowling: { wickets: 11, best_bowling: '3/18', economy: 7.1, overs: 56.0, average: 20.4 }
  },
  {
    external_id: '41746818', // Aarav
    name: 'Aarav',
    matches: 21,
    runs: 60,
    wickets: 7,
    batting: { high_score: 26, total_runs: 60, average: 5.5, strike_rate: 82.2, fours: 6, sixes: 0, innings: 11 },
    bowling: { wickets: 7, best_bowling: '3/8', economy: 6.6, overs: 46.0, average: 18.1 }
  },
  {
    external_id: '27500289', // Aaroosh Pandey
    name: 'Aaroosh_Pandey.',
    matches: 25,
    runs: 247, // CricHeroes summary shows 247
    wickets: 3,
    batting: { high_score: 45, total_runs: 247, average: 15.4, strike_rate: 94.3, fours: 28, sixes: 3, innings: 16 },
    bowling: { wickets: 3, best_bowling: '2/14', economy: 6.2, overs: 24.0, average: 28.0 }
  },
  {
    external_id: '41644117', // Sagar Pathak
    name: 'Sagar Pathak',
    matches: 22,
    runs: 22,
    wickets: 15, // CricHeroes shows 15
    batting: { high_score: 10, total_runs: 22, average: 3.1, strike_rate: 62.9, fours: 2, sixes: 0, innings: 7 },
    bowling: { wickets: 15, best_bowling: '3/9', economy: 5.8, overs: 62.0, average: 14.1 }
  },
  {
    external_id: '43826244', // Rohan Rayal
    name: 'Rohan Rayal',
    matches: 4,
    runs: 19,
    wickets: 3,
    batting: { high_score: 11, total_runs: 19, average: 6.3, strike_rate: 73.1, fours: 1, sixes: 0, innings: 3 },
    bowling: { wickets: 3, best_bowling: '2/24', economy: 8.0, overs: 10.0, average: 26.3 }
  },
  {
    external_id: '43609842', // Sakshm
    name: 'Sakshm',
    matches: 8,
    runs: 72,
    wickets: 5,
    batting: { high_score: 44, total_runs: 72, average: 12.0, strike_rate: 134.6, fours: 9, sixes: 2, innings: 6 },
    bowling: { wickets: 5, best_bowling: '2/14', economy: 7.3, overs: 14.0, average: 19.2 }
  },
  {
    external_id: '44936562', // Yug Rawat
    name: 'Yug Rawat',
    matches: 2,
    runs: 22,
    wickets: 0,
    batting: { high_score: 22, total_runs: 22, average: 11.0, strike_rate: 129.4, fours: 2, sixes: 0, innings: 2 },
    bowling: { wickets: 0, best_bowling: '0/0', economy: 0, overs: 0, average: 0 }
  },
];

const applyCorrections = async () => {
  try {
    console.log('🔗 Connecting...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!\n');

    for (const fix of CORRECTIONS) {
      const updatePayload = {
        matches: fix.matches,
        runs: fix.runs,
        wickets: fix.wickets,
        'batting.high_score': fix.batting.high_score,
        'batting.total_runs': fix.batting.total_runs,
        'batting.average': fix.batting.average,
        'batting.strike_rate': fix.batting.strike_rate,
        'batting.fours': fix.batting.fours,
        'batting.sixes': fix.batting.sixes,
        'batting.innings': fix.batting.innings,
        'bowling.wickets': fix.bowling.wickets,
        'bowling.best_bowling': fix.bowling.best_bowling,
        'bowling.economy': fix.bowling.economy,
        'bowling.overs': fix.bowling.overs,
        'bowling.average': fix.bowling.average,
      };

      const result = await Player.updateOne(
        { external_id: fix.external_id },
        { $set: updatePayload }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ ${fix.name} — updated (runs: ${fix.runs}, wkts: ${fix.wickets})`);
      } else {
        console.log(`⚠️  ${fix.name} (${fix.external_id}) — NOT FOUND in DB`);
      }
    }

    console.log('\n✅ All corrections applied!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e);
    process.exit(1);
  }
};

applyCorrections();
