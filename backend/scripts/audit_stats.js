import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from '../models/Player.js';

dotenv.config();

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json', 'Referer': 'https://cricheroes.com/' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function getBuildId() {
  const res = await fetch('https://cricheroes.com/', { headers: { 'User-Agent': USER_AGENT } });
  const html = await res.text();
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  if (!match) throw new Error('Could not find buildId');
  return match[1];
}

async function audit() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB. Starting Audit...');
    
    const buildId = await getBuildId();
    console.log(`Build ID: ${buildId}\n`);

    const players = await Player.find({});
    console.log(`Auditing ${players.length} players...\n`);

    console.log('| Player Name | DB Matches | CH Matches | DB Runs | CH Runs | DB Wkts | CH Wkts | Status |');
    console.log('|-------------|------------|------------|---------|---------|---------|---------|--------|');

    for (const p of players) {
      try {
        // Construct slug if missing
        const slug = (p.name || 'player').toLowerCase().replace(/\s+/g, '-');
        const url = `https://cricheroes.com/_next/data/${buildId}/player-profile/${p.external_id}/${slug}/stats.json`;
        
        const json = await fetchJSON(url);
        const info = json?.pageProps?.playerInfo?.data;

        if (!info) {
          console.log(`| ${p.name} | ${p.matches} | N/A | ${p.runs} | N/A | ${p.wickets} | N/A | ⚠️ No Data |`);
          continue;
        }

        const chMatches = info.total_matches || 0;
        const chRuns = info.total_runs || 0;
        const chWkts = info.total_wickets || 0;

        const isMatch = (p.matches === chMatches && p.runs === chRuns && p.wickets === chWkts);
        const status = isMatch ? '✅ OK' : '❌ MISMATCH';

        console.log(`| ${p.name} | ${p.matches} | ${chMatches} | ${p.runs} | ${chRuns} | ${p.wickets} | ${chWkts} | ${status} |`);

      } catch (e) {
        console.log(`| ${p.name} | ${p.matches} | ERR | ${p.runs} | ERR | ${p.wickets} | ERR | ⚠️ Error |`);
      }
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

    process.exit(0);
  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
}

audit();
