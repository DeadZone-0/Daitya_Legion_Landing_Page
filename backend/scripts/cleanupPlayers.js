import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Player from '../models/Player.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const BLACKLIST_NAMES = ['Aditya Jethuri', 'Aryan Singh', 'Pranjal', 'Pranjal Rawat'];

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const result = await Player.deleteMany({
      name: { $in: BLACKLIST_NAMES }
    });

    console.log(`Successfully deleted ${result.deletedCount} players.`);
    
    // Also check for partial matches just in case
    const remaining = await Player.find({ 
      name: { $regex: new RegExp(BLACKLIST_NAMES.join('|'), 'i') } 
    });
    
    if (remaining.length > 0) {
      console.log(`Warning: Found ${remaining.length} potential partial matches that were not deleted:`);
      remaining.forEach(p => console.log(` - ${p.name}`));
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

cleanup();
