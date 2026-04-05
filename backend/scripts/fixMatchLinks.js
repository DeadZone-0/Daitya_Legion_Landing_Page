import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Player from '../models/Player.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const players = await Player.find({});
    console.log(`Found ${players.length} players to check.`);

    let totalUpdated = 0;

    for (const player of players) {
      if (!player.match_history || player.match_history.length === 0) continue;

      let changed = false;
      player.match_history = player.match_history.map(match => {
        const url = match.cricheroes_url;
        // Check if URL is in the old format (ends with the ID and no detail slug)
        // Example old: https://cricheroes.com/scorecard/23502320
        // We match URLs that follow the /scorecard/{id} pattern but don't have the extra segments
        const matchIdMatch = url.match(/\/scorecard\/(\d+)$/);
        
        if (matchIdMatch) {
          const matchId = matchIdMatch[1];
          match.cricheroes_url = `https://cricheroes.com/scorecard/${matchId}/match-details/match-details/scorecard`;
          changed = true;
          totalUpdated++;
          return match;
        }
        return match;
      });

      if (changed) {
        await player.save();
        console.log(`Updated match links for player: ${player.name}`);
      }
    }

    console.log(`Migration complete. Total match links updated: ${totalUpdated}`);

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

migrate();
