/**
 * ANCHOR — Home Screen (Command Deck Progressive Disclosure)
 * Hero HUD Drift Ring, single-sentence verdict, primary action chip,
 * 4 compact orbit chips, and collapsible lower readouts.
 */

window.Anchor = window.Anchor || {};
Anchor.screens = Anchor.screens || {};

(function () {
  'use strict';

  var PM_LENS_DATA = {
    problem: 'Preference atrophy: when an agent predicts your wants, you stop forming them. The Agency Score surfaces this erosion as a single actionable number.',
    keyDecision: 'Healthy band (55–80), not higher-is-better. Above 80 means Anchor is adding friction without value; below 55 means you have ceded too much autonomy. Above the fold is restricted to the Ring, Verdict, and One Action Chip to eliminate cognitive overload.',
    tradeoff: {
      pro: 'Orbit chips replace bulky paragraphs with quick glanceable HUD readouts.',
      con: 'Detailed reasoning requires an intentional tap into a bottom sheet.'
    },
    metric: {
      name: 'Agency Score',
      input: 'Approval velocity, choose-first matches, stakes-weighted influence flags, manual vitality',
      output: 'Agency Score (0–100, healthy: 55–80)'
    },
    notBuilt: [
      'Social comparison ("you have more agency than 73% of users") — would create perverse gamification',
      'Predictive anxiety alerts ("score will drop if not reviewed") — triggers alert fatigue',
      'AI-generated narrative summary — keeps review human and verifiable'
    ],
    marketplace: 'High preference alignment coupled with a high Echo Index reveals preference atrophy: Meera believes Sia knows her, but Meera has actually conformed to Sia\'s predictive nudges. For Flipkart, identifying this gap ensures long-term customer lifetime value over short-term conversion.'
  };

  var _activeWeekIndex = 6; // current week (0-6)

  function render() {
    var screen = document.getElementById('screen-home');
    if (!screen) return;

    var scores = Anchor.scoring.compute();
    var history = Anchor.store.get('scoreHistory') || {};
    var decisions = Anchor.store.get('decisions') || [];
    var pending = decisions.filter(function (d) { return d.state === 'pending'; });
    var highStakesPending = pending.filter(function (d) { return d.stakeLevel === 'high'; });

    screen.innerHTML = buildHTML(scores, history, pending, highStakesPending);

    // Initial Drift Ring Draw
    var canvas = document.getElementById('drift-ring-canvas');
    if (canvas) {
      Anchor.charts.drawDriftRing(canvas, scores);
    }

    // Interactive mouse / touch parallax on ring
    bindRingParallax();

    // Week scrubber interaction
    bindScrubber(scores, history);

    // Hotspot pin click
    var hotspot = document.getElementById('hotspot-ring');
    if (hotspot) {
      hotspot.addEventListener('click', function (e) {
        e.stopPropagation();
        if (Anchor.pmlens && typeof Anchor.pmlens.openHotspot === 'function') {
          Anchor.pmlens.openHotspot('drift-ring');
        } else if (Anchor.pmlens && typeof Anchor.pmlens.open === 'function') {
          Anchor.pmlens.open();
        }
      });
    }

    // Orbit chips click
    document.querySelectorAll('.orbit-chip[data-type]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var type = chip.getAttribute('data-type');
        openSubScoreSheet(type, scores, history);
      });
    });

    // Primary Action Chip -> Navigate to Pause
    var actionChip = document.getElementById('primary-action-chip');
    if (actionChip) {
      actionChip.addEventListener('click', function () {
        Anchor.router.navigate('pause');
      });
    }

    // Collapsible sections toggle
    document.querySelectorAll('.home-section-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var targetId = toggle.getAttribute('data-target');
        var content = document.getElementById(targetId);
        if (content) {
          var isHidden = content.style.display === 'none';
          content.style.display = isHidden ? 'flex' : 'none';
          var arrow = toggle.querySelector('.toggle-arrow');
          if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
        }
      });
    });

    // Needs item click
    document.querySelectorAll('.needs-mini-row').forEach(function (row) {
      row.addEventListener('click', function () {
        Anchor.router.navigate('pause');
      });
    });
  }

  function buildHTML(scores, history, pending, highStakesPending) {
    var agency = scores.agency;
    var echo = scores.echo || 60;

    // Derived delta from history
    var deltaText = buildDelta(history.agency);

    // Health status label & class
    var healthClass = scores.inHealthyBand ? 'mint' : scores.tooHigh ? 'amber' : 'coral';
    var healthLabel = scores.inHealthyBand
      ? '● HEALTHY RANGE (55–80)'
      : scores.tooHigh
        ? '▲ OVER-REVIEWING'
        : '▼ LOW AGENCY';

    var actionText = highStakesPending.length > 0
      ? highStakesPending.length + ' high-stakes decisions need pause'
      : pending.length + ' decisions need pause';

    return `
      <div class="home-hero">
        <!-- Identity & Agent Status Header -->
        <div class="home-hero__identity">
          <div class="user-name-tag">Meera Iyer</div>
          <div class="agent-status-tag" title="Sia handling 340 tasks this week">Sia · 340 tasks/wk</div>
        </div>

        <!-- Hero Drift Ring Container with Parallax & Scrubber -->
        <div class="drift-ring-hud-wrap" id="drift-ring-hud">
          <canvas id="drift-ring-canvas"></canvas>
          <div class="drift-ring-center-readout">
            <div class="ring-score-metric" id="agency-score-num">${agency}</div>
            <div class="ring-score-sub">AGENCY SCORE</div>
          </div>
          <button class="hotspot-pin" id="hotspot-ring" title="PM Insight: Why healthy range is 55-80" aria-label="PM Annotation for Drift Ring" style="position:absolute;top:6px;right:6px;">?</button>
        </div>

        <!-- Healthy Range Status Pill (positioned below ring to prevent any arc overlap) -->
        <div style="display:flex;justify-content:center;margin:var(--space-1) auto var(--space-2);">
          <div class="ring-health-badge ${healthClass}">${healthLabel}</div>
        </div>

        <!-- 7-Week History Scrubber -->
        <div class="ring-scrubber-bar" id="ring-scrubber">
          <span>7W TREND:</span>
          ${(history.agency || [66, 68, 69, 69, 70, 70, 71]).map(function (val, idx) {
            return '<span class="ring-scrubber-dot' + (idx === 6 ? ' active' : '') + '" data-idx="' + idx + '" title="W' + (idx + 1) + ': ' + val + ' pts"></span>';
          }).join('')}
          <span style="color:var(--you-cyan);font-weight:700">W7 (NOW)</span>
        </div>

        <!-- Single Sentence Verdict -->
        <div class="home-verdict-box">
          <div class="home-verdict-text">
            ${scores.tooHigh
              ? '<strong>You are steering ' + agency + '% of decisions</strong>, but over-reviewing routine low-stakes tasks.'
              : scores.tooLow
                ? '<strong>Sia is steering ' + (100 - agency) + '% of life choices</strong>, exceeding your desired boundary.'
                : '<strong>You are steering ' + agency + '% of the decisions that shape your life.</strong> Within your calibrated healthy zone.'
            }
          </div>
          <div class="home-verdict-delta">${deltaText}</div>
        </div>

        <!-- ONE Primary Action Chip -->
        ${pending.length > 0 ? `
          <div class="primary-action-chip" id="primary-action-chip" role="button" tabindex="0">
            <span class="primary-action-chip__count">${pending.length}</span>
            <span>${actionText}</span>
            <span style="font-size:12px">→</span>
          </div>
        ` : `
          <div class="primary-action-chip" style="border-color:var(--status-mint);box-shadow:0 0 16px var(--status-mint-glow);background:rgba(46,242,160,0.12)" onclick="Anchor.router.navigate('pause')">
            <span>✓ All decisions reviewed · Open Queue</span>
          </div>
        `}
      </div>

      <!-- Compact Orbit Chips (4 Sub-Scores) -->
      <div class="section-header" style="padding-bottom:0">
        <span class="section-title">Telemetry Sub-Scores</span>
        <span style="font-size:10px;color:var(--text-low);font-family:var(--font-hud)">TAP CHIP FOR DRILL-DOWN</span>
      </div>

      <div class="orbit-chips-grid">
        <!-- Preference Alignment with Echo Index callout -->
        <div class="orbit-chip" data-type="preference" role="button" tabindex="0">
          <div class="orbit-chip__info">
            <div class="orbit-chip__label">PREFERENCE</div>
            <div class="orbit-chip__subtext">${echo}% is echo drift</div>
          </div>
          <div class="orbit-chip__readout">
            <span class="orbit-chip__val" style="color:${Anchor.scoring.getScoreColor(scores.preference, 70, 95)}">${scores.preference}</span>
            <span class="orbit-chip__trend" style="color:var(--status-mint)">↑+1</span>
          </div>
        </div>

        <!-- Consent Quality -->
        <div class="orbit-chip" data-type="consent" role="button" tabindex="0">
          <div class="orbit-chip__info">
            <div class="orbit-chip__label">CONSENT QUAL.</div>
            <div class="orbit-chip__subtext">review velocity</div>
          </div>
          <div class="orbit-chip__readout">
            <span class="orbit-chip__val" style="color:${Anchor.scoring.getScoreColor(scores.consent, 70, 95)}">${scores.consent}</span>
            <span class="orbit-chip__trend" style="color:var(--status-mint)">↑+2</span>
          </div>
        </div>

        <!-- Influence Exposure -->
        <div class="orbit-chip" data-type="influence" role="button" tabindex="0">
          <div class="orbit-chip__info">
            <div class="orbit-chip__label">INFLUENCE EXP.</div>
            <div class="orbit-chip__subtext">sponsored bids</div>
          </div>
          <div class="orbit-chip__readout">
            <span class="orbit-chip__val" style="color:${Anchor.scoring.getScoreColor(scores.influence, 70, 95)}">${scores.influence}</span>
            <span class="orbit-chip__trend" style="color:var(--text-mid)">—0</span>
          </div>
        </div>

        <!-- Skill Vitality -->
        <div class="orbit-chip" data-type="skill" role="button" tabindex="0">
          <div class="orbit-chip__info">
            <div class="orbit-chip__label">SKILL VITALITY</div>
            <div class="orbit-chip__subtext">needs practice</div>
          </div>
          <div class="orbit-chip__readout">
            <span class="orbit-chip__val" style="color:${Anchor.scoring.getScoreColor(scores.skill)}">${scores.skill}</span>
            <span class="orbit-chip__trend" style="color:var(--status-mint)">↑+1</span>
          </div>
        </div>
      </div>

      <!-- Collapsible Section: Needs You Queue Preview -->
      <div class="home-collapsible-section">
        <button class="home-section-toggle" data-target="needs-content">
          <span>PENDING PAUSE MOMENTS (${pending.length})</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="home-collapsible-content" id="needs-content" style="display:none">
          ${pending.slice(0, 3).map(function (d) {
            return `
              <div class="card--row needs-mini-row" style="cursor:pointer" role="button" tabindex="0">
                <span style="font-size:1.1rem">${d.categoryIcon}</span>
                <div style="flex:1">
                  <div style="font-size:12px;font-weight:600;color:var(--text-high)">${d.title}</div>
                  <div style="font-size:10px;color:var(--text-low);font-family:var(--font-hud)">${d.amount || 'Decision'} · ${d.platform}</div>
                </div>
                <span class="badge badge--${d.stakeLevel}">${d.stakeLevel}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Collapsible Section: Weekly Autonomous Output -->
      <div class="home-collapsible-section" style="margin-top:var(--space-2)">
        <button class="home-section-toggle" data-target="weekly-content">
          <span>WEEKLY AUTOMATION TELEMETRY</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="home-collapsible-content" id="weekly-content" style="display:none">
          <div class="card--insight" style="margin-top:0">
            <div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--you-cyan);margin-bottom:4px">
              340 WEEKLY TASKS PROCESSED
            </div>
            <div style="font-size:12px;color:var(--text-mid);line-height:1.4">
              This week Sia handled 337 tasks; you chose 3 yourself (99% delegation rate vs your 85% comfort target).
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildDelta(history) {
    if (!history || history.length < 2) return '';
    var last = history[history.length - 1];
    var prev = history[history.length - 2];
    var diff = last - prev;
    if (diff === 0) return '↔ Flat vs previous week';
    var sign = diff > 0 ? '+' : '';
    var col = diff > 0 ? 'var(--status-mint)' : 'var(--status-coral)';
    return '<span style="color:' + col + ';font-weight:600">' + sign + diff + ' pts vs last week</span>';
  }

  function bindRingParallax() {
    var wrap = document.getElementById('drift-ring-hud');
    if (!wrap) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    wrap.addEventListener('mousemove', function (e) {
      var rect = wrap.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      wrap.style.transform = 'perspective(400px) rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 14) + 'deg)';
    });

    wrap.addEventListener('mouseleave', function () {
      wrap.style.transform = 'perspective(400px) rotateY(0deg) rotateX(0deg)';
    });
  }

  function bindScrubber(scores, history) {
    var dots = document.querySelectorAll('.ring-scrubber-dot');
    var canvas = document.getElementById('drift-ring-canvas');
    var numEl = document.getElementById('agency-score-num');

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-idx'));
        dots.forEach(function (d) { d.classList.remove('active'); });
        dot.classList.add('active');

        var histAgency = (history.agency && history.agency[idx]) || scores.agency;
        var histPA     = (history.preference && history.preference[idx]) || scores.preference;

        if (canvas) {
          Anchor.charts.drawDriftRing(canvas, {
            agency: histAgency,
            preference: histPA
          }, { instant: true });
        }

        if (numEl) {
          numEl.textContent = histAgency;
        }
      });
    });
  }

  function openSubScoreSheet(type, scores, history) {
    var el = document.createElement('div');

    var config = {
      preference: {
        title: 'Preference Alignment',
        score: scores.preference,
        desc: 'Measures how accurately Sia’s internal weights mirror your reflective choices.',
        why: '60% of this alignment is echo drift (Meera conforming to Sia’s suggestions). Your stated choices on Travel and Time differ from what Sia auto-books.',
        tip: 'Take the weekly calibration quiz in Mirror to unseat stale predictive assumptions.'
      },
      consent: {
        title: 'Consent Quality',
        score: scores.consent,
        desc: 'Evaluates your review deliberation speed to detect superficial rubber-stamping.',
        why: 'Approvals under 2.0s incur a –15pt penalty. Considered reviews between 5–15s earn full agency credit.',
        tip: 'Use Hold-to-Confirm on high-stakes Pause moments to register thoughtful consent.'
      },
      influence: {
        title: 'Influence Exposure',
        score: scores.influence,
        desc: 'Monitors how often Sia recommended commercially sponsored seller bids.',
        why: '3 of the last 25 decisions carried sponsor loyalty incentives (Dell laptop, Sony earbuds, Dyson). High stakes carries 3x penalty weight.',
        tip: 'Look for the "Verified by Anchor" badge to trust commercial recommendations.'
      },
      skill: {
        title: 'Skill Vitality',
        score: scores.skill,
        desc: 'Needs practice · Tracks human problem-solving practice before delegating to AI agents.',
        why: 'Meera delegates ~340 tasks/week. 30 reflects an intentional baseline: only 1.5 Agent-Off Days completed and zero Choose-First reviews before today. Needs regular manual practice to rebuild muscle.',
        tip: 'Activate an Agent-Off Day challenge in the top menu to maintain decision autonomy.'
      }
    };

    var c = config[type] || config.preference;
    var sparkId = 'sheet-sparkline-' + type;

    el.innerHTML = `
      <div class="sheet-header">
        <div class="sheet-title">${c.title}</div>
        <div class="sheet-subtitle">${c.desc}</div>
      </div>
      <div class="sheet-body">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0">
          <div>
            <div style="font-family:var(--font-hud);font-size:3rem;font-weight:800;color:var(--you-cyan);line-height:1">${c.score}</div>
            <div style="font-family:var(--font-hud);font-size:10px;color:var(--text-low);margin-top:2px">OUT OF 100</div>
          </div>
          <div style="width:140px;height:40px">
            <svg id="${sparkId}" style="width:100%;height:100%"></svg>
          </div>
        </div>

        <div class="divider"></div>

        <div class="card--insight" style="margin-bottom:var(--space-3)">
          <div style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--you-cyan);margin-bottom:2px">WHY THIS CHANGED</div>
          <div style="font-size:12px;color:var(--text-high);line-height:1.4">${c.why}</div>
        </div>

        <div class="card" style="margin-bottom:var(--space-4)">
          <div style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--status-mint);margin-bottom:2px">PM ACTIONABLE TIP</div>
          <div style="font-size:12px;color:var(--text-mid);line-height:1.4">${c.tip}</div>
        </div>

        <button class="btn btn--primary btn--full" onclick="Anchor.ui.closeSheet()">Done</button>
      </div>
    `;

    Anchor.ui.openSheet(el, { label: c.title + ' telemetry drilldown' });

    requestAnimationFrame(function () {
      var svg = document.getElementById(sparkId);
      if (svg && history[type]) {
        Anchor.charts.drawSparkline(svg, history[type], '#19E3FF', { width: 140, height: 40 });
      }
    });
  }

  // Auto-resize ring on window resize if crossing height breakpoint
  var _lastRingW = 0;
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('resize', function () {
      var canvas = document.getElementById('drift-ring-canvas');
      var screen = document.getElementById('screen-home');
      if (canvas && screen && screen.classList.contains('active')) {
        var parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
        var curW = parentW > 0 ? parentW : (window.innerHeight < 700 ? 170 : 210);
        if (curW !== _lastRingW) {
          _lastRingW = curW;
          Anchor.charts.drawDriftRing(canvas, Anchor.scoring.compute(), { instant: true });
        }
      }
    });
  }

  Anchor.screens.home = {
    render: render,
    PM_LENS_DATA: PM_LENS_DATA
  };
})();
