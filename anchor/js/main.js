/**
 * ANCHOR — Main Application Bootstrapper
 * Loads all state, initializes scoring, wires router and PM Lens.
 */

window.Anchor = window.Anchor || {};

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Hydrate or Seed Store
  var hasSaved = Anchor.store.hydrate();
  if (!hasSaved || !Anchor.store.get('seeded')) {
    Anchor.data.seed();
  }

  // 2. Initialize Scoring Engine
  Anchor.scoring._init(Anchor.store);
  Anchor.scoring.compute();

  // 3. Initialize PM Lens
  Anchor.pmlens.init();

  // 4. Update Pending Badge on Pause Tab
  Anchor.screens.pause.updatePauseBadge();

  // 5. Initialize Guided Tour
  Anchor.tour.init();

  // 6. Initialize Router & Load Initial Screen
  Anchor.router.init();

  // 7. Bind Top Bar Navigation & Actions
  var menuBtn = document.getElementById('menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      Anchor.ui.toggleMenu('top-menu');
    });
  }

  var agentOffMenuItem = document.getElementById('menu-agentoff');
  if (agentOffMenuItem) {
    agentOffMenuItem.addEventListener('click', function () {
      Anchor.ui.toggleMenu('top-menu');
      Anchor.router.navigate('agentoff');
    });
  }

  // Tour — header button
  var tourStartBtn = document.getElementById('tour-start-btn');
  if (tourStartBtn) {
    tourStartBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      Anchor.tour.start();
    });
  }

  // Tour — menu item ("Play Guided Tour")
  var takeTourMenuItem = document.getElementById('menu-take-tour');
  if (takeTourMenuItem) {
    takeTourMenuItem.addEventListener('click', function () {
      Anchor.ui.toggleMenu('top-menu');
      Anchor.tour.start();
    });
  }

  var resetMenuItem = document.getElementById('menu-reset');
  if (resetMenuItem) {
    resetMenuItem.addEventListener('click', function () {
      Anchor.ui.toggleMenu('top-menu');
      Anchor.ui.confirm(
        'Reset all demo data to baseline? This will restore all 6 Pause moments, reseed 25 ledger items, and reset scores to Meera\'s initial state.',
        { okLabel: 'Reset data', cancelLabel: 'Keep current' }
      ).then(function (ok) {
        if (ok) {
          Anchor.store.reset();
          Anchor.data.seed();
          Anchor.scoring.compute();
          Anchor.screens.pause.updatePauseBadge();
          Anchor.router.navigate('home');
          Anchor.screens.home.render();
          Anchor.pmlens.update('home');
          Anchor.ui.showToast('Demo data reset to baseline state.', 'info');
        }
      });
    });
  }

  var aboutMenuItem = document.getElementById('menu-about');
  if (aboutMenuItem) {
    aboutMenuItem.addEventListener('click', function () {
      Anchor.ui.toggleMenu('top-menu');
      openAboutSheet();
    });
  }

  // 8. Global Keyboard Shortcuts (1-5: tabs, T: tour, L: PM Lens)
  window.addEventListener('keydown', function (e) {
    // Ignore when focus is inside text inputs or dialogs
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
      return;
    }

    var key = e.key;
    if (key === '1') { Anchor.router.navigate('home'); }
    else if (key === '2') { Anchor.router.navigate('pause'); }
    else if (key === '3') { Anchor.router.navigate('mirror'); }
    else if (key === '4') { Anchor.router.navigate('autonomy'); }
    else if (key === '5') { Anchor.router.navigate('ledger'); }
    else if (key === 't' || key === 'T') { Anchor.tour.start(); }
    else if (key === 'l' || key === 'L') { Anchor.pmlens.toggle(); }
  });
});

function openAboutSheet() {
  var el = document.createElement('div');
  el.innerHTML = `
    <div class="sheet-header">
      <div class="sheet-title">About ANCHOR</div>
      <div class="sheet-subtitle">Flipkart APM Role Submission · Year 2040</div>
    </div>
    <div class="sheet-body">
      <div style="font-family:var(--font-display);font-size:var(--text-lg);font-weight:700;color:var(--blue-primary);margin-bottom:var(--space-2)">
        "Your agent knows you. Anchor makes sure you still do."
      </div>
      <p class="text-sm" style="color:var(--neutral-700);line-height:var(--lh-snug);margin-bottom:var(--space-4)">
        By 2040, hyper-capable personal agents like <strong>Sia</strong> carry out ~340 micro-tasks weekly for persona <strong>Meera Iyer</strong> (29, Bengaluru).
        When agents predict every desire, humans stop forming them (<strong>preference atrophy</strong>) and rubber-stamp high-stakes commitments (<strong>consent degradation</strong>).
      </p>

      <div class="transparency-section__label">Core Product Innovations</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-4)">
        <div class="card--row" style="padding:var(--space-2) var(--space-3)">
          <span style="font-size:1.1rem">🎯</span>
          <div class="text-xs" style="flex:1"><strong>Agency Score (55–80 healthy band)</strong>: Balances human oversight against friction.</div>
        </div>
        <div class="card--row" style="padding:var(--space-2) var(--space-3)">
          <span style="font-size:1.1rem">⏸</span>
          <div class="text-xs" style="flex:1"><strong>Choose-First Flow</strong>: Hides agent answers to restore reflective preference formation.</div>
        </div>
        <div class="card--row" style="padding:var(--space-2) var(--space-3)">
          <span style="font-size:1.1rem">🪞</span>
          <div class="text-xs" style="flex:1"><strong>Echo Index</strong>: Detects when you drift toward the AI vs AI learning you.</div>
        </div>
        <div class="card--row" style="padding:var(--space-2) var(--space-3)">
          <span style="font-size:1.1rem">🛍</span>
          <div class="text-xs" style="flex:1"><strong>Marketplace Trust Layer</strong>: "Verified by Anchor" filters sponsored agent bids on Flipkart orders.</div>
        </div>
      </div>

      <button class="btn btn--primary btn--full" onclick="Anchor.ui.closeSheet()">Back to Prototype</button>
    </div>
  `;
  Anchor.ui.openSheet(el, { label: 'About Anchor' });
}

