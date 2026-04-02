import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { scrapePlayers } from '../services/scraperService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const run = async () => {
  try {
    console.log('Connecting to Database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected! Unleashing Deep Scraper...');
    
    await scrapePlayers();
    
    console.log('---------------------------------');
    console.log('SUCCESS! Daitya Legion data is officially updated!');
    console.log('You can now check the frontend dashboard!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to run scraper:', err);
    process.exit(1);
  }
};

run();
