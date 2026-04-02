import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very basic schema definition to wipe players
const playerSchema = new mongoose.Schema({
  external_id: String,
  name: String,
  role: String,
  matches: Number,
  runs: Number,
  wickets: Number,
  image_url: String,
  is_manual_override: Boolean,
  batting: Object,
  bowling: Object,
  general: Object
}, { timestamps: true });

const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);

async function resetDB() {
  try {
    console.log('Connecting to DB locally to reset default players...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Delete only non-manual overrides
    const result = await Player.deleteMany({ is_manual_override: false });
    console.log(`Deleted ${result.deletedCount} old placeholder players without deep stats.`);

    // Load new placeholders
    const rawData = fs.readFileSync(path.join(__dirname, 'data', 'players.json'));
    const playersData = JSON.parse(rawData);

    for (const data of playersData) {
      if (!data.is_manual_override) {
         await Player.findOneAndUpdate({ external_id: data.external_id }, data, { upsert: true, new: true });
         console.log(`Seeded detailed stats for ${data.name}`);
      }
    }
    
    console.log('Database synced successfully! You will now see Deep Stats!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

resetDB();
