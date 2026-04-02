import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' } });
  return res.json();
}

(async () => {
  const BUILD_ID = '3J0bGObNS3mVkuBoQyB8v';
  const MATCH_ID = '23502320';
  const url = `https://cricheroes.com/_next/data/${BUILD_ID}/scorecard/${MATCH_ID}/match/summary.json`;
  
  const data = await fetchJSON(url);
  console.log('Redirect Info:', JSON.stringify(data, null, 2));
})();
