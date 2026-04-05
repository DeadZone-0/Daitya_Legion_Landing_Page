import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from '../models/Player.js';
import { scrapePlayers } from '../services/scraperService.js';

dotenv.config({ path: '../.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');
  
  const ansh = await Player.findOne({ name: /Ansh/i });
  if (ansh) {
    console.log(`Found Ansh: ${ansh.name}. Resetting manual override.`);
    ansh.is_manual_override = false;
    await ansh.save();
  }

  console.log('Running scraper...');
  await scrapePlayers();
  process.exit(0);
}
run();
