import Player from '../models/Player.js';
import Team from '../models/Team.js';

const BLACKLIST_IDS = ['1', '3'];
const BLACKLIST_NAMES = ['Vikram Singh', 'Aditya Jethuri', 'Aryan Singh', 'Pranjal', 'Pranjal Rawat'];
const DAITYA_TEAM_ID = '11183415';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TEAM_URL = 'https://cricheroes.com/team-profile/11183415/daitya-legion/members';

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html', 'Referer': 'https://cricheroes.com/' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json', 'Referer': 'https://cricheroes.com/' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function getBuildId() {
  const html = await fetchText('https://cricheroes.com/');
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  if (!match) throw new Error('Could not find buildId');
  return match[1];
}

function parseStatement(ps) {
  if (!ps) return {};
  const num = (regex) => {
    const m = ps.match(regex);
    return m ? parseFloat(m[1]) : 0;
  };
  return {
    innings: num(/With (\d+) turns at the crease/),
    high_score: num(/top score of <b>([^<]+)<\/b>/),
    batting_average: num(/average of <b>([^<]+)<\/b>/),
    strike_rate: num(/strike rate of <b>([^<]+)<\/b>/),
    sixes: num(/<b>(\d+) sixes<\/b>/),
    fours: num(/<b>(\d+) fours<\/b>/),
    overs: num(/bowled <b>([^<]+)<\/b> overs/),
    total_wickets: num(/taking <b>(\d+)<\/b> wickets/),
    economy: num(/economy rate of <b>([^<]+)<\/b>/),
    catches: num(/Taking <b>(\d+)<\/b> catches/),
    run_outs: num(/making <b>(\d+)<\/b> run outs/),
    man_of_the_match: num(/has won <b>(\d+)<\/b> Man of the Match awards/),
    tournaments: num(/played in <b>(\d+)<\/b> different tournaments/),
    titles: Array.from(ps.matchAll(/class="badge[^>]+>([^<]+)<\/span>/g)).map(m => m[1].trim())
  };
}

async function fetchScorecardPerformance(matchId, playerId, buildId, teamASlug, teamBSlug) {
  try {
    const slug = `${teamASlug}-vs-${teamBSlug}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const url = `https://cricheroes.com/_next/data/${buildId}/scorecard/${matchId}/${slug}/scorecard/scorecard.json?matchId=${matchId}&tournamentName=${slug}&teamNames=scorecard&tab=scorecard`;
    
    let json = await fetchJSON(url);
    
    // Handle redirect if needed
    if (json?.pageProps?.__N_REDIRECT) {
      const redir = json.pageProps.__N_REDIRECT;
      const cleanRedir = redir.replace('/scorecard/', '').replace('/scorecard/live', '').replace('/summary', '');
      const [mId, ...slugParts] = cleanRedir.split('/');
      const newSlug = slugParts.join('/');
      const retryUrl = `https://cricheroes.com/_next/data/${buildId}/scorecard/${matchId}/${newSlug}/scorecard/scorecard.json`;
      json = await fetchJSON(retryUrl);
    }

    const scorecard = json?.pageProps?.scorecard || [];
    let perf = {
      batting: { runs: 0, balls: 0, fours: 0, sixes: 0, strike_rate: 0, how_out: 'DNB' },
      bowling: { wickets: 0, overs: 0, runs: 0, economy: 0 }
    };

    const pid = String(playerId);
    for (const inning of scorecard) {
      // Check batting
      const batter = (inning.batting || []).find(b => String(b.player_id) === pid);
      if (batter) {
        perf.batting = {
          runs: parseInt(batter.runs) || 0,
          balls: parseInt(batter.balls) || 0,
          fours: parseInt(batter['4s']) || 0,
          sixes: parseInt(batter['6s']) || 0,
          strike_rate: parseFloat(batter.SR) || 0,
          how_out: batter.how_to_out || 'Not Out'
        };
      }
      // Check bowling
      const bowler = (inning.bowling || []).find(b => String(b.player_id) === pid);
      if (bowler) {
        perf.bowling = {
          wickets: parseInt(bowler.wickets) || 0,
          overs: parseFloat(bowler.overs) || 0,
          runs: parseInt(bowler.runs) || 0,
          economy: parseFloat(bowler.economy_rate) || 0
        };
      }
    }
    return perf;
  } catch (e) {
    return null;
  }
}

async function fetchMatchHistory(playerId, buildId, slug) {
  const allMatches = [];
  try {
    const url = `https://cricheroes.com/_next/data/${buildId}/player-profile/${playerId}/${slug}/matches.json`;
    const json = await fetchJSON(url);
    const firstPage = json?.pageProps?.matches?.data || [];
    
    const processMatches = async (matchList) => {
      const processed = [];
      for (const m of matchList) {
        if (m.match_result === 'Resulted' || m.match_result === 'Drawn') {
          const date = new Date(m.match_start_time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
          const isDaitya_A = String(m.team_a_id) === DAITYA_TEAM_ID;
          const myInnings = isDaitya_A ? m.team_a_innings : m.team_b_innings;
          const oppInnings = isDaitya_A ? m.team_b_innings : m.team_a_innings;
          const opponent = isDaitya_A ? m.team_b : m.team_a;
          const won = String(m.winning_team_id) === DAITYA_TEAM_ID;

          console.log(`      🏏 Fetching Scorecard for Match ID: ${m.match_id} (vs ${opponent})`);
          const performance = await fetchScorecardPerformance(m.match_id, playerId, buildId, m.team_a, m.team_b);
          await new Promise(r => setTimeout(r, 150)); // Tiny delay

          processed.push({
            match_id: m.match_id,
            date,
            opponent,
            opp_logo: isDaitya_A ? m.team_b_logo : m.team_a_logo,
            ground: m.ground_name,
            city: m.city_name,
            match_type: m.match_type,
            result: m.match_summary?.summary || m.win_by || '',
            won,
            my_score: (isDaitya_A ? m.team_a_summary : m.team_b_summary) || '—',
            opp_score: (isDaitya_A ? m.team_b_summary : m.team_a_summary) || '—',
            my_overs: myInnings?.[0]?.overs_played || '—',
            opp_overs: oppInnings?.[0]?.overs_played || '—',
            toss: m.toss_details || '',
            cricheroes_url: `https://cricheroes.com/scorecard/${m.match_id}/match-details/match-details/scorecard`,
            performance: performance || {
              batting: { runs: 0, balls: 0, fours: 0, sixes: 0, strike_rate: 0, how_out: 'DNB' },
              bowling: { wickets: 0, overs: 0, runs: 0, economy: 0 }
            }
          });
        }
      }
      return processed;
    };

    allMatches.push(...(await processMatches(firstPage)));
    let nextUrl = json?.pageProps?.matches?.page?.next;
    if (nextUrl) {
       console.log(`      ... (Pagination found for ${playerId}, additional pages available)`);
    }
  } catch(e) {
    console.log(`     ⚠️ Match history fetch failed: ${e.message}`);
  }
  return allMatches;
}

async function getTeamMembers(buildId) {
  console.log('Fetching team member list...');
  try {
    const dataUrl = `https://cricheroes.com/_next/data/${buildId}/team-profile/11183415/daitya-legion/members.json`;
    const json = await fetchJSON(dataUrl);
    const members = json?.pageProps?.memberList?.data || [];
    console.log(`  JSON Result: Found ${members.length} raw members`);
    if (members.length > 0) {
      return members.map(m => ({
        external_id: String(m.player_id || m.member_id),
        name: m.name || 'Unknown',
        image_url: m.profile_photo || null,
        role: m.playing_role || 'Unknown',
        slug: m.slug || (m.name || 'player').replace(/\s+/g, '-'),
      })).filter(m => !BLACKLIST_IDS.includes(m.external_id) && !BLACKLIST_NAMES.includes(m.name));
    }
  } catch(e) {
    console.log(`  JSON Fetch failed: ${e.message}. Falling back to HTML...`);
  }

  try {
    const html = await fetchText(TEAM_URL);
    const links = [...html.matchAll(/href="\/player-profile\/(\d+)\/([^/"]+)/g)];
    const seen = new Set();
    const members = [];
    for (const [, id, slug] of links) {
      if (seen.has(id) || BLACKLIST_IDS.includes(id)) continue;
      seen.add(id);
      const name = decodeURIComponent(slug.replace(/-/g, ' '));
      if (BLACKLIST_NAMES.includes(name)) continue;
      members.push({ external_id: id, name, image_url: null, role: 'Unknown', slug });
    }
    console.log(`  HTML Result: Found ${members.length} members via regex`);
    
    // Explicitly add requested extra players not always found on main squad list
    const EXTRA_MEMBERS = [
      { external_id: '21556092', name: 'Paritosh Dhyani', image_url: null, role: 'Unknown', slug: 'Paritosh-Dhyani' },
      { external_id: '38569177', name: 'Abhideep Gupta', image_url: null, role: 'Unknown', slug: 'Abhideep-Gupta' },
    ];
    
    EXTRA_MEMBERS.forEach(extra => {
      if (!members.find(m => m.external_id === extra.external_id)) {
        members.push(extra);
      }
    });

    return members;
  } catch (e) {
    console.log(`  HTML Fallback failed: ${e.message}`);
  }
  return [];
}

export const scrapePlayers = async () => {
  console.log('🔍 Initializing V2 Deep Stats Scraper with Awards extraction...');
  const buildId = await getBuildId();
  console.log(`  Build ID: ${buildId}`);

  let teamLogoUrl = 'https://cricheroes.com/assets/images/team-placeholder.png';
  try {
    const teamDataUrl = `https://cricheroes.com/_next/data/${buildId}/team-profile/11183415/daitya-legion.json`;
    const teamJson = await fetchJSON(teamDataUrl);
    teamLogoUrl = teamJson?.pageProps?.teamInfo?.data?.logo_url || teamLogoUrl;
  } catch(e) {}

  const members = await getTeamMembers(buildId);
  console.log(`\n🎯 Processing ${members.length} Legion members...\n`);

  for (const m of members) {
    console.log(`📊 Deep Sync: ${m.name} (ID: ${m.external_id})`);
    try {
      const playerDataUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/${m.external_id}/${m.slug}/stats.json`;
      const json = await fetchJSON(playerDataUrl);
      const info = json?.pageProps?.playerInfo?.data;
      if (!info) continue;

      const extras = parseStatement(info.player_statement);
      const matchHistory = await fetchMatchHistory(m.external_id, buildId, m.slug);

      // Best Stats Fallback Calculation
      let realHighScore = extras.high_score || 0;
      let realBestBowling = '0/0';
      let bestWickets = 0;
      let minRuns = 999;

      matchHistory.forEach(mh => {
        const perf = mh.performance;
        
        // High Score
        if (perf.batting.runs > realHighScore) realHighScore = perf.batting.runs;
        // Best Bowling
        if (perf.bowling.wickets > bestWickets) {
          bestWickets = perf.bowling.wickets;
          minRuns = perf.bowling.runs;
          realBestBowling = `${bestWickets}/${minRuns}`;
        } else if (perf.bowling.wickets === bestWickets && perf.bowling.runs < minRuns && bestWickets > 0) {
          minRuns = perf.bowling.runs;
          realBestBowling = `${bestWickets}/${minRuns}`;
        }
      });


      const dbPayload = {
        external_id: String(info.player_id),
        name: info.name,
        image_url: info.profile_photo || null,
        role: info.playing_role || m.role,
        titles: (info.badges && info.badges.length > 0) ? info.badges.map(b => b.name) : (extras.titles || []),
        matches: info.total_matches || 0,
        runs: info.total_runs || 0,
        wickets: info.total_wickets || 0,
        catches: extras.catches || 0,
        run_outs: extras.run_outs || 0,
        man_of_the_match: extras.man_of_the_match || 0,
        tournaments: extras.tournaments || 0,
        match_history: matchHistory,
        batting: {
          average: extras.batting_average || 0,
          strike_rate: extras.strike_rate || 0,
          high_score: realHighScore,
          total_runs: info.total_runs || 0,
          innings: extras.innings || 0,
          fours: extras.fours || 0,
          sixes: extras.sixes || 0,
          fifties: 0, hundreds: 0,
        },
        bowling: {
          wickets: info.total_wickets || 0,
          economy: extras.economy || 0,
          overs: extras.overs || 0,
          average: 0, five_w: 0,
          best_bowling: realBestBowling === '0/0' ? 'None' : realBestBowling,
        },
        general: {
          dob: info.dob || '',
          batting_style: info.batting_hand || '',
          bowling_style: info.bowling_style || '',
        },
      };

      const existing = await Player.findOne({ external_id: dbPayload.external_id });
      
      // Inherit existing titles if scraper fails to pull new ones
      if (existing && existing.titles?.length > 0 && (!dbPayload.titles || dbPayload.titles.length === 0)) {
        dbPayload.titles = existing.titles;
      }
      
      if (existing && !existing.is_manual_override) {
        await Player.updateOne({ external_id: dbPayload.external_id }, { $set: dbPayload });
      } else if (!existing) {
        await Player.create({ ...dbPayload, is_manual_override: false });
      }

      console.log(`   └─ ✅ Sync Complete. HS: ${realHighScore}, Best: ${realBestBowling}`);
      await new Promise(r => setTimeout(r, 1000));
    } catch(e) {
      console.error(`   └─ ❌ Error syncing ${m.name}:`, e.message);
    }
  }

  // Aggregation
  const allPlayers = await Player.find({});
  const total_matches = Math.max(...allPlayers.map(p => p.matches || 0), 0);
  const total_runs = allPlayers.reduce((a, p) => a + (p.runs || 0), 0);
  const total_wickets = allPlayers.reduce((a, p) => a + (p.wickets || 0), 0);
  const total_tournaments = Math.max(...allPlayers.map(p => p.tournaments || 0), 0);

  let totalWins = 0;
  let totalLogs = 0;
  let bestWinStr = "";
  let maxMargin = 0;

  allPlayers.forEach(p => {
    (p.match_history || []).forEach(m => {
      totalLogs++;
      if (m.won) totalWins++;
      if (m.won && m.result) {
        const runMatch = m.result.match(/(\d+)\s+runs/i);
        const wicketMatch = m.result.match(/(\d+)\s+wickets/i);
        let margin = 0;
        if (runMatch) margin = parseInt(runMatch[1]);
        else if (wicketMatch) margin = parseInt(wicketMatch[1]) * 15;
        if (margin > maxMargin) {
          maxMargin = margin;
          bestWinStr = m.result;
        }
      }
    });
  });

  const win_percentage = totalLogs > 0 ? `${Math.round((totalWins / totalLogs) * 100)}%` : "0%";

  await Team.findOneAndUpdate({ name: 'Daitya Legion' }, { 
    logo_url: teamLogoUrl, 
    total_matches, 
    total_runs, 
    total_wickets, 
    total_tournaments,
    win_percentage,
    best_win: bestWinStr,
    last_updated: Date.now() 
  }, { upsert: true });

  console.log('\n🏆 Legion V2 Database Synchronized Successfully!');
  if (win_percentage) console.log(`⭐ Win Probability: ${win_percentage}`);
};
