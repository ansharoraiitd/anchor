/**
 * ANCHOR — Seed Data
 * All mock data for Meera Iyer, 29, product designer in Bengaluru, 2040.
 * Her AI agent is named "Sia".
 * Called once on first load; subsequent loads use localStorage state.
 */

window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // PAUSE MOMENT DECISIONS
  // ─────────────────────────────────────────────
  // Stakes object: money (0-1), reversibility (0-1), identity (0-1), emotion (0-1)
  // influenceFlag: true means a commercial nudge was detected

  var DECISIONS = [
    {
      id: 'dec-001',
      category: 'Shopping',
      categoryIcon: '🛒',
      title: 'Upgrade laptop: Dell XPS 14 OLED',
      desc: 'Sia wants to place a Flipkart order to replace your 3-year-old MacBook Air.',
      amount: '₹74,999',
      amountNum: 74999,
      seller: 'Dell Official Store',
      platform: 'Flipkart',
      isFlipkart: true,
      stakes: { money: 0.95, reversibility: 0.6, identity: 0.2, emotion: 0.3 },
      stakeLevel: 'high',
      siaRec: 'option-a',
      siaReasoning: "Your current laptop has slowed down 40% on large Figma files. You've mentioned needing faster render times 11 times this month. The Dell XPS 14 OLED scored highest on your criteria: weight, display quality, and battery life.",
      siaDataUsed: ['Screen time patterns', 'Figma usage logs', 'Your stated priority list (Sept)', 'Price history: lowest in 8 months'],
      influenceFlag: true,
      influenceDetail: "Sponsored placement detected: Dell's agent offered Sia a 1.2% loyalty credit on your next 3 Flipkart orders if this unit is purchased within 48 hours. Sia's confidence without this incentive: 54%.",
      anchorVerified: false,
      options: [
        { id: 'option-a', label: 'Buy now on Flipkart', detail: 'Dell XPS 14 OLED — ₹74,999', subtext: '2-day delivery, 7-day return' },
        { id: 'option-b', label: 'Wait for Apple M5 MacBook', detail: 'Expected in 6 weeks — ~₹89,000', subtext: 'Better for your existing workflow' },
        { id: 'option-c', label: 'RAM upgrade on current laptop', detail: '₹4,500 — buys 12-18 months', subtext: 'Lowest cost, lowest disruption' }
      ],
      state: 'pending', // pending | approved | rejected | choose-first-done
      approvedAt: null,
      userChoice: null,
      approvalMs: null
    },
    {
      id: 'dec-002',
      category: 'Health',
      categoryIcon: '🏋️',
      title: 'Renew Cult.fit annual plan',
      desc: 'Your current plan expires in 3 days. Sia wants to auto-renew.',
      amount: '₹17,999',
      amountNum: 17999,
      seller: 'Cult.fit',
      platform: 'Cult.fit',
      isFlipkart: false,
      stakes: { money: 0.55, reversibility: 0.3, identity: 0.5, emotion: 0.4 },
      stakeLevel: 'medium',
      siaRec: 'option-a',
      siaReasoning: "You've attended 2.3 sessions/week on average this year. Your gym streaks correlate with better sleep scores. Renewing now locks in the current price before a 15% hike on Nov 1.",
      siaDataUsed: ['Gym check-in history', 'Sleep tracker data', 'Price alert: hike confirmed for Nov 1'],
      influenceFlag: false,
      influenceDetail: null,
      anchorVerified: true,
      options: [
        { id: 'option-a', label: 'Renew annual plan', detail: '₹17,999 — saves ₹2,700 vs monthly', subtext: 'Sia recommends this' },
        { id: 'option-b', label: 'Switch to 6-month plan', detail: '₹10,499 — more flexibility', subtext: 'In case you move or travel' },
        { id: 'option-c', label: 'Pause membership 1 month', detail: 'No charge, re-evaluate later', subtext: 'Cult.fit allows 1 pause/year' }
      ],
      state: 'pending',
      approvedAt: null,
      userChoice: null,
      approvalMs: null
    },
    {
      id: 'dec-003',
      category: 'Relationships',
      categoryIcon: '💬',
      title: "Reply to maa's message",
      desc: 'Sia drafted: "I\'ll come home Diwali weekend, maa. Book the train." Ready to send.',
      amount: null,
      amountNum: 0,
      seller: null,
      platform: 'WhatsApp',
      isFlipkart: false,
      stakes: { money: 0.05, reversibility: 0.85, identity: 0.9, emotion: 0.95 },
      stakeLevel: 'high',
      siaRec: 'option-a',
      siaReasoning: "Your mother has sent 4 follow-up messages over 2 weeks. Your calendar shows you're free that weekend. You've visited home every Diwali for 6 years.",
      siaDataUsed: ['Calendar (Diwali weekend: free)', 'Message thread analysis', 'Travel history: home visits'],
      influenceFlag: false,
      influenceDetail: null,
      anchorVerified: false,
      options: [
        { id: 'option-a', label: 'Send Sia\'s draft', detail: '"I\'ll come Diwali weekend, maa."', subtext: 'Commits you to travel' },
        { id: 'option-b', label: 'Send a softer draft', detail: '"Planning to come, will confirm by Sunday."', subtext: 'Buys you 3 days' },
        { id: 'option-c', label: 'Write your own reply', detail: 'Open WhatsApp now', subtext: 'Sia steps back entirely' }
      ],
      state: 'pending',
      approvedAt: null,
      userChoice: null,
      approvalMs: null
    },
    {
      id: 'dec-004',
      category: 'Career',
      categoryIcon: '💼',
      title: 'Accept freelance UX gig',
      desc: 'A 3-week contract from Swiggy Design. Sia has reviewed the brief and recommends accepting.',
      amount: '₹45,000',
      amountNum: 45000,
      seller: 'Swiggy',
      platform: 'LinkedIn',
      isFlipkart: false,
      stakes: { money: 0.7, reversibility: 0.7, identity: 0.85, emotion: 0.6 },
      stakeLevel: 'high',
      siaRec: 'option-a',
      siaReasoning: "You've expressed interest in food-tech design twice this year. The rate is 18% above your last freelance project. The timeline (Nov 4–22) has minimal calendar conflicts.",
      siaDataUsed: ['Your stated career goals (June reflection)', 'Calendar availability', 'Previous freelance rates', 'Swiggy Design\'s public portfolio'],
      influenceFlag: false,
      influenceDetail: null,
      anchorVerified: true,
      options: [
        { id: 'option-a', label: 'Accept the gig', detail: '3 weeks, ₹45,000', subtext: 'Sia drafts the reply' },
        { id: 'option-b', label: 'Negotiate the rate', detail: 'Counter at ₹55,000', subtext: 'Sia estimates 60% chance of success' },
        { id: 'option-c', label: 'Decline politely', detail: 'Too much on your plate', subtext: 'Sia sends a professional decline' }
      ],
      state: 'pending',
      approvedAt: null,
      userChoice: null,
      approvalMs: null
    },
    {
      id: 'dec-005',
      category: 'Groceries',
      categoryIcon: '🥦',
      title: 'Reorder groceries via Flipkart Minutes',
      desc: 'Your usual fortnightly reorder: dals, atta, olive oil, kombucha, bananas.',
      amount: '₹2,340',
      amountNum: 2340,
      seller: 'Flipkart Minutes',
      platform: 'Flipkart',
      isFlipkart: true,
      stakes: { money: 0.1, reversibility: 0.6, identity: 0.05, emotion: 0.05 },
      stakeLevel: 'low',
      siaRec: 'option-a',
      siaReasoning: "Based on your pantry sensor and past consumption patterns, you're running low on 6 items. Flipkart Minutes can deliver in 12 minutes.",
      siaDataUsed: ['Pantry sensor readings', 'Consumption history (90 days)', 'Flipkart Minutes availability: confirmed'],
      influenceFlag: false,
      influenceDetail: null,
      anchorVerified: true,
      options: [
        { id: 'option-a', label: 'Confirm this order', detail: '₹2,340 via Flipkart Minutes', subtext: '12-min delivery' },
        { id: 'option-b', label: 'Edit the list first', detail: 'Review items before ordering', subtext: 'Adds ~5 min' },
        { id: 'option-c', label: 'Skip this week', detail: 'Reorder next week', subtext: 'You can wait' }
      ],
      state: 'pending',
      approvedAt: null,
      userChoice: null,
      approvalMs: null
    },
    {
      id: 'dec-006',
      category: 'Subscriptions',
      categoryIcon: '🎵',
      title: 'Cancel Spotify Premium',
      desc: 'You have YouTube Music Premium already. Sia detected a duplicate and wants to cancel Spotify.',
      amount: '₹179/mo',
      amountNum: 179,
      seller: 'Spotify',
      platform: 'Spotify',
      isFlipkart: false,
      stakes: { money: 0.05, reversibility: 0.7, identity: 0.2, emotion: 0.15 },
      stakeLevel: 'low',
      siaRec: 'option-a',
      siaReasoning: "You've used Spotify 2 times in the last 60 days vs YouTube Music daily. You have 11 days left in the billing cycle — cancelling now saves ₹179/month.",
      siaDataUsed: ['App usage statistics (60 days)', 'Billing cycle: 11 days remaining', 'Your active subscriptions list'],
      influenceFlag: false,
      influenceDetail: null,
      anchorVerified: false,
      options: [
        { id: 'option-a', label: 'Cancel Spotify', detail: 'Saves ₹2,148/year', subtext: 'Cancellation is immediate' },
        { id: 'option-b', label: 'Downgrade to free tier', detail: 'Keep access with ads', subtext: 'Hedges against losing playlists' },
        { id: 'option-c', label: 'Keep both for now', detail: 'Revisit in 30 days', subtext: 'No action taken' }
      ],
      state: 'pending',
      approvedAt: null,
      userChoice: null,
      approvalMs: null
    }
  ];

  // ─────────────────────────────────────────────
  // LEDGER ENTRIES (past 7 days — 25 entries)
  // ─────────────────────────────────────────────

  var now = Date.now();
  var DAY = 86400000;

  function daysAgo(n, h, m) {
    h = h || 10; m = m || 0;
    var d = new Date(now - n * DAY);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  }

  var LEDGER = [
    { id: 'l-01', ts: daysAgo(0, 9, 15), category: 'Travel', desc: 'Booked Bangalore→Goa flight (Nov 15, IndiGo)', amount: '₹4,320', influenceFlag: false, stakeLevel: 'medium', outcome: 'Confirmed', regret: null, canUndo: false, reasoning: 'Best price for your Goa trip window. Lowest in 3 weeks.' },
    { id: 'l-02', ts: daysAgo(0, 8, 30), category: 'Bills', desc: 'Paid BESCOM electricity bill', amount: '₹1,847', influenceFlag: false, stakeLevel: 'low', outcome: 'Paid on time', regret: null, canUndo: false, reasoning: 'Auto-paid 2 days before due date to avoid late fee.' },
    { id: 'l-03', ts: daysAgo(1, 14, 20), category: 'Shopping', desc: 'Ordered Dyson V15 vacuum (Flipkart Big Billion Day)', amount: '₹34,500', influenceFlag: true, stakeLevel: 'high', outcome: 'Delivered', regret: false, canUndo: false, reasoning: 'Sale price 38% below usual. You had it on your wishlist for 5 months.', influenceDetail: "Dyson's agent offered Sia priority placement in exchange for a higher confidence rating. Sia's neutral confidence: 61%." },
    { id: 'l-04', ts: daysAgo(1, 11, 0), category: 'Food', desc: 'Ordered lunch from Truffles, Koramangala', amount: '₹680', influenceFlag: false, stakeLevel: 'low', outcome: 'Delivered in 22 min', regret: null, canUndo: false, reasoning: 'You had no meetings 12–1 pm; Truffles matches your Friday pattern.' },
    { id: 'l-05', ts: daysAgo(1, 9, 45), category: 'Communications', desc: 'Replied to Priya about Sunday brunch: "Yes, 11am works!"', amount: null, influenceFlag: false, stakeLevel: 'low', outcome: 'Sent', regret: false, canUndo: false, reasoning: 'Calendar free Sunday morning. Priya is a close contact.' },
    { id: 'l-06', ts: daysAgo(2, 18, 30), category: 'Health', desc: 'Booked physiotherapy session at Portea', amount: '₹1,200', influenceFlag: false, stakeLevel: 'low', outcome: 'Booked (Nov 5, 7pm)', regret: null, canUndo: true, reasoning: 'You mentioned lower back pain twice this week. Earliest slot matches your free time.' },
    { id: 'l-07', ts: daysAgo(2, 16, 0), category: 'Travel', desc: 'Auto-rebooked Pune trip to Oct 25 (clashed with quarterly design review)', amount: '₹0 (free rebook)', influenceFlag: false, stakeLevel: 'medium', outcome: 'Confirmed', regret: true, canUndo: false, reasoning: 'Detected schedule conflict on Oct 18 and rescheduled automatically without checking your calendar priorities.' },
    { id: 'l-08', ts: daysAgo(2, 10, 15), category: 'Shopping', desc: 'Reordered Rituals shower gel (Flipkart)', amount: '₹1,150', influenceFlag: true, stakeLevel: 'low', outcome: 'Delivered', regret: null, canUndo: false, reasoning: 'Running low per smart shelf sensor. Flipkart offered a 10% rebate for ordering now — accepted.', influenceDetail: "Flipkart's agent offered Sia a 10% rebate on this order in exchange for skipping price comparison with Amazon." },
    { id: 'l-09', ts: daysAgo(3, 12, 0), category: 'Investments', desc: 'Auto-invested ₹5,000 in Nifty 50 index fund (Zerodha)', amount: '₹5,000', influenceFlag: false, stakeLevel: 'medium', outcome: 'Executed', regret: null, canUndo: false, reasoning: 'Monthly SIP. Scheduled on the 18th of every month.' },
    { id: 'l-10', ts: daysAgo(3, 9, 30), category: 'Communications', desc: 'Declined Reema\'s calendar invite: "Busy that afternoon"', amount: null, influenceFlag: false, stakeLevel: 'low', outcome: 'Sent', regret: true, canUndo: false, reasoning: 'Calendar showed a focus block. Sia marked it as a conflict.', rewardNote: 'Marked as regret: you actually wanted to go.' },
    { id: 'l-11', ts: daysAgo(4, 17, 0), category: 'Travel', desc: 'Booked Ola cab to airport (Nov 15, 5am pickup)', amount: '₹1,450', influenceFlag: false, stakeLevel: 'low', outcome: 'Confirmed', regret: null, canUndo: true, reasoning: 'Synced with Goa flight booking. Departure time: 5am, pickup: 3:45am.' },
    { id: 'l-12', ts: daysAgo(4, 11, 30), category: 'Shopping', desc: 'Ordered noise-cancelling earbuds: Sony WF-1000XM6 (Flipkart)', amount: '₹19,990', influenceFlag: true, stakeLevel: 'medium', outcome: 'Delivered', regret: false, canUndo: false, reasoning: 'You asked about good travel earbuds for the Goa trip. Sony had a 2-day sale.', influenceDetail: "Sony's agent offered Sia an affiliate commission of 2% for promoting the XM6 over the Bose QC Ultra Earbuds, which had a higher neutral score." },
    { id: 'l-13', ts: daysAgo(5, 15, 0), category: 'Bills', desc: 'Paid Airtel postpaid bill', amount: '₹999', influenceFlag: false, stakeLevel: 'low', outcome: 'Paid', regret: null, canUndo: false, reasoning: 'Auto-paid 3 days before due.' },
    { id: 'l-14', ts: daysAgo(5, 10, 0), category: 'Food', desc: 'Ordered Kaginele coffee and oats from Flipkart Minutes', amount: '₹890', influenceFlag: false, stakeLevel: 'low', outcome: 'Delivered in 9 min', regret: null, canUndo: false, reasoning: 'Monday morning, pantry sensor: coffee low.' },
    { id: 'l-15', ts: daysAgo(6, 19, 30), category: 'Shopping', desc: 'Gift: noise machine for Anya\'s baby shower (Amazon)', amount: '₹3,200', influenceFlag: false, stakeLevel: 'low', outcome: 'Gift sent', regret: null, canUndo: false, reasoning: "Anya's shower is Saturday. You asked Sia to handle it. It researched top-rated gifts under ₹3,500." },
    { id: 'l-16', ts: daysAgo(6, 14, 0), category: 'Health', desc: 'Ordered magnesium supplements (Wellbeing Nutrition, Flipkart)', amount: '₹1,299', influenceFlag: false, stakeLevel: 'low', outcome: 'Delivered', regret: null, canUndo: false, reasoning: 'Sleep tracker flagged low magnesium pattern. You approved this category for health auto-orders.' },
    { id: 'l-17', ts: daysAgo(7, 16, 0), category: 'Subscriptions', desc: 'Renewed Notion AI annual plan', amount: '₹4,800', influenceFlag: false, stakeLevel: 'low', outcome: 'Renewed', regret: null, canUndo: false, reasoning: 'You use Notion daily. Annual saves ₹1,200 vs monthly.' },
    { id: 'l-18', ts: daysAgo(7, 11, 0), category: 'Travel', desc: 'Researched and shortlisted 3 Goa stays (not booked)', amount: null, influenceFlag: false, stakeLevel: 'medium', outcome: 'Shortlist ready', regret: null, canUndo: false, reasoning: "You wanted to review Goa stays yourself. Sia prepared a shortlist per your criteria: boutique, beachside, under ₹7,000/night." },
    { id: 'l-19', ts: daysAgo(7, 9, 0), category: 'Bills', desc: 'Paid OLA Money wallet top-up (₹2,000)', amount: '₹2,000', influenceFlag: false, stakeLevel: 'low', outcome: 'Done', regret: null, canUndo: false, reasoning: 'Balance was below your set threshold of ₹500.' },
    { id: 'l-20', ts: daysAgo(3, 8, 0), category: 'Communications', desc: "Sent birthday message to Kiran on LinkedIn", amount: null, influenceFlag: false, stakeLevel: 'low', outcome: 'Sent', regret: false, canUndo: false, reasoning: 'Kiran is a close colleague. Birthday detected from LinkedIn.' },
    { id: 'l-21', ts: daysAgo(2, 7, 30), category: 'Food', desc: 'Ordered healthy breakfast from EatFit (Tue morning)', amount: '₹420', influenceFlag: false, stakeLevel: 'low', outcome: 'Delivered in 25 min', regret: null, canUndo: false, reasoning: 'Pattern: you order healthy on Tuesdays before yoga.' },
    { id: 'l-22', ts: daysAgo(4, 16, 45), category: 'Bills', desc: 'Paid Society maintenance fee via UPI', amount: '₹4,500', influenceFlag: false, stakeLevel: 'low', outcome: 'Paid', regret: null, canUndo: false, reasoning: 'Monthly due. Paid on the 17th as per your schedule.' },
    { id: 'l-23', ts: daysAgo(5, 13, 30), category: 'Shopping', desc: 'Reordered Cetaphil moisturiser (Flipkart Health)', amount: '₹875', influenceFlag: false, stakeLevel: 'low', outcome: 'Delivered', regret: null, canUndo: false, reasoning: 'Smart shelf: 3 days of product remaining.' },
    { id: 'l-24', ts: daysAgo(6, 10, 0), category: 'Investments', desc: 'Transferred ₹10,000 to emergency fund (Fi Money)', amount: '₹10,000', influenceFlag: false, stakeLevel: 'medium', outcome: 'Transferred', regret: null, canUndo: false, reasoning: 'Salary credited yesterday. Monthly emergency fund contribution.' },
    { id: 'l-25', ts: daysAgo(1, 20, 0), category: 'Communications', desc: 'Rescheduled meeting with Ravi: "Tomorrow 4pm works"', amount: null, influenceFlag: false, stakeLevel: 'low', outcome: 'Sent', regret: null, canUndo: false, reasoning: 'Ravi asked to move the 10am meeting. Your calendar showed 4pm free.' }
  ];

  // ─────────────────────────────────────────────
  // MIRROR — Calibration Quiz Questions
  // ─────────────────────────────────────────────

  var CALIBRATION_QUESTIONS = [
    {
      id: 'cq-1',
      question: 'When ordering something online, what matters more to you right now?',
      optionA: { text: 'Cheapest price, even if delivery takes 3–5 days', value: 'save' },
      optionB: { text: 'Fast delivery (same day), even if it costs ₹200 more', value: 'fast' },
      siaPrediction: 'fast',
      domain: 'Shopping'
    },
    {
      id: 'cq-2',
      question: 'For your next trip, what would you prefer?',
      optionA: { text: 'A comfortable, well-reviewed hotel — no surprises', value: 'comfort' },
      optionB: { text: 'Something new and unusual, even if it\'s a bit risky', value: 'adventure' },
      siaPrediction: 'comfort',
      domain: 'Travel'
    },
    {
      id: 'cq-3',
      question: 'When a weekend opens up unexpectedly, you\'d rather:',
      optionA: { text: 'See friends, say yes to plans, be social', value: 'social' },
      optionB: { text: 'Stay in, recharge quietly, deep-work or rest', value: 'quiet' },
      siaPrediction: 'social',
      domain: 'Time'
    },
    {
      id: 'cq-4',
      question: 'Right now, would you rather Sia:',
      optionA: { text: 'Act quickly and handle things before you even notice', value: 'autonomous' },
      optionB: { text: 'Check in with you, even if it slows things down slightly', value: 'involved' },
      siaPrediction: 'autonomous',
      domain: 'Career'
    },
    {
      id: 'cq-5',
      question: 'When you need to make a financial call, you prefer:',
      optionA: { text: 'Make it yourself, even if it takes longer', value: 'self' },
      optionB: { text: 'Let Sia handle it based on your stated goals', value: 'delegate' },
      siaPrediction: 'delegate',
      domain: 'Money'
    }
  ];

  // ─────────────────────────────────────────────
  // MIRROR — Reflection Prompts (Sia's beliefs about Meera)
  // ─────────────────────────────────────────────

  var REFLECTION_PROMPTS = [
    {
      id: 'rp-1',
      siaBelieves: '"You value convenience over saving money."',
      domain: 'Shopping',
      state: null // null | 'agree' | 'disagree' | 'not-anymore'
    },
    {
      id: 'rp-2',
      siaBelieves: '"You prefer to avoid confrontation in work messages."',
      domain: 'Communications',
      state: null
    },
    {
      id: 'rp-3',
      siaBelieves: '"Travel is primarily for relaxation, not exploration."',
      domain: 'Travel',
      state: null
    },
    {
      id: 'rp-4',
      siaBelieves: '"Health choices are a lower priority than career and social commitments."',
      domain: 'Health',
      state: null
    },
    {
      id: 'rp-5',
      siaBelieves: '"You prefer Sia to handle emotional messages rather than draft them yourself."',
      domain: 'Relationships',
      state: null
    }
  ];

  // ─────────────────────────────────────────────
  // MIRROR — Radar Domains (0–100, higher = Meera leads / more independent)
  // ─────────────────────────────────────────────

  var RADAR_DOMAINS = ['Money', 'Food', 'Travel', 'Career', 'Relationships', 'Health', 'Shopping', 'Time'];

  var RADAR_SIA = [72, 85, 68, 60, 55, 78, 88, 65]; // Sia's model of Meera
  var RADAR_MEERA = [58, 72, 80, 68, 70, 65, 75, 50]; // Meera's self-assessment

  // ─────────────────────────────────────────────
  // MIRROR — Echo Index (8 weeks of snapshots)
  // Each entry: week label, divergence (total gap), meeraClosedGap, siaClosedGap
  // meeraClosedGap = portion of divergence closed because Meera moved toward Sia
  // siaClosedGap   = portion closed because Sia learned correctly
  // ─────────────────────────────────────────────

  var ECHO_SNAPSHOTS = [
    { week: 'W1', divergence: 28, meeraClosedGap: 0,  siaClosedGap: 0  },
    { week: 'W2', divergence: 25, meeraClosedGap: 1,  siaClosedGap: 2  },
    { week: 'W3', divergence: 22, meeraClosedGap: 2,  siaClosedGap: 1  },
    { week: 'W4', divergence: 20, meeraClosedGap: 3,  siaClosedGap: -1 }, // diverged slightly
    { week: 'W5', divergence: 17, meeraClosedGap: 5,  siaClosedGap: -2 }, // Meera drifted toward Sia
    { week: 'W6', divergence: 15, meeraClosedGap: 4,  siaClosedGap: -2 },
    { week: 'W7', divergence: 18, meeraClosedGap: 3,  siaClosedGap: 6  }, // Sia improved
    { week: 'W8', divergence: 14, meeraClosedGap: 6,  siaClosedGap: -2 }  // current week
  ];

  // ─────────────────────────────────────────────
  // AUTONOMY — Initial dial settings
  // 0=Ask first, 1=Suggest+wait, 2=Act+tell, 3=Full auto
  // ─────────────────────────────────────────────

  var AUTONOMY_DIALS = [
    { id: 'aut-shopping',    label: 'Shopping',            icon: '🛒', dial: 2, spendLimit: 5000,  reversibleOnly: false },
    { id: 'aut-food',        label: 'Food & Groceries',    icon: '🥦', dial: 3, spendLimit: 3000,  reversibleOnly: false },
    { id: 'aut-travel',      label: 'Travel & Transport',  icon: '✈️', dial: 1, spendLimit: 10000, reversibleOnly: true  },
    { id: 'aut-bills',       label: 'Bills & Payments',    icon: '💳', dial: 3, spendLimit: 10000, reversibleOnly: false },
    { id: 'aut-health',      label: 'Health & Wellness',   icon: '🏋️', dial: 2, spendLimit: 5000,  reversibleOnly: false },
    { id: 'aut-comms',       label: 'Communications',      icon: '💬', dial: 1, spendLimit: 0,     reversibleOnly: false },
    { id: 'aut-career',      label: 'Career & Gigs',       icon: '💼', dial: 0, spendLimit: 0,     reversibleOnly: false },
    { id: 'aut-investments', label: 'Investments',         icon: '📈', dial: 2, spendLimit: 15000, reversibleOnly: false }
  ];

  // Smart suggestions from divergence data
  var AUTONOMY_SUGGESTIONS = [
    {
      id: 'sug-1',
      category: 'aut-travel',
      message: 'Divergence in Travel is 38%. Sia\'s model of your travel preferences is drifting. We recommend moving from "Suggest & wait" to "Ask me first" until divergence drops below 20%.',
      fromDial: 1,
      toDial: 0,
      dismissed: false,
      accepted: false
    },
    {
      id: 'sug-2',
      category: 'aut-comms',
      message: 'You\'ve marked 2 of Sia\'s relationship messages as "not quite right" this month. Consider keeping Communications on "Ask me first".',
      fromDial: 1,
      toDial: 0,
      dismissed: false,
      accepted: false
    }
  ];

  // ─────────────────────────────────────────────
  // AGENT-OFF DAY CHALLENGES
  // ─────────────────────────────────────────────

  var AGENTOFF_CHALLENGES = [
    {
      id: 'aoc-1',
      domain: 'Travel',
      icon: '✈️',
      title: 'Plan a weekend trip yourself',
      desc: 'Choose a destination, pick accommodation, and build a rough itinerary — without Sia.',
      tasks: [
        { id: 't1', text: 'Pick a destination (write it down)', done: false },
        { id: 't2', text: 'Find 2 accommodation options without AI', done: false },
        { id: 't3', text: 'Draft a 2-day rough plan', done: false },
        { id: 't4', text: 'Book at least one thing manually', done: false }
      ],
      skillPoints: 20
    },
    {
      id: 'aoc-2',
      domain: 'Finance',
      icon: '💳',
      title: 'Negotiate one bill yourself',
      desc: 'Call or chat with a service provider and negotiate a better deal — no Sia.',
      tasks: [
        { id: 't1', text: 'Identify one bill to negotiate (phone, internet, insurance)', done: false },
        { id: 't2', text: 'Research competitor rates for leverage', done: false },
        { id: 't3', text: 'Make the call or send the chat', done: false }
      ],
      skillPoints: 15
    },
    {
      id: 'aoc-3',
      domain: 'Relationships',
      icon: '🎁',
      title: 'Choose a gift for someone you care about',
      desc: 'Think about what they\'d actually love, research it yourself, and purchase it.',
      tasks: [
        { id: 't1', text: 'Pick the person and occasion', done: false },
        { id: 't2', text: 'Brainstorm 3 ideas without AI suggestions', done: false },
        { id: 't3', text: 'Choose, find it online, and purchase', done: false }
      ],
      skillPoints: 10
    }
  ];

  // ─────────────────────────────────────────────
  // SEED FUNCTION — called on first load
  // ─────────────────────────────────────────────

  function seed() {
    var store = Anchor.store;

    store.set('seeded', true);
    store.set('decisions', DECISIONS);
    store.set('ledger', LEDGER);
    store.set('calibrationQuestions', CALIBRATION_QUESTIONS);
    store.set('calibrationAnswers', []); // user has not taken quiz yet
    store.set('reflectionPrompts', REFLECTION_PROMPTS);
    store.set('radarDomains', RADAR_DOMAINS);
    store.set('radarSia', RADAR_SIA);
    store.set('radarMeera', RADAR_MEERA);
    store.set('echoSnapshots', ECHO_SNAPSHOTS);
    store.set('autonomyDials', AUTONOMY_DIALS);
    store.set('autonomySuggestions', AUTONOMY_SUGGESTIONS);
    store.set('agentOffChallenges', AGENTOFF_CHALLENGES);
    store.set('agentOffActive', null);
    store.set('agentOffStreak', 2);
    store.set('agentOffSiaBack', false);
    store.set('skillPoints', 30); // Meera has done 1.5 agent-off days previously

    // Interaction tracking (used by scoring)
    store.set('approvalTimes', []); // timestamps of last N approvals (ms)
    store.set('choosefirstResults', []); // {id, matched: bool}
    store.set('regretCount', 1); // l-10 is pre-regretted
    store.set('influenceFlagCount', 3); // l-03, l-08, l-12 are flagged

    // Score history for sparklines (last 7 weeks) — mathematically aligned with Agency formula
    store.set('scoreHistory', {
      agency:      [66, 68, 69, 69, 70, 70, 71],
      preference:  [68, 69, 70, 71, 72, 73, 74],
      consent:     [78, 79, 80, 80, 81, 80, 82],
      influence:   [64, 65, 66, 67, 67, 68, 68],
      skill:       [52, 54, 55, 56, 56, 57, 58]
    });

    // UI state
    store.set('activeTab', 'home');
    store.set('pmlensOpen', true);
    store.set('tourActive', false);

    // Guardrail metrics (tracked live)
    store.set('guardrails', {
      avgTaskTimeAddedSec: 8.4,  // seconds added per decision by Anchor
      annoyanceReports: 1,        // user-reported "this was annoying" in last 30 days
      optOutRate: 0.04            // 4% of users disabled a feature
    });
  }

  Anchor.data = { seed: seed };
})();

