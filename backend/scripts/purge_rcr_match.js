import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Player from "../models/Player.js";
import Match from "../models/Match.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

const purgeMatch = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to DB");

    const targetMatchId = "69d23f8b39e37bb2ecdbbe1d";
    const targetPlayerName = "Sagar Pathak";

    // 1. Find Sagar Pathak
    const sagar = await Player.findOne({ name: /Sagar Pathak/i });
    if (!sagar) {
      console.error("Sagar Pathak not found");
      process.exit(1);
    }

    console.log(`Found Player: ${sagar.name} (${sagar._id})`);

    // 2. Find and remove the match entry from history
    const matchIndex = sagar.match_history.findIndex(m => m.match_id.toString() === targetMatchId);
    if (matchIndex === -1) {
      console.error("Match record not found in Sagar's history");
    } else {
      const matchPerf = sagar.match_history[matchIndex].performance;
      console.log("Found match performance:", JSON.stringify(matchPerf));

      // Revert Stats
      sagar.matches = Math.max(0, sagar.matches - 1);
      sagar.runs = Math.max(0, sagar.runs - (matchPerf.batting?.runs || 0));
      sagar.wickets = Math.max(0, sagar.wickets - (matchPerf.bowling?.wickets || 0));
      
      // Update aggregate batting
      sagar.batting.total_runs = Math.max(0, sagar.batting.total_runs - (matchPerf.batting?.runs || 0));
      if (matchPerf.batting?.how_out && !matchPerf.batting.how_out.toLowerCase().includes('dnb')) {
        sagar.batting.innings = Math.max(0, sagar.batting.innings - 1);
      }
      
      // Update aggregate bowling
      const prevOvers = parseFloat(sagar.bowling.overs || 0);
      const matchOvers = parseFloat(matchPerf.bowling?.overs || 0);
      sagar.bowling.overs = parseFloat(Math.max(0, prevOvers - matchOvers).toFixed(1));

      // Remove from history
      sagar.match_history.splice(matchIndex, 1);

      // Recalculate Averages
      const dismissals = sagar.match_history.filter(
        m => m.performance?.batting?.how_out &&
          !m.performance.batting.how_out.toLowerCase().includes('not out') &&
          m.performance.batting.how_out.toLowerCase() !== 'dnb'
      ).length;
      sagar.batting.average = dismissals > 0 ? parseFloat((sagar.batting.total_runs / dismissals).toFixed(2)) : sagar.batting.total_runs;

      const totalRunsConceded = sagar.match_history.reduce((sum, m) => sum + (m.performance?.bowling?.runs || 0), 0);
      const totalOvers = sagar.match_history.reduce((sum, m) => sum + parseFloat(m.performance?.bowling?.overs || 0), 0);
      sagar.bowling.economy = totalOvers > 0 ? parseFloat((totalRunsConceded / totalOvers).toFixed(2)) : 0;

      await sagar.save();
      console.log("Sagar's profile updated successfully.");
    }

    // 3. Delete the match document
    const deleteResult = await Match.deleteOne({ _id: targetMatchId });
    if (deleteResult.deletedCount > 0) {
      console.log("Match document deleted from Matches collection.");
    } else {
      console.log("Match document not found in Matches collection (already deleted?)");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

purgeMatch();
