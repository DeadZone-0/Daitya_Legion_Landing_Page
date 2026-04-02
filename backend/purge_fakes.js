import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/Player.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Delete fake Bruce Wayne (ext_id: "1" from placeholder data)
  const r1 = await Player.deleteMany({ external_id: '1' });
  console.log(`Deleted fake Bruce Wayne (ext_id=1): ${r1.deletedCount}`);

  // Delete Vikram Singh if still there
  const r2 = await Player.deleteMany({ name: 'Vikram Singh' });
  console.log(`Deleted Vikram Singh: ${r2.deletedCount}`);

  // Show remaining players
  const players = await Player.find({}, 'external_id name runs wickets').sort({ runs: -1 });
  console.log(`\nRemaining ${players.length} players:`);
  players.forEach(p => console.log(`  ${p.name} (${p.external_id}) - ${p.runs}R ${p.wickets}W`));

  process.exit(0);
})();
