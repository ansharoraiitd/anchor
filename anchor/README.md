# ANCHOR — "Your agent knows you. Anchor makes sure you still do."

> **Case Submission**: Flipkart Associate Product Manager Role (2040 Vision)  
> **Prompt**: *"It's 2040. Everyone has a personal AI agent that knows them better than they know themselves and carries out their day-to-day tasks. Outline the ramifications and create a digital product that helps protect yourselves from it."*

---

## ⚡ Try This in 60 Seconds (Reviewer Quick-Flow)

1. **Launch**: Double-click `index.html` in any web browser.
2. **HUD Dashboard**: Notice the glowing **Drift Ring** (73 Agency Score — inside the 55–80 healthy band) and the 7-week scrubber. Hover or tap scrubber dots to inspect past weeks.
3. **Primary Action**: Tap the central action chip: **"6 decisions need pause →"** to jump into the Pause queue.
4. **Choose-First & Hold-to-Confirm**:
   - Open the **₹74,999 Dell XPS laptop** card.
   - Notice Sia's recommendation is **sealed behind a locked glowing card**.
   - Pick **any option except "Buy now"** → watch the card unseal with a divergence reveal.
   - Notice the **Influence Check**: Sia's unbiased confidence without Dell's 1.2% loyalty incentive was only 54%.
   - Experience **Hold-to-Confirm**: Press and hold the approval button for 1.2s to physically register considered consent.
5. **The Echo Index**: Tap **Mirror** (or press keyboard key `3`):
   - Inspect the **Echo Index (60%)**: *"Part of the gap closed because you changed, not because Sia learned."*
   - Toggle the 8-domain radar between **Overlay**, **You Say**, and **Sia Thinks**.
6. **Autonomy & Counterfactual Simulation**: Tap **Autonomy** (key `4`):
   - Turn the rotary knobs to inspect the 4 delegation boundaries.
   - Tap **"Simulate Impact →"** on the Travel suggestion to see the before/after replay catching a real regret flight clash.
7. **PM Lens Drawer**: Press **`L`** (or tap the pulsing right-edge tab) to open the live Metrics Tree, guardrails, and marketplace annotations.

---

## 1. Quick Start

**Zero build step. Zero npm dependencies. Zero external fonts or network calls. Runs directly from `index.html`.**

1. Navigate to the `anchor/` folder.
2. Double-click `index.html` in Chrome, Safari, Edge, or Firefox.
3. *Alternative (local test server)*:
   ```bash
   cd anchor
   python3 -m http.server 8000
   # Open http://localhost:8000 in your browser
   ```
4. **Keyboard Shortcuts**:
   - `1` – Home (Agency Dashboard)
   - `2` – Pause (Stakes Queue)
   - `3` – Mirror (Divergence Lab)
   - `4` – Autonomy (Rotary Dials)
   - `5` – Ledger (Audit Trail)
   - `T` – Play Guided Tour (Instant HUD Walkthrough)
   - `L` – Toggle PM Lens Drawer
   - `Space` – Pause / Resume active tour
   - `← / →` – Prev / Next step in tour
   - `Esc` – Exit tour immediately

---

## 2. Product Overview & Persona Context

By 2040, hyper-capable personal agents carry out hundreds of micro-decisions weekly. For persona **Meera Iyer** (29, product designer in Bengaluru), her agent **Sia** executes **~340 tasks per week**:
- **280 autonomous micro-tasks** (smart grocery refills, utility bill auto-pay, calendar adjustments, commute re-routing).
- **54 reviewed decisions** (flight bookings, hotel shortlists, subscription renewals, messaging drafts).
- **6 high/medium-stakes pause decisions** currently pending human reflection.

### The Core Problem (Ramifications)
1. **Preference Atrophy**: When an agent predicts every desire before you articulate it, you stop forming preferences.
2. **Consent Degradation**: Confirming hundreds of decisions degrades into thoughtless rubber-stamping.
3. **Agent-to-Agent Commercial Nudging**: Sellers' automated agents negotiate with personal agents, offering micro-incentives or loyalty bids that distort recommendations away from genuine user interests.
4. **Skill Decay**: Basic human life skills (budgeting, negotiating, trip planning) atrophy without deliberate exercise.

### The Solution: ANCHOR
Anchor is an **independent, user-owned software layer** positioned between Meera and Sia. It audits drift, enforces human reflection on decisions that matter, inspects commercial incentives, and measures the user's **Agency Score**.

---

## 3. Visual System & Design Direction

The UI is built as a futuristic, dark technical **command deck for your own mind**: sleek, alive, and instantly understandable in 5 seconds.

### Semantic Color Language
- **YOU (Human Steering)**: Electric Blue to Cyan (`#2874F0` to `#19E3FF`) — Used exclusively for human agency, stated choices, and Anchor verification.
- **SIA (Personal AI Agent)**: Violet to Magenta (`#8B5CFF` to `#FF4FD8`) — Used for AI predictions, autonomous schedules, and algorithmic hypotheses.
- **DRIFT GAP (Misalignment)**: Amber / Gold Glow (`#FFC83D`) — Highlights the variance between what Sia predicted and what Meera actually chose.
- **HEALTHY STATUS**: Mint (`#2EF2A0`) — Calibrated equilibrium (55–80% agency).
- **RISK / ALERT**: Coral (`#FF5C6C`) — Flagged commercial distortion, rubber-stamping, and panic states.

### Visual Architecture
- **Ambient Aurora**: Slowly drifting dual-blob aurora (cyan and violet) with a faint 40px HUD grid behind the phone shell.
- **Glowing Phone Frame**: 390×844 mobile frame on desktop with a glowing edge hairline and glassmorphic depth (`backdrop-filter: blur(20px)`).
- **Tabular Monospace HUD Font**: Monospace numbers (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`) for all telemetry readouts, timestamps, and scores.

---

## 4. Key Product Innovations

### 1. The Drift Ring (Home)
Dual-arc canvas HUD gauge. The outer cyan arc represents Meera's steering; the inner violet arc represents Sia's prediction. The shaded amber gap between them visualizes drift. Surrounded by 40 radial tick marks and an interactive 7-week history scrubber.

### 2. Agency Score & Healthy Band (55–80%)
$$\text{Agency Score} = 0.30 \cdot \text{PA} + 0.25 \cdot \text{CQ} + 0.25 \cdot \text{IE} + 0.20 \cdot \text{SV}$$
- **Healthy Band**: 55–80.
- *Pilot Target*: Test whether keeping users in the 55–80 healthy band reduces self-reported decision regret compared to unmonitored delegation, without triggering review fatigue.
- *Over-Review Signal*: An Agency Score >80 or manual intervention on >65% of low-stakes tasks triggers an "Over-reviewing" warning — reminding Meera that delegating routine tasks is healthy.

### 3. Hold-to-Confirm (Consent with Physical Friction)
For high-stakes decisions (e.g. ₹74,999 laptop or ₹45,000 career gig), Anchor replaces single-tap buttons with a **1.2-second Hold-to-Confirm button**. A glowing progress bar fills during the hold. If released early, it cancels and prompts deliberate focus. Low-stakes tasks remain single-tap.

### 4. Choose-First Mode (Pause)
Hides Sia's recommendation behind a **sealed, glowing card**. Meera picks first from realistic options. Upon selection, the card unseals with match/divergence animations, logging ground-truth preference data into Mirror before anchoring bias can occur.

### 5. The Echo Index (Mirror)
$$\text{Echo Index} = \frac{\text{Divergence closed by Meera moving toward Sia}}{\text{Total divergence closed}} \times 100$$
*"Part of the gap closed because you changed, not because Sia learned."* 8 weeks of historical snapshots show whether alignment came from AI intelligence or human conformity.

### 6. Rotary Delegation Dials & 7-Day Replay Simulation (Autonomy)
Replaces generic sliders with 4-position rotary knobs (*Ask me first, Suggest & wait, Act & tell me, Fully auto*). The **"Simulate Setting"** modal replays the past 7 days of ledger items, demonstrating counterfactual proof: e.g. switching Travel to "Ask me first" prevented an unwanted Pune trip reschedule that clashed with Meera's design review.

### 7. Hotspot Educational Pins
Interactive pulsing `?` pins situated on signature mechanics (Drift Ring, Choose-First, Echo Index, Simulation). Clicking any hotspot slides open the PM Lens drawer with targeted product design annotations.

### 8. Interactive Guided Tour System
Activated via the header **"Tour"** button, the top-right menu (`...` → "Play Guided Tour"), or pressing **`T`**:
- **Fast Activation (under 150ms)**: Starts almost instantly; lights up the phone frame with a cyan edge glow and activates the top **`● TOUR MODE`** pill with step tracking.
- **Tab-by-Tab & Option-by-Option Educational Cards**: Explains *what each tab is*, itemizes *all options and views* available in that screen, and displays a live cue of simulated interactions.
- **Target Spotlight Halos**: Dynamically frames focused UI elements (e.g. Drift Ring, Choose-First card, Echo Index, counterfactual simulator).
- **Full Tactile Control**: Reviewers can pause auto-advance, step backward/forward at their own pace via `[◀ Back]`, `[⏸ Pause]`, `[Next ▶]` or keyboard arrows.
- **Tour Mode Completed Modal**: Upon finishing, displays a 5-subsystem recap with quick actions to *Explore Freely*, *Replay Tour*, *Reset Demo Data*, or *Open PM Lens*.

---

## 5. The Flipkart Marketplace Lens

1. **Agent-to-Agent Commerce Trust**: When automated buyer agents transact with seller agents, buyers fear covert kickbacks. Anchor's **Influence Check** exposes commercial bids (e.g. Dell's 1.2% loyalty incentive dropping Sia's neutral confidence from 89% to 54%).
2. **"Verified by Anchor" Seller Trust Badge**: Sellers whose agents do not offer predatory side-incentives gain a trust badge, leading to higher conversion and fewer dispute escalations.
3. **Regret Returns Reduction**: By enforcing Choose-First on high-ticket Flipkart orders, Flipkart reduces impulse agent buys and costly reverse logistics.
4. **Targeting Intelligence from Dials**: When Meera sets a category to "Suggest & wait", Flipkart knows she is in an active consideration phase and presents in-depth comparison material rather than premature 1-click checkout prompts.

---

## 6. Architecture & File Structure

```
anchor/
├── index.html              # Shell loading dark command-deck assets in order
├── README.md               # Product documentation & engineering specification
├── css/
│   ├── tokens.css          # Semantic dark palette, typography & glow shadows
│   ├── base.css            # Ambient aurora, phone frame & sliding tab bar
│   ├── components.css      # Hold-to-confirm, rotary knobs & hotspot pins
│   ├── screens.css         # Screen-specific HUD layouts & progressive disclosure
│   └── pmlens.css          # PM Lens glass drawer & live metrics tree
└── js/
    ├── store.js            # Reactive localStorage store (v3 schema)
    ├── data.js             # Realistic 2040 Bangalore seed data for Meera & Sia
    ├── scoring.js          # Ground-truth formulas & over-review signal
    ├── ui.js               # Shared glass bottom-sheets, HUD toasts, formatters
    ├── charts.js           # Vanilla SVG/Canvas: Drift Ring, Radar, Echo Timeline
    ├── pmlens.js           # Live metrics updates & hotspot spotlight controller
    ├── tour.js             # Scripted guided walkthrough with glowing cursor trail
    ├── router.js           # Hash routing & sliding glow pill indicator
    ├── screens/
    │   ├── home.js         # HUD Dashboard, orbit chips & week scrubber
    │   ├── pause.js        # Pause queue, sealed choose-first & hold-to-confirm
    │   ├── mirror.js       # Echo Index, 8-domain radar & calibration quiz
    │   ├── autonomy.js     # Rotary knobs & before/after animated replay
    │   ├── ledger.js       # Glowing spine timeline, search & regret marks
    │   └── agentoff.js     # 24h manual mode challenge & streak progression
    └── main.js             # Bootstrapper, keyboard shortcuts (1-5, T, L) & menu
```

---

## 7. Trade-offs and Simplifications

1. **Vanilla SVG/Canvas instead of Charting Libraries**:
   - *Trade-off*: Avoided libraries (like Chart.js or D3) to maintain strict zero-dependency portability from `file://`. Radar and arc tweens are hand-crafted.
2. **Simulated Delays & Latency**:
   - *Trade-off*: To feel like a live cloud product, confirmation toasts and unlocks run on realistic $200\text{--}400\,\text{ms}$ transitions.
3. **Self-Reported Agent-Off Day Verification**:
   - *Trade-off*: Real verification would require OS-level application tracking or biometric proof. A lightweight manual checklist was chosen to avoid creating a surveillance tool inside a product built for autonomy.
4. **Simulated Cursor in Guided Tour**:
   - *Trade-off*: Implemented via an absolutely positioned DOM element for seamless screen recording without OS cursor jitter.
