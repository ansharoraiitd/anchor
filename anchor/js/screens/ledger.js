/**
 * ANCHOR — Ledger Screen (Decision Black Box)
 * Glowing vertical spine timeline, expandable entries,
 * soft pulsing influence flags, and regret feedback.
 */

window.Anchor = window.Anchor || {};
Anchor.screens = Anchor.screens || {};

(function () {
  'use strict';

  var PM_LENS_DATA = {
    problem: 'Decision accountability: across ~340 autonomous micro-tasks weekly, people lose track of what agents executed. The Ledger functions as the black-box flight recorder.',
    keyDecision: 'Regret marking ("Did you regret this?") provides genuine counter-preferential training signals. It exposes whether Sia’s predictive choices aligned with long-term reflective satisfaction.',
    tradeoff: {
      pro: 'The influence-flagged filter isolates agent-to-agent conflicts of interest in one glance.',
      con: 'Asking users to confirm regret can feel punitive; framed as calibration feedback to maintain engagement.'
    },
    metric: {
      name: 'Preference Alignment',
      input: 'Regret logs, influence flag counts, undo invocations',
      output: 'Preference Alignment & Influence Exposure sub-scores'
    },
    notBuilt: [
      'Irreversible bank-wire rollbacks — constrained by banking API protocols',
      'Export to enterprise tax software — outside consumer sovereignty scope',
      'Shared multi-party ledger — violates individual autonomy privacy'
    ],
    marketplace: 'In marketplace economics, the Ledger provides indisputable provenance for agent transactions. Flagged seller recommendations that accumulate high regret ratings automatically reduce the seller agent’s trust tier on Flipkart.'
  };

  var _activeFilter = 'all';
  var _searchQuery = '';
  var _expandedIds = {};

  function render() {
    var screen = document.getElementById('screen-ledger');
    if (!screen) return;

    var ledger = Anchor.store.get('ledger') || [];
    var filtered = applyFilter(ledger, _activeFilter, _searchQuery);

    screen.innerHTML = buildHTML(ledger, filtered);
    bindInteractions(ledger);
  }

  function buildHTML(all, filtered) {
    var totalDecisions = all.length;
    var reviewed = all.filter(function (l) { return l.regret !== null; }).length;
    var regretted = all.filter(function (l) { return l.regret === true; }).length;
    var influenceFlagged = all.filter(function (l) { return l.influenceFlag; }).length;
    var reviewPct = totalDecisions > 0 ? Math.round(reviewed / totalDecisions * 100) : 0;
    var regretRate = reviewed > 0 ? Math.round(regretted / reviewed * 100) : 0;

    var grouped = groupByDate(filtered);

    return `
      <!-- Header Summary -->
      <div style="margin-bottom:var(--space-3)">
        <div style="font-family:var(--font-hud);font-size:var(--text-lg);font-weight:700;color:var(--text-high);letter-spacing:0.04em">
          BLACK BOX LEDGER
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
          Immutable audit trail of Sia's autonomous executions.
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-2);margin-top:var(--space-3)">
          <div class="card" style="padding:var(--space-2);text-align:center">
            <div style="font-family:var(--font-hud);font-size:var(--text-xl);font-weight:700;color:var(--you-cyan)">${totalDecisions}</div>
            <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);text-transform:uppercase">DECISIONS</div>
          </div>
          <div class="card" style="padding:var(--space-2);text-align:center">
            <div style="font-family:var(--font-hud);font-size:var(--text-xl);font-weight:700;color:var(--status-mint)">${reviewPct}%</div>
            <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);text-transform:uppercase">REVIEWED</div>
          </div>
          <div class="card" style="padding:var(--space-2);text-align:center">
            <div style="font-family:var(--font-hud);font-size:var(--text-xl);font-weight:700;color:${regretRate > 10 ? 'var(--status-coral)' : 'var(--text-high)'}">${regretRate}%</div>
            <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);text-transform:uppercase">REGRET RATE</div>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div style="margin-bottom:var(--space-2)">
        <input type="search" id="ledger-search" placeholder="Search actions, categories, merchants…"
          value="${_searchQuery}"
          style="width:100%;padding:8px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-pill);font-size:12px;font-family:var(--font-hud);background:rgba(255,255,255,0.03);color:var(--text-high);outline:none;"
          aria-label="Search ledger items">
      </div>

      <!-- Filter Chips -->
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:var(--space-2);margin-bottom:var(--space-2);scrollbar-width:none">
        ${['all', 'influence', 'regretted', 'high-stakes'].map(function (f) {
          var labels = {
            all: 'ALL',
            influence: '⚠ INFLUENCE FLAGGED (' + influenceFlagged + ')',
            regretted: '↩ REGRETS (' + regretted + ')',
            'high-stakes': '🔴 HIGH STAKES'
          };
          var isActive = (f === _activeFilter);
          return '<button class="btn btn--sm ' + (isActive ? 'btn--primary' : 'btn--ghost') + ' ledger-filter-btn" data-filter="' + f + '">' + labels[f] + '</button>';
        }).join('')}
      </div>

      <!-- Timeline with Glowing Vertical Spine -->
      <div class="ledger-timeline-spine" id="ledger-list">
        ${grouped.length === 0
          ? '<div class="card" style="text-align:center;padding:var(--space-5)"><div style="font-size:12px;color:var(--text-mid)">No ledger events match current filter.</div></div>'
          : grouped.map(buildDateGroup).join('')}
      </div>
    `;
  }

  function buildDateGroup(group) {
    return `
      <div style="margin-bottom:var(--space-4)">
        <div style="font-family:var(--font-hud);font-size:10px;font-weight:700;letter-spacing:0.08em;color:var(--text-low);margin-bottom:var(--space-2)">
          ${group.label.toUpperCase()}
        </div>
        <div>
          ${group.entries.map(buildLedgerNode).join('')}
        </div>
      </div>
    `;
  }

  function buildLedgerNode(entry) {
    var isFlagged = entry.influenceFlag;
    var isExpanded = !!_expandedIds[entry.id];

    return `
      <div class="ledger-node" data-entry-id="${entry.id}">
        <div class="ledger-node__dot ${isFlagged ? 'flagged' : ''}"></div>
        <div class="ledger-card-expandable card" data-id="${entry.id}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-2)">
            <div style="flex:1">
              <div style="font-size:12.5px;font-weight:600;color:var(--text-high);line-height:1.35">${entry.desc}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap">
                <span class="badge badge--you" style="font-size:9px">${entry.category}</span>
                ${isFlagged ? '<span class="badge badge--high" style="font-size:9px">⚠ SPONSORED BID</span>' : ''}
                <span style="font-family:var(--font-hud);font-size:9px;color:var(--text-low)">${Anchor.ui.formatTime(entry.ts)}</span>
              </div>
            </div>
            ${entry.amount ? '<div style="font-family:var(--font-hud);font-size:12px;font-weight:700;color:var(--you-cyan);white-space:nowrap">' + entry.amount + '</div>' : ''}
          </div>

          <!-- Expanded Detail View -->
          ${isExpanded ? `
            <div style="margin-top:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--border-subtle);font-size:11px;color:var(--text-mid);line-height:1.4">
              <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);margin-bottom:2px">SIA'S REASONING:</div>
              <div>${entry.reasoning || 'Executed within standard autonomous schedule.'}</div>
              ${isFlagged && entry.influenceDetail ? `
                <div style="margin-top:4px;color:#FFA4AD;background:rgba(255,92,108,0.1);padding:4px 6px;border-radius:4px">
                  ⚠ ${entry.influenceDetail}
                </div>
              ` : ''}

              <!-- Regret & Undo Controls -->
              <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);align-items:center">
                ${entry.regret === null ? `
                  <button class="btn btn--sm btn--ghost regret-btn" data-id="${entry.id}" data-val="false" style="font-size:9px">👍 Good Call</button>
                  <button class="btn btn--sm btn--danger regret-btn" data-id="${entry.id}" data-val="true" style="font-size:9px">👎 Regret Decision</button>
                ` : entry.regret === true ? `
                  <span style="font-family:var(--font-hud);font-size:10px;color:var(--status-coral)">👎 MARKED AS REGRET</span>
                ` : `
                  <span style="font-family:var(--font-hud);font-size:10px;color:var(--status-mint)">👍 CONFIRMED SATISFACTION</span>
                `}

                ${entry.canUndo ? `
                  <button class="btn btn--sm btn--secondary undo-btn" data-id="${entry.id}" style="font-size:9px;margin-left:auto">Undo Action →</button>
                ` : ''}
              </div>
            </div>
          ` : `
            <div style="margin-top:4px;display:flex;justify-content:flex-end">
              <span style="font-family:var(--font-hud);font-size:9px;color:var(--you-cyan)">TAP TO EXPAND AUDIT TRAIL ▾</span>
            </div>
          `}
        </div>
      </div>
    `;
  }

  function groupByDate(entries) {
    var groups = {};
    var order = [];
    entries.forEach(function (entry) {
      var label = Anchor.ui.formatDate(entry.ts);
      if (!groups[label]) { groups[label] = []; order.push(label); }
      groups[label].push(entry);
    });
    return order.map(function (label) {
      return { label: label, entries: groups[label] };
    });
  }

  function applyFilter(ledger, filter, query) {
    var result = ledger.slice();
    result.sort(function (a, b) { return b.ts - a.ts; });

    if (filter === 'influence') result = result.filter(function (l) { return l.influenceFlag; });
    if (filter === 'regretted') result = result.filter(function (l) { return l.regret === true; });
    if (filter === 'high-stakes') result = result.filter(function (l) { return l.stakeLevel === 'high'; });

    if (query) {
      var q = query.toLowerCase();
      result = result.filter(function (l) {
        return (l.desc || '').toLowerCase().includes(q) ||
               (l.category || '').toLowerCase().includes(q) ||
               (l.reasoning || '').toLowerCase().includes(q);
      });
    }
    return result;
  }

  function bindInteractions(allLedger) {
    // Filter Buttons
    document.querySelectorAll('.ledger-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _activeFilter = btn.getAttribute('data-filter');
        render();
      });
    });

    // Expandable Cards
    document.querySelectorAll('.ledger-card-expandable').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.regret-btn') || e.target.closest('.undo-btn')) return;
        var id = card.getAttribute('data-id');
        _expandedIds[id] = !_expandedIds[id];
        render();
      });
    });

    // Search
    var searchInput = document.getElementById('ledger-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        _searchQuery = searchInput.value;
        var filtered = applyFilter(allLedger, _activeFilter, _searchQuery);
        var list = document.getElementById('ledger-list');
        if (list) {
          var grouped = groupByDate(filtered);
          list.innerHTML = grouped.length === 0
            ? '<div class="card" style="text-align:center;padding:var(--space-5)"><div style="font-size:12px;color:var(--text-mid)">No ledger events match query.</div></div>'
            : grouped.map(buildDateGroup).join('');
          bindCardEvents();
        }
      });
    }

    bindCardEvents();
  }

  function bindCardEvents() {
    document.querySelectorAll('.regret-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        var val = btn.getAttribute('data-val') === 'true';
        markRegret(id, val);
      });
    });

    document.querySelectorAll('.undo-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        handleUndo(id);
      });
    });
  }

  function markRegret(id, val) {
    Anchor.store.update('ledger', function (ledger) {
      return ledger.map(function (l) {
        return l.id === id ? Object.assign({}, l, { regret: val }) : l;
      });
    });
    if (val) {
      Anchor.store.update('regretCount', function (n) { return (n || 0) + 1; });
      Anchor.ui.showToast('Regret logged. Recalibrating Preference Alignment model.', 'warn');
    } else {
      Anchor.ui.showToast('Satisfaction confirmed.', 'success');
    }
    Anchor.scoring.compute();
    render();
  }

  function handleUndo(id) {
    Anchor.ui.confirm('Roll back this booking? Sia will send an automated cancellation request.', {
      okLabel: 'Rollback Action',
      cancelLabel: 'Keep Action'
    }).then(function (ok) {
      if (ok) {
        Anchor.store.update('ledger', function (ledger) {
          return ledger.map(function (l) {
            return l.id === id ? Object.assign({}, l, { outcome: 'Undone', canUndo: false }) : l;
          });
        });
        Anchor.ui.showToast('Action rolled back successfully.', 'success');
        render();
      }
    });
  }

  Anchor.screens.ledger = {
    render: render,
    PM_LENS_DATA: PM_LENS_DATA
  };
})();
