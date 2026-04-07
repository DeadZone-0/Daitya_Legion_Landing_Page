import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');
  const players = await Player.find({});
  for (const p of players) {
    if (p.titles && p.titles.length > 0) {
      console.log(p.name, "- Titles:", p.titles.join(", "));
    }
  }
  process.exit(0);
}
run();
