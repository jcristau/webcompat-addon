"use strict";

/**
 * Bug 1472081 - election.gov.np - Override window.sidebar with something falsey
 * WebCompat issue #11622 - https://webcompat.com/issues/11622
 *
 * This site is blocking onmousedown and onclick if window.sidebar is something
 * that evaluates to true, rendering the form fields unusable. This patch
 * overrides window.sidebar with false, so the blockign event handlers won't
 * get registered.
 */

/* globals exportFunction */

Object.defineProperty(window.wrappedJSObject, "sidebar", {
  get: exportFunction(function() {
    return false;
  }, window),

  set: exportFunction(function() {}, window)
});
