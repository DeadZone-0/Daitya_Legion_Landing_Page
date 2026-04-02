import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

async function testUrl(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' } });
    console.log(`URL: ${url} | Status: ${res.status} | OK: ${res.ok}`);
    if (res.ok) {
      const text = await res.text();
      console.log(`  Length: ${text.length} | Start: ${text.substring(0, 100)}`);
      return true;
    }
  } catch(e) {
    console.log(`URL: ${url} | Error: ${e.message}`);
  }
  return false;
}

(async () => {
  const PLAYER_ID = '41997128';
  const ts = Date.now();
  const variations = [
    `https://cricheroes.com/player/get-player-match/${PLAYER_ID}?pagesize=12&pageno=2&datetime=${ts}`,
    `https://www.cricheroes.com/player/get-player-match/${PLAYER_ID}?pagesize=12&pageno=2&datetime=${ts}`,
    `https://cricheroes.in/player/get-player-match/${PLAYER_ID}?pagesize=12&pageno=2&datetime=${ts}`,
    `https://www.cricheroes.in/player/get-player-match/${PLAYER_ID}?pagesize=12&pageno=2&datetime=${ts}`,
    `https://cricheroes.com/api/player/get-player-match/${PLAYER_ID}?pagesize=12&pageno=2&datetime=${ts}`,
  ];
  
  for (const v of variations) {
    await testUrl(v);
  }
})();
