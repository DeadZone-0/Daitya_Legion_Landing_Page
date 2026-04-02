/**
 * Probe the CricHeroes pagination endpoint for player matches.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json', 'Referer': 'https://cricheroes.com/' }
  });
  console.log('Status:', res.status, 'Content-Type:', res.headers.get('content-type'));
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch(e) {
    console.log('Raw response (first 500 chars):', text.substring(0, 500));
    return null;
  }
}

(async () => {
  // Bruce Wayne has 28 matches - test page 2
  const PLAYER_ID = '41997128';
  const datetime = Date.now();
  
  const pageUrl = `https://cricheroes.com/player/get-player-match/${PLAYER_ID}?pagesize=12&pageno=2&datetime=${datetime}`;
  console.log('Fetching page 2:', pageUrl);
  
  const data = await fetchJSON(pageUrl);
  if (!data) { console.log('Failed to get data'); process.exit(1); }
  
  fs.writeFileSync('pagination_dump.json', JSON.stringify(data, null, 2));
  console.log('\nTop-level keys:', Object.keys(data));
  console.log('Is array?', Array.isArray(data));
  
  if (Array.isArray(data)) {
    console.log('Array length:', data.length);
    console.log('First item keys:', Object.keys(data[0] || {}));
  } else {
    if (data.data) {
      console.log('data.data length:', Array.isArray(data.data) ? data.data.length : typeof data.data);
    }
    if (data.page) console.log('data.page:', data.page);
    if (data.status !== undefined) console.log('data.status:', data.status);
  }
  
  console.log('\nPagination dump saved to pagination_dump.json');
  console.log('First 1000 chars:', JSON.stringify(data).substring(0, 1000));
})();
