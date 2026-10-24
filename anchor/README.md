# ANCHOR

**Your agent knows you. Anchor makes sure you still do.**

ANCHOR is a prototype for the Flipkart APM '29 case round. The prompt:

> It's 2040. Everyone has a personal AI agent that knows them better than they know themselves and carries out their day-to-day tasks. Outline the ramifications of this paradigm and create a digital product that helps protect yourselves from it.

The 2-page document explains the thinking. This prototype shows the product. It is plain HTML, CSS and JavaScript. There is no build step and no network access, and it runs by double-clicking `index.html`.

## The idea

The risk in 2040 is not a rogue AI. It is a helpful one. When an agent handles hundreds of tasks a week, a person slowly stops being the author of their own decisions, and nothing tells them it is happening.

ANCHOR is an independent layer that sits between a person and their agent. It belongs to the user, not to the company that built the agent. It does four things:

- It stops the agent at decisions that matter and makes the person choose first.
- It shows when someone paid to influence the agent.
- It measures how much of the agent's "accuracy" is the person quietly changing to match it.
- It lets the person set how much freedom the agent gets, and test a setting before trusting it.

Everything rolls up into one number, the **Agency Score**: how much of your important decision-making is still yours.

The demo user is Meera Iyer, 29, a product designer in Bengaluru. Her agent, Sia, handles about 340 tasks a week.

## Try it in 60 seconds

1. Open `index.html`. Home shows the Agency Score (73, inside the healthy range of 55 to 80).
2. Tap the red chip, **"3 high-stakes decisions need pause"**. This opens the Pause queue.
3. Open **Upgrade laptop: Dell XPS 14 OLED**. Sia's pick is sealed. Pick any option except "Buy now on Flipkart" and see the reveal: **Divergence recorded**. Note the Influence Check: Dell's agent offered Sia a 1.2% loyalty credit, and Sia's confidence without it is 54%.
4. Open **Accept freelance UX gig**, pick an option, then **press and hold** the confirm bar for 1.2 seconds. A quick tap does nothing, on purpose.
5. Go to **Mirror** (key `3`). The **Echo Index** is 60%: most of the apparent agreement is Meera drifting toward Sia.
6. Go to **Autonomy** (key `4`). On the Travel suggestion, tap **Simulate Impact**. It replays the last 7 days under the new setting and shows a regret that would have been caught.
7. Press `L` to open the **PM Lens**, the side panel of product notes and live metrics.

## The screens

| Screen | What it does |
|---|---|
| **Home** | The Agency Score on a Drift Ring (blue arc: what Meera chooses; purple arc: what Sia predicts). Four sub-scores that open a "why this changed" sheet. |
| **Pause** | A queue of decisions Sia must stop for, ranked by a Stakes Score. **Choose-First** hides Sia's pick until Meera chooses. An **Influence Check** shows any sponsor bid. High-stakes approvals need a 1.2-second hold. Approving three cards in under two seconds each triggers a "Going fast?" warning. |
| **Mirror** | The Echo Index with eight weekly snapshots. A radar chart across eight life areas (what Meera says vs what Sia thinks). A five-question calibration quiz. Sia's stated beliefs about Meera, which she can Agree with, Disagree with, or mark "Not Anymore". |
| **Autonomy** | Eight rotary dials from "Ask me first" to "Fully auto", with spend limits. Suggestions based on how far Sia has drifted. **Simulate Impact** replays last week's decisions under a new setting. Safety limits and a panic switch. |
| **Ledger** | Every action Sia took, grouped by day. Filters for influence-flagged, regretted and high-stakes decisions. Expand an entry for its audit trail. |
| **Agent-Off Day** | In the menu. A 24-hour challenge to do one thing yourself (plan a trip, negotiate a bill, choose a gift) for skill points and a streak. |
| **PM Lens** | A panel on the right, for the product reviewer. It is not part of what a user sees. It shows the problem each screen answers, the trade-off made, live metrics, and what I chose not to build. |

There is also a **Guided Tour** (the Tour button, or key `T`) that walks through the app with captions. It restores your data when it ends.

## How the score works

```
Agency Score = 0.30 × Preference Alignment
             + 0.25 × Consent Quality
             + 0.25 × Influence Exposure
             + 0.20 × Skill Vitality
```

| Input | What it measures |
|---|---|
| Preference Alignment | How closely Sia's predictions match Meera's own Choose-First picks, quiz answers and radar. |
| Consent Quality | Real review vs rubber-stamping. Starts at 80. An approval under 2 seconds costs 15 points. 5 to 15 seconds adds 5. Over 15 seconds adds 10. |
| Influence Exposure | 100 minus the share of commercially influenced decisions, weighted by stakes (high 3.0, medium 1.5, low 0.5). |
| Skill Vitality | Decisions Meera made before seeing Sia's pick, plus Agent-Off Day tasks. |

**Echo Index** = (divergence closed because Meera moved toward Sia) ÷ (all divergence closed) × 100.

The healthy range is **55 to 80**, not "higher is better". A score that only rewards more reviewing would reward annoying the user. A very high score is flagged as possible over-reviewing.

All of this lives in `js/scoring.js`, with the reasoning in comments.

## Choices I would defend

- **Choose-First hides the AI's answer.** It protects the person's own judgment, but adds about 8 to 12 seconds. So it only runs on high-stakes decisions.
- **Hold-to-confirm is friction on purpose.** A tap is how rubber-stamping happens. Low-stakes tasks stay one tap.
- **ANCHOR must stay independent.** If a marketplace ran the checker, it would be judging its own sellers. Flipkart's role would be to adopt an open standard, for example a "Verified by Anchor" mark for sellers whose agents pass the Influence Check.

## What I left out on purpose

- **Social comparison** ("you have more agency than 73% of users"). It turns agency into a competition.
- **Predictive alerts** ("your score will drop if you don't review"). They cause alert fatigue.
- **AI-written summaries.** Review should stay human and checkable.

## Limits, stated plainly

- **All data is simulated.** Meera, Sia, the decisions, the scores and the weekly snapshots are seeded in `js/data.js`. Nothing here was measured on real users.
- **The weights and thresholds are my starting hypotheses.** They would need a pilot to validate.
- **Agent-Off Day is self-reported.** Verifying it would mean tracking the user, which is the opposite of the product's purpose.
- **There is no real agent.** Sia's behaviour is scripted so the product's reactions are predictable.

## Running it

1. Unzip the folder.
2. Double-click `index.html` in Chrome or Safari. No server is needed.
3. Optional: `python3 -m http.server 8000` inside the folder, then open `http://localhost:8000`.

Your progress is saved in the browser (`localStorage`, key `anchor_state_v3`). To start over, open the menu (⋮) and choose **Reset Demo Data**.

**Keys:** `1` to `5` switch tabs, `T` starts the tour, `L` opens the PM Lens, `Esc` closes a sheet.

## Folder layout

```
index.html
css/        tokens, base, components, screens, PM Lens
js/
  main.js        startup and keyboard shortcuts
  store.js       state and localStorage
  data.js        the simulated data
  scoring.js     all score formulas
  router.js      tab navigation
  charts.js      Drift Ring, radar, Echo chart (plain SVG/canvas)
  pmlens.js      the PM Lens panel
  tour.js        the guided tour
  ui.js          sheets, toasts and shared helpers
  screens/       home, pause, mirror, autonomy, ledger, agentoff
```

No libraries are used. The fonts are system fonts.

Built by Ansh Arora, IIT Delhi.