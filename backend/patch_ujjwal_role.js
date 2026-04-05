import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const playerSchema = new mongoose.Schema({ external_id: String, name: String, role: String }, { strict: false });
const Player = mongoose.model('Player', playerSchema);

await mongoose.connect(process.env.MONGODB_URI);

const result = await Player.findOneAndUpdate(
  { external_id: '16628521' },
  { $set: { role: 'Bowler' } },
  { new: true }
);

console.log(result ? `✅ Updated: ${result.name} → Role: ${result.role}` : '❌ Player not found');
await mongoose.disconnect();
