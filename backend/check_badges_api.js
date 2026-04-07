async function run() {
  const USER_AGENT = 'Mozilla/5.0';
  const html = await (await fetch('https://cricheroes.com/', { headers: { 'User-Agent': USER_AGENT } })).text();
  const buildId = html.match(/"buildId"\s*:\s*"([^"]+)"/)[1];

  for (const id of ['21556092', '38569177']) {
     const badgesUrl = `https://cricheroes.com/_next/data/${buildId}/player-profile/${id}/player/badges.json`;
     const req = await fetch(badgesUrl, { headers: { 'User-Agent': USER_AGENT } });
     if(req.ok) {
        const json = await req.json();
        const activeBadges = (json?.pageProps?.badgeData?.data || []).map(b => b.name);
        console.log(`ID ${id} badges:`, activeBadges);
     } else {
        console.log("Failed fetching badges for", id);
     }
  }
}
run();
