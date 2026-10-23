/**
 * ANCHOR — Global Store
 * Simple reactive state with localStorage persistence.
 * All app state lives here. Screens read from and write to the store.
 * The store emits change events so the PM Lens metrics tree can update live.
 */

window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  const STORAGE_KEY = 'anchor_state_v3';

  let _state = {};
  const _subscribers = {}; // key → [fn, ...]

  const store = {
    /** Read a value by key */
    get: function (key) {
      return _state[key];
    },

    /** Replace a value by key and notify subscribers */
    set: function (key, val) {
      _state[key] = val;
      _notify(key, val);
      _persist();
    },

    /** Mutate a value with an updater function */
    update: function (key, updater) {
      _state[key] = updater(_state[key]);
      _notify(key, _state[key]);
      _persist();
    },

    /** Subscribe to changes on a key. Use '*' for any key. */
    subscribe: function (key, fn) {
      if (!_subscribers[key]) _subscribers[key] = [];
      _subscribers[key].push(fn);
    },

    /** Return a shallow copy of the full state */
    getAll: function () {
      return Object.assign({}, _state);
    },

    /** Return deep clone snapshot of the entire state */
    snapshot: function () {
      try {
        return JSON.parse(JSON.stringify(_state));
      } catch (e) {
        return Object.assign({}, _state);
      }
    },

    /** Restore entire state from a snapshot and persist */
    restore: function (snapshotState) {
      if (!snapshotState || typeof snapshotState !== 'object') return;
      try {
        _state = JSON.parse(JSON.stringify(snapshotState));
      } catch (e) {
        _state = Object.assign({}, snapshotState);
      }
      _persist();
      _notify('*', null);
    },

    /** Load state from localStorage. Called once at boot. */
    hydrate: function () {
      try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          _state = JSON.parse(saved);
          return true; // had saved state
        }
      } catch (e) {
        console.warn('[Anchor] Could not hydrate store:', e);
      }
      return false;
    },

    /** Clear all state and remove from localStorage */
    reset: function () {
      _state = {};
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      _notify('*', null);
    }
  };

  function _notify(key, val) {
    (_subscribers[key] || []).forEach(function (fn) { fn(val); });
    if (key !== '*') {
      (_subscribers['*'] || []).forEach(function (fn) { fn(key, val); });
    }
  }

  function _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    } catch (e) {
      console.warn('[Anchor] Could not persist store:', e);
    }
  }

  Anchor.store = store;
})();

