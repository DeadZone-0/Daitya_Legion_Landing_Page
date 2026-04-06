import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Match from "../models/Match.js";
import Player from "../models/Player.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

const addMatch = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to DB");

    // 1. Find Sagar Pathak (or create if not exists)
    let sagar = await Player.findOne({ name: /Sagar Pathak/i });
    if (!sagar) {
        console.log("Sagar Pathak not found, creating baseline...");
        sagar = new Player({
            name: "Sagar Pathak",
            role: "All-Rounder",
            external_id: "manual-sagar-pathak",
            matches: 0,
            runs: 0,
            wickets: 0,
            is_manual_override: true,
            titles: ["Aspirant"]
        });
        await sagar.save();
    }

    console.log(`Found Player: ${sagar.name} (${sagar._id})`);

    // 2. Create the match
    const matchData = {
      date: "2024-04-05",
      opponent: "Bakery 11",
      ground: "Tactical Arena",
      city: "New Delhi",
      match_type: "T20",
      our_score: "185/6",
      opp_score: "142/10",
      our_overs: "20.0",
      opp_overs: "18.4",
      toss: "Won, elected to bat",
      result: "won",
      insights: "A dominant performance led by Sagar Pathak's all-round brilliance.",
      highlights: "Sagar Pathak's 52(30) and 3/15 turned the tide against Bakery 11.",
      cricheroes_url: "https://cricheroes.in/scorecard/match-details/bakery-11-vs-daitya-legion",
      player_performances: [
        {
          player_id: sagar._id,
          player_name: sagar.name,
          runs: 52,
          balls: 30,
          fours: 4,
          sixes: 3,
          how_out: "not out",
          wickets: 3,
          overs_bowled: "4.0",
          runs_conceded: 15,
          catches: 1,
          mvp_points: 9.5 // This should trigger MOM
        }
      ]
    };

    const newMatch = new Match(matchData);
    const savedMatch = await newMatch.save();
    console.log("Match saved:", savedMatch._id);

    // 3. Update Sagar's profile (logic taken from matchController)
    const perf = matchData.player_performances[0];
    
    sagar.match_history.unshift({
        match_id: savedMatch._id,
        date: matchData.date,
        opponent: matchData.opponent,
        ground: matchData.ground,
        city: matchData.city,
        match_type: matchData.match_type,
        result: "Won",
        won: true,
        my_score: matchData.our_score,
        opp_score: matchData.opp_score,
        my_overs: matchData.our_overs,
        opp_overs: matchData.opp_overs,
        toss: matchData.toss,
        cricheroes_url: matchData.cricheroes_url,
        performance: {
          batting: {
            runs: perf.runs,
            balls: perf.balls,
            fours: perf.fours,
            sixes: perf.sixes,
            strike_rate: 173.33,
            how_out: perf.how_out,
          },
          bowling: {
            wickets: perf.wickets,
            overs: perf.overs_bowled,
            runs: perf.runs_conceded,
            economy: 3.75,
          },
        },
    });

    sagar.matches += 1;
    sagar.runs += perf.runs;
    sagar.wickets += perf.wickets;
    sagar.catches += perf.catches;
    sagar.man_of_the_match += 1; // Since MVP >= 8 

    sagar.batting.total_runs += perf.runs;
    if (perf.runs > sagar.batting.high_score) sagar.batting.high_score = perf.runs;
    sagar.batting.innings += 1;
    sagar.batting.fifties += 1;

    console.log("Updating Sagar's stats...");
    await sagar.save();
    console.log("Stats updated successfully!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addMatch();
