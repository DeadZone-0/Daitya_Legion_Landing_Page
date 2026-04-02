import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/Player.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const players = await Player.find({ name: { $in: [/sagar/i, /pranjal/i, /bruce/i] } });
  
  console.log('--- Player Stats Verification ---');
  players.forEach(p => {
    console.log(`\nPlayer: ${p.name}`);
    console.log(`Runs: ${p.runs}, Wickets: ${p.wickets}`);
    console.log(`Bowling Ob:`, JSON.stringify(p.bowling, null, 2));
    console.log(`Matches Count: ${p.matches}`);
    console.log(`Match History Count: ${p.match_history?.length}`);
  });

  process.exit(0);
})();
