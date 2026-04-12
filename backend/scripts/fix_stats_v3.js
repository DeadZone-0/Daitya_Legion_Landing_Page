import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Player from '../models/Player.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const corrections = [
  { 
    external_id: '41997128', 
    name: 'Bruce Wayne',
    batting: { total_runs: 424, high_score: 42, average: 21.2, strike_rate: 118.3, fours: 44, sixes: 12, innings: 20, fifties: 0 }
  },
  { 
    external_id: '32875462', 
    name: 'Maithani Ashraya',
    batting: { total_runs: 259, high_score: 37, average: 14.4, strike_rate: 91.2, fours: 28, sixes: 3, innings: 18, fifties: 0 }
  },
  { 
    external_id: '41232063', 
    name: 'Ansh!',
    batting: { total_runs: 340, high_score: 45, average: 20.0, strike_rate: 117.6, fours: 34, sixes: 9, innings: 17, fifties: 0 }
  },
  { 
    external_id: '27500289', 
    name: 'Aaroosh Pandey',
    batting: { total_runs: 247, high_score: 45, average: 15.4, strike_rate: 94.3, fours: 28, sixes: 3, innings: 16, fifties: 0 }
  },
  { 
    external_id: '24544263', 
    name: 'Anuj Negi',
    batting: { total_runs: 186, high_score: 44, average: 16.9, strike_rate: 102.8, fours: 21, sixes: 4, innings: 11, fifties: 0 }
  },
  { 
    external_id: '41646508', 
    name: 'Deepak Kothiyal',
    batting: { total_runs: 206, high_score: 45, average: 14.7, strike_rate: 98.6, fours: 22, sixes: 4, innings: 14, fifties: 0 }
  },
  { 
    external_id: '41746818', 
    name: 'Aarav',
    batting: { total_runs: 112, high_score: 26, average: 10.2, strike_rate: 88.6, fours: 12, sixes: 1, innings: 11, fifties: 0 }
  },
  { 
    external_id: '41644117', 
    name: 'Sagar Pathak',
    batting: { total_runs: 22, high_score: 10, average: 3.1, strike_rate: 62.9, fours: 2, sixes: 0, innings: 7, fifties: 0 }
  }
];

const applyCorrections = async () => {
  try {
    console.log('🔗 Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!\n');

    for (const c of corrections) {
      const updateData = {
        'batting.total_runs': c.batting.total_runs,
        'batting.high_score': c.batting.high_score,
        'batting.average': c.batting.average,
        'batting.strike_rate': c.batting.strike_rate,
        'batting.fours': c.batting.fours,
        'batting.sixes': c.batting.sixes,
        'batting.innings': c.batting.innings,
        'batting.fifties': c.batting.fifties,
      };

      const result = await Player.updateOne({ external_id: c.external_id }, { $set: updateData });
      if (result.matchedCount > 0) {
        console.log(`✅ ${c.name} — HS: ${c.batting.high_score}, 50s: ${c.batting.fifties}`);
      } else {
        console.log(`⚠️ ${c.name} (${c.external_id}) — NOT FOUND`);
      }
    }

    console.log('\n✅ All statistical corrections successfully applied.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

applyCorrections();
