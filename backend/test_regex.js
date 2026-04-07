function parseStatement(ps) {
  if (!ps) return {};
  const num = (regex) => {
    const m = ps.match(regex);
    return m ? parseFloat(m[1]) : 0;
  };
  return {
    innings: num(/With (\d+) turns at the crease/),
    high_score: num(/top score of <b>([^<]+)<\/b>/),
    batting_average: num(/average of <b>([^<]+)<\/b>/),
    strike_rate: num(/strike rate of <b>([^<]+)<\/b>/),
  };
}

const statement = `A complete player, Bruce Wayne has made a big mark in cricket. With 32 turns at the crease, they've hit a top score of <b>38</b>, with an average of <b>15.70</b> and a quick strike rate of <b>82.49</b>.</br></br>
Equally good at bowling, they've bowled <b>77.1</b> overs, taking <b>44</b> wickets at an economy rate of <b>4.79</b>. Despite a few wides, their accuracy is top-notch, making them a key player for their team.`;

console.log(parseStatement(statement));
