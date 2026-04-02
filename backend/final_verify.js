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
  
  const p = await Player.findOne({ name: /sagar pathak/i });
  if (p) {
    console.log(`Player: ${p.name}`);
    console.log(`Bowling Stats: Overs ${p.bowling.overs}, Wickets ${p.bowling.wickets}`);
    console.log(`Match History Sample (First Match Performance):`);
    console.log(JSON.stringify(p.match_history[0].performance, null, 2));
  } else {
    console.log('Player not found');
  }
  process.exit(0);
})();
