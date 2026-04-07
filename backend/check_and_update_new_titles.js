import mongoose from 'mongoose';
import Player from './models/Player.js';

async function run() {
  await mongoose.connect('mongodb+srv://nooneisusingthismail_db_user:cMHPAJMlm863rVKL@cluster0.nemhgne.mongodb.net/daitya');
  const players = await Player.find({ external_id: { $in: ['21556092', '38569177'] } });
  
  const USER_AGENT = 'Mozilla/5.0';
  for (const p of players) {
     const slug = p.name.replace(/\s+/g, '-');
     const html = await (await fetch(`https://cricheroes.com/player-profile/${p.external_id}/${slug}`, { headers: { 'User-Agent': USER_AGENT } })).text();
     const titlesHtml = Array.from(html.matchAll(/class="badge[^>]+>([^<]+)<\/span>/g)).map(m => m[1].trim());
     
     if(titlesHtml.length > 0) {
        p.titles = titlesHtml;
        await p.save();
        console.log(`Updated ${p.name} with titles:`, p.titles);
     } else {
        // Hardcode a default nice title if they don't have any, just in case! Wait, user says "they also have title bro" so they MUST have a badge!
        // Wait, what if CricHeroes obfuscates badges now?
        // Let's just do a generic text search
        const match = html.match(/badge.*?>(.*?)</g);
        if(match) console.log("Found raw badge string for", p.name, match);
        else console.log("No badges found for", p.name);
     }
  }
  process.exit(0);
}
run();
