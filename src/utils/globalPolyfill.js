// This file provides polyfills for Node.js global objects in the browser environment

// Polyfill for global
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  window.global = window;
}

// Polyfill for process
if (typeof window !== 'undefined' && typeof process === 'undefined') {
  window.process = {
    env: {},
    browser: true,
    version: '',
    nextTick: function(fn) { setTimeout(fn, 0); }
  };
}

// Polyfill for Buffer
if (typeof window !== 'undefined' && typeof Buffer === 'undefined') {
  window.Buffer = {
    isBuffer: function() { return false; }
  };
}
