import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PLAYER_ID   = '41232063';
const PLAYER_SLUG = 'ansh';
const USER_AGENT  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html', Referer: 'https://cricheroes.com/' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  return res.text();
}

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', Referer: 'https://cricheroes.com/' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  return res.json();
}

async function getBuildId() {
  const html = await fetchText('https://cricheroes.com/');
  const m = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  if (!m) throw new Error('buildId not found');
  return m[1];
}

async function main() {
  const buildId = await getBuildId();
  console.log('buildId:', buildId);

  // Fetch stats page
  const statsUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/stats.json`;
  console.log('\nFetching stats from:', statsUrl);
  const statsJson = await fetchJSON(statsUrl);
  const info = statsJson?.pageProps?.playerInfo?.data;

  if (!info) {
    console.log('RAW pageProps keys:', Object.keys(statsJson?.pageProps || {}));
    console.log('RAW sample:', JSON.stringify(statsJson).slice(0, 800));
    return;
  }

  console.log('\n=== RAW PLAYER INFO FROM CRICHEROES ===');
  console.log('Name:', info.name);
  console.log('Player ID:', info.player_id);
  console.log('Role:', info.playing_role);
  console.log('Total Matches:', info.total_matches);
  console.log('Total Runs:', info.total_runs);
  console.log('Total Wickets:', info.total_wickets);
  console.log('DOB:', info.dob);
  console.log('Batting Hand:', info.batting_hand);
  console.log('Bowling Style:', info.bowling_style);
  console.log('Profile Photo:', info.profile_photo);
  console.log('\n--- RAW player_statement ---');
  console.log(info.player_statement);
  console.log('\n--- ALL raw fields ---');
  Object.keys(info).forEach(k => {
    if (!['player_statement','profile_photo'].includes(k))
      console.log(`  ${k}:`, info[k]);
  });
}

main().catch(console.error);
