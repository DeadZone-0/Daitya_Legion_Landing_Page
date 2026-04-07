async function run() {
  const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
  const html = await (await fetch('https://cricheroes.com/', { headers: { 'User-Agent': USER_AGENT } })).text();
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  const buildId = match[1];

  const htmlTeam = await (await fetch('https://cricheroes.com/team-profile/11183415/daitya-legion/members', { headers: { 'User-Agent': USER_AGENT } })).text();
  const links = [...htmlTeam.matchAll(/href="\/player-profile\/(\d+)\/([^/"]+)/g)];
  if(links.length === 0) return console.log("No players found");
  
  const id = links[0][1];
  const slug = links[0][2];
  
  const statsUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/${id}/${slug}/stats.json`;
  const statsJson = await (await fetch(statsUrl, { headers: { 'User-Agent': USER_AGENT } })).json();
  const info = statsJson?.pageProps?.playerInfo?.data || {};
  
  console.log("Found player:", info.name);
  console.log("Total Runs:", info.total_runs);
  console.log("Player Statement:", info.player_statement);
  
  for(let key in info) {
    if (typeof info[key] !== 'string' && typeof info[key] !== 'number' && info[key]) {
       console.log("DEBUG KEY:", key, JSON.stringify(info[key]).slice(0, 100));
    }
  }
}
run();
