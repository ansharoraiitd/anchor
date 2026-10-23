/**
 * ANCHOR — UI Helpers
 * Shared utilities: toasts, bottom sheets, skeletons, number animation, confirm dialog.
 */

window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  // ─── Toast ───────────────────────────────────────────────

  function showToast(msg, type, duration) {
    var container = document.getElementById('toast-container');
    if (!container) return;

    type = type || 'default'; // default | warn | success | info
    duration = duration || 3000;

    var toast = document.createElement('div');
    toast.className = 'toast' + (type !== 'default' ? ' toast--' + type : '');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    var icon = '';
    if (type === 'success') icon = '✓ ';
    if (type === 'warn')    icon = '⚠ ';
    if (type === 'info')    icon = 'ℹ ';

    toast.textContent = icon + msg;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('visible');
      });
    });

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  // ─── Bottom Sheet ─────────────────────────────────────────

  var _sheetBackdrop = null;
  var _sheet = null;

  function openSheet(contentEl, opts) {
    opts = opts || {};
    closeSheet(true); // close any existing sheet

    var mount = document.getElementById('phone-frame') || document.body;

    // Backdrop
    _sheetBackdrop = document.createElement('div');
    _sheetBackdrop.className = 'sheet-backdrop';
    _sheetBackdrop.addEventListener('click', function () { closeSheet(); });
    mount.appendChild(_sheetBackdrop);

    // Sheet
    _sheet = document.createElement('div');
    _sheet.className = 'bottom-sheet' + (opts.isDecisionSheet ? ' bottom-sheet--decision' : '');
    _sheet.setAttribute('role', 'dialog');
    _sheet.setAttribute('aria-modal', 'true');
    if (opts.label) _sheet.setAttribute('aria-label', opts.label);

    var handle = document.createElement('div');
    handle.className = 'sheet-handle';
    _sheet.appendChild(handle);

    _sheet.appendChild(contentEl);
    mount.appendChild(_sheet);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        _sheetBackdrop.classList.add('visible');
        _sheet.classList.add('open');
      });
    });

    // Trap focus
    var focusable = _sheet.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();

    // Keyboard close
    var escHandler = function (e) {
      if (e.key === 'Escape') { closeSheet(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
  }

  function closeSheet(instant) {
    if (!_sheet) return;
    if (instant) {
      if (_sheet.parentNode) _sheet.parentNode.removeChild(_sheet);
      if (_sheetBackdrop && _sheetBackdrop.parentNode) _sheetBackdrop.parentNode.removeChild(_sheetBackdrop);
      _sheet = null; _sheetBackdrop = null;
      return;
    }
    _sheet.classList.remove('open');
    _sheetBackdrop.classList.remove('visible');
    var s = _sheet, b = _sheetBackdrop;
    _sheet = null; _sheetBackdrop = null;
    setTimeout(function () {
      if (s.parentNode) s.parentNode.removeChild(s);
      if (b.parentNode) b.parentNode.removeChild(b);
    }, 400);
  }

  // ─── Skeleton Loaders ──────────────────────────────────────

  function showSkeleton(container, lines) {
    container.innerHTML = '';
    for (var i = 0; i < (lines || 3); i++) {
      var sk = document.createElement('div');
      sk.className = 'skeleton skeleton--line';
      sk.style.width = (60 + Math.random() * 35) + '%';
      container.appendChild(sk);
    }
  }

  function hideSkeleton(container, contentHTML) {
    return new Promise(function (resolve) {
      var delay = 300 + Math.random() * 300;
      setTimeout(function () {
        container.innerHTML = contentHTML || '';
        resolve();
      }, delay);
    });
  }

  // ─── Animated Number Counter ──────────────────────────────

  function animateNumber(el, from, to, duration) {
    var start = null;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { el.textContent = to; return; }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      el.textContent = Math.round(from + (to - from) * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ─── Custom Confirm Dialog ────────────────────────────────

  function confirm(msg, opts) {
    return new Promise(function (resolve) {
      opts = opts || {};
      var el = document.createElement('div');
      el.className = 'sheet-body';
      el.innerHTML =
        '<p style="font-size:var(--text-base);color:var(--neutral-700);line-height:var(--lh-snug);margin-bottom:var(--space-5);">' + msg + '</p>' +
        '<div style="display:flex;gap:var(--space-3);">' +
          '<button class="btn btn--ghost btn--full" id="confirm-cancel">' + (opts.cancelLabel || 'Cancel') + '</button>' +
          '<button class="btn btn--primary btn--full" id="confirm-ok">' + (opts.okLabel || 'Confirm') + '</button>' +
        '</div>';

      openSheet(el, { label: msg });

      el.querySelector('#confirm-ok').addEventListener('click', function () {
        closeSheet();
        resolve(true);
      });
      el.querySelector('#confirm-cancel').addEventListener('click', function () {
        closeSheet();
        resolve(false);
      });
    });
  }

  // ─── Formatting helpers ───────────────────────────────────

  function formatTime(ts) {
    var d = new Date(ts);
    var now = new Date();
    var diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return 'Today, ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday, ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
           d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(ts) {
    var d = new Date(ts);
    var now = new Date();
    var diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  }

  function scoreColor(score, invert) {
    if (invert) {
      // For influence: higher is better
      if (score >= 75) return 'var(--green-600)';
      if (score >= 55) return 'var(--orange-500)';
      return 'var(--red-600)';
    }
    if (score >= 75) return 'var(--blue-primary)';
    if (score >= 55) return 'var(--orange-500)';
    return 'var(--red-600)';
  }

  // ─── Menu popup toggle ────────────────────────────────────

  function toggleMenu(menuId) {
    var menu = document.getElementById(menuId);
    if (!menu) return;
    var isOpen = menu.classList.contains('open');
    // Close all menus first
    document.querySelectorAll('.menu-popup.open').forEach(function (m) { m.classList.remove('open'); });
    if (!isOpen) {
      menu.classList.add('open');
      // Close on outside click
      setTimeout(function () {
        document.addEventListener('click', function onOut(e) {
          if (!menu.contains(e.target)) {
            menu.classList.remove('open');
            document.removeEventListener('click', onOut);
          }
        });
      }, 0);
    }
  }

  Anchor.ui = {
    showToast: showToast,
    openSheet: openSheet,
    closeSheet: closeSheet,
    showSkeleton: showSkeleton,
    hideSkeleton: hideSkeleton,
    animateNumber: animateNumber,
    confirm: confirm,
    formatTime: formatTime,
    formatDate: formatDate,
    scoreColor: scoreColor,
    toggleMenu: toggleMenu
  };
})();

