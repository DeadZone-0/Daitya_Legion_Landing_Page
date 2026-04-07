import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');
  await Player.updateOne({ external_id: "41997128" }, { $set: { "batting.average": 15.7 } });
  const bruce = await Player.findOne({ external_id: "41997128" });
  console.log("Fixed Bruce Batting Average to:", bruce.batting.average);
  process.exit(0);
}
run();
