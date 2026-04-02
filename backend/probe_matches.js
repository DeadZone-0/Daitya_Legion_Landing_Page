/**
 * Probe CricHeroes player scoring/matches endpoints to find match history structure.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const PLAYER_ID = '41997128'; // Bruce Wayne (real)
const PLAYER_SLUG = 'bruce-wayne';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json', 'Referer': 'https://cricheroes.com/' }
  });
  if (!res.ok) return { error: res.status, url };
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html', 'Referer': 'https://cricheroes.com/' }
  });
  return res.text();
}

(async () => {
  // Get current build ID
  const html = await fetchText('https://cricheroes.com/');
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  const buildId = match?.[1];
  console.log('Build ID:', buildId);

  // Try known Next.js data endpoints for scoring/matches
  const endpoints = [
    `https://cricheroes.com/_next/data/${buildId}/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/scoring.json`,
    `https://cricheroes.com/_next/data/${buildId}/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/bowling.json`,
    `https://cricheroes.com/_next/data/${buildId}/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/matches.json`,
  ];

  for (const url of endpoints) {
    console.log('\nFetching:', url);
    const data = await fetchJSON(url);
    if (data.error) { console.log('  -> Error:', data.error); continue; }
    const pretty = JSON.stringify(data, null, 2);
    const fname = url.split('/').pop().replace('.json', '_endpoint.json');
    fs.writeFileSync(fname, pretty);
    console.log('  -> Saved to', fname);
    console.log('  Top keys:', Object.keys(data).slice(0, 5));
    if (data.pageProps) {
      console.log('  PageProps keys:', Object.keys(data.pageProps).slice(0, 10));
      // Print first 1000 chars
      console.log(pretty.substring(0, 1500));
    }
  }
})();
