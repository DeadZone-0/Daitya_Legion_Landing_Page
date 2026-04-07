async function run() {
  const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
  const html = await (await fetch('https://cricheroes.com/', { headers: { 'User-Agent': USER_AGENT } })).text();
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  const buildId = match[1];

  const dataUrl = `https://cricheroes.com/_next/data/${buildId}/team-profile/11183415/daitya-legion/members.json`;
  const json = await (await fetch(dataUrl, { headers: { 'User-Agent': USER_AGENT } })).json();
  const members = json?.pageProps?.memberList?.data || [];
  
  // get the first member with some matches
  const player = members.find(m => m.name.toLowerCase().includes('bruce') || m.name.toLowerCase().includes('wayne')) || members[0];
  console.log("Found member", player.name, player.player_id, player.slug);

  const statsUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/${player.player_id || player.member_id}/${player.slug}/stats.json`;
  const statsJson = await (await fetch(statsUrl, { headers: { 'User-Agent': USER_AGENT } })).json();
  const info = statsJson?.pageProps?.playerInfo?.data;
  console.log("Player Info JSON keys:", Object.keys(info || {}));
  console.log("Statement:", info.player_statement);
  if (info.batting) console.log("Batting!", info.batting);
  if (info.bowling) console.log("Bowling!", info.bowling);
  if (info.stats) console.log("Stats!", info.stats);
}
run();
