/**
 * ANCHOR — PM Lens (Dark Glass Command Drawer)
 * Collapsed by default with subtle beacon, slides over on demand.
 * Live Metrics Tree & Hotspot Inspector.
 */

window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  var _currentTab = 'home';

  var HOTSPOT_CONTENT = {
    'drift-ring': {
      title: 'Drift Ring & Healthy Band (55–80%)',
      body: '<strong>Why not 100% Agency?</strong> In 2040, delegating ~340 tasks/week is mandatory to survive cognitive load. An Agency Score >80 means the user is over-reviewing trivial grocery or bill items, creating review fatigue. Below 55 means dangerous loss of sovereignty. 55–80 is the calibrated healthy equilibrium.',
      tag: 'CALIBRATION STRATEGY'
    },
    'choose-first': {
      title: 'Choose-First (Sovereignty Protocol)',
      body: '<strong>Why hide the AI answer?</strong> When humans see an AI recommendation first, anchoring bias causes them to rubber-stamp it in 88% of cases. Hiding Sia\'s pick forces Meera to articulate her own choice first, generating clean uncorrupted divergence data.',
      tag: 'COGNITIVE DESIGN'
    },
    'echo-index': {
      title: 'The Echo Index (Signature Harm Metric)',
      body: '<strong>The Core Harm of 2040:</strong> The true danger of hyper-personalization is not that AI makes bad picks, but that the human changes their desires to match the AI\'s suggestions. The Echo Index measures the percentage of alignment caused by human conformity rather than machine learning.',
      tag: 'SIGNATURE INSIGHT'
    },
    'simulate': {
      title: 'Counterfactual Replay Simulation',
      body: '<strong>Why simulate dial changes?</strong> Users fear tightening AI autonomy because they worry about friction. Replaying the past 7 days proves the exact trade-off: preventing 1 regret decision costs just +14 seconds of weekly deliberation time.',
      tag: 'GOVERNANCE UX'
    }
  };

  var pmlens = {
    init: function () {
      var panel = document.getElementById('pm-lens');
      var toggle = document.getElementById('pm-lens-toggle');
      if (!panel || !toggle) return;

      // Auto-open on wide screens (≥ 1280px); collapsed on narrower/mobile viewports
      var autoOpen = window.innerWidth >= 1280;

      if (autoOpen) {
        panel.classList.add('open');
        document.body.classList.add('pmlens-open');
        document.body.classList.remove('pmlens-closed');
        // No pulse-hint — it's already visible
      } else {
        panel.classList.remove('open');
        document.body.classList.remove('pmlens-open');
        document.body.classList.add('pmlens-closed');
        toggle.classList.add('pulse-hint');
      }

      // Toggle click
      toggle.addEventListener('click', function () {
        pmlens.toggle();
      });

      // Close button in drawer header
      var closeBtn = document.getElementById('pmlens-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          pmlens.close();
        });
      }

      // Live updates
      Anchor.store.subscribe('scores', function () { pmlens._renderMetricsTree(); });
      Anchor.store.subscribe('guardrails', function () { pmlens._renderMetricsTree(); });

      this.update('home');
    },

    open: function () {
      var panel = document.getElementById('pm-lens');
      var toggle = document.getElementById('pm-lens-toggle');
      if (!panel) return;
      panel.classList.add('open');
      document.body.classList.add('pmlens-open');
      document.body.classList.remove('pmlens-closed');
      if (toggle) toggle.classList.remove('pulse-hint');
      Anchor.store.set('pmlensOpen', true);
    },

    close: function () {
      var panel = document.getElementById('pm-lens');
      if (!panel) return;
      panel.classList.remove('open');
      document.body.classList.remove('pmlens-open');
      document.body.classList.add('pmlens-closed');
      Anchor.store.set('pmlensOpen', false);
    },

    toggle: function () {
      var panel = document.getElementById('pm-lens');
      if (!panel) return;
      var isOpen = panel.classList.contains('open');
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    openHotspot: function (key) {
      this.open();
      var item = HOTSPOT_CONTENT[key];
      if (!item) return;

      var spotlightMount = document.getElementById('pmlens-spotlight');
      if (spotlightMount) {
        spotlightMount.style.display = 'block';
        spotlightMount.innerHTML = `
          <div class="card--insight" style="border-color:var(--you-cyan);box-shadow:0 0 20px var(--you-glow);margin-bottom:var(--space-3)">
            <div style="font-family:var(--font-hud);font-size:9px;font-weight:700;color:var(--you-cyan);letter-spacing:0.1em">
              PINNED PM HOTSPOT · ${item.tag}
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--text-high);margin:3px 0">${item.title}</div>
            <div style="font-size:12px;color:var(--text-high);line-height:1.4">${item.body}</div>
          </div>
        `;
        spotlightMount.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },

    update: function (tab) {
      _currentTab = tab;
      var screen = Anchor.screens[tab];
      var data = (screen && screen.PM_LENS_DATA) || {};

      var header = document.getElementById('pmlens-header-screen');
      if (header) {
        header.textContent = tab.toUpperCase() + ' SCREEN';
      }

      var spotlightMount = document.getElementById('pmlens-spotlight');
      if (spotlightMount) spotlightMount.style.display = 'none';

      this._renderAnnotations(data);
      this._renderMetricsTree();
    },

    _renderAnnotations: function (data) {
      var body = document.getElementById('pmlens-annotations');
      if (!body) return;

      var marketplace = data.marketplace ? `
        <div class="lens-card lens-card--marketplace">
          <div class="lens-card__header">🛒 Why this matters for Flipkart Marketplace</div>
          <div class="lens-card__body">${data.marketplace}</div>
        </div>
      ` : '';

      var tradeoff = data.tradeoff ? `
        <div class="lens-card">
          <div class="lens-card__header">⚖ Key Design Decision & Trade-off</div>
          <div class="lens-card__body">
            <div style="font-size:11px;color:var(--text-high);margin-bottom:var(--space-2)">${data.keyDecision || ''}</div>
            <div class="tradeoff-item">
              <span class="tradeoff-pro">PRO:</span>
              <span class="tradeoff-text">${data.tradeoff.pro}</span>
            </div>
            <div class="tradeoff-item">
              <span class="tradeoff-con">CON:</span>
              <span class="tradeoff-text">${data.tradeoff.con}</span>
            </div>
          </div>
        </div>
      ` : '';

      var notBuilt = data.notBuilt ? `
        <div class="lens-card">
          <div class="lens-card__header">🚫 What We Deliberately Did NOT Build</div>
          <div class="lens-card__body">
            <ul class="not-built-list">
              ${data.notBuilt.map(function (item) { return '<li>' + item + '</li>'; }).join('')}
            </ul>
          </div>
        </div>
      ` : '';

      var metric = data.metric ? `
        <div class="lens-card">
          <div class="lens-card__header">📐 Telemetry & Metric Moved</div>
          <div class="lens-card__body">
            <div style="font-family:var(--font-hud);font-weight:700;color:var(--you-cyan);margin-bottom:2px">${data.metric.name}</div>
            <div style="font-size:11px;color:var(--text-mid)"><strong>Input:</strong> ${data.metric.input}</div>
            <div style="font-size:11px;color:var(--text-mid);margin-top:2px"><strong>Output:</strong> ${data.metric.output}</div>
          </div>
        </div>
      ` : '';

      var problem = data.problem ? `
        <div class="lens-card">
          <div class="lens-card__header">🎯 Problem Addressed</div>
          <div class="lens-card__body">${data.problem}</div>
        </div>
      ` : '';

      body.innerHTML = problem + tradeoff + metric + marketplace + notBuilt;
    },

    _renderMetricsTree: function () {
      var container = document.getElementById('pmlens-metrics');
      if (!container) return;

      var scores = Anchor.store.get('scores') || {};
      var guardrails = Anchor.store.get('guardrails') || {};

      var inputs = [
        { label: 'Preference Alignment', key: 'preference', color: 'var(--you-cyan)' },
        { label: 'Consent Quality',      key: 'consent',    color: 'var(--status-mint)' },
        { label: 'Influence Exposure',   key: 'influence',  color: 'var(--status-coral)' },
        { label: 'Skill Vitality',       key: 'skill',      color: 'var(--drift-amber)' }
      ];

      var bandLabel = scores.inHealthyBand ? 'HEALTHY RANGE ✓'
                    : scores.tooHigh ? '▲ OVER-REVIEWING'
                    : '▼ LOW AGENCY';

      container.innerHTML = `
        <div class="metrics-tree">
          <div class="metric-north-star">
            <div>
              <div class="metric-north-star__label">NORTH STAR: AGENCY SCORE</div>
              <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-mid);margin-top:1px">TARGET EQUILIBRIUM: 55–80</div>
            </div>
            <div style="text-align:right">
              <div class="metric-north-star__value">${scores.agency || 71}</div>
              <div style="font-family:var(--font-hud);font-size:9px;color:var(--status-mint);margin-top:1px">${bandLabel}</div>
            </div>
          </div>

          <!-- 4 Inputs -->
          <div style="padding:2px 0">
            ${inputs.map(function (inp) {
              var val = scores[inp.key] || 0;
              return `
                <div class="metric-row">
                  <div class="metric-row__dot" style="background:${inp.color};box-shadow:0 0 6px ${inp.color}"></div>
                  <div class="metric-row__label">${inp.label}</div>
                  <div class="metric-row__bar">
                    <div class="metric-row__bar-fill" style="width:${val}%;background:${inp.color}"></div>
                  </div>
                  <div class="metric-row__value">${val}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="hypothesis-note">
            ⚗ Formula weights (0.30/0.25/0.25/0.20) and penalty thresholds are hypotheses to validate in pilot studies.
          </div>

          <div class="guardrail-section">
            <div class="guardrail-label">GUARDRAIL METRICS (LIVE TELEMETRY)</div>
            <div class="guardrail-row">
              <span class="guardrail-row__label">Avg Friction Added:</span>
              <span class="guardrail-row__value">${guardrails.avgTaskTimeAddedSec || 8.4}s / decision</span>
            </div>
            <div class="guardrail-row">
              <span class="guardrail-row__label">Annoyance Reports (30d):</span>
              <span class="guardrail-row__value">${guardrails.annoyanceReports || 1}</span>
            </div>
            <div class="guardrail-row">
              <span class="guardrail-row__label">Feature Opt-Out Rate:</span>
              <span class="guardrail-row__value">${guardrails.optOutRate ? (guardrails.optOutRate * 100).toFixed(1) + '%' : '4.0%'}</span>
            </div>
          </div>
        </div>
      `;
    }
  };

  Anchor.pmlens = pmlens;
})();
