# Akshat Parashar — Portfolio Client

A game-client style portfolio inspired by the VALORANT client UI. Plain HTML/CSS/JS: no build step and no frameworks.

## Run locally
```bash
cd akshat-valorant
python -m http.server 5500
```
Then open http://localhost:5500. You can also drag the folder into Vercel or Netlify as a static site.

## Make it yours
Almost all the content is in **`js/data.js`**: your details, links, experience, education, projects, skills (with self-rated mastery 1–5), store services, Night Market facts and inbox messages.

| Screen (tab) | What it shows |
|---|---|
| Preloader | Splash with a loading bar and a "click to start" gate that turns on sound |
| PLAY / Lobby | Player card, party slots (invite = contact), resume, FIND MATCH (a queue, then agent select, then contact) |
| Progression | Career Pass tiers (your jobs), daily loop, current grind, education objectives |
| Agents | Skills roster by role, with an info / used-in / mastery view for each skill |
| Career | Match history (work and education), agent mastery, CGPA "rank" |
| About | Bio, a live Jaipur clock in "Next Up", partnered teams |
| Premier | How I work (hub), Awards (certs), Crest |
| Collection | Projects as a weapon loadout. Click one to inspect |
| Store | Hire me / services |
| Night.Market | Flip cards with fun facts |

Keyboard: `1`–`8` switch tabs, `P` opens the lobby, `M` opens the inbox, `Esc` opens the menu. Sound, background FX, the crosshair cursor and its colour can all be changed under Menu → Settings.

Project screenshots live in `assets/img/`. Replace them with the same file names, or update the paths in `data.js`.

Fan-made. Not affiliated with or endorsed by Riot Games.
