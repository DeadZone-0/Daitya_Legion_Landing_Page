import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/Player.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Purge Vikram Singh and potential placeholder ID: 3
    const result1 = await Player.deleteMany({ name: 'Vikram Singh' });
    console.log(`- Deleted Vikram Singh: ${result1.deletedCount} records`);
    
    const result2 = await Player.deleteMany({ external_id: '3' });
    console.log(`- Deleted ID 3: ${result2.deletedCount} records`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
