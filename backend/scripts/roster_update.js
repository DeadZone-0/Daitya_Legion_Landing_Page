import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Player from '../models/Player.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const runRosterUpdate = async () => {
  try {
    console.log('🔗 Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    const playersToRemove = [
      'Ujjwal Sati', 
      'Vaibhav', 
      'Piyush ', 
      'Armaan Rawat', // Sometimes spelled Armaan or Arman
      'Armaan',
      'Arman Rawat',
      'Gaurav Kothiyal', 
      'Himanshu Bisht',
      'Saksham' // Old saksham 
    ];

    console.log('\n🗑️ Removing players...');
    for (const name of playersToRemove) {
      // Find using a regex for flexibility
      const result = await Player.deleteMany({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
      if (result.deletedCount > 0) {
        console.log(`   - Deleted ${result.deletedCount} record(s) for ${name}`);
      }
    }

    console.log('\n🎖️ Granting Titles...');
    const aroosh = await Player.findOne({ name: { $regex: /Aaroosh.+Pandey/i } });
    if (aroosh) {
      if (!aroosh.titles) aroosh.titles = [];
      if (!aroosh.titles.includes('Accumulator')) {
        aroosh.titles.push('Accumulator');
        aroosh.is_manual_override = true; // Protect title
        await aroosh.save();
        console.log(`   - Granted 'Accumulator' to ${aroosh.name}`);
      } else {
        console.log(`   - ${aroosh.name} already has 'Accumulator'`);
      }
    } else {
      console.log(`   - Could not find Aroosh Pandey in DB.`);
    }

    console.log('\n---------------------------------');
    console.log('✅ Base DB Updates Complete.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Update failed:', err);
    process.exit(1);
  }
};

runRosterUpdate();
