import puppeteer from 'puppeteer';

const TEAM_URL = 'https://cricheroes.com/team-profile/11183415/daitya-legion/members';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');
  
  console.log('Navigating to', TEAM_URL);
  await page.goto(TEAM_URL, { waitUntil: 'networkidle2' });
  
  console.log('Extracting members...');
  const players = await page.evaluate(() => {
    const playerCards = document.querySelectorAll('a[href*="/player-profile/"]');
    const results = [];
    playerCards.forEach(card => {
      const href = card.getAttribute('href');
      const nameEl = card.querySelector('h3') || card.querySelector('.player-name');
      if (href) {
        results.push({
          url: href,
          // Fallback to extracting from URL if name element is tricky to find
          name: nameEl ? nameEl.innerText.trim() : href.split('/').pop().replace(/-/g, ' ')
        });
      }
    });
    return results;
  });
  
  console.log('Found players:', players);
  await browser.close();
}

run().catch(console.error);
