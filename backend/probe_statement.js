/**
 * Probe CricHeroes player_statement bold values to fix parseStatement ordering.
 */
const testStatements = [
  // Sagar Pathak
  "A complete player, Sagar Pathak has made a big mark in cricket. With 14 turns at the crease, they've hit a top score of <b>10</b>, with an average of <b>2.44</b> and a quick strike rate of <b>56.41</b>. Their knack for hitting big shots is evident with <b>0 sixes</b> and <b>2 fours</b>.</br></br>\n Equally good at bowling, they've bowled <b>31.3</b> overs, taking <b>12</b> wickets at an economy rate of <b>8.03</b>.",
  // Bruce Wayne
  "A complete player, Bruce Wayne has made a big mark in cricket. With 31 turns at the crease, they've hit a top score of <b>38</b>, with an average of <b>15.50</b> and a quick strike rate of <b>82.92</b>. Their knack for hitting big shots is evident with <b>3 sixes</b> and <b>44 fours</b>.</br></br>\n Equally good at bowling, they've bowled <b>73.1</b> overs, taking <b>42</b> wickets at an economy rate of <b>4.67</b>.",
];

for (const ps of testStatements) {
  const nums = (ps.match(/<b>([^<]+)<\/b>/g) || []).map(s => s.replace(/<\/?b>/g, '').trim());
  console.log('Bold values:', nums);
  
  // Regex-based extraction
  const hs = ps.match(/top score of <b>([^<]+)<\/b>/)?.[1];
  const avg = ps.match(/average of <b>([^<]+)<\/b>/)?.[1];
  const sr = ps.match(/strike rate of <b>([^<]+)<\/b>/)?.[1];
  const sixesRaw = ps.match(/<b>(\d+) sixes<\/b>/)?.[1];
  const foursRaw = ps.match(/<b>(\d+) fours<\/b>/)?.[1];
  const overs = ps.match(/bowled <b>([^<]+)<\/b> overs/)?.[1];
  const wickets = ps.match(/taking <b>(\d+)<\/b> wickets/)?.[1];
  const econ = ps.match(/economy rate of <b>([^<]+)<\/b>/)?.[1];
  
  console.log({ hs, avg, sr, sixes: sixesRaw, fours: foursRaw, overs, wickets, econ });
  console.log('---');
}
