import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');
  const players = await Player.find({ external_id: { $in: ['21556092', '38569177'] } });
  
  if (players.length === 0) console.log("Not found in DB yet!");
  for (const p of players) {
    console.log(p.name, "- Titles:", p.titles, "- Matches:", p.matches);
  }
  process.exit(0);
}
run();
