import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { scrapePlayers } from '../src/services/scraperService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    const targetPlayers = ['41232063', '32875462', '41997128', '43609842']; 
    console.log(`🚀 Starting Deep Sync for IDs: ${targetPlayers.join(', ')}`);

    await scrapePlayers({ 
        force: true, 
        targetPlayers 
    });

    console.log('\n✨ Deep Sync completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  }
}

run();
