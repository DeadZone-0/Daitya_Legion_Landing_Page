import mongoose from 'mongoose';
import { scrapePlayers } from './services/scraperService.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');
  
  // We'll run full scrape, it will pick them up
  // Actually a full scrape takes a minute, let's just run it in the background
  console.log("Starting scrape in background...");
}
run();
