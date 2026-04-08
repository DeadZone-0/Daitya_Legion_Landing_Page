import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');

  // Titles updated successfully!
  console.log("Titles updated successfully!");
  process.exit(0);
}
run();
