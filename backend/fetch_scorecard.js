import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' } });
  if (!res.ok) return { error: res.status, url };
  return res.json();
}

(async () => {
  const BUILD_ID = '3J0bGObNS3mVkuBoQyB8v';
  const MATCH_ID = '23502320';
  
  const url = `https://cricheroes.com/_next/data/${BUILD_ID}/scorecard/${MATCH_ID}/match/summary.json`;
  console.log('Fetching scorecard:', url);
  
  const data = await fetchJSON(url);
  if (data.error) { console.log('Error:', data.error); process.exit(1); }
  
  fs.writeFileSync('scorecard_dump.json', JSON.stringify(data, null, 2));
  console.log('\nDownloaded scorecard JSON to scorecard_dump.json');
  console.log('Keys:', Object.keys(data.pageProps || {}));
})();
