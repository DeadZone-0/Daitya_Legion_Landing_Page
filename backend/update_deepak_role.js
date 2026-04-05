import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/Player.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const p = await Player.findOne({ name: /Deepak Kothiyal/i });
  if (p) {
    p.role = "All-Rounder";
    p.is_manual_override = true;
    await p.save();
    console.log("Updated Deepak's role to All-Rounder");
  } else {
    console.log("Deepak not found");
  }
  process.exit(0);
}
run();
