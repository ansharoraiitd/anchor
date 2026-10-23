/**
 * ANCHOR — Pause Screen (Hold-to-Confirm & Sealed Choose-First)
 * High-stakes friction, sealed prediction reveal, rubber-stamp detector,
 * and commercial influence audit.
 */

window.Anchor = window.Anchor || {};
Anchor.screens = Anchor.screens || {};

(function () {
  'use strict';

  var PM_LENS_DATA = {
    problem: 'Consent degradation: with hundreds of micro-decisions per week, approval becomes automated rubber-stamping. Pause Moments inject deliberate tactile friction only at high stakes.',
    keyDecision: 'Hold-to-Confirm (1.2s radial fill) physically embodies "consent with friction". It forces physiological deceleration on high-stakes calls (e.g. ₹74,999 laptop or career contracts), while low-stakes groceries remain 1-tap.',
    tradeoff: {
      pro: 'Choose-First hides Sia’s answer so Meera articulates what she wants before being primed by the AI model.',
      con: 'Adds ~8–12s per high-stakes card; gated strictly by the Stakes Engine to avoid notification burnout.'
    },
    metric: {
      name: 'Consent Quality',
      input: 'Time elapsed per decision, hold-to-confirm completions, choose-first articulateness',
      output: 'Consent Quality sub-score (0–100)'
    },
    notBuilt: [
      'Auto-approve timeout (e.g. approve if no answer in 24h) — violates the user-sovereignty guarantee',
      'Batch approval for mixed stakes — defeats reflective friction',
      'AI voice summary — voice agents introduce compliance biases'
    ],
    marketplace: 'For Flipkart, the Influence Check is the core trust protocol in agent-to-agent negotiations. When third-party seller agents offer loyalty kickbacks, Anchor exposes the real confidence drop (e.g. Dell confidence drops from 89% to 54%). "Verified by Anchor" badges signal uncompromised seller agents.'
  };

  var _recentApprovalTimes = [];
  var _activeDecisionId = null;
  var _chooseFirstStartTime = null;

  function render() {
    var screen = document.getElementById('screen-pause');
    if (!screen) return;

    var decisions = Anchor.store.get('decisions') || [];
    var pending = decisions.filter(function (d) { return d.state === 'pending'; });
    var done = decisions.filter(function (d) { return d.state !== 'pending'; });

    screen.innerHTML = buildHTML(pending, done);

    // Bind card clicks
    document.querySelectorAll('.pause-card[data-id]').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = card.getAttribute('data-id');
        openDecisionSheet(id);
      });
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });
    });
  }

  function buildHTML(pending, done) {
    return `
      <div class="pause-header">
        <div class="pause-header__title">
          <span>PAUSE QUEUE</span>
          ${pending.length > 0 ? '<span class="badge badge--high">' + pending.length + ' PENDING</span>' : '<span class="badge badge--low">CLEAR</span>'}
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
          Decisions requiring conscious human steering based on Stakes Telemetry.
        </div>
      </div>

      ${pending.length === 0 ? buildEmpty() : buildPendingList(pending)}

      ${done.length > 0 ? `
        <div class="section-header" style="margin-top:var(--space-4);padding-left:0;padding-right:0">
          <span class="section-title">HANDLED THIS WEEK (${done.length})</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-2)">
          ${done.map(buildDoneCard).join('')}
        </div>
      ` : ''}
    `;
  }

  function buildEmpty() {
    return `
      <div class="card" style="text-align:center;padding:var(--space-6) var(--space-4);margin-top:var(--space-3)">
        <div style="font-size:2rem;margin-bottom:var(--space-2)">✓</div>
        <div style="font-family:var(--font-hud);font-size:var(--text-sm);font-weight:700;color:var(--status-mint)">ALL STAKES CLEARED</div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:4px">Sia is executing within your designated Autonomy Dials.</div>
      </div>
    `;
  }

  function buildPendingList(pending) {
    return pending.map(buildPauseCard).join('');
  }

  function buildPauseCard(d) {
    var isHigh = d.stakeLevel === 'high';
    var isMed  = d.stakeLevel === 'medium';
    var fillClass = isHigh ? 'fill-high' : isMed ? 'fill-med' : 'fill-low';
    var filledCount = isHigh ? 4 : isMed ? 3 : 1;

    var stakesBars = [1, 2, 3, 4].map(function (idx) {
      return '<div class="stakes-bar-seg ' + (idx <= filledCount ? fillClass : '') + '"></div>';
    }).join('');

    return `
      <div class="pause-card" data-id="${d.id}" role="button" tabindex="0">
        <div class="pause-card__top">
          <div>
            <div style="font-family:var(--font-hud);font-size:10px;color:var(--text-low);letter-spacing:0.06em;text-transform:uppercase">
              ${d.categoryIcon} ${d.category} · ${d.platform}
            </div>
            <div class="pause-card__title" style="margin-top:2px">${d.title}</div>
            <div style="font-size:12px;color:var(--text-mid);margin-top:2px;line-height:1.4">${d.desc}</div>
            <div style="margin-top:var(--space-2);display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="badge badge--${d.stakeLevel}">${d.stakeLevel} stakes</span>
              ${d.influenceFlag ? '<span class="badge badge--high" style="border-color:var(--status-coral);color:#FFA4AD">⚠ SPONSORED</span>' : ''}
              ${d.anchorVerified ? '<span class="badge badge--anchor-verified">Verified</span>' : ''}
            </div>
          </div>
          ${d.amount ? '<div class="pause-card__amount">' + d.amount + '</div>' : ''}
        </div>

        <div style="margin-top:var(--space-3);padding-top:var(--space-2);border-top:1px solid var(--border-subtle)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
            <span style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);text-transform:uppercase">STAKES SCORE</span>
            <span style="font-family:var(--font-hud);font-size:10px;color:var(--text-mid)">${isHigh ? '92%' : isMed ? '64%' : '25%'}</span>
          </div>
          <div class="stakes-bar-wrap">${stakesBars}</div>
        </div>
      </div>
    `;
  }

  function buildDoneCard(d) {
    return `
      <div class="card--row" style="opacity:0.65">
        <span style="font-size:1rem">${d.categoryIcon}</span>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600;color:var(--text-high)">${d.title}</div>
          <div style="font-size:10px;font-family:var(--font-hud);color:var(--text-low)">${d.amount || ''} · ${d.category}</div>
        </div>
        <span style="font-family:var(--font-hud);font-size:10px;color:var(--status-mint)">APPROVED</span>
      </div>
    `;
  }

  // ── Modal Sheet for Decision ────────────────────────────────

  function openDecisionSheet(decisionId) {
    var decisions = Anchor.store.get('decisions') || [];
    var d = decisions.find(function (x) { return x.id === decisionId; });
    if (!d) return;

    _activeDecisionId = decisionId;
    var el = buildDecisionSheetEl(d);
    Anchor.ui.openSheet(el, { label: d.title, isDecisionSheet: true });
    bindDecisionActions(el, d);
  }

  function buildDecisionSheetEl(d) {
    var el = document.createElement('div');
    el.className = 'sheet-decision-wrapper';
    var isHigh = d.stakeLevel === 'high';

    var influenceHTML = d.influenceFlag ? `
      <div class="card--danger" style="margin-top:var(--space-3)">
        <div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--status-coral);margin-bottom:4px">
          ⚠ INFLUENCE CHECK: THIRD-PARTY BID DETECTED
        </div>
        <div style="font-size:12px;color:var(--text-high);line-height:1.4">${d.influenceDetail}</div>
        <div style="display:flex;gap:var(--space-3);margin-top:var(--space-3);padding-top:var(--space-2);border-top:1px solid rgba(255,92,108,0.25)">
          <div>
            <div style="font-family:var(--font-hud);font-size:1.4rem;font-weight:800;color:var(--status-coral)">54%</div>
            <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low)">SIA UNBIASED</div>
          </div>
          <div>
            <div style="font-family:var(--font-hud);font-size:1.4rem;font-weight:800;color:var(--sia-violet)">89%</div>
            <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low)">WITH SPONSOR BID</div>
          </div>
        </div>
      </div>
    ` : `
      <div class="card--insight" style="margin-top:var(--space-3)">
        <div style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--status-mint);display:flex;align-items:center;gap:6px">
          <span>✓ NO COMMERCIAL DISTORTION DETECTED</span>
          ${d.anchorVerified ? '<span class="badge badge--anchor-verified">Verified</span>' : ''}
        </div>
        ${d.anchorVerified ? '<div style="font-size:11px;color:var(--text-mid);margin-top:4px">Agent passed continuous Anchor influence audits for 90 days.</div>' : ''}
      </div>
    `;

    el.innerHTML = `
      <div class="sheet-header">
        <div style="font-family:var(--font-hud);font-size:10px;color:var(--text-low);text-transform:uppercase">
          ${d.categoryIcon} ${d.category} · ${d.platform}
        </div>
        <div class="sheet-title" style="margin-top:2px">${d.title}</div>
        ${d.amount ? '<div style="font-family:var(--font-hud);font-size:var(--text-lg);font-weight:700;color:var(--you-cyan);margin-top:4px">' + d.amount + '</div>' : ''}
      </div>

      <div class="sheet-decision-scroll">
        <!-- Choose-First Prompt Banner with Hotspot -->
        <div class="card--insight" id="cf-prompt-banner" style="margin-bottom:var(--space-4)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--you-cyan)">CHOOSE FIRST (SOVEREIGNTY MODE)</span>
            <button class="hotspot-pin" id="hotspot-choose-first" title="PM Insight: Why Choose-First hides AI answer">?</button>
          </div>
          <div style="font-size:12px;color:var(--text-high);margin-top:4px">
            Pick your genuine preference before unsealing Sia's prediction.
          </div>
        </div>

        <!-- 3 Options -->
        <div style="display:flex;flex-direction:column;gap:var(--space-2)" id="options-container">
          ${d.options.map(function (opt) {
            return `
              <div class="option-card" data-option-id="${opt.id}" role="button" tabindex="0">
                <div style="font-size:13px;font-weight:600;color:var(--text-high)">${opt.label}</div>
                <div style="font-size:11px;color:var(--text-mid);margin-top:2px">${opt.detail}</div>
                <div style="font-size:10px;color:var(--text-low);margin-top:2px;font-family:var(--font-hud)">${opt.subtext}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Sealed Sia Card (Shown before pick) -->
        <div class="sealed-card" id="sealed-sia-card" style="margin-top:var(--space-3)">
          <div class="sealed-card__shimmer"></div>
          <div class="sealed-card__badge">🔒 SEALED AGENT PREDICTION</div>
          <div class="sealed-card__text">Sia has drafted an autonomous action. Pick an option above to unseal and compare divergence.</div>
        </div>

        <!-- Unsealed Result Box (Hidden until pick) -->
        <div id="unsealed-result-box" style="display:none;margin-top:var(--space-3)"></div>

        <!-- Influence Check Box -->
        ${influenceHTML}

        <!-- Sia Reasoning Section (Hidden until pick) -->
        <div id="sia-reasoning-box" style="display:none;margin-top:var(--space-3)">
          <div class="card">
            <div style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--sia-violet);margin-bottom:4px">SIA'S REASONING ENGINE</div>
            <div style="font-size:12px;color:var(--text-high);line-height:1.4">${d.siaReasoning}</div>
            <div style="margin-top:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--border-subtle)">
              <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);margin-bottom:3px">TELEMETRY SOURCES:</div>
              ${d.siaDataUsed.map(function (src) {
                return '<div style="font-size:10px;color:var(--text-mid)">· ' + src + '</div>';
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Action Footer (Always visible without scrolling at 900px viewport) -->
      <div class="sheet-sticky-footer" id="decision-actions-mount">
        <button class="btn btn--ghost btn--full" id="btn-peek-explain">View Sia's reasoning without choosing →</button>
        <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2)">
          <button class="btn btn--danger btn--full" id="btn-delay-24h">Delay 24h</button>
          <button class="btn btn--ghost btn--full" id="btn-never-auto">Never auto-decide</button>
        </div>
      </div>
    `;

    return el;
  }

  function bindDecisionActions(el, d) {
    _chooseFirstStartTime = Date.now();
    var optionCards = el.querySelectorAll('.option-card');
    var sealedCard = el.querySelector('#sealed-sia-card');
    var unsealBox = el.querySelector('#unsealed-result-box');
    var reasoningBox = el.querySelector('#sia-reasoning-box');
    var actionsMount = el.querySelector('#decision-actions-mount');
    var isHigh = d.stakeLevel === 'high';

    // Hotspot click
    var hotspot = el.querySelector('#hotspot-choose-first');
    if (hotspot) {
      hotspot.addEventListener('click', function (e) {
        e.stopPropagation();
        if (Anchor.pmlens && typeof Anchor.pmlens.openHotspot === 'function') {
          Anchor.pmlens.openHotspot('choose-first');
        } else if (Anchor.pmlens && typeof Anchor.pmlens.open === 'function') {
          Anchor.pmlens.open();
        }
      });
    }

    // Option Clicks
    optionCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var userChoice = card.getAttribute('data-option-id');
        var matched = (userChoice === d.siaRec);

        optionCards.forEach(function (c) {
          if (c === card) {
            c.classList.add('selected', matched ? 'match' : 'mismatch');
          } else if (c.getAttribute('data-option-id') === d.siaRec && !matched) {
            c.classList.add('sia-pick');
          }
        });

        // Dramatic Unseal
        sealedCard.style.display = 'none';
        unsealBox.style.display = 'block';
        unsealBox.className = 'card ' + (matched ? 'card--insight' : 'card--warn') + ' card-unlocked';
        unsealBox.innerHTML = matched
          ? `<div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--status-mint);margin-bottom:2px">🎯 PREDICTION ALIGNED</div>
             <div style="font-size:12px;color:var(--text-high)">You and Sia picked the exact same option. Zero divergence logged.</div>`
          : `<div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--drift-amber);margin-bottom:2px">↔ DIVERGENCE RECORDED</div>
             <div style="font-size:12px;color:var(--text-high)">Sia favored a different option. Divergence coordinates logged to Mirror radar to recalibrate weights.</div>`;

        reasoningBox.style.display = 'block';

        // Record Choose-First decision made before seeing pick
        Anchor.scoring.recordChooseFirst(d.id, matched);

        // Mount Hold-to-Confirm for high stakes or Single tap for low stakes
        renderActionButtons(actionsMount, d, userChoice, isHigh);
      });
    });

    // Peek explain without choosing
    var peekBtn = el.querySelector('#btn-peek-explain');
    if (peekBtn) {
      peekBtn.addEventListener('click', function () {
        reasoningBox.style.display = 'block';
        peekBtn.style.display = 'none';
      });
    }

    var delayBtn = el.querySelector('#btn-delay-24h');
    if (delayBtn) {
      delayBtn.addEventListener('click', function () {
        updateDecisionState(d.id, 'delayed', null, null);
        Anchor.ui.closeSheet();
        Anchor.ui.showToast('Decision snoozed for 24 hours.', 'info');
        render();
      });
    }

    var neverBtn = el.querySelector('#btn-never-auto');
    if (neverBtn) {
      neverBtn.addEventListener('click', function () {
        handleNeverAuto(d);
      });
    }
  }

  function renderActionButtons(mount, d, userChoice, isHigh) {
    if (isHigh) {
      // Hold-to-Confirm Button (1.2s radial fill)
      mount.innerHTML = `
        <button class="btn btn--hold btn--full" id="btn-hold-approve" style="height:46px;">
          <div class="btn--hold__fill" id="hold-fill-bar"></div>
          <div class="btn--hold__label">
            <span>HOLD TO CONFIRM (1.2s)</span>
            <span style="font-size:10px;opacity:0.7">🔒 HIGH STAKES</span>
          </div>
        </button>
        <div style="display:flex;gap:var(--space-2);margin-top:var(--space-1)">
          <button class="btn btn--ghost btn--full" id="btn-choose-diff">Pick differently</button>
          <button class="btn btn--danger btn--full" id="btn-delay-alt">Delay 24h</button>
        </div>
      `;

      bindHoldToConfirm(mount.querySelector('#btn-hold-approve'), d, userChoice);
    } else {
      mount.innerHTML = `
        <button class="btn btn--primary btn--full" id="btn-tap-approve">Confirm & Execute</button>
        <button class="btn btn--ghost btn--full" id="btn-choose-diff">Pick differently</button>
      `;

      var approveBtn = mount.querySelector('#btn-tap-approve');
      if (approveBtn) {
        approveBtn.addEventListener('click', function () {
          var elapsed = Date.now() - _chooseFirstStartTime;
          handleApprove(d, elapsed, userChoice);
        });
      }
    }

    var diffBtn = mount.querySelector('#btn-choose-diff');
    if (diffBtn) {
      diffBtn.addEventListener('click', function () {
        Anchor.ui.closeSheet();
        updateDecisionState(d.id, 'rejected', userChoice, null);
        Anchor.ui.showToast('Sovereign choice logged. Sia recommendation overruled.', 'info');
        render();
      });
    }
  }

  function bindHoldToConfirm(btn, d, userChoice) {
    if (!btn) return;
    var fill = btn.querySelector('#hold-fill-bar');
    var timer = null;
    var startTime = null;
    var duration = 1200; // 1.2s

    function startHold(e) {
      if (timer) return;
      if (e) e.preventDefault();
      startTime = Date.now();
      btn.classList.add('is-holding');

      timer = setInterval(function () {
        var elapsed = Date.now() - startTime;
        var pct = Math.min(100, (elapsed / duration) * 100);
        if (fill) fill.style.width = pct + '%';

        if (elapsed >= duration) {
          clearInterval(timer);
          timer = null;
          handleApprove(d, elapsed, userChoice);
        }
      }, 30);
    }

    function cancelHold() {
      if (timer) {
        clearInterval(timer);
        timer = null;
        if (fill) fill.style.width = '0%';
        btn.classList.remove('is-holding');
        Anchor.ui.showToast('Hold for full 1.2s to confirm high-stakes decision.', 'warn', 2500);
      }
    }

    // Pointer events with pointer-leave cancel
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('mouseleave', cancelHold);
    btn.addEventListener('pointerleave', cancelHold);
    window.addEventListener('mouseup', cancelHold);
    window.addEventListener('touchend', cancelHold);

    // Keyboard support: Hold Space or Enter for 1.2s
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-label', 'Hold Space or Enter for 1.2 seconds to confirm high-stakes decision');

    btn.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        if (!e.repeat && !timer) {
          e.preventDefault();
          startHold(e);
        }
      }
    });

    btn.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        cancelHold();
      }
    });

    btn.addEventListener('blur', cancelHold);
  }

  function handleApprove(d, approvalMs, userChoice) {
    _recentApprovalTimes.push(approvalMs);
    if (_recentApprovalTimes.length > 3) _recentApprovalTimes.shift();

    Anchor.scoring.recordApproval(approvalMs);

    if (Anchor.scoring.isRubberStamping()) {
      Anchor.ui.showToast('Going fast? Rubber-stamping detected on 3 consecutive decisions. Consent Quality score adjusted.', 'warn', 5000);
    }

    updateDecisionState(d.id, 'approved', userChoice, approvalMs);
    Anchor.ui.closeSheet();
    Anchor.ui.showToast('Decision confirmed and committed.', 'success');
    render();
  }

  function handleNeverAuto(d) {
    Anchor.ui.confirm(
      'Set ' + d.category + ' to "Ask me first"? Sia will halt autonomous execution on all ' + d.category.toLowerCase() + ' decisions.',
      { okLabel: 'Set Ask me first', cancelLabel: 'Cancel' }
    ).then(function (ok) {
      if (ok) {
        var dials = Anchor.store.get('autonomyDials') || [];
        var catId = 'aut-' + d.category.toLowerCase().replace(/[^a-z]/g, '');
        dials.forEach(function (dial) {
          if (dial.id === catId || dial.label.toLowerCase().includes(d.category.toLowerCase())) {
            dial.dial = 0;
          }
        });
        Anchor.store.set('autonomyDials', dials);
        updateDecisionState(d.id, 'rejected', null, null);
        Anchor.ui.showToast(d.category + ' moved to Ask me first in Autonomy.', 'success');
        render();
      }
    });
  }

  function updateDecisionState(id, state, userChoice, approvalMs) {
    Anchor.store.update('decisions', function (decisions) {
      return decisions.map(function (d) {
        if (d.id !== id) return d;
        return Object.assign({}, d, {
          state: state,
          userChoice: userChoice,
          approvalMs: approvalMs,
          approvedAt: Date.now()
        });
      });
    });
    updatePauseBadge();
  }

  function updatePauseBadge() {
    var decisions = Anchor.store.get('decisions') || [];
    var count = decisions.filter(function (d) { return d.state === 'pending'; }).length;
    var badge = document.querySelector('.tab-item[data-tab="pause"] .tab-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count === 0 ? 'none' : '';
    }
  }

  Anchor.screens.pause = {
    render: render,
    PM_LENS_DATA: PM_LENS_DATA,
    updatePauseBadge: updatePauseBadge
  };
})();
