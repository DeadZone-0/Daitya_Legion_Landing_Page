import mongoose from 'mongoose';
import { scrapePlayers } from './services/scraperService.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');
  await scrapePlayers();
  process.exit(0);
}
run();
