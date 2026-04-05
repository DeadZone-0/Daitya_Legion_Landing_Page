import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Match from '../models/Match.js';
import Player from '../models/Player.js';

dotenv.config();

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DAITYA_TEAM_ID = '11183415';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function getBuildId() {
  const html = await fetchText('https://cricheroes.com/');
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  if (!match) throw new Error('Could not find buildId');
  return match[1];
}

async function fetchScorecard(matchId, buildId, teamASlug, teamBSlug) {
  try {
    const slug = `${teamASlug}-vs-${teamBSlug}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const url = `https://cricheroes.com/_next/data/${buildId}/scorecard/${matchId}/${slug}/scorecard/scorecard.json?matchId=${matchId}&tournamentName=${slug}&teamNames=scorecard&tab=scorecard`;
    let json = await fetchJSON(url);
    if (json?.pageProps?.__N_REDIRECT) {
      let redir = json.pageProps.__N_REDIRECT;
      const cleanRedir = redir.replace('/scorecard/', '').replace('/scorecard/live', '').replace('/summary', '');
      const parts = cleanRedir.split('/');
      parts.shift(); // remove matchId
      const newSlug = parts.join('/');
      const retryUrl = `https://cricheroes.com/_next/data/${buildId}/scorecard/${matchId}/${newSlug}/scorecard/scorecard.json`;
      json = await fetchJSON(retryUrl);
    }
    return json?.pageProps?.scorecard || [];
  } catch (e) {
    return [];
  }
}

export async function syncTeamMatches() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const buildId = await getBuildId();
    console.log(`Build ID: ${buildId}`);

    // Fetch team matches
    const allMatches = [];
    let page = 1;
    let url = `https://cricheroes.com/_next/data/${buildId}/team-profile/11183415/daitya-legion/matches.json`;

    console.log(`Fetching match list...`);
    const json = await fetchJSON(url);
    const matches = json?.pageProps?.matches?.data || [];
    allMatches.push(...matches);

    console.log(`Found ${allMatches.length} total matches. Processing resulted/drawn matches...`);

    const playersDb = await Player.find({});
    const playerMap = {};
    playersDb.forEach(p => { playerMap[p.external_id] = { id: p._id, name: p.name }; });

    let count = 0;
    for (const m of allMatches) {
      if (m.match_result === 'Resulted' || m.match_result === 'Drawn') {
        const isDaitya_A = String(m.team_a_id) === DAITYA_TEAM_ID;
        const opponent = isDaitya_A ? m.team_b : m.team_a;
        const cricheroes_url = `https://cricheroes.com/scorecard/${m.match_id}/match-details/match-details/scorecard`;

        // Check if already in DB
        const existing = await Match.findOne({ cricheroes_url });
        if (existing) {
          console.log(`Match ${m.match_id} vs ${opponent} already exists. Skipping...`);
          continue;
        }

        console.log(`Scraping scorecard for Match ID: ${m.match_id} (vs ${opponent})`);
        const scorecard = await fetchScorecard(m.match_id, buildId, m.team_a, m.team_b);
        await new Promise(r => setTimeout(r, 800)); // avoid rate limits!

        const player_performances = [];
        
        for (const inning of scorecard) {
          const batters = inning.batting || [];
          const bowlers = inning.bowling || [];
          const fielders = inning.fall_of_wickets || []; // CricHeroes usually maps fielders somewhere else, but hard to extract catchers simply. We will rely on batters/bowlers.
          
          Object.keys(playerMap).forEach(extId => {
            const dbP = playerMap[extId];
            
            const b = batters.find(x => String(x.player_id) === extId);
            const w = bowlers.find(x => String(x.player_id) === extId);
            
            if (b || w) {
              const runs = b ? parseInt(b.runs) || 0 : 0;
              const balls = b ? parseInt(b.balls) || 0 : 0;
              const fours = b ? parseInt(b['4s']) || 0 : 0;
              const sixes = b ? parseInt(b['6s']) || 0 : 0;
              const strike_rate = b ? parseFloat(b.SR) || 0 : 0;
              const how_out = b ? b.how_to_out : 'DNB';
              
              const wickets = w ? parseInt(w.wickets) || 0 : 0;
              const overs_bowled = w ? w.overs || '0' : '0';
              const runs_conceded = w ? parseInt(w.runs) || 0 : 0;
              const economy = w ? parseFloat(w.economy_rate) || 0 : 0;

              // Calculate basic MVP
              let mvp = (runs * 1) + (fours * 0.5) + (sixes * 1) + (wickets * 10) + (wickets >= 3 ? 5 : 0);
              const totalMvpScaled = Math.min((mvp / 50) * 10, 10).toFixed(2);

              player_performances.push({
                player_id: dbP.id,
                player_name: dbP.name,
                runs, balls, fours, sixes, strike_rate, how_out,
                wickets, overs_bowled, runs_conceded, economy,
                catches: 0, run_outs: 0,
                mvp_points: parseFloat(totalMvpScaled)
              });
            }
          });
        }

        // De-duplicate performances (since we iterate innings, a player might appear twice. Wait, T20s only have 1 batting/bowling inn per player)
        // Let's merge if duplicate
        const mergedPerformances = [];
        const perfMap = {};
        player_performances.forEach(p => {
          if (!perfMap[p.player_id]) {
            perfMap[p.player_id] = p;
          } else {
            // merge
            const ex = perfMap[p.player_id];
            if (p.runs > 0 || p.how_out !== 'DNB') {
              ex.runs = p.runs;
              ex.balls = p.balls;
              ex.fours = p.fours;
              ex.sixes = p.sixes;
              ex.how_out = p.how_out;
            }
            if (p.wickets > 0 || p.overs_bowled !== '0') {
              ex.wickets = p.wickets;
              ex.overs_bowled = p.overs_bowled;
              ex.runs_conceded = p.runs_conceded;
              ex.economy = p.economy;
            }
          }
        });

        const myInnings = isDaitya_A ? m.team_a_innings : m.team_b_innings;
        const oppInnings = isDaitya_A ? m.team_b_innings : m.team_a_innings;
        const won = String(m.winning_team_id) === DAITYA_TEAM_ID;
        const resultRaw = m.match_summary?.summary || m.win_by || '';
        let resultEnum = won ? 'won' : (resultRaw.toLowerCase().includes('drawn') || resultRaw.toLowerCase().includes('abandon') ? 'no_result' : 'lost');

        const newMatch = new Match({
          date: new Date(m.match_start_time).toISOString().split('T')[0],
          opponent: opponent,
          ground: m.ground_name || '',
          city: m.city_name || '',
          match_type: m.match_type || 'T20',
          our_score: (isDaitya_A ? m.team_a_summary : m.team_b_summary) || '',
          opp_score: (isDaitya_A ? m.team_b_summary : m.team_a_summary) || '',
          our_overs: myInnings?.[0]?.overs_played || '',
          opp_overs: oppInnings?.[0]?.overs_played || '',
          toss: m.toss_details || '',
          result: resultEnum,
          cricheroes_url: cricheroes_url,
          player_performances: Object.values(perfMap)
        });

        await newMatch.save();
        count++;
        console.log(`   └─ Saved successfully. ID: ${newMatch._id}`);
      }
    }
    
    console.log(`\n✅ Completed! Scraped and inserted ${count} historical matches!`);
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
}

syncTeamMatches();
