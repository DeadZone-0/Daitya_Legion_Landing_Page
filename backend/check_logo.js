async function run() {
  const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
  const html = await (await fetch('https://cricheroes.com/', { headers: { 'User-Agent': USER_AGENT } })).text();
  const match = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  const buildId = match[1];

  const teamDataUrl = `https://cricheroes.com/_next/data/${buildId}/team-profile/11183415/daitya-legion.json`;
  const teamJson = await (await fetch(teamDataUrl, { headers: { 'User-Agent': USER_AGENT } })).json();
  const teamLogoUrl = teamJson?.pageProps?.teamInfo?.data?.logo_url;
  console.log("Team Logo:", teamLogoUrl);
}
run();
