import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/Player.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const checkStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const players = await Player.find({});
    console.log(`Found ${players.length} players:`);
    
    players.forEach(p => {
      console.log(`- ${p.name} (ID: ${p.external_id})`);
      console.log(`  Runs: ${p.runs}, Wickets: ${p.wickets}`);
      console.log(`  Batting: AVG ${p.batting?.average}, SR ${p.batting?.strike_rate}`);
      console.log(`  Bowling: ECON ${p.bowling?.economy}, WKTS ${p.bowling?.wickets}`);
      console.log(`  Recent Form Count: ${p.recent_form?.length || 0}`);
      console.log('-------------------');
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkStats();
