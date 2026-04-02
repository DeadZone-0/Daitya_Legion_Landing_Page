/**
 * Diagnostic: Probe CricHeroes Next.js JSON endpoints directly (no browser).
 * We'll find which endpoint returns player stats and print the structure.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const PLAYER_ID = '41644117';
const PLAYER_SLUG = 'Sagar-Pathak';

// CricHeroes is a Next.js app — pages are pre-rendered and _next/data JSON is publicly accessible
// Format: https://cricheroes.com/_next/data/<BUILD_ID>/player-profile/<id>/<slug>/stats.json
// We need the BUILD_ID first by fetching the main page and reading the __NEXT_DATA__ script tag.

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function get(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://cricheroes.com/',
    }
  });
  return { status: res.status, text: await res.text() };
}

async function getJSON(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json',
      'Referer': 'https://cricheroes.com/',
    }
  });
  if (!res.ok) return { error: res.status };
  return res.json();
}

(async () => {
  try {
    console.log('Step 1: Fetching player profile page to extract Build ID...');
    const profileUrl = `https://cricheroes.com/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/stats`;
    const { status, text } = await get(profileUrl);
    console.log('Page status:', status);

    // Extract Build ID from __NEXT_DATA__
    const match = text.match(/"buildId"\s*:\s*"([^"]+)"/);
    if (!match) {
      console.log('No buildId found in page source. First 2000 chars of response:');
      console.log(text.substring(0, 2000));
      return;
    }

    const buildId = match[1];
    console.log('Build ID found:', buildId);

    // Try the Next.js data endpoint
    const nextDataUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/${PLAYER_ID}/${PLAYER_SLUG}/stats.json`;
    console.log('\nStep 2: Fetching Next.js JSON data from:', nextDataUrl);
    const nextJson = await getJSON(nextDataUrl);

    if (nextJson.error) {
      console.log('Next.js JSON returned status:', nextJson.error);
    } else {
      const pretty = JSON.stringify(nextJson, null, 2);
      fs.writeFileSync('next_data_dump.json', pretty);
      console.log('✅ Data saved to next_data_dump.json');
      console.log('\nTop-level keys:', Object.keys(nextJson));
      if (nextJson.pageProps) {
        console.log('PageProps keys:', Object.keys(nextJson.pageProps));
        // Look for player_statement
        const ps = nextJson.pageProps?.player_statement;
        if (ps) {
          console.log('\n🎉 player_statement FOUND! Keys:', Object.keys(ps));
          console.log('Runs:', ps.total_runs, 'Wickets:', ps.total_wickets, 'Matches:', ps.matches);
        } else {
          // Recursive search for any "runs" or "total_runs" field
          const find = (obj, depth = 0) => {
            if (depth > 6) return;
            if (typeof obj !== 'object' || !obj) return;
            if (obj.total_runs !== undefined) {
              console.log('\n🎉 Found stats at depth', depth, ':', JSON.stringify(obj).substring(0, 500));
              return;
            }
            for (const k of Object.keys(obj)) find(obj[k], depth + 1);
          };
          find(nextJson);
        }
      }
    }

    // Also try the CricHeroes public API
    console.log('\nStep 3: Trying CricHeroes API endpoints...');
    const apiUrls = [
      `https://cricheroes.com/api/v1/player/${PLAYER_ID}/stats`,
      `https://cricheroes.com/api/v2/player/${PLAYER_ID}/profile`,
      `https://cricheroes.com/api/v1/players/${PLAYER_ID}`,
    ];

    for (const apiUrl of apiUrls) {
      console.log('Trying:', apiUrl);
      try {
        const data = await getJSON(apiUrl);
        if (!data.error) {
          console.log('✅ Got response! Keys:', Object.keys(data).slice(0, 10));
          const str = JSON.stringify(data).substring(0, 500);
          console.log(str);
          break;
        } else {
          console.log('  -> Status:', data.error);
        }
      } catch(e) {
        console.log('  -> Error:', e.message);
      }
    }

  } catch (err) {
    console.error('Fatal error:', err.message);
  }
})();
