import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tournament from './models/Tournament.js';
import Match from './models/Match.js';
import Player from './models/Player.js';

dotenv.config();

const RPL_URL = "https://cricheroes.com/scorecard/23878814/rishikesh-premier-league-/dynamic-devils-vs-daitya-legion/summary";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // 1. Find or Create the RPL Match
    let rplMatch = await Match.findOne({ cricheroes_url: RPL_URL });
    
    const players = await Player.find({});
    const findId = (name) => {
      const p = players.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
      return p ? p._id : null;
    };

    const matchData = {
      date: "12 Apr 2026",
      opponent: "Dynamic Devils",
      ground: "IDPL",
      city: "Rishikesh",
      match_type: "T20",
      our_score: "164/3",
      opp_score: "160/10",
      our_overs: "18.4",
      opp_overs: "19.2",
      toss: "Daitya Legion won, elected to field",
      result: "won",
      insights: "Strategic victory in the 1st match of the tournament. The bowling unit struck early and the chase was clinical.",
      highlights: "Excellent bowling by Ashraya (3 wickets) and Sagar (2 wickets). Sakshm's unbeaten 44 guided us home.",
      cricheroes_url: RPL_URL,
      player_performances: [
        { player_name: "Sakshm", runs: 44, balls: 28, fours: 6, sixes: 1, strike_rate: 157.1, how_out: "Not Out", wickets: 1, overs_bowled: "2", runs_conceded: 23, player_id: findId("Sakshm") },
        { player_name: "Maithani Ashraya", runs: 37, balls: 42, fours: 5, sixes: 0, strike_rate: 88.1, how_out: "Caught", wickets: 3, overs_bowled: "3", runs_conceded: 28, player_id: findId("Ashraya") },
        { player_name: "Aaroosh Pandey", runs: 21, balls: 27, fours: 2, sixes: 0, strike_rate: 77.8, how_out: "Out", player_id: findId("Aaroosh") },
        { player_name: "Yug Rawat", runs: 22, balls: 17, fours: 2, sixes: 0, strike_rate: 129.4, how_out: "Not Out", player_id: findId("Yug") },
        { player_name: "Ansh!", runs: 0, balls: 1, fours: 0, sixes: 0, strike_rate: 0, how_out: "Caught", player_id: findId("Ansh") },
        { player_name: "Rohan Rayal", wickets: 2, overs_bowled: "3", runs_conceded: 24, player_id: findId("Rohan") },
        { player_name: "Sagar Pathak", wickets: 2, overs_bowled: "2.2", runs_conceded: 17, player_id: findId("Sagar") },
        { player_name: "Bruce Wayne", wickets: 1, overs_bowled: "4", runs_conceded: 23, player_id: findId("Bruce") },
        { player_name: "Deepak Kothiyal", wickets: 1, overs_bowled: "1", runs_conceded: 11, player_id: findId("Deepak") },
        { player_name: "Abhishek", player_id: findId("Abhishek") },
        { player_name: "Harendra", player_id: findId("Harendra") }
      ]
    };

    if (rplMatch) {
      await Match.findByIdAndUpdate(rplMatch._id, matchData);
      console.log('🔄 Updated existing RPL Match 1');
    } else {
      rplMatch = await Match.create(matchData);
      console.log('✅ Created new RPL Match 1');
    }

    // 2. Create/Update Tournaments
    const tournaments = [
      {
        name: "Rishikesh Premier League",
        type: "T20",
        year: 2026,
        status: "ongoing",
        matches_played: 1,
        wins: 1,
        losses: 0,
        result: "Ongoing",
        cricheroes_url: "https://cricheroes.com/tournament/rishikesh-premier-league-",
        matches: [rplMatch._id]
      },
      {
        name: "Daitya Legion VS Bakery 11s BLITZ Trophy Series",
        type: "T20",
        year: 2025,
        status: "completed",
        matches_played: 5,
        wins: 3,
        losses: 2,
        result: "Winners",
        cricheroes_url: ""
      },
      {
        name: "Daitya Legion VS Bakery 11s — The Guard Of Honour Test Series",
        type: "Test",
        year: 2025,
        status: "completed",
        matches_played: 2,
        wins: 1,
        losses: 1,
        result: "Series Drawn",
        cricheroes_url: ""
      }
    ];

    for (const t of tournaments) {
      await Tournament.findOneAndUpdate({ name: t.name }, t, { upsert: true, new: true });
      console.log(`🏆 Seeded Tournament: ${t.name}`);
    }

    // 3. Update Player match_history
    const updatePlayerHistory = async (playerNameSearch, performanceData) => {
      const p = players.find(p => p.name.toLowerCase().includes(playerNameSearch.toLowerCase()));
      if (!p) return;

      const historyItem = {
        match_id: rplMatch._id.toString(),
        date: matchData.date,
        opponent: matchData.opponent,
        ground: matchData.ground,
        city: matchData.city,
        match_type: matchData.match_type,
        result: "Daitya Legion won by 7 wickets",
        won: true,
        my_score: matchData.our_score,
        opp_score: matchData.opp_score,
        my_overs: matchData.our_overs,
        opp_overs: matchData.opp_overs,
        toss: matchData.toss,
        cricheroes_url: matchData.cricheroes_url,
        performance: {
          batting: {
            runs: performanceData.runs || 0,
            balls: performanceData.balls || 0,
            fours: performanceData.fours || 0,
            sixes: performanceData.sixes || 0,
            strike_rate: performanceData.strike_rate || 0,
            how_out: performanceData.how_out || "DNB"
          },
          bowling: {
            wickets: performanceData.wickets || 0,
            overs: parseFloat(performanceData.overs_bowled) || 0,
            runs: performanceData.runs_conceded || 0,
            economy: performanceData.overs_bowled ? (performanceData.runs_conceded / (parseFloat(performanceData.overs_bowled) || 1)) : 0
          }
        }
      };

      // Check if match already in history
      const exists = p.match_history.some(m => m.match_id === rplMatch._id.toString());
      if (!exists) {
        await Player.findByIdAndUpdate(p._id, { $push: { match_history: { $each: [historyItem], $position: 0 } } });
      } else {
        await Player.updateOne(
          { _id: p._id, "match_history.match_id": rplMatch._id.toString() },
          { $set: { "match_history.$": historyItem } }
        );
      }
    };

    const performances = matchData.player_performances;
    for (const perf of performances) {
      await updatePlayerHistory(perf.player_name, perf);
      console.log(`👤 Updated history for ${perf.player_name}`);
    }

    console.log('✨ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
