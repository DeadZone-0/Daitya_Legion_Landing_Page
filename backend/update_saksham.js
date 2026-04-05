import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const PlayerSchema = new mongoose.Schema({
  name: String,
  external_id: String,
  image_url: String,
  is_manual_override: { type: Boolean, default: false }
});

const Player = mongoose.model('Player', PlayerSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Sakshm or Saksham
    let p = await Player.findOne({ name: { $regex: /Sakshm|Saksham/i } });
    
    if (p) {
      console.log(`Found player: ${p.name}`);
      p.name = "Saksham";
      p.image_url = "/players/saksham.jpg";
      p.is_manual_override = true;
      await p.save();
      console.log(`Updated player to Saksham with local image.`);
    } else {
      // Create new if not exists
      console.log('Player not found, creating new...');
      const newP = new Player({
        name: "Saksham",
        external_id: "43609842", // Sakshm's ID from CricHeroes match 23692063
        image_url: "/players/saksham.jpg",
        is_manual_override: true
      });
      await newP.save();
      console.log('Created new player: Saksham');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
