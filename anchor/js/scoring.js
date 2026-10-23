/**
 * ANCHOR — Scoring Engine
 *
 * Computes the Agency Score and its four sub-scores from live interaction data.
 * All weights and penalty values are marked as HYPOTHESES — they should be
 * validated against real user behaviour in a pilot study.
 *
 * North-star metric:
 *   Agency Score = weighted composite of 4 sub-scores
 *   Healthy range: 55–80 (NOT higher-is-better)
 *     < 55: user has lost too much agency — Anchor needs more friction/checkpoints
 *     > 80: user may be over-reviewing — Anchor is adding unnecessary friction
 *
 * FORMULA OVERVIEW
 * ────────────────
 * AgencyScore = 0.30 × PreferenceAlignment
 *             + 0.25 × ConsentQuality
 *             + 0.25 × InfluenceExposure
 *             + 0.20 × SkillVitality
 *
 * All weights: HYPOTHESIS — to be validated in pilot.
 */

window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  var store = null; // set at init

  /**
   * PREFERENCE ALIGNMENT (0–100)
   *
   * Measures how well Sia's model of Meera matches her actual stated preferences.
   *
   * PA = 100 − (avgRadarDivergence × 100) × 0.7
   *         − (calibrationMismatchRate × 100) × 0.3
   *
   * avgRadarDivergence: mean absolute difference across 8 radar domains, normalised to [0,1]
   * calibrationMismatchRate: fraction of quiz answers where Sia's prediction was wrong
   *
   * Weight split (0.7 radar / 0.3 quiz): HYPOTHESIS — quiz is small sample.
   */
  function calcPreferenceAlignment() {
    var sia = store.get('radarSia') || [];
    var meera = store.get('radarMeera') || [];
    var n = Math.min(sia.length, meera.length);
    if (n === 0) return 74; // fallback

    var totalDiff = 0;
    for (var i = 0; i < n; i++) {
      totalDiff += Math.abs(sia[i] - meera[i]);
    }
    var avgDiff = totalDiff / n; // in 0–100 scale
    var radarComponent = Math.max(0, 100 - avgDiff * 1.0); // direct gap

    // Quiz component
    var answers = store.get('calibrationAnswers') || [];
    var questions = store.get('calibrationQuestions') || [];
    var mismatches = 0;
    answers.forEach(function (ans) {
      var q = questions.find(function (q) { return q.id === ans.questionId; });
      if (q && ans.userAnswer !== q.siaPrediction) mismatches++;
    });
    var mismatchRate = answers.length > 0 ? mismatches / answers.length : 0;
    var quizComponent = 100 - mismatchRate * 100;

    var score = radarComponent * 0.7 + quizComponent * 0.3;
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * CONSENT QUALITY (0–100)
   *
   * Measures whether Meera is genuinely reviewing decisions or rubber-stamping.
   * Based on approval time per Pause card.
   *
   * Each approval is scored:
   *   < 2 000 ms  → rubberStamp (−15 per occurrence) — HYPOTHESIS: threshold
   *   2–5 000 ms  → rushed       (0 penalty)
   *   5–15 000 ms → considered   (+5 bonus)
   *   > 15 000 ms → thorough     (+10 bonus)
   *
   * CQ = clamp(80 + bonuses − penalties, 0, 100)
   * Baseline 80 represents a typical user who glances at decisions.
   */
  function calcConsentQuality() {
    var times = store.get('approvalTimes') || [];
    if (times.length === 0) return 82; // seeded baseline

    var score = 80;
    // HYPOTHESIS: −15 per rubber-stamp, +5/+10 per considered/thorough
    times.forEach(function (ms) {
      if (ms < 2000) {
        score -= 15; // rubber-stamp penalty — HYPOTHESIS
      } else if (ms >= 5000 && ms < 15000) {
        score += 5;  // considered bonus — HYPOTHESIS
      } else if (ms >= 15000) {
        score += 10; // thorough bonus — HYPOTHESIS
      }
    });
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * INFLUENCE EXPOSURE (0–100)
   *
   * Measures how often Sia's recommendations were commercially influenced.
   * Weighted by stakes: high-stakes flagged decisions penalise more.
   *
   * IE = 100 − weightedFlagRate × 100
   *
   * weightedFlagRate = Σ(flaggedDecision.stakesWeight) / Σ(allDecision.stakesWeight)
   *
   * stakesWeight by level:
   *   high   → 3   (HYPOTHESIS)
   *   medium → 1.5 (HYPOTHESIS)
   *   low    → 0.5 (HYPOTHESIS)
   */
  function calcInfluenceExposure() {
    var ledger = store.get('ledger') || [];
    var decisions = store.get('decisions') || [];
    var all = ledger.concat(decisions);

    function stakeWeight(level) {
      if (level === 'high')   return 3;   // HYPOTHESIS
      if (level === 'medium') return 1.5; // HYPOTHESIS
      return 0.5;                          // low — HYPOTHESIS
    }

    var totalWeight = 0, flaggedWeight = 0;
    all.forEach(function (item) {
      var w = stakeWeight(item.stakeLevel || 'low');
      totalWeight += w;
      if (item.influenceFlag) flaggedWeight += w;
    });

    if (totalWeight === 0) return 68;
    var rate = flaggedWeight / totalWeight;
    return Math.round(Math.max(0, Math.min(100, 100 - rate * 100)));
  }

  /**
   * SKILL VITALITY (0–100)
   *
   * Measures how much Meera is maintaining her own decision-making skills.
   * Based on Agent-Off Day completions and decisions made BEFORE seeing Sia's pick
   * in Choose-First flows (exercising independent preference articulation).
   *
   * SV = min(agentOffPoints × 1.0 + chooseFirstDecisions × 4.0, 100)
   *
   * HYPOTHESIS: weights to be validated in a pilot study.
   */
  function calcSkillVitality() {
    var skillPoints = store.get('skillPoints') || 0;
    var results = store.get('choosefirstResults') || [];
    var chooseFirstDecisions = results.length; // decisions made before seeing Sia's pick

    var score = Math.min(skillPoints * 1.0 + chooseFirstDecisions * 4.0, 100);
    return Math.round(Math.max(0, score));
  }

  /**
   * OVER-REVIEW SIGNAL
   * Evaluates the proportion of low-stakes decisions manually intervened.
   * If a user manually reviews >65% of low-stakes micro-tasks (which Sia handles safely),
   * they are expending unnecessary friction.
   */
  function checkOverReview() {
    var decisions = store.get('decisions') || [];
    var lowStakes = decisions.filter(function (d) { return d.stakeLevel === 'low'; });
    if (lowStakes.length === 0) return false;
    var reviewedLow = lowStakes.filter(function (d) { return d.state !== 'pending'; }).length;
    return (reviewedLow / lowStakes.length) > 0.65;
  }

  /**
   * UNIFIED SCORE COLOR RULE:
   * Healthy range (mint #2EF2A0)
   * Warning / Attention needed (amber #FFC83D)
   * Critical risk (coral #FF5C6C)
   */
  function getScoreColor(val, minHealthy, maxHealthy) {
    minHealthy = minHealthy !== undefined ? minHealthy : 55;
    maxHealthy = maxHealthy !== undefined ? maxHealthy : 80;
    if (val >= minHealthy && val <= maxHealthy) return 'var(--status-mint)';
    if (val > maxHealthy) return 'var(--drift-amber)';
    if (val >= 45) return 'var(--drift-amber)';
    return 'var(--status-coral)';
  }

  /**
   * ECHO INDEX (0–100)
   *
   * The signature insight of the Mirror screen.
   * Measures how much of the preference divergence was closed because
   * Meera changed toward Sia (Echo Effect) vs Sia correctly learning Meera.
   *
   * EchoIndex = totalMeeraClosedGap / totalDivergenceClosed × 100
   *
   * A high Echo Index (>50%) means Meera is drifting toward the agent —
   * her preferences are being shaped by Sia's suggestions, not the other way around.
   *
   * HYPOTHESIS: threshold for "concerning" Echo Index is >40% — to be validated.
   */
  function calcEchoIndex() {
    var snapshots = store.get('echoSnapshots') || [];
    if (snapshots.length < 2) return 45; // fallback

    var totalMeeraClosed = 0, totalClosed = 0;
    snapshots.forEach(function (s) {
      if (s.meeraClosedGap > 0) totalMeeraClosed += s.meeraClosedGap;
      totalClosed += Math.abs(s.meeraClosedGap) + Math.abs(s.siaClosedGap);
    });
    if (totalClosed === 0) return 0;
    return Math.round((totalMeeraClosed / totalClosed) * 100);
  }

  /**
   * AGENCY SCORE (0–100)
   * Healthy band: 55–80
   *
   * AgencyScore = 0.30 × PA + 0.25 × CQ + 0.25 × IE + 0.20 × SV
   * All weights: HYPOTHESIS — to be validated in pilot.
   */
  function calcAgencyScore(pa, cq, ie, sv) {
    var score = pa * 0.30 + cq * 0.25 + ie * 0.25 + sv * 0.20;
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Compute all scores and return them.
   * Also writes to store under 'scores' key.
   */
  function compute() {
    var pa = calcPreferenceAlignment();
    var cq = calcConsentQuality();
    var ie = calcInfluenceExposure();
    var sv = calcSkillVitality();
    var agency = calcAgencyScore(pa, cq, ie, sv);
    var echo = calcEchoIndex();

    var scores = {
      agency: agency,
      preference: pa,
      consent: cq,
      influence: ie,
      skill: sv,
      echo: echo,
      // Healthy band assessment
      inHealthyBand: agency >= 55 && agency <= 80 && !checkOverReview(),
      tooHigh: agency > 80 || checkOverReview(),
      tooLow: agency < 55,
      isOverReviewing: checkOverReview()
    };

    store.set('scores', scores);
    return scores;
  }

  /**
   * Whether 3+ recent approvals were rubber-stamp fast (< 2s)
   */
  function isRubberStamping() {
    var times = store.get('approvalTimes') || [];
    var recent = times.slice(-3);
    if (recent.length < 3) return false;
    // HYPOTHESIS: 3 consecutive < 2000ms triggers nudge
    return recent.every(function (ms) { return ms < 2000; });
  }

  /**
   * Record an approval and update Consent Quality.
   * @param {number} ms - time taken in milliseconds
   */
  function recordApproval(ms) {
    store.update('approvalTimes', function (arr) {
      arr = arr || [];
      arr.push(ms);
      return arr.slice(-20); // keep last 20
    });
    compute();
  }

  /**
   * Record a choose-first result.
   * @param {string} decisionId
   * @param {boolean} matched - did user pick same as Sia?
   */
  function recordChooseFirst(decisionId, matched) {
    store.update('choosefirstResults', function (arr) {
      arr = arr || [];
      arr.push({ id: decisionId, matched: matched, ts: Date.now() });
      return arr;
    });
    compute();
  }

  Anchor.scoring = {
    compute: compute,
    recordApproval: recordApproval,
    recordChooseFirst: recordChooseFirst,
    isRubberStamping: isRubberStamping,
    calcEchoIndex: calcEchoIndex,
    getScoreColor: getScoreColor,
    checkOverReview: checkOverReview
  };

  // Set store reference when scoring is used (called from main.js)
  Anchor.scoring._init = function (s) { store = s; };
})();

