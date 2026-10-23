/**
 * ANCHOR — Mirror Screen (Divergence Lab & Echo Index)
 * Radar morph, 8-week echo timeline, card-flip calibration quiz,
 * and reflective belief prompts.
 */

window.Anchor = window.Anchor || {};
Anchor.screens = Anchor.screens || {};

(function () {
  'use strict';

  var PM_LENS_DATA = {
    problem: 'The Echo Effect: When agents continuously predict preferences, people unconsciously conform to the agent’s recommendations rather than forming their own desires. The Echo Index exposes this drift.',
    keyDecision: 'Echo Index calculates the proportion of alignment gained because Meera changed vs Sia learning. If the gap closes because Meera drifted toward the AI, that is not personalization — it is preference erosion.',
    tradeoff: {
      pro: 'The Echo Index gives product teams a quantifiable safeguard against behavioral homogenization.',
      con: 'Requires periodic active calibration prompts; passive observation alone cannot separate genuine learning from compliance.'
    },
    metric: {
      name: 'Preference Alignment',
      input: 'Self-reported radar coordinates, calibration quiz tradeoffs, belief challenge responses',
      output: 'Preference Alignment score (0–100) and Echo Index (0–100)'
    },
    notBuilt: [
      'Social conformity benchmarking — comparison fuels anxiety rather than self-knowledge',
      'Forced periodic lockouts — creates annoyance and app abandonment',
      'AI-authored personality summaries — risks reinforcing the echo chamber'
    ],
    marketplace: 'In e-commerce, the Echo Effect leads to catalog narrowing — agents repeatedly buy the same 12 brands because the buyer stops searching. By tracking Echo Index, Flipkart can identify when users are trapped in predictive loops and inject novelty.'
  };

  var _radarMode = 'both'; // 'both' | 'you' | 'sia'
  var _quizIdx = 0;
  var _quizAnswers = [];

  function render() {
    var screen = document.getElementById('screen-mirror');
    if (!screen) return;

    var scores = Anchor.scoring.compute();
    var echoIndex = scores.echo || 60;
    var snapshots = Anchor.store.get('echoSnapshots') || [];
    var domains = Anchor.store.get('radarDomains') || [];
    var siaVals = Anchor.store.get('radarSia') || [];
    var meeraVals = Anchor.store.get('radarMeera') || [];
    var questions = Anchor.store.get('calibrationQuestions') || [];
    var answers = Anchor.store.get('calibrationAnswers') || [];
    var prompts = Anchor.store.get('reflectionPrompts') || [];

    screen.innerHTML = buildHTML(scores, echoIndex, snapshots, domains, siaVals, meeraVals, questions, answers, prompts);

    // Draw Radar Chart
    var radarSvg = document.getElementById('mirror-radar');
    if (radarSvg) {
      Anchor.charts.drawRadarChart(radarSvg, domains, siaVals, meeraVals, {
        size: 280,
        mode: _radarMode
      });
    }

    // Draw Echo Index Timeline Chart
    var echoSvg = document.getElementById('echo-chart');
    if (echoSvg) {
      Anchor.charts.drawEchoChart(echoSvg, snapshots, {
        width: 320,
        height: 95,
        onSelect: function (snap, idx) {
          var tip = document.getElementById('echo-timeline-tooltip');
          if (tip) {
            tip.innerHTML = `<strong>${snap.week}:</strong> Total divergence gap was ${snap.divergence} pts. ${snap.meeraClosedGap > 0 ? snap.meeraClosedGap + ' pts closed by Meera conforming' : 'Sia learned ' + snap.siaClosedGap + ' pts'}.`;
          }
        }
      });
    }

    // Hotspot Pin click
    var hotspot = document.getElementById('hotspot-echo');
    if (hotspot) {
      hotspot.addEventListener('click', function (e) {
        e.stopPropagation();
        if (Anchor.pmlens && typeof Anchor.pmlens.openHotspot === 'function') {
          Anchor.pmlens.openHotspot('echo-index');
        } else if (Anchor.pmlens && typeof Anchor.pmlens.open === 'function') {
          Anchor.pmlens.open();
        }
      });
    }

    // Radar Mode Toggles
    document.querySelectorAll('.radar-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _radarMode = btn.getAttribute('data-mode');
        document.querySelectorAll('.radar-toggle-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var rSvg = document.getElementById('mirror-radar');
        if (rSvg) {
          Anchor.charts.drawRadarChart(rSvg, domains, siaVals, meeraVals, { size: 280, mode: _radarMode });
        }
      });
    });

    // Quiz Start
    var startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) {
      startBtn.addEventListener('click', function () { startQuiz(); });
    }

    // Bind Reflection Prompts
    bindReflectionPrompts();
  }

  function buildHTML(scores, echoIndex, snapshots, domains, siaVals, meeraVals, questions, answers, prompts) {
    var quizDone = answers.length >= questions.length && questions.length > 0;

    return `
      <!-- Header -->
      <div style="margin-bottom:var(--space-3)">
        <div style="font-family:var(--font-hud);font-size:var(--text-lg);font-weight:700;color:var(--text-high);letter-spacing:0.04em">
          DIVERGENCE LAB
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
          Auditing whether Sia knows you, or you are conforming to Sia.
        </div>
      </div>

      <!-- Signature Hero: The Echo Index -->
      <div class="mirror-hero-echo">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px">
              <span style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--drift-amber);letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap">
                THE ECHO INDEX
              </span>
              <button class="hotspot-pin" id="hotspot-echo" title="PM Insight: What is the Echo Index?" style="margin-left:0;flex-shrink:0">?</button>
            </div>
            <div class="echo-big-metric">${echoIndex}%</div>
            <div style="font-family:var(--font-hud);font-size:10px;color:var(--drift-amber);margin-top:2px;font-weight:600">
              HIGH ECHO EFFECT DETECTED
            </div>
          </div>
          <div style="text-align:right">
            <span class="badge badge--medium">8-WEEK SNAPSHOTS</span>
          </div>
        </div>

        <div style="margin-top:var(--space-3);padding-top:var(--space-2);border-top:1px solid rgba(255,200,61,0.25)">
          <div style="font-size:12px;color:var(--text-high);line-height:1.4">
            <strong>Part of the gap closed because you changed, not because Sia learned.</strong>
            60% of apparent preference alignment stems from Meera accepting Sia's recommendations repeatedly.
          </div>
        </div>

        <!-- 8-Week Bar Chart -->
        <div style="margin-top:var(--space-3)">
          <svg id="echo-chart"></svg>
          <div id="echo-timeline-tooltip" style="font-family:var(--font-hud);font-size:10px;color:var(--text-mid);min-height:16px;margin-top:4px">
            Tap any week bar to inspect ground-truth divergence coordinates.
          </div>
        </div>
      </div>

      <!-- Divergence Map Radar -->
      <div class="section-header" style="padding-left:0;padding-right:0">
        <span class="section-title">8-Domain Divergence Map</span>
        <div class="radar-controls-bar" style="margin-bottom:0">
          <button class="radar-toggle-btn active" data-mode="both">Overlay</button>
          <button class="radar-toggle-btn" data-mode="you">You Say</button>
          <button class="radar-toggle-btn" data-mode="sia">Sia Thinks</button>
        </div>
      </div>

      <div class="card" style="display:flex;flex-direction:column;align-items:center;padding:var(--space-3) 0">
        <div style="display:flex;gap:var(--space-4);font-family:var(--font-hud);font-size:10px;margin-bottom:var(--space-2)">
          <span style="color:var(--you-cyan);display:flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--you-cyan);display:inline-block"></span> You (${scores.preference}%)
          </span>
          <span style="color:var(--sia-violet);display:flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--sia-violet);display:inline-block"></span> Sia Model
          </span>
        </div>
        <div style="width:100%;max-width:280px;height:280px">
          <svg id="mirror-radar"></svg>
        </div>
      </div>

      <!-- Weekly Calibration Quiz Section -->
      <div class="section-header" style="margin-top:var(--space-4);padding-left:0;padding-right:0">
        <span class="section-title">Weekly Calibration Quiz</span>
        ${quizDone ? '<span class="badge badge--low">Completed</span>' : '<span class="badge badge--high">5 Qs Pending</span>'}
      </div>

      <div class="card" style="margin-bottom:var(--space-4)">
        ${quizDone
          ? `<div style="text-align:center;padding:var(--space-3) 0">
               <div style="font-family:var(--font-hud);font-size:var(--text-2xl);font-weight:700;color:var(--status-mint)">3 / 5 MATCHED</div>
               <div style="font-size:12px;color:var(--text-mid);margin-top:2px">Sia miscalculated your Travel & Career tradeoff thresholds. Weights updated.</div>
               <button class="btn btn--secondary btn--sm" id="start-quiz-btn" style="margin-top:var(--space-3)">Retake Calibration</button>
             </div>`
          : `<div>
               <div style="font-size:12px;color:var(--text-high);margin-bottom:var(--space-3);line-height:1.4">
                 Answer 5 preference tradeoffs before Sia reveals its prediction. Tests whether Sia's model is lagging your evolving tastes.
               </div>
               <button class="btn btn--primary btn--full" id="start-quiz-btn">Start Calibration Quiz →</button>
             </div>`
        }
      </div>

      <!-- Reflection Prompts -->
      <div class="section-header" style="padding-left:0;padding-right:0">
        <span class="section-title">Sia's Stated Beliefs</span>
        <span style="font-family:var(--font-hud);font-size:10px;color:var(--text-low)">CHALLENGE ASSUMPTIONS</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        ${prompts.map(buildReflectionCard).join('')}
      </div>
    `;
  }

  function buildReflectionCard(p) {
    var isAnswered = p.state !== null;
    return `
      <div class="card" style="padding:var(--space-3)">
        <div style="font-family:var(--font-hud);font-size:9px;color:var(--sia-violet);letter-spacing:0.06em;text-transform:uppercase">
          SIA’S CURRENT HYPOTHESIS · ${p.domain}
        </div>
        <div style="font-size:12px;font-weight:600;color:var(--text-high);margin-top:2px;font-style:italic">
          ${p.siaBelieves}
        </div>
        ${isAnswered ? `
          <div style="margin-top:var(--space-2);font-family:var(--font-hud);font-size:10px;color:var(--you-cyan)">
            ✓ RESPONDED: ${p.state.toUpperCase()}
          </div>
        ` : `
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2)">
            <button class="btn btn--sm btn--secondary reflect-btn" data-id="${p.id}" data-val="agree">Agree</button>
            <button class="btn btn--sm btn--danger reflect-btn" data-id="${p.id}" data-val="disagree">Disagree</button>
            <button class="btn btn--sm btn--ghost reflect-btn" data-id="${p.id}" data-val="not-anymore">Not Anymore</button>
          </div>
        `}
      </div>
    `;
  }

  function bindReflectionPrompts() {
    document.querySelectorAll('.reflect-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var val = btn.getAttribute('data-val');
        Anchor.store.update('reflectionPrompts', function (prompts) {
          return prompts.map(function (p) {
            return p.id === id ? Object.assign({}, p, { state: val }) : p;
          });
        });

        // Disagreement logs divergence into Mirror
        if (val !== 'agree') {
          Anchor.ui.showToast('Assumption challenged. Sia weight shifted.', 'warn');
        } else {
          Anchor.ui.showToast('Belief confirmed.', 'success');
        }

        Anchor.scoring.compute();
        render();
      });
    });
  }

  // ── Quiz Flow with 3D Card-Flip Animation ──────────────────

  function startQuiz() {
    _quizIdx = 0;
    _quizAnswers = [];
    showQuizQuestion();
  }

  function showQuizQuestion() {
    var questions = Anchor.store.get('calibrationQuestions') || [];
    if (_quizIdx >= questions.length) {
      Anchor.store.set('calibrationAnswers', _quizAnswers);
      Anchor.scoring.compute();
      Anchor.ui.closeSheet();
      Anchor.ui.showToast('Calibration complete! Preference Alignment updated.', 'success');
      render();
      return;
    }

    var q = questions[_quizIdx];
    var el = document.createElement('div');
    el.innerHTML = `
      <div class="sheet-header">
        <div style="font-family:var(--font-hud);font-size:10px;color:var(--text-low);letter-spacing:0.08em">
          CALIBRATION ${ _quizIdx + 1 } OF ${ questions.length } · ${ q.domain }
        </div>
        <div class="sheet-title" style="margin-top:2px">${ q.question }</div>
      </div>
      <div class="sheet-body">
        <div style="display:flex;flex-direction:column;gap:var(--space-2)" id="quiz-opts">
          <div class="option-card quiz-card" data-val="${ q.optionA.value }">
            <div style="font-size:13px;font-weight:600;color:var(--text-high)">${ q.optionA.text }</div>
          </div>
          <div class="option-card quiz-card" data-val="${ q.optionB.value }">
            <div style="font-size:13px;font-weight:600;color:var(--text-high)">${ q.optionB.text }</div>
          </div>
        </div>

        <div id="quiz-flip-reveal" style="display:none;margin-top:var(--space-3)"></div>
      </div>
    `;

    Anchor.ui.openSheet(el, { label: 'Calibration Question ' + (_quizIdx + 1) });

    el.querySelectorAll('.quiz-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var userPick = card.getAttribute('data-val');
        var matched = (userPick === q.siaPrediction);

        card.classList.add('selected', matched ? 'match' : 'mismatch');
        _quizAnswers.push({ questionId: q.id, userAnswer: userPick, matched: matched });
        Anchor.scoring.recordChooseFirst(q.id, matched);

        var revealBox = el.querySelector('#quiz-flip-reveal');
        revealBox.style.display = 'block';
        revealBox.className = 'card ' + (matched ? 'card--insight' : 'card--warn') + ' card-unlocked';
        revealBox.innerHTML = matched
          ? `<div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--status-mint)">🎯 MATCHED SIA’S MODEL</div>
             <div style="font-size:12px;color:var(--text-high);margin-top:2px">Sia correctly predicted this choice. Zero drift recorded.</div>`
          : `<div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--drift-amber)">↔ PREFERENCE DIVERGED</div>
             <div style="font-size:12px;color:var(--text-high);margin-top:2px">Sia expected you to choose the other option. Calibration weight adjusted.</div>`;

        var nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn--primary btn--full';
        nextBtn.style.marginTop = 'var(--space-3)';
        nextBtn.textContent = (_quizIdx + 1 < questions.length) ? 'Next Tradeoff →' : 'Finalize Calibration →';
        revealBox.appendChild(nextBtn);

        nextBtn.addEventListener('click', function () {
          _quizIdx++;
          Anchor.ui.closeSheet(true);
          setTimeout(function () { showQuizQuestion(); }, 80);
        });
      });
    });
  }

  Anchor.screens.mirror = {
    render: render,
    PM_LENS_DATA: PM_LENS_DATA
  };
})();
