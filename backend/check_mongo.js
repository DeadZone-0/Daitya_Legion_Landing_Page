import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://daityalegion:vrtfL9oNszU1p6J8@cluster0.dbw5i.mongodb.net/daityalegion');
  const sagar = await Player.findOne({ name: /Sagar/i });
  console.log("Sagar ID:", sagar.external_id);
  
  // Also calculate based on match_history
  const players = await Player.find({});
  for(const p of players.slice(0, 5)) {
    let runs = 0, dism = 0, no = 0, inns=0;
    p.match_history.forEach(m => {
      const b = m.performance?.batting;
      if (b && b.how_out && b.how_out !== 'DNB') {
         inns++;
         runs += b.runs || 0;
         if (b.how_out.toLowerCase() === 'not out' || b.how_out.toLowerCase() === 'retired hurt') {
           no++;
         } else {
           dism++;
         }
      }
    });
    console.log(`${p.name} -> History: ${runs} runs, ${inns} inns, ${no} NOs, Avg: ${(runs/dism).toFixed(2)} | DB Avg: ${p.batting?.average}`);
  }
  process.exit(0);
}
run();
