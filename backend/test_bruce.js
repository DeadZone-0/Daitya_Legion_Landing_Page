import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');
  const bruce = await Player.findOne({ name: /Bruce|Wayne/i });
  console.log("Bruce ID:", bruce?.external_id);
  console.log("Batting:", bruce?.batting);
  console.log("Bowling:", bruce?.bowling);
  console.log("Runs:", bruce?.runs);
  process.exit(0);
}
run();
