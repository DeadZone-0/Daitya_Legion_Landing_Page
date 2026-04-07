import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://daityalegion:vrtfL9oNszU1p6J8@cluster0.dbw5i.mongodb.net/daityalegion?retryWrites=true&w=majority', { family: 4 });
  const bruce = await Player.findOne({ name: /Bruce|Wayne/i });
  if (bruce) {
     console.log("Found:", bruce.name, "ID:", bruce.external_id, "Current Average:", bruce.batting?.average, "Matches History len:", bruce.match_history.length);
  } else {
     const all = await Player.find({}, 'name external_id');
     console.log("Not found bruce. Players:", all.map(p => p.name).join(', '));
  }
  process.exit(0);
}
run();
