/**
 * ANCHOR — Agent-Off Day Screen (Manual Practice HUD)
 * 24-hour deliberate practice challenges, streak rewards,
 * and skill vitality progression.
 */

window.Anchor = window.Anchor || {};
Anchor.screens = Anchor.screens || {};

(function () {
  'use strict';

  var PM_LENS_DATA = {
    problem: 'Skill atrophy: with Sia handling ~340 tasks/week, foundational human decision-making muscles atrophy. Agent-Off Day is a structured manual practice intervention.',
    keyDecision: 'Self-reported task verification avoids intrusive OS-level surveillance. Completing manual challenges builds Skill Vitality and maintains weekly streak momentum.',
    tradeoff: {
      pro: 'Provides an intentional stepping stone away from automated AI reliance.',
      con: 'Relies on self-reporting; future versions could use ambient sensor signals with strict privacy boundaries.'
    },
    metric: {
      name: 'Skill Vitality',
      input: 'Challenge completions, streak consistency, manual decisions',
      output: 'Skill Vitality sub-score (0–100) → Agency Score'
    },
    notBuilt: [
      'Public competitive leaderboards — comparison fuels insecurity rather than agency',
      'Penalties for skipping challenges — negative reinforcement causes user churn',
      'AI-authored challenge roadmaps — humans should define their own non-AI practice'
    ],
    marketplace: 'For Flipkart, Agent-Off Day drives high-intent manual exploration. Users browsing manually in "Practice Mode" discover new categories and build stronger brand affinity than automated background reorders.'
  };

  function render() {
    var screen = document.getElementById('screen-agentoff');
    if (!screen) return;

    var active = Anchor.store.get('agentOffActive');
    var streak = Anchor.store.get('agentOffStreak') || 0;
    var skillPoints = Anchor.store.get('skillPoints') || 0;
    var siaBack = Anchor.store.get('agentOffSiaBack') || false;
    var challenges = Anchor.store.get('agentOffChallenges') || [];

    screen.innerHTML = buildHTML(active, streak, skillPoints, siaBack, challenges);
    bindInteractions();
  }

  function buildHTML(active, streak, skillPoints, siaBack, challenges) {
    if (active && !siaBack) {
      return buildActiveChallengeHTML(active, streak, skillPoints);
    }
    return buildPickHTML(streak, skillPoints, challenges, siaBack);
  }

  function buildPickHTML(streak, skillPoints, challenges, justFinished) {
    return `
      <div style="margin-bottom:var(--space-3)">
        <button class="section-link" onclick="Anchor.router.navigate('home')" style="display:inline-flex;align-items:center;gap:4px;margin-bottom:var(--space-2)">
          ← Back to Agency Dashboard
        </button>
        <div style="font-family:var(--font-hud);font-size:var(--text-lg);font-weight:700;color:var(--text-high);letter-spacing:0.04em">
          AGENT-OFF DAY
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">
          Deliberate manual mode: execute one life domain without AI assistance.
        </div>

        <div style="display:flex;gap:var(--space-3);margin-top:var(--space-3)">
          <div class="card" style="flex:1;padding:var(--space-2);text-align:center">
            <div style="font-family:var(--font-hud);font-size:var(--text-xl);font-weight:800;color:var(--drift-amber)">${streak} 🔥</div>
            <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);text-transform:uppercase">WEEK STREAK</div>
          </div>
          <div class="card" style="flex:1;padding:var(--space-2);text-align:center">
            <div style="font-family:var(--font-hud);font-size:var(--text-xl);font-weight:800;color:var(--you-cyan)">${skillPoints}</div>
            <div style="font-family:var(--font-hud);font-size:9px;color:var(--text-low);text-transform:uppercase">SKILL POINTS</div>
          </div>
        </div>
      </div>

      ${justFinished ? `
        <div class="card--insight" style="margin-bottom:var(--space-3)">
          <div style="font-family:var(--font-hud);font-size:11px;font-weight:700;color:var(--you-cyan)">SIA RESTORED</div>
          <div style="font-size:12px;color:var(--text-high);margin-top:2px">Challenge completed. Skill Vitality telemetries refreshed.</div>
        </div>
      ` : ''}

      <div class="section-header" style="padding-left:0;padding-right:0">
        <span class="section-title">Select Manual Challenge</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        ${challenges.map(buildChallengeCard).join('')}
      </div>
    `;
  }

  function buildChallengeCard(ch) {
    return `
      <div class="card" style="cursor:pointer" data-challenge-id="${ch.id}" role="button" tabindex="0">
        <div style="display:flex;gap:var(--space-3);align-items:flex-start">
          <div style="font-size:1.5rem">${ch.icon}</div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:700;color:var(--text-high)">${ch.title}</div>
            <div style="font-size:11px;color:var(--text-mid);margin-top:2px;line-height:1.4">${ch.desc}</div>
            <div style="display:flex;gap:6px;margin-top:var(--space-2)">
              <span class="badge badge--you">${ch.tasks.length} TASKS</span>
              <span class="badge badge--medium">+${ch.skillPoints} SKILL PTS</span>
            </div>
          </div>
          <span style="color:var(--you-cyan);font-family:var(--font-hud);font-size:12px">START →</span>
        </div>
      </div>
    `;
  }

  function buildActiveChallengeHTML(active, streak, skillPoints) {
    var ch = active;
    var completedCount = ch.tasks.filter(function (t) { return t.done; }).length;
    var pct = Math.round((completedCount / ch.tasks.length) * 100);
    var allDone = (completedCount === ch.tasks.length);

    return `
      <div style="margin-bottom:var(--space-3)">
        <button class="section-link" onclick="Anchor.router.navigate('home')" style="display:inline-flex;align-items:center;gap:4px;margin-bottom:var(--space-2)">
          ← Back to Agency Dashboard
        </button>
        <div style="font-family:var(--font-hud);font-size:10px;font-weight:700;color:var(--status-mint);letter-spacing:0.08em">
          ACTIVE PRACTICE MODE
        </div>
        <div style="font-family:var(--font-hud);font-size:var(--text-base);font-weight:700;color:var(--text-high);margin-top:2px">
          ${ch.icon} ${ch.title}
        </div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${ch.desc}</div>

        <div style="margin-top:var(--space-3)">
          <div style="display:flex;justify-content:space-between;font-family:var(--font-hud);font-size:10px;color:var(--text-mid);margin-bottom:4px">
            <span>PROGRESS: ${completedCount} OF ${ch.tasks.length} TASKS</span>
            <span>${pct}%</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg, var(--you-cyan), var(--status-mint));transition:width 0.4s var(--ease-spring)"></div>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        ${ch.tasks.map(buildTaskItem).join('')}
      </div>

      ${allDone ? `
        <div class="card--insight" style="margin-top:var(--space-3);text-align:center">
          <div style="font-size:1.8rem;margin-bottom:4px">🎉</div>
          <div style="font-family:var(--font-hud);font-size:13px;font-weight:700;color:var(--status-mint)">ALL TASKS VERIFIED</div>
          <div style="font-size:11px;color:var(--text-high);margin-top:2px">+${ch.skillPoints} Skill Vitality points ready to claim.</div>
          <button class="btn btn--primary btn--full" id="complete-btn" style="margin-top:var(--space-3)">Claim Points & Complete</button>
        </div>
      ` : ''}

      <div style="margin-top:var(--space-4)">
        <button class="btn btn--ghost btn--full" id="sia-back-btn">Bring Sia Back Early</button>
      </div>
    `;
  }

  function buildTaskItem(t) {
    return `
      <div class="card--row" data-task-id="${t.id}" style="cursor:pointer;border-color:${t.done ? 'rgba(46,242,160,0.35)' : 'var(--border-subtle)'}" role="checkbox" aria-checked="${t.done}">
        <div style="width:18px;height:18px;border-radius:4px;border:1.5px solid ${t.done ? 'var(--status-mint)' : 'var(--border-mid)'};background:${t.done ? 'var(--status-mint)' : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${t.done ? '<span style="color:#060913;font-size:11px;font-weight:900">✓</span>' : ''}
        </div>
        <div style="flex:1;font-size:12px;color:${t.done ? 'var(--text-low)' : 'var(--text-high)'};${t.done ? 'text-decoration:line-through' : ''}">
          ${t.text}
        </div>
      </div>
    `;
  }

  function bindInteractions() {
    document.querySelectorAll('[data-challenge-id]').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = card.getAttribute('data-challenge-id');
        startChallenge(id);
      });
    });

    document.querySelectorAll('[data-task-id]').forEach(function (row) {
      row.addEventListener('click', function () {
        var taskId = row.getAttribute('data-task-id');
        toggleTask(taskId);
      });
    });

    var completeBtn = document.getElementById('complete-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', function () { completeChallenge(); });
    }

    var siaBackBtn = document.getElementById('sia-back-btn');
    if (siaBackBtn) {
      siaBackBtn.addEventListener('click', function () {
        Anchor.ui.confirm('Bring Sia back early? Partial progress is preserved, but full skill points require task completion.', {
          okLabel: 'Restore Sia',
          cancelLabel: 'Keep Practicing'
        }).then(function (ok) {
          if (ok) {
            Anchor.store.set('agentOffSiaBack', true);
            Anchor.ui.showToast('Sia restored.', 'info');
            render();
          }
        });
      });
    }
  }

  function startChallenge(id) {
    var challenges = Anchor.store.get('agentOffChallenges') || [];
    var ch = challenges.find(function (c) { return c.id === id; });
    if (!ch) return;
    var fresh = Object.assign({}, ch, {
      tasks: ch.tasks.map(function (t) { return Object.assign({}, t, { done: false }); })
    });
    Anchor.store.set('agentOffActive', fresh);
    Anchor.store.set('agentOffSiaBack', false);
    Anchor.ui.showToast('Manual Challenge Activated. Sia stepped back.', 'info');
    render();
  }

  function toggleTask(taskId) {
    Anchor.store.update('agentOffActive', function (ch) {
      if (!ch) return ch;
      var tasks = ch.tasks.map(function (t) {
        return t.id === taskId ? Object.assign({}, t, { done: !t.done }) : t;
      });
      return Object.assign({}, ch, { tasks: tasks });
    });
    render();
  }

  function completeChallenge() {
    var active = Anchor.store.get('agentOffActive');
    if (!active) return;

    Anchor.store.update('skillPoints', function (pts) { return (pts || 0) + active.skillPoints; });
    Anchor.store.update('agentOffStreak', function (n) { return (n || 0) + 1; });
    Anchor.store.set('agentOffActive', null);
    Anchor.store.set('agentOffSiaBack', true);

    Anchor.scoring.compute();
    Anchor.ui.showToast('+' + active.skillPoints + ' Skill Points Claimed! Streak extended 🔥', 'success');
    render();
  }

  Anchor.screens.agentoff = {
    render: render,
    PM_LENS_DATA: PM_LENS_DATA
  };
})();
