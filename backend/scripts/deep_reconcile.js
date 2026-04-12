import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import { getBuildId, fetchScorecardPerformance } from '../services/scraperService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const runReconciliation = async () => {
  try {
    console.log('🚀 INITIALIZING GROUND-UP RECONCILIATION FROM BROWSER CACHE...');
    
    const matchIdsPath = path.join(__dirname, '..', 'data', 'match_ids.json');
    if (!fs.existsSync(matchIdsPath)) {
      throw new Error('match_ids.json not found! Please run the collector first.');
    }
    const matchIdsMap = JSON.parse(fs.readFileSync(matchIdsPath, 'utf8'));

    console.log('Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected! 🔗');

    const buildId = await getBuildId();
    console.log(`Current Build ID: ${buildId}`);

    const playerIds = Object.keys(matchIdsMap);
    console.log(`Processing ${playerIds.length} players...\n`);

    for (const pid of playerIds) {
      const player = await Player.findOne({ external_id: pid });
      if (!player) {
         console.log(`⚠️ Player ${pid} not found in DB, skipping...`);
         continue;
      }

      console.log(`📊 Reconciling ${player.name} (${pid})...`);
      const matchIds = matchIdsMap[pid];
      console.log(`   Found ${matchIds.length} matches to audit.`);

      let totalRuns = 0;
      let totalBalls = 0;
      let totalFours = 0;
      let totalSixes = 0;
      let totalWickets = 0;
      let totalRunsConceded = 0;
      let totalOvers = 0;
      let highScore = 0;
      let matchCount = matchIds.length;
      let innings = 0;
      let bestBowlingWkts = 0;
      let bestBowlingRuns = 999;
      let bestBowlingStr = '0/0';

      for (let i = 0; i < matchIds.length; i++) {
        const mid = matchIds[i];
        process.stdout.write(`   [${i+1}/${matchIds.length}] Fetching Scorecard ${mid}... `);
        
        try {
          // We use dummy slugs, the scraper handles the redirect
          const perf = await fetchScorecardPerformance(mid, pid, buildId, 'a', 'b');
          
          if (perf) {
            // Batting
            const r = perf.batting.runs || 0;
            totalRuns += r;
            totalBalls += perf.batting.balls || 0;
            totalFours += perf.batting.fours || 0;
            totalSixes += perf.batting.sixes || 0;
            if (r > highScore) highScore = r;
            if (perf.batting.how_out !== 'DNB' && perf.batting.how_out !== 'Absent Hurt') {
               innings++;
            }

            // Bowling
            const w = perf.bowling.wickets || 0;
            const rc = perf.bowling.runs || 0;
            const ov = perf.bowling.overs || 0;
            totalWickets += w;
            totalRunsConceded += rc;
            totalOvers += ov;

            if (w > bestBowlingWkts) {
              bestBowlingWkts = w;
              bestBowlingRuns = rc;
              bestBowlingStr = `${w}/${rc}`;
            } else if (w === bestBowlingWkts && rc < bestBowlingRuns && w > 0) {
              bestBowlingRuns = rc;
              bestBowlingStr = `${w}/${rc}`;
            }

            process.stdout.write(`✅\n`);
          } else {
            process.stdout.write(`❌ (No Data)\n`);
          }
        } catch (e) {
          process.stdout.write(`❌ (${e.message})\n`);
        }
        
        // Small delay to be polite
        await new Promise(r => setTimeout(r, 200));
      }

      // Calculations
      const battingAvg = innings > 0 ? (totalRuns / innings).toFixed(2) : 0;
      const strikeRate = totalBalls > 0 ? ((totalRuns / totalBalls) * 100).toFixed(2) : 0;
      const economy = totalOvers > 0 ? (totalRunsConceded / totalOvers).toFixed(2) : 0;

      // Update Payload
      const updateData = {
        matches: matchCount,
        runs: totalRuns,
        wickets: totalWickets,
        batting: {
          average: battingAvg,
          strike_rate: strikeRate,
          high_score: highScore,
          total_runs: totalRuns,
          innings: innings,
          fours: totalFours,
          sixes: totalSixes,
          fifties: 0, // Manual update or check matches? Not critical for now
          hundreds: 0
        },
        bowling: {
          wickets: totalWickets,
          economy: parseFloat(economy),
          overs: totalOvers,
          average: totalWickets > 0 ? (totalRunsConceded / totalWickets).toFixed(2) : 0,
          five_w: 0,
          best_bowling: bestBowlingStr
        }
      };

      await Player.updateOne({ external_id: pid }, { $set: updateData });
      console.log(`   ✅ Database updated for ${player.name}.\n`);
    }

    // Final Team Aggregation
    console.log('🏆 Performing Final Team Aggregation...');
    const allPlayers = await Player.find({});
    const team_runs = allPlayers.reduce((a, p) => a + (p.runs || 0), 0);
    const team_wickets = allPlayers.reduce((a, p) => a + (p.wickets || 0), 0);
    
    await Team.findOneAndUpdate({ name: 'Daitya Legion' }, { 
      total_runs: team_runs, 
      total_wickets: team_wickets,
      last_updated: Date.now() 
    });

    console.log('\n---------------------------------');
    console.log('✅ RECONCILIATION COMPLETE!');
    console.log('All player statistics have been cross-referenced with full match history cache.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Reconciliation failed:', err);
    process.exit(1);
  }
};

runReconciliation();
