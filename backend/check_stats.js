import fs from 'fs';
async function run() {
  const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const html = await (await fetch('https://cricheroes.com/', { headers: { 'User-Agent': USER_AGENT } })).text();
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  const buildId = match[1];

  // let's grab Sagar's stats or ujjwal's stats. 
  // Sagar: '11183415' is team. 
  const url = `https://cricheroes.com/_next/data/${buildId}/player-profile/6770247/sagar/stats.json`;
  const res = await (await fetch(url, { headers: { 'User-Agent': USER_AGENT } })).json();
  console.log(JSON.stringify(res?.pageProps?.playerInfo?.data, null, 2));
}
run();
