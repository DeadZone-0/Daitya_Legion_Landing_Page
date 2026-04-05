import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// ── Inline Player schema (mirrors models/Player.js) ──────────────────────────
const playerSchema = new mongoose.Schema(
  {
    external_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, default: 'Unknown' },
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    catches: { type: Number, default: 0 },
    run_outs: { type: Number, default: 0 },
    man_of_the_match: { type: Number, default: 0 },
    tournaments: { type: Number, default: 0 },
    image_url: { type: String, default: '' },
    is_manual_override: { type: Boolean, default: false },
    batting: {
      average: { type: Number, default: 0 },
      strike_rate: { type: Number, default: 0 },
      high_score: { type: Number, default: 0 },
      total_runs: { type: Number, default: 0 },
      innings: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      fifties: { type: Number, default: 0 },
      hundreds: { type: Number, default: 0 },
    },
    bowling: {
      wickets: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
      overs: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      five_w: { type: Number, default: 0 },
      best_bowling: { type: String, default: '0/0' },
    },
    general: {
      dob: { type: String, default: '' },
      batting_style: { type: String, default: '' },
      bowling_style: { type: String, default: '' },
    },
    match_history: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);

// ── Config ─────────────────────────────────────────────────────────────────
const PLAYER_ID   = '16628521';
const PLAYER_SLUG = 'ujjwal-sati';
const USER_AGENT  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DAITYA_TEAM_ID = '11183415';

// ── Helpers ─────────────────────────────────────────────────────────────────
async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
      Referer: 'https://cricheroes.com/',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  return res.text();
}

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      Referer: 'https://cricheroes.com/',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  return res.json();
}

async function getBuildId() {
  const html = await fetchText('https://cricheroes.com/');
  const m = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  if (!m) throw new Error('buildId not found in HTML');
  return m[1];
}

function parseStatement(ps) {
  if (!ps) return {};
  const num = (regex) => { const m = ps.match(regex); return m ? parseFloat(m[1]) : 0; };
  return {
    innings:         num(/With (\d+) turns at the crease/),
    high_score:      num(/top score of <b>([^<]+)<\/b>/),
    batting_average: num(/average of <b>([^<]+)<\/b>/),
    strike_rate:     num(/strike rate of <b>([^<]+)<\/b>/),
    sixes:           num(/<b>(\d+) sixes<\/b>/),
    fours:           num(/<b>(\d+) fours<\/b>/),
    overs:           num(/bowled <b>([^<]+)<\/b> overs/),
    total_wickets:   num(/taking <b>(\d+)<\/b> wickets/),
    economy:         num(/economy rate of <b>([^<]+)<\/b>/),
    catches:         num(/Taking <b>(\d+)<\/b> catches/),
    run_outs:        num(/making <b>(\d+)<\/b> run outs/),
    man_of_the_match:num(/has won <b>(\d+)<\/b> Man of the Match/),
    tournaments:     num(/played in <b>(\d+)<\/b> different tournaments/),
  };
}

async function fetchScorecardPerf(matchId, buildId, teamA, teamB) {
  try {
    const slug = `${teamA}-vs-${teamB}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const url = `https://cricheroes.com/_next/data/${buildId}/scorecard/${matchId}/${slug}/scorecard/scorecard.json?matchId=${matchId}&tournamentName=${slug}&teamNames=scorecard&tab=scorecard`;
    let json = await fetchJSON(url);
    if (json?.pageProps?.__N_REDIRECT) {
      const redir = json.pageProps.__N_REDIRECT.replace('/scorecard/', '').replace('/scorecard/live', '').replace('/summary', '');
      const [, ...slugParts] = redir.split('/');
      const retryUrl = `https://cricheroes.com/_next/data/${buildId}/scorecard/${matchId}/${slugParts.join('/')}/scorecard/scorecard.json`;
      json = await fetchJSON(retryUrl);
    }
    const scorecard = json?.pageProps?.scorecard || [];
    let perf = {
      batting: { runs: 0, balls: 0, fours: 0, sixes: 0, strike_rate: 0, how_out: 'DNB' },
      bowling: { wickets: 0, overs: 0, runs: 0, economy: 0 },
    };
    for (const inning of scorecard) {
      const batter = (inning.batting || []).find(b => String(b.player_id) === PLAYER_ID);
      if (batter) {
        perf.batting = {
          runs: parseInt(batter.runs) || 0,
          balls: parseInt(batter.balls) || 0,
          fours: parseInt(batter['4s']) || 0,
          sixes: parseInt(batter['6s']) || 0,
          strike_rate: parseFloat(batter.SR) || 0,
          how_out: batter.how_to_out || 'Not Out',
        };
      }
      const bowler = (inning.bowling || []).find(b => String(b.player_id) === PLAYER_ID);
      if (bowler) {
        perf.bowling = {
          wickets: parseInt(bowler.wickets) || 0,
          overs: parseFloat(bowler.overs) || 0,
          runs: parseInt(bowler.runs) || 0,
          economy: parseFloat(bowler.economy_rate) || 0,
        };
      }
    }
    return perf;
  } catch {
    return null;
  }
}

async function fetchMatchHistory(buildId) {
  const allMatches = [];
  try {
    const url = `https://cricheroes.com/_next/data/${buildId}/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/matches.json`;
    const json = await fetchJSON(url);
    const matchList = json?.pageProps?.matches?.data || [];
    for (const m of matchList) {
      if (m.match_result === 'Resulted' || m.match_result === 'Drawn') {
        const date = new Date(m.match_start_time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const isDaityaA = String(m.team_a_id) === DAITYA_TEAM_ID;
        const opponent = isDaityaA ? m.team_b : m.team_a;
        const won = String(m.winning_team_id) === DAITYA_TEAM_ID;
        console.log(`   🏏 Match vs ${opponent} [${date}]`);
        const performance = await fetchScorecardPerf(m.match_id, buildId, m.team_a, m.team_b);
        await new Promise(r => setTimeout(r, 200));
        allMatches.push({
          match_id: m.match_id,
          date,
          opponent,
          opp_logo: isDaityaA ? m.team_b_logo : m.team_a_logo,
          ground: m.ground_name,
          city: m.city_name,
          match_type: m.match_type,
          result: m.match_summary?.summary || m.win_by || '',
          won,
          my_score: (isDaityaA ? m.team_a_summary : m.team_b_summary) || '—',
          opp_score: (isDaityaA ? m.team_b_summary : m.team_a_summary) || '—',
          my_overs: (isDaityaA ? m.team_a_innings : m.team_b_innings)?.[0]?.overs_played || '—',
          opp_overs: (isDaityaA ? m.team_b_innings : m.team_a_innings)?.[0]?.overs_played || '—',
          toss: m.toss_details || '',
          cricheroes_url: `https://cricheroes.com/scorecard/${m.match_id}/match-details/match-details/scorecard`,
          performance: performance || {
            batting: { runs: 0, balls: 0, fours: 0, sixes: 0, strike_rate: 0, how_out: 'DNB' },
            bowling: { wickets: 0, overs: 0, runs: 0, economy: 0 },
          },
        });
      }
    }
  } catch (e) {
    console.warn(`   ⚠️  Match history error: ${e.message}`);
  }
  return allMatches;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected!\n');

  console.log(`📡 Fetching CricHeroes buildId...`);
  const buildId = await getBuildId();
  console.log(`   buildId: ${buildId}\n`);

  // ── Stats page ─────────────────────────────────────────────────────────────
  console.log(`🎯 Fetching stats for Ujjwal Sati (ID: ${PLAYER_ID})...`);
  const statsUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/stats.json`;
  const statsJson = await fetchJSON(statsUrl);
  const info = statsJson?.pageProps?.playerInfo?.data;
  if (!info) throw new Error('Could not parse playerInfo from stats endpoint');

  console.log(`   Name: ${info.name}`);
  console.log(`   Role: ${info.playing_role}`);
  console.log(`   Matches: ${info.total_matches}  Runs: ${info.total_runs}  Wickets: ${info.total_wickets}\n`);

  const extras = parseStatement(info.player_statement);
  console.log('📝 Parsed player statement:', extras);

  // ── Match history ──────────────────────────────────────────────────────────
  console.log('\n📜 Fetching match history...');
  const matchHistory = await fetchMatchHistory(buildId);
  console.log(`   → ${matchHistory.length} completed matches found.\n`);

  // ── Derive best stats ──────────────────────────────────────────────────────
  let realHighScore = extras.high_score || 0;
  let realBestBowling = '0/0';
  let bestWickets = 0;
  let minRuns = 999;

  matchHistory.forEach(mh => {
    if (mh.performance.batting.runs > realHighScore) realHighScore = mh.performance.batting.runs;
    const w = mh.performance.bowling.wickets;
    const r = mh.performance.bowling.runs;
    if (w > bestWickets || (w === bestWickets && r < minRuns && w > 0)) {
      bestWickets = w;
      minRuns = r;
      realBestBowling = `${w}/${r}`;
    }
  });

  // ── Build DB payload ───────────────────────────────────────────────────────
  const payload = {
    external_id: String(info.player_id || PLAYER_ID),
    name: info.name || 'Ujjwal Sati',
    image_url: info.profile_photo || null,
    role: info.playing_role || 'Unknown',
    matches: info.total_matches || 0,
    runs: info.total_runs || 0,
    wickets: info.total_wickets || 0,
    catches: extras.catches || 0,
    run_outs: extras.run_outs || 0,
    man_of_the_match: extras.man_of_the_match || 0,
    tournaments: extras.tournaments || 0,
    is_manual_override: false,
    match_history: matchHistory,
    batting: {
      average: extras.batting_average || 0,
      strike_rate: extras.strike_rate || 0,
      high_score: realHighScore,
      total_runs: info.total_runs || 0,
      innings: extras.innings || 0,
      fours: extras.fours || 0,
      sixes: extras.sixes || 0,
      fifties: 0,
      hundreds: 0,
    },
    bowling: {
      wickets: info.total_wickets || 0,
      economy: extras.economy || 0,
      overs: extras.overs || 0,
      average: 0,
      five_w: 0,
      best_bowling: realBestBowling === '0/0' ? 'None' : realBestBowling,
    },
    general: {
      dob: info.dob || '',
      batting_style: info.batting_hand || '',
      bowling_style: info.bowling_style || '',
    },
  };

  // ── Upsert into DB ─────────────────────────────────────────────────────────
  console.log('💾 Saving Ujjwal Sati to database...');
  const existing = await Player.findOne({ external_id: payload.external_id });
  if (existing && !existing.is_manual_override) {
    Object.assign(existing, payload);
    await existing.save();
    console.log('   ✅ Updated existing record.');
  } else if (!existing) {
    await Player.create(payload);
    console.log('   ✅ Created new record.');
  } else {
    console.log('   ⚠️  Manual override active – skipping to preserve custom data.');
  }

  console.log(`\n🏆 Done! High Score: ${realHighScore}  Best Bowling: ${realBestBowling}`);
  console.log('   Ujjwal Sati is now live on the Daitya Legion dashboard!');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
