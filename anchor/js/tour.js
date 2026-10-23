/**
 * ANCHOR — Guided Tour
 * Cinematic, paced walkthrough with a floating caption bubble and simulated cursor.
 * Features:
 *  1. Store snapshot at start & full restore on finish/exit (scores verified identical)
 *  2. Header "TOUR MODE" pill indicator
 *  3. Dim spotlight around described element
 *  4. Back/Next buttons alongside Pause/Exit (+ ArrowLeft/ArrowRight support)
 *  5. Caption card placed strictly above bottom tab bar (never covers tab bar)
 *  6. Rich educational step descriptions & completion bottom sheet
 */
window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  var _active  = false;
  var _paused  = false;
  var _stepIdx = 0;
  var _timer   = null;
  var _subTimers = [];
  var _storeSnapshot = null;

  // ── Helpers ──────────────────────────────────────────────────
  function subTimeout(fn, ms) {
    var t = setTimeout(function () {
      if (_active) fn();
    }, ms);
    _subTimers.push(t);
  }

  function clearSubTimers() {
    _subTimers.forEach(function (t) { clearTimeout(t); });
    _subTimers = [];
  }

  // ── Tour script (13 steps) ──────────────────────────────────
  var TOUR_SCRIPT = [
    /* ── HOME ─────────────────────────────────────────────── */
    {
      tab: 'home',
      caption: '🏠 HOME — Agency Dashboard.\nThe big circle is the Drift Ring: the gap between the outer blue arc (Meera\'s choices) and the inner violet arc (Sia\'s predictions) is your drift story. The score lives in the 55–80 healthy band.',
      highlight: '#drift-ring-canvas',
      delay: 5500
    },
    {
      tab: 'home',
      caption: '📊 ORBIT CHIPS — Four sub-scores around the ring.\nPreference Alignment, Consent Quality, Influence Exposure and Skill Vitality each feed the Agency Score. Tap any chip to drill in.',
      highlight: '.orbit-chips',
      delay: 4500,
      action: function () {
        subTimeout(function () {
          var chip = document.querySelector('.orbit-chip[data-type="influence"]');
          if (chip) chip.click();
        }, 1800);
      }
    },
    {
      tab: 'home',
      caption: '⚠️ INFLUENCE EXPOSURE — Commercial nudges flagged.\n3 of Meera\'s last 25 decisions had hidden commercial nudges — including the ₹74,999 laptop. Scores recalculate live as she acts.',
      highlight: '.orbit-chip[data-type="influence"]',
      delay: 4500,
      action: function () {
        subTimeout(function () { Anchor.ui.closeSheet(); }, 4000);
      }
    },
    /* ── PAUSE ─────────────────────────────────────────────── */
    {
      tab: 'pause',
      caption: '⏸ PAUSE MOMENTS — Sia\'s consent queue.\nThese are the decisions Sia flagged as too important to auto-approve. Each card shows Stakes Badges: Financial ₹, Reversibility ↩, Identity 👤, Emotion ❤️.',
      highlight: '.pause-card',
      delay: 5500
    },
    {
      tab: 'pause',
      caption: '🎯 CHOOSE-FIRST — Pick before Sia reveals her answer.\nThe ₹74,999 laptop card has a Sponsored flag — Sia was incentivised by Dell\'s loyalty bid. Open it and pick first to log your unbiased preference.',
      highlight: '.pause-card[data-id="dec-001"]',
      delay: 4500,
      action: function () {
        subTimeout(function () {
          var card = document.querySelector('.pause-card[data-id="dec-001"]');
          if (card) card.click();
        }, 1800);
      }
    },
    {
      tab: 'pause',
      caption: '↔ DIVERGENCE REVEAL — Sia\'s sealed card unseals.\nMeera picks "Wait for Apple M5 MacBook". Notice the Influence Check: without Dell\'s incentive Sia\'s unbiased confidence was only 54%.',
      highlight: null,
      delay: 5500,
      action: function () {
        subTimeout(function () {
          var opts = document.querySelectorAll('.option-card');
          if (opts && opts[1]) opts[1].click();
        }, 1600);
        subTimeout(function () { Anchor.ui.closeSheet(); }, 5000);
      }
    },
    /* ── MIRROR ─────────────────────────────────────────────── */
    {
      tab: 'mirror',
      caption: '🪞 MIRROR — Divergence Lab.\nThe radar shows Meera\'s stated values (blue) vs Sia\'s model (violet) across 8 life domains. Toggle the view buttons to isolate each.',
      highlight: '#mirror-radar',
      delay: 5500
    },
    {
      tab: 'mirror',
      caption: '📈 Echo Index — the signature insight.\n60% of the alignment gap closed because Meera changed, not because Sia learned: "Part of the gap closed because you changed, not because Sia learned."',
      highlight: '.mirror-hero-echo',
      delay: 5000
    },
    /* ── AUTONOMY ─────────────────────────────────────────────── */
    {
      tab: 'autonomy',
      caption: '🎛 AUTONOMY DIALS — Set Sia\'s boundaries.\n4-position rotary knobs per domain: Ask First → Suggest & Wait → Act & Tell → Fully Auto. Turn the Travel knob to see Sia\'s proactive suggestion based on 38% divergence.',
      highlight: null,
      delay: 5000
    },
    {
      tab: 'autonomy',
      caption: '📊 COUNTERFACTUAL SIMULATION — Replay with new settings.\n"Simulate this setting" replays last week\'s decisions under the new Travel dial — showing exactly which regret it would have caught (the Pune flight reschedule clash).',
      highlight: '.sug-simulate',
      delay: 4500,
      action: function () {
        subTimeout(function () {
          var btn = document.querySelector('.sug-simulate');
          if (btn) btn.click();
        }, 1800);
        subTimeout(function () { Anchor.ui.closeSheet(); }, 4200);
      }
    },
    /* ── LEDGER ─────────────────────────────────────────────── */
    {
      tab: 'ledger',
      caption: '📋 LEDGER — Immutable flight recorder.\nEvery decision Sia executed, grouped by day. Filter by "Influence Flagged" to surface the sponsored nudges — including a Dyson vacuum placed via a paid seller-agent bid.',
      highlight: '.pill-toggle__item[data-filter="influence"]',
      delay: 5000,
      action: function () {
        subTimeout(function () {
          var btn = document.querySelector('.pill-toggle__item[data-filter="influence"]');
          if (btn) btn.click();
        }, 1800);
      }
    },
    {
      tab: 'ledger',
      caption: '👎 REGRET SIGNAL — Counter-signal feeds back to Mirror.\nMeera marks the Dyson vacuum as a regret. This feeds straight back into Preference Alignment so Sia\'s model updates before the next purchase.',
      highlight: null,
      delay: 4500,
      action: function () {
        subTimeout(function () {
          var regretBtns = document.querySelectorAll('.regret-btn[data-val="true"]');
          if (regretBtns && regretBtns[0]) regretBtns[0].click();
        }, 1500);
      }
    },
    /* ── WRAP-UP ─────────────────────────────────────────────── */
    {
      tab: 'home',
      caption: '🏁 TOUR COMPLETE — Explore freely.\nAgency Score is restored to baseline. This is ANCHOR — the independent layer that makes sure Meera still knows herself even as Sia knows everything else.',
      highlight: '#drift-ring-canvas',
      delay: 5000
    }
  ];

  // ── DOM helpers ───────────────────────────────────────────────
  function getCaption()  { return document.getElementById('tour-caption'); }
  function getCursor()   { return document.getElementById('tour-cursor'); }
  function getControls() { return document.getElementById('tour-controls'); }
  function getLabel()    { return document.getElementById('tour-step-label'); }

  function showCaption(text) {
    var el = getCaption();
    if (!el) return;
    el.classList.remove('visible');
    setTimeout(function () {
      // Split on first \n: first segment = bold title, rest = explanation body
      var parts = text.split('\n');
      var titleText = parts[0] || '';
      var bodyText  = parts.slice(1).join('\n').trim();
      var html = '<span class="tour-caption-title">' + escapeHtml(titleText) + '</span>';
      if (bodyText) {
        html += '<span class="tour-caption-body">' + escapeHtml(bodyText) + '</span>';
      }
      el.innerHTML = html;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.classList.add('visible');
        });
      });
    }, 180);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function hideCaption() {
    var el = getCaption();
    if (el) el.classList.remove('visible');
  }

  function moveCursor(selector) {
    var cursor = getCursor();
    if (!cursor) return;
    if (!selector) { cursor.classList.remove('visible'); return; }

    var target = document.querySelector(selector);
    if (!target) { cursor.classList.remove('visible'); return; }

    var rect = target.getBoundingClientRect();
    cursor.style.left = (rect.left + rect.width  / 2) + 'px';
    cursor.style.top  = (rect.top  + rect.height / 2) + 'px';
    cursor.classList.add('visible');
  }

  function updateSpotlight(selector) {
    var spot = document.getElementById('tour-dim-spotlight');
    var phone = document.getElementById('phone-frame');
    if (!spot || !phone) return;

    if (!selector) {
      spot.classList.remove('visible');
      return;
    }

    var target = document.querySelector(selector);
    if (!target) {
      spot.classList.remove('visible');
      return;
    }

    var phoneRect = phone.getBoundingClientRect();
    var targetRect = target.getBoundingClientRect();
    var pad = 6;

    var top = (targetRect.top - phoneRect.top) - pad;
    var left = (targetRect.left - phoneRect.left) - pad;
    var width = targetRect.width + (pad * 2);
    var height = targetRect.height + (pad * 2);

    spot.style.top = Math.max(0, top) + 'px';
    spot.style.left = Math.max(0, left) + 'px';
    spot.style.width = width + 'px';
    spot.style.height = height + 'px';
    spot.classList.add('visible');
  }

  function updateStepLabel(idx) {
    var el = getLabel();
    if (el) el.textContent = 'Step ' + (idx + 1) + ' of ' + TOUR_SCRIPT.length;
  }

  // ── Core ──────────────────────────────────────────────────────

  var tour = {
    init: function () {
      // Bind controls
      var prevBtn = document.getElementById('tour-prev-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', function () { tour.prev(); });
      }

      var nextBtn = document.getElementById('tour-next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', function () { tour.next(); });
      }

      var pauseBtn = document.getElementById('tour-pause-btn');
      if (pauseBtn) {
        pauseBtn.addEventListener('click', function () { tour.togglePause(); });
      }

      var skipBtn = document.getElementById('tour-skip-btn');
      if (skipBtn) {
        skipBtn.addEventListener('click', function () { tour.stop(); });
      }

      // Keyboard: Space = pause, Esc = exit, ArrowLeft = back, ArrowRight = next
      window.addEventListener('keydown', function (e) {
        if (!_active) return;
        if (e.key === 'Escape') {
          tour.stop();
        } else if (e.key === ' ') {
          e.preventDefault();
          tour.togglePause();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          tour.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          tour.next();
        }
      });
    },

    start: function () {
      if (_active) return;

      // 1. Snapshot entire store before tour executes any mock choices
      if (Anchor.store && typeof Anchor.store.snapshot === 'function') {
        _storeSnapshot = Anchor.store.snapshot();
      }

      // Close open menus/sheets immediately
      document.querySelectorAll('.menu-popup.open').forEach(function (m) {
        m.classList.remove('open');
      });
      if (typeof Anchor.ui.closeSheet === 'function') {
        Anchor.ui.closeSheet(true);
      }

      _active  = true;
      _paused  = false;
      _stepIdx = 0;
      Anchor.store.set('tourActive', true);

      // Show header "TOUR MODE" pill, hide regular tour button
      var pill = document.getElementById('tour-mode-pill');
      if (pill) pill.style.display = 'inline-flex';
      var startBtn = document.getElementById('tour-start-btn');
      if (startBtn) startBtn.style.display = 'none';

      // Show controls bar
      var controls = getControls();
      if (controls) controls.classList.add('active');

      // 0ms instant execution
      this._runStep();
    },

    prev: function () {
      if (!_active) return;
      clearTimeout(_timer);
      clearSubTimers();
      if (_stepIdx > 0) {
        _stepIdx--;
        this._runStep();
      }
    },

    next: function () {
      if (!_active) return;
      clearTimeout(_timer);
      clearSubTimers();
      _stepIdx++;
      if (_stepIdx >= TOUR_SCRIPT.length) {
        this.stop();
        this._showCompletion();
      } else {
        this._runStep();
      }
    },

    togglePause: function () {
      if (!_active) return;
      _paused = !_paused;
      var btn = document.getElementById('tour-pause-btn');
      if (btn) btn.textContent = _paused ? '▶ Resume' : '⏸ Pause';

      if (!_paused) {
        this._scheduleNext(TOUR_SCRIPT[_stepIdx].delay / 2);
      } else {
        clearTimeout(_timer);
      }
    },

    stop: function () {
      _active = false;
      _paused = false;
      clearTimeout(_timer);
      clearSubTimers();
      Anchor.store.set('tourActive', false);

      // Hide header "TOUR MODE" pill, restore regular tour button
      var pill = document.getElementById('tour-mode-pill');
      if (pill) pill.style.display = 'none';
      var startBtn = document.getElementById('tour-start-btn');
      if (startBtn) startBtn.style.display = '';

      var controls = getControls();
      if (controls) controls.classList.remove('active');

      hideCaption();
      var cursor = getCursor();
      if (cursor) cursor.classList.remove('visible');

      var spot = document.getElementById('tour-dim-spotlight');
      if (spot) spot.classList.remove('visible');

      // 2. Fully restore the store snapshot so scores are verified identical
      if (_storeSnapshot && Anchor.store && typeof Anchor.store.restore === 'function') {
        Anchor.store.restore(_storeSnapshot);
        _storeSnapshot = null;
        Anchor.scoring.compute();
        if (Anchor.screens.pause && Anchor.screens.pause.updatePauseBadge) {
          Anchor.screens.pause.updatePauseBadge();
        }
        if (Anchor.screens.home && Anchor.screens.home.render) {
          Anchor.screens.home.render();
        }
        if (Anchor.pmlens && Anchor.pmlens.update) {
          Anchor.pmlens.update((window.location.hash || '#home').replace('#', ''));
        }
      }
    },

    _scheduleNext: function (delay) {
      clearTimeout(_timer);
      var self = this;
      _timer = setTimeout(function () {
        if (!_active || _paused) return;
        _stepIdx++;
        self._runStep();
      }, delay);
    },

    _runStep: function () {
      if (!_active) return;
      clearSubTimers();

      if (_stepIdx >= TOUR_SCRIPT.length) {
        this.stop();
        this._showCompletion();
        return;
      }

      var step = TOUR_SCRIPT[_stepIdx];

      // Update step counter & nav button states
      updateStepLabel(_stepIdx);
      var prevBtn = document.getElementById('tour-prev-btn');
      if (prevBtn) prevBtn.disabled = (_stepIdx === 0);
      var nextBtn = document.getElementById('tour-next-btn');
      if (nextBtn) nextBtn.textContent = (_stepIdx === TOUR_SCRIPT.length - 1 ? 'Finish ✓' : 'Next ▶');

      // Navigate to the right tab
      if (step.tab) {
        Anchor.router.navigate(step.tab);
      }

      var tabSwitchDelay = step.tab ? 80 : 0;
      var self = this;

      setTimeout(function () {
        if (!_active) return;

        showCaption(step.caption);

        // Move cursor & update dim spotlight
        if (step.highlight) {
          moveCursor(step.highlight);
          updateSpotlight(step.highlight);
        } else {
          var cursor = getCursor();
          if (cursor) cursor.classList.remove('visible');
          updateSpotlight(null);
        }

        // Run optional action
        if (typeof step.action === 'function') {
          step.action();
        }

        // Schedule advance
        self._scheduleNext(step.delay);

      }, tabSwitchDelay);
    },

    _showCompletion: function () {
      var el = document.createElement('div');
      el.innerHTML =
        '<div class="sheet-header">' +
          '<div class="sheet-title" style="color:var(--status-mint)">✓ Tour Complete</div>' +
          '<div class="sheet-subtitle">You\'ve seen all 5 ANCHOR screens · Scores restored to baseline</div>' +
        '</div>' +
        '<div class="sheet-body">' +
          '<div style="display:flex;flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-4)">' +
            '<div class="card--row" style="padding:var(--space-2) var(--space-3)">' +
              '<span style="font-size:1.1rem">🏠</span>' +
              '<div class="text-xs" style="flex:1"><strong>Home</strong> — Drift Ring, Agency Score (55–80 band), 4 orbit sub-scores.</div>' +
            '</div>' +
            '<div class="card--row" style="padding:var(--space-2) var(--space-3)">' +
              '<span style="font-size:1.1rem">⏸</span>' +
              '<div class="text-xs" style="flex:1"><strong>Pause</strong> — Stakes queue, Choose-First sealed reveal, 1.2s Hold-to-Confirm.</div>' +
            '</div>' +
            '<div class="card--row" style="padding:var(--space-2) var(--space-3)">' +
              '<span style="font-size:1.1rem">🪞</span>' +
              '<div class="text-xs" style="flex:1"><strong>Mirror</strong> — 8-domain radar, Echo Index (60% — "you changed, not Sia learned").</div>' +
            '</div>' +
            '<div class="card--row" style="padding:var(--space-2) var(--space-3)">' +
              '<span style="font-size:1.1rem">🎛</span>' +
              '<div class="text-xs" style="flex:1"><strong>Autonomy</strong> — 4-position rotary dials, 7-day counterfactual simulation.</div>' +
            '</div>' +
            '<div class="card--row" style="padding:var(--space-2) var(--space-3)">' +
              '<span style="font-size:1.1rem">📋</span>' +
              '<div class="text-xs" style="flex:1"><strong>Ledger</strong> — Flight recorder, influence audit, regret feedback loop.</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:var(--space-3);flex-wrap:wrap">' +
            '<button class="btn btn--primary btn--full" id="tour-done-explore">Explore freely</button>' +
            '<button class="btn btn--secondary btn--full" id="tour-done-replay">↺ Replay tour</button>' +
          '</div>' +
          '<button class="btn btn--ghost btn--full" id="tour-done-reset" style="margin-top:var(--space-2);color:var(--drift-amber)">↺ Reset demo data</button>' +
        '</div>';

      Anchor.ui.openSheet(el, { label: 'Tour complete' });

      var exploreBtn = document.getElementById('tour-done-explore');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', function () {
          Anchor.ui.closeSheet();
          Anchor.router.navigate('home');
        });
      }

      var replayBtn = document.getElementById('tour-done-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', function () {
          Anchor.ui.closeSheet();
          tour.start();
        });
      }

      var resetBtn = document.getElementById('tour-done-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          Anchor.ui.closeSheet();
          Anchor.store.reset();
          Anchor.data.seed();
          Anchor.scoring.compute();
          if (Anchor.screens.pause && Anchor.screens.pause.updatePauseBadge) {
            Anchor.screens.pause.updatePauseBadge();
          }
          Anchor.router.navigate('home');
          if (Anchor.screens.home && Anchor.screens.home.render) {
            Anchor.screens.home.render();
          }
          if (Anchor.pmlens && Anchor.pmlens.update) {
            Anchor.pmlens.update('home');
          }
          Anchor.ui.showToast('Demo data reset to baseline.', 'info');
        });
      }
    }
  };

  Anchor.tour = tour;
})();
