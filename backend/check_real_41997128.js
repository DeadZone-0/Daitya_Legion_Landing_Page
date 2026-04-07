async function run() {
  const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
  const html = await (await fetch('https://cricheroes.com/', { headers: { 'User-Agent': USER_AGENT } })).text();
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  const buildId = match[1];

  const statsUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/41997128/bruce-wayne/stats.json`;
  const statsRes = await fetch(statsUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!statsRes.ok) {
     console.log("Failed fetching profile!", statsRes.status);
     return;
  }
  const statsJson = await statsRes.json();
  const info = statsJson?.pageProps?.playerInfo?.data || {};
  console.log("Name:", info.name);
  console.log("Total Runs:", info.total_runs);
  console.log("Statement:", info.player_statement);
}
run();
