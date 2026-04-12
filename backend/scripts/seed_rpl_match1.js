/**
 * seed_rpl_match1.js
 * Seeds the Rishikesh Premier League Match 1 data into MongoDB.
 * Daitya Legion vs Dynamic Devils — 12 Apr 2026 — Won by 7 wickets
 *
 * Run: node backend/scripts/seed_rpl_match1.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Player from '../models/Player.js';
import Tournament from '../models/Tournament.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI missing'); process.exit(1); }

// ─── MATCH CONSTANTS ──────────────────────────────────────────────────────────
const MATCH_DATE        = '12 Apr 2026';
const OPPONENT          = 'Dynamic Devils';
const GROUND            = 'IDPL Ground';
const CITY              = 'Rishikesh';
const MATCH_TYPE        = 'T20';
const OUR_SCORE         = '164/3';
const OPP_SCORE         = '160/10';
const OUR_OVERS         = '18.4';
const OPP_OVERS         = '19.2';
const TOSS              = 'Daitya Legion won the toss and elected to field';
const RESULT            = 'won';
const CRICHEROES_URL    = 'https://cricheroes.com/scorecard/23878814/rishikesh-premier-league-/dynamic-devils-vs-daitya-legion/summary';
const TOURNAMENT_URL    = 'https://cricheroes.com/tournament-profile/rishikesh-premier-league';

// ─── PLAYER PERFORMANCES ─────────────────────────────────────────────────────
// Each entry: { namePattern, batting, bowling }
const PERFORMANCES = [
  // ── BATTERS ──────────────────────────────────────────────────────────────
  {
    namePattern: /saksham/i,
    batting: { runs: 44, balls: 28, fours: 6, sixes: 1, strike_rate: 157.14, how_out: 'Not Out' },
    bowling: { wickets: 1, overs: 2, runs: 23, economy: 11.5 },
    isStarPerformer: true, starCategory: 'batting', starLabel: '44* (28b, 6×4, 1×6)',
  },
  {
    namePattern: /maithani|ashraya/i,
    batting: { runs: 37, balls: 42, fours: 5, sixes: 0, strike_rate: 88.09, how_out: 'Out' },
    bowling: { wickets: 3, overs: 3, runs: 28, economy: 9.33 },
    isPlayerOfMatch: true,
  },
  {
    namePattern: /sagar pathak/i,
    batting: { runs: 0, balls: 0, fours: 0, sixes: 0, strike_rate: 0, how_out: 'DNB' },
    bowling: { wickets: 2, overs: 2.2, runs: 17, economy: 7.28 },
    isStarPerformer: true, starCategory: 'bowling', starLabel: '2/17 (2.2 Ov)',
  },
  {
    namePattern: /bruce wayne/i,
    batting: { runs: 0, balls: 0, fours: 0, sixes: 0, strike_rate: 0, how_out: 'DNB' },
    bowling: { wickets: 1, overs: 4, runs: 23, economy: 5.75 },
  },
  {
    namePattern: /deepak/i,
    batting: { runs: 0, balls: 0, fours: 0, sixes: 0, strike_rate: 0, how_out: 'DNB' },
    bowling: { wickets: 1, overs: 1, runs: 11, economy: 11.0 },
  },
  {
    namePattern: /ansh/i,
    batting: { runs: 0, balls: 1, fours: 0, sixes: 0, strike_rate: 0, how_out: 'Out' },
    bowling: { wickets: 0, overs: 0, runs: 0, economy: 0 },
  },
];

// Extra players who may not be in the DB yet (fielding/batting only)
// Rohan Rayal, Aaroosh Pandey, Yug Rawat, Abhishek — add as star performers in tournament doc
// but we won't create Player docs for them unless they already exist

const matchHistoryEntry = {
  match_id: 'rpl-2026-match1',
  date: MATCH_DATE,
  opponent: OPPONENT,
  ground: GROUND,
  city: CITY,
  match_type: MATCH_TYPE,
  result: 'Won by 7 wickets',
  won: true,
  my_score: OUR_SCORE,
  opp_score: OPP_SCORE,
  my_overs: OUR_OVERS,
  opp_overs: OPP_OVERS,
  toss: TOSS,
  cricheroes_url: CRICHEROES_URL,
};

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  let tally = { updated: 0, skipped: 0 };

  for (const perf of PERFORMANCES) {
    const player = await Player.findOne({ name: perf.namePattern });
    if (!player) {
      console.log(`  ⚠️  Player not found: ${perf.namePattern} — skipping`);
      tally.skipped++;
      continue;
    }

    // Avoid duplicate — check if this match is already in history
    const alreadyAdded = player.match_history?.some(m => m.match_id === 'rpl-2026-match1');
    if (alreadyAdded) {
      console.log(`  ℹ️  ${player.name} — RPL Match 1 already in history, skipping`);
      tally.skipped++;
      continue;
    }

    const entry = {
      ...matchHistoryEntry,
      performance: {
        batting: perf.batting,
        bowling: perf.bowling,
      },
    };

    player.match_history.unshift(entry);

    // Update top-level aggregate stats
    if (perf.batting.runs > 0) {
      player.runs = (player.runs || 0) + perf.batting.runs;
      player.batting.total_runs = (player.batting.total_runs || 0) + perf.batting.runs;
      if (perf.batting.runs > (player.batting.high_score || 0)) player.batting.high_score = perf.batting.runs;
      player.batting.fours = (player.batting.fours || 0) + perf.batting.fours;
      player.batting.sixes = (player.batting.sixes || 0) + perf.batting.sixes;
      if (perf.batting.how_out !== 'DNB') player.batting.innings = (player.batting.innings || 0) + 1;
      if (perf.batting.runs >= 50) player.batting.fifties = (player.batting.fifties || 0) + 1;
    }
    if (perf.bowling.wickets > 0 || perf.bowling.overs > 0) {
      player.wickets = (player.wickets || 0) + perf.bowling.wickets;
      player.bowling.wickets = (player.bowling.wickets || 0) + perf.bowling.wickets;
      player.bowling.overs = parseFloat(((player.bowling.overs || 0) + perf.bowling.overs).toFixed(1));
    }
    player.matches = (player.matches || 0) + 1;

    // Player of the Match
    if (perf.isPlayerOfMatch) {
      player.man_of_the_match = (player.man_of_the_match || 0) + 1;
    }

    await player.save();
    console.log(`  ✅ Updated: ${player.name}`);
    tally.updated++;
  }

  // ─── UPSERT TOURNAMENT RECORD ─────────────────────────────────────────────
  const existing = await Tournament.findOne({ name: 'Rishikesh Premier League' });
  const matchDoc = {
    match_id: 'rpl-2026-match1',
    date: MATCH_DATE,
    opponent: OPPONENT,
    our_score: OUR_SCORE,
    opp_score: OPP_SCORE,
    result: RESULT,
    ground: GROUND,
    city: CITY,
    cricheroes_url: CRICHEROES_URL,
    player_of_match: 'Maithani Ashraya',
    star_performers: [
      { player_name: 'Maithani Ashraya', category: 'bowling',  performance: '3/28 (3 Ov) + 37 runs' },
      { player_name: 'Saksham',          category: 'batting',  performance: '44* (28b, 6×4, 1×6)' },
      { player_name: 'Sagar Pathak',     category: 'bowling',  performance: '2/17 (2.2 Ov)' },
      { player_name: 'Rohan Rayal',      category: 'batting',  performance: 'Key batting contribution' },
    ],
    highlights: 'Dominant all-round performance. Ashraya took 3 wickets and scored 37 to guide Daitya Legion to a 7-wicket win in their RPL opener.',
  };

  if (existing) {
    const alreadyHasMatch = existing.matches?.some(m => m.match_id === 'rpl-2026-match1');
    if (!alreadyHasMatch) {
      existing.matches.push(matchDoc);
      existing.matches_played = (existing.matches_played || 0) + 1;
      existing.wins = (existing.wins || 0) + 1;
      existing.status = 'ongoing';
      await existing.save();
      console.log('\n🏆 RPL Tournament record updated — Match 1 added');
    } else {
      console.log('\nℹ️  RPL Tournament already has Match 1');
    }
  } else {
    await Tournament.create({
      name: 'Rishikesh Premier League',
      short_name: 'RPL 2026',
      type: 'T20',
      year: 2026,
      status: 'ongoing',
      matches_played: 1,
      wins: 1,
      losses: 0,
      result: 'Ongoing',
      cricheroes_url: TOURNAMENT_URL,
      matches: [matchDoc],
    });
    console.log('\n🏆 RPL Tournament created with Match 1');
  }

  // Also seed past tournaments if not present
  const bakery1 = await Tournament.findOne({ name: /BLITZ Trophy/i });
  if (!bakery1) {
    await Tournament.create({
      name: 'Daitya Legion VS Bakery 11s BLITZ Trophy Series',
      short_name: 'BLITZ 2025',
      type: 'T20',
      year: 2025,
      status: 'completed',
      result: 'Series Result',
      cricheroes_url: 'https://cricheroes.com/team-profile/11183415/daitya-legion/tournaments',
      matches: [],
    });
    console.log('✅ BLITZ Trophy Series seeded');
  }
  const bakery2 = await Tournament.findOne({ name: /Guard Of Honour/i });
  if (!bakery2) {
    await Tournament.create({
      name: 'DL VS Bakery 11s — The Guard Of Honour Test Series',
      short_name: 'Guard of Honour',
      type: 'Test',
      year: 2025,
      status: 'completed',
      result: 'Series Result',
      cricheroes_url: 'https://cricheroes.com/team-profile/11183415/daitya-legion/tournaments',
      matches: [],
    });
    console.log('✅ Guard of Honour Test Series seeded');
  }

  console.log(`\n📊 Done — Updated: ${tally.updated}, Skipped: ${tally.skipped}`);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
