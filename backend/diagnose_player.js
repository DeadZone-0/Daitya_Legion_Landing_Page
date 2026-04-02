import puppeteer from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Using Sagar Pathak as our test subject
const PLAYER_URL = 'https://cricheroes.com/player-profile/41644117/Sagar-Pathak/stats';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log('Navigating to:', PLAYER_URL);
  
  // Capture the NEXT_DATA JSON response
  let apiData = null;
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('_next/data') || url.includes('player') || url.includes('41644117')) {
      try {
        const ct = response.headers()['content-type'] || '';
        if (ct.includes('json')) {
          const json = await response.json();
          console.log('\n[API RESPONSE]', url);
          const str = JSON.stringify(json, null, 2).substring(0, 2000);
          console.log(str);
          if (!apiData) apiData = json;
        }
      } catch(e) {}
    }
  });

  try {
    await page.goto(PLAYER_URL, { waitUntil: 'networkidle0', timeout: 45000 });
    await page.waitForTimeout(3000);
  } catch(e) {
    console.log('Page load warning:', e.message);
  }

  // Dump the __NEXT_DATA__ script contents
  const nextData = await page.evaluate(() => {
    const el = document.getElementById('__NEXT_DATA__');
    return el ? el.textContent : null;
  });

  if (nextData) {
    fs.writeFileSync('next_data_dump.json', nextData);
    console.log('\n✅ __NEXT_DATA__ found and saved to next_data_dump.json');
    
    // Print top-level keys to understand structure
    try {
      const parsed = JSON.parse(nextData);
      const keys = Object.keys(parsed);
      console.log('Top-level keys:', keys);
      if (parsed.props) {
        console.log('Props keys:', Object.keys(parsed.props));
        if (parsed.props.pageProps) {
          console.log('PageProps keys:', Object.keys(parsed.props.pageProps));
        }
      }
    } catch(e) {
      console.log('Could not parse JSON:', e.message);
    }
  } else {
    console.log('\n❌ No __NEXT_DATA__ found. Checking for other data...');
  }

  // Dump the full body HTML (limited)
  const bodyHtml = await page.evaluate(() => {
    // Remove scripts and styles to reduce noise
    const noisy = document.querySelectorAll('script, style, link, meta');
    noisy.forEach(n => n.remove());
    return document.body.innerHTML.substring(0, 15000);
  });

  fs.writeFileSync('page_body_dump.html', bodyHtml);
  console.log('\n✅ Page body HTML saved to page_body_dump.html');

  // Check what tables and stat elements exist
  const elements = await page.evaluate(() => {
    const result = {
      tableCount: document.querySelectorAll('table').length,
      tables: [],
      statElements: [],
    };
    
    // Dump each table's headers and first data row
    document.querySelectorAll('table').forEach((t, i) => {
      const headers = Array.from(t.querySelectorAll('th, tr:first-child td'))
        .map(h => h.innerText.trim());
      const firstDataRow = Array.from(t.querySelectorAll('tr:nth-child(2) td'))
        .map(c => c.innerText.trim());
      result.tables.push({ i, headers, firstDataRow });
    });
    
    // Find any elements with numeric content near stat keywords
    ['matches', 'runs', 'wickets', 'average', 'strike'].forEach(kw => {
      document.querySelectorAll('*').forEach(el => {
        if (el.children.length < 3 && el.innerText.toLowerCase().includes(kw)) {
          result.statElements.push({
            tag: el.tagName,
            text: el.innerText.trim().substring(0, 100),
            parentText: el.parentElement?.innerText.trim().substring(0, 200)
          });
        }
      });
    });
    
    return result;
  });

  console.log('\n--- PAGE STRUCTURE ANALYSIS ---');
  console.log('Table Count:', elements.tableCount);
  elements.tables.forEach(t => {
    console.log(`\nTable ${t.i}:`);
    console.log('  Headers:', t.headers.slice(0, 10));
    console.log('  First Row:', t.firstDataRow.slice(0, 10));
  });
  
  if (elements.statElements.length > 0) {
    console.log('\nStat Elements Found:', elements.statElements.slice(0, 10));
  } else {
    console.log('\n❌ No stat keywords found in DOM - page may not be loaded!');
  }

  await browser.close();
  console.log('\nDiagnostic complete. Check next_data_dump.json and page_body_dump.html');
})();
