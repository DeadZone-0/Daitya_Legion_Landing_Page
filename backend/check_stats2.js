import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://daityalegion:vrtfL9oNszU1p6J8@cluster0.dbw5i.mongodb.net/daityalegion?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
  const players = await Player.find({});
  for (const p of players) {
    let totalRuns = 0;
    let dismissals = 0;
    for (const m of p.match_history) {
      const bat = m.performance?.batting;
      if (bat && bat.how_out && bat.how_out !== 'DNB') {
         totalRuns += bat.runs || 0;
         if (bat.how_out.toLowerCase() !== 'not out' && bat.how_out.toLowerCase() !== 'retired hurt') {
           dismissals++;
         }
      }
    }
    const computed = dismissals > 0 ? (totalRuns / dismissals).toFixed(2) : (totalRuns > 0 ? totalRuns.toFixed(2) : 0);
    console.log(`${p.name} - Scraped Avg: ${p.batting?.average} | Computed Avg: ${computed} | Runs/Inns: ${totalRuns}/${dismissals}`);
  }
  process.exit(0);
}
run();
