/**
 * ANCHOR — Router
 * Hash-based tab routing. Handles smooth slide transitions between screens.
 */

window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  var TABS = ['home', 'pause', 'mirror', 'autonomy', 'ledger'];
  var ALL_SCREENS = ['home', 'pause', 'mirror', 'autonomy', 'ledger', 'agentoff'];
  var currentTab = null;

  var router = {
    init: function () {
      // Bind tab bar clicks
      document.querySelectorAll('.tab-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tab = btn.getAttribute('data-tab');
          if (tab) router.navigate(tab);
        });
        // Keyboard: Enter or Space
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var tab = btn.getAttribute('data-tab');
            if (tab) router.navigate(tab);
          }
        });
      });

      // Respond to hash changes (back/forward)
      window.addEventListener('hashchange', function () {
        var tab = (window.location.hash || '#home').replace('#', '');
        if (ALL_SCREENS.includes(tab)) router._show(tab, false);
      });

      // Initial load
      var initial = (window.location.hash || '#home').replace('#', '');
      if (!ALL_SCREENS.includes(initial)) initial = 'home';
      this._show(initial, false);
    },

    navigate: function (tab) {
      if (!ALL_SCREENS.includes(tab)) return;
      if (tab === currentTab) return;
      window.location.hash = '#' + tab;
      this._show(tab, true);
    },

    _show: function (tab, animate) {
      var prev = currentTab;
      currentTab = tab;

      // Update screens
      ALL_SCREENS.forEach(function (t) {
        var el = document.getElementById('screen-' + t);
        if (!el) return;
        if (t === tab) {
          el.classList.add('active');
          if (animate && prev) {
            var goingRight = ALL_SCREENS.indexOf(tab) > ALL_SCREENS.indexOf(prev);
            el.style.transform = goingRight ? 'translateX(20px)' : 'translateX(-20px)';
            el.style.opacity = '0';
            // force reflow
            el.getBoundingClientRect();
            el.style.transform = '';
            el.style.opacity = '';
          }
        } else {
          el.classList.remove('active');
        }
      });

      // Update tab bar & sliding glow pill
      var tabIdx = TABS.indexOf(tab);
      var pill = document.getElementById('tab-indicator-pill');
      if (pill) {
        if (tabIdx >= 0) {
          pill.style.display = 'block';
          pill.style.transform = 'translateX(' + (tabIdx * 100) + '%)';
        } else {
          pill.style.display = 'none';
        }
      }

      document.querySelectorAll('.tab-item').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
        btn.setAttribute('aria-selected', btn.getAttribute('data-tab') === tab);
      });

      // Update store
      Anchor.store.set('activeTab', tab);

      // Re-render the active screen (screens handle their own render)
      var screen = Anchor.screens[tab];
      if (screen && typeof screen.render === 'function') {
        screen.render();
      }

      // Update PM Lens annotations
      if (Anchor.pmlens && typeof Anchor.pmlens.update === 'function') {
        Anchor.pmlens.update(tab);
      }
    },

    currentTab: function () { return currentTab; }
  };

  Anchor.router = router;
})();

