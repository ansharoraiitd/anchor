/**
 * ANCHOR — Autonomy Screen (Rotary Delegation Dials)
 * 4-position rotary knobs, proactive divergence suggestions,
 * before/after animated simulation, and panic killswitch.
 */

window.Anchor = window.Anchor || {};
Anchor.screens = Anchor.screens || {};

(function () {
  'use strict';

  var PM_LENS_DATA = {
    problem: 'Binary automation forces an all-or-nothing trap. Users either babysit every task or hand over blanket control. Autonomy provides granular 4-position rotary delegation per domain.',
    keyDecision: 'Rotary knobs with 4 discrete contracts (Ask First, Suggest & Wait, Act & Tell, Fully Auto) create tactile boundaries. The 7-day replay simulation proves the counterfactual value of changing a dial before committing.',
    tradeoff: {
      pro: 'Simulate Setting surfaces concrete regret decisions prevented (e.g. Pune flight reschedule clash caught).',
      con: 'Historical simulation assumes future task distributions mirror the past week.'
    },
    metric: {
      name: 'Consent Quality',
      input: 'Rotary dial positions, smart-suggestion acceptance rate, spend limits',
      output: 'Consent Quality & Autonomy Governance score'
    },
    notBuilt: [
      'Time-of-day automation rules — excessive configuration friction for a consumer app',
      'Autonomous agent financial borrowing — strict regulatory non-starter',
      'Silent override mode — defeats human-in-the-loop guarantee'
    ],
    marketplace: 'For Flipkart, rotary dial settings are high-intent commercial signals. When Meera sets Shopping to "Suggest & Wait", Flipkart’s recommendation engine presents rich product comparisons rather than triggering 1-click autonomous purchases.'
  };

  var DIAL_LABELS = ['Ask me first', 'Suggest & wait', 'Act & tell me', 'Fully auto'];

  function render() {
    var screen = document.getElementById('screen-autonomy');
    if (!screen) return;

    var dials = Anchor.store.get('autonomyDials') || [];
    var suggestions = (Anchor.store.get('autonomySuggestions') || []).filter(function (s) { return !s.dismissed && !s.accepted; });

    screen.innerHTML = buildHTML(dials, suggestions);
    bindInteractions();
  }

  function buildHTML(dials, suggestions) {
    return `
      <!-- Header -->
      <div style="margin-bottom:var(--space-3)">
        <div style="font-family:var(--font-hud);font-size:var(--text-lg);font-weight:700;color:var(--text-high);letter-spacing:0.04em">
          AUTONOMY DIALS
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
          Calibrating Sia's decision boundary across 8 operational domains.
        </div>
      </div>

      <!-- Proactive Suggestions from Divergence Telemetry -->
      ${suggestions.length > 0 ? buildSuggestions(suggestions) : ''}

      <!-- 8 Rotary Knob Rows -->
      <div class="section-header" style="padding-left:0;padding-right:0">
        <span class="section-title">Domain Rotary Dials</span>
        <span style="font-family:var(--font-hud);font-size:10px;color:var(--text-low)">TAP SEGMENT TO ROTATE</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        ${dials.map(buildRotaryRow).join('')}
      </div>

      <!-- Safety Rails & Panic Killswitch -->
      <div class="section-header" style="margin-top:var(--space-4);padding-left:0;padding-right:0">
        <span class="section-title">Hard Boundaries</span>
      </div>

      <div class="card--warn" style="margin-bottom:var(--space-2)">
        <div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--drift-amber);margin-bottom:4px">
          SYSTEM-WIDE SAFETY LIMITS
        </div>
        <div class="card--row" style="background:transparent;border:none;padding:2px 0">
          <div style="flex:1;font-size:12px;color:var(--text-high)">Global Daily Spend Cap (all agents)</div>
          <span style="font-family:var(--font-hud);font-size:12px;font-weight:700;color:var(--you-cyan)">₹25,000</span>
        </div>
        <div class="card--row" style="background:transparent;border:none;padding:2px 0">
          <div style="flex:1;font-size:12px;color:var(--text-high)">Never Auto-Send Emotional Messages</div>
          <span style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--status-mint)">ENFORCED ✓</span>
        </div>
      </div>

      <div class="card" style="border:1px solid rgba(255,92,108,0.4);background:rgba(255,92,108,0.06);margin-bottom:var(--space-4)">
        <div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--status-coral);margin-bottom:2px">
          🛑 PANIC SHUTDOWN SWITCH
        </div>
        <div style="font-size:11px;color:var(--text-mid);margin-bottom:var(--space-3)">
          Immediately revoke all autonomous execution privileges. All 8 domains drop to "Ask me first".
        </div>
        <button class="btn btn--danger btn--full" id="panic-btn">Halt All Autonomous Agent Execution</button>
      </div>
    `;
  }

  function buildSuggestions(suggestions) {
    return suggestions.map(function (s) {
      return `
        <div class="card--insight" style="margin-bottom:var(--space-3)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--you-cyan)">
              AUTONOMY RECOMMENDATION · DIVERGENCE TELEMETRY
            </span>
            <button class="hotspot-pin" id="hotspot-simulate" title="PM Insight: Counterfactual simulation">?</button>
          </div>
          <div style="font-size:12px;color:var(--text-high);margin-top:4px;line-height:1.4">${s.message}</div>
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
            <button class="btn btn--primary btn--sm sug-accept" data-sug-id="${s.id}" data-cat="${s.category}" data-to="${s.toDial}">Accept</button>
            <button class="btn btn--secondary btn--sm sug-simulate" data-sug-id="${s.id}" data-cat="${s.category}" data-from="${s.fromDial}" data-to="${s.toDial}">Simulate Impact →</button>
            <button class="btn btn--ghost btn--sm sug-dismiss" data-sug-id="${s.id}">Dismiss</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function buildRotaryRow(cat) {
    var dial = cat.dial;
    var colors = ['var(--status-mint)', 'var(--you-cyan)', 'var(--drift-amber)', 'var(--status-coral)'];
    var activeColor = colors[dial];

    return `
      <div class="rotary-item-card" data-cat="${cat.id}">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:1.1rem">${cat.icon}</span>
            <span style="font-size:13px;font-weight:600;color:var(--text-high)">${cat.label}</span>
          </div>
          <div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:${activeColor};margin-top:2px">
            ${DIAL_LABELS[dial].toUpperCase()}
          </div>
          <div style="font-family:var(--font-hud);font-size:10px;color:var(--text-low);margin-top:1px">
            ${cat.spendLimit > 0 ? 'Max ₹' + cat.spendLimit.toLocaleString('en-IN') + ' · ' : ''}${cat.reversibleOnly ? 'Reversible only' : 'All actions'}
          </div>
        </div>

        <!-- Interactive Rotary Dial Knob -->
        <div class="rotary-knob" data-cat="${cat.id}" data-level="${dial}" title="Click to rotate position" role="slider" aria-valuenow="${dial}" aria-valuemin="0" aria-valuemax="3" tabindex="0">
          <div class="rotary-knob__pointer"></div>
        </div>
      </div>
    `;
  }

  function bindInteractions() {
    // Rotary Knobs Click/Key
    document.querySelectorAll('.rotary-knob').forEach(function (knob) {
      knob.addEventListener('click', function () {
        var catId = knob.getAttribute('data-cat');
        var curr = parseInt(knob.getAttribute('data-level') || '0');
        var next = (curr + 1) % 4;
        updateDial(catId, next);
      });
      knob.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          var catId = knob.getAttribute('data-cat');
          var curr = parseInt(knob.getAttribute('data-level') || '0');
          updateDial(catId, (curr + 1) % 4);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          var catId = knob.getAttribute('data-cat');
          var curr = parseInt(knob.getAttribute('data-level') || '0');
          updateDial(catId, (curr + 3) % 4);
        }
      });
    });

    // Hotspot click
    var hotspot = document.getElementById('hotspot-simulate');
    if (hotspot) {
      hotspot.addEventListener('click', function (e) {
        e.stopPropagation();
        if (Anchor.pmlens && typeof Anchor.pmlens.openHotspot === 'function') {
          Anchor.pmlens.openHotspot('simulate');
        } else if (Anchor.pmlens && typeof Anchor.pmlens.open === 'function') {
          Anchor.pmlens.open();
        }
      });
    }

    // Smart Suggestions
    document.querySelectorAll('.sug-accept').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sugId = btn.getAttribute('data-sug-id');
        var catId = btn.getAttribute('data-cat');
        var toDial = parseInt(btn.getAttribute('data-to'));
        acceptSuggestion(sugId, catId, toDial);
      });
    });

    document.querySelectorAll('.sug-dismiss').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sugId = btn.getAttribute('data-sug-id');
        dismissSuggestion(sugId);
      });
    });

    document.querySelectorAll('.sug-simulate').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var catId = btn.getAttribute('data-cat');
        var fromDial = parseInt(btn.getAttribute('data-from'));
        var toDial = parseInt(btn.getAttribute('data-to'));
        showSimulation(catId, fromDial, toDial);
      });
    });

    // Panic Killswitch
    var panicBtn = document.getElementById('panic-btn');
    if (panicBtn) {
      panicBtn.addEventListener('click', function () {
        Anchor.ui.confirm('EMERGENCY OVERRIDE: Revoke all autonomous execution across all 8 domains? All actions will pause for manual authorization.', {
          okLabel: 'SHUT DOWN AUTONOMY',
          cancelLabel: 'Cancel'
        }).then(function (ok) {
          if (ok) {
            Anchor.store.update('autonomyDials', function (dials) {
              return dials.map(function (d) { return Object.assign({}, d, { dial: 0 }); });
            });
            Anchor.ui.showToast('All domains dropped to Ask Me First.', 'warn', 5000);
            render();
          }
        });
      });
    }
  }

  function updateDial(catId, val) {
    Anchor.store.update('autonomyDials', function (dials) {
      return dials.map(function (d) {
        return d.id === catId ? Object.assign({}, d, { dial: val }) : d;
      });
    });
    Anchor.ui.showToast('Dial set to ' + DIAL_LABELS[val] + '.', 'info');
    render();
  }

  function acceptSuggestion(sugId, catId, toDial) {
    Anchor.store.update('autonomySuggestions', function (sgs) {
      return sgs.map(function (s) { return s.id === sugId ? Object.assign({}, s, { accepted: true }) : s; });
    });
    updateDial(catId, toDial);
  }

  function dismissSuggestion(sugId) {
    Anchor.store.update('autonomySuggestions', function (sgs) {
      return sgs.map(function (s) { return s.id === sugId ? Object.assign({}, s, { dismissed: true }) : s; });
    });
    render();
  }

  // ── Animated Before / After Simulation Modal ────────────────

  function showSimulation(catId, fromDial, toDial) {
    var ledger = Anchor.store.get('ledger') || [];
    var dials = Anchor.store.get('autonomyDials') || [];
    var cat = dials.find(function (d) { return d.id === catId; }) || dials[2]; // default to Travel

    var catKeyword = cat.label.split(' ')[0].toLowerCase();
    var related = ledger.filter(function (l) {
      return l.category.toLowerCase().includes(catKeyword);
    });

    var el = document.createElement('div');
    el.innerHTML = `
      <div class="sheet-header">
        <div style="font-family:var(--font-hud);font-size:10px;color:var(--text-low);letter-spacing:0.08em">
          COUNTERFACTUAL REPLAY ENGINE
        </div>
        <div class="sheet-title" style="margin-top:2px">Simulating ${cat.label} Setting</div>
        <div class="sheet-subtitle">Replaying past 7 days: ${DIAL_LABELS[fromDial]} → ${DIAL_LABELS[toDial]}</div>
      </div>
      <div class="sheet-body">
        <!-- Before vs After Comparison Grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-4)">
          <div class="card" style="border-color:rgba(255,92,108,0.3);text-align:center">
            <div style="font-family:var(--font-hud);font-size:10px;color:var(--status-coral)">BEFORE (SUGGEST)</div>
            <div style="font-family:var(--font-hud);font-size:1.8rem;font-weight:800;color:var(--status-coral);margin-top:2px">1 REGRET</div>
            <div style="font-size:10px;color:var(--text-mid);margin-top:2px">Auto-action slipped past review</div>
          </div>

          <div class="card" style="border-color:rgba(46,242,160,0.3);text-align:center">
            <div style="font-family:var(--font-hud);font-size:10px;color:var(--status-mint)">AFTER (ASK FIRST)</div>
            <div style="font-family:var(--font-hud);font-size:1.8rem;font-weight:800;color:var(--status-mint);margin-top:2px">0 REGRETS</div>
            <div style="font-size:10px;color:var(--text-mid);margin-top:2px">+14s human friction added</div>
          </div>
        </div>

        <!-- Concrete Regret Caught Story -->
        <div class="card--warn" style="margin-bottom:var(--space-4)">
          <div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--drift-amber);margin-bottom:3px">
            🎯 1 CONCRETE REGRET DECISION PREVENTED:
          </div>
          <div style="font-size:12px;color:var(--text-high);line-height:1.4">
            <strong>Pune trip rebooking:</strong> Sia auto-moved the departure to Oct 25 without asking, clashing with your quarterly design review. Under "Ask me first", Anchor would have halted this rebooking for your explicit consent.
          </div>
        </div>

        <div style="font-family:var(--font-hud);font-size:10px;color:var(--text-low);margin-bottom:var(--space-4)">
          * Simulation replays 4 decisions across the past 7 days against new boundary rules.
        </div>

        <div style="display:flex;gap:var(--space-2)">
          <button class="btn btn--primary btn--full" id="sim-confirm-apply">Apply "${DIAL_LABELS[toDial]}"</button>
          <button class="btn btn--ghost" onclick="Anchor.ui.closeSheet()">Dismiss</button>
        </div>
      </div>
    `;

    Anchor.ui.openSheet(el, { label: 'Simulation Replay' });

    var applyBtn = el.querySelector('#sim-confirm-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', function () {
        updateDial(cat.id, toDial);
        Anchor.ui.closeSheet();
      });
    }
  }

  Anchor.screens.autonomy = {
    render: render,
    PM_LENS_DATA: PM_LENS_DATA
  };
})();
