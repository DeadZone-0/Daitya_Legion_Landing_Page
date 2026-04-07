import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');

  // Update Paritosh
  await Player.updateOne(
    { external_id: "21556092" },
    { $set: { titles: ["Classicist", "Aspirant"] } }
  );

  // Update Abhideep
  await Player.updateOne(
    { external_id: "38569177" },
    { $set: { titles: ["Steady Batter"] } }
  );

  console.log("Titles updated successfully!");
  process.exit(0);
}
run();
