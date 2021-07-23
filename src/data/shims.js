/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* globals module, require */

const AVAILABLE_SHIMS = [
  {
    id: "LiveTestShim",
    platform: "all",
    name: "Live test shim",
    bug: "livetest",
    file: "live-test-shim.js",
    matches: ["*://webcompat-addon-testbed.herokuapp.com/shims_test.js"],
    needsShimHelpers: ["getOptions", "optIn"],
  },
  {
    id: "MochitestShim",
    platform: "all",
    branch: ["all:ignoredOtherPlatform"],
    name: "Test shim for Mochitests",
    bug: "mochitest",
    file: "mochitest-shim-1.js",
    matches: [
      "*://example.com/browser/browser/extensions/webcompat/tests/browser/shims_test.js",
    ],
    needsShimHelpers: ["getOptions", "optIn"],
    options: {
      simpleOption: true,
      complexOption: { a: 1, b: "test" },
      branchValue: { value: true, branches: [] },
      platformValue: { value: true, platform: "neverUsed" },
    },
    unblocksOnOptIn: ["*://trackertest.org/*"],
  },
  {
    disabled: true,
    id: "MochitestShim2",
    platform: "all",
    name: "Test shim for Mochitests (disabled by default)",
    bug: "mochitest",
    file: "mochitest-shim-2.js",
    matches: [
      "*://example.com/browser/browser/extensions/webcompat/tests/browser/shims_test_2.js",
    ],
    needsShimHelpers: ["getOptions", "optIn"],
    options: {
      simpleOption: true,
      complexOption: { a: 1, b: "test" },
      branchValue: { value: true, branches: [] },
      platformValue: { value: true, platform: "neverUsed" },
    },
    unblocksOnOptIn: ["*://trackertest.org/*"],
  },
  {
    id: "MochitestShim3",
    platform: "all",
    name: "Test shim for Mochitests (host)",
    bug: "mochitest",
    file: "mochitest-shim-3.js",
    notHosts: ["example.com"],
    matches: [
      "*://example.com/browser/browser/extensions/webcompat/tests/browser/shims_test_3.js",
    ],
  },
  {
    id: "MochitestShim4",
    platform: "all",
    name: "Test shim for Mochitests (notHost)",
    bug: "mochitest",
    file: "mochitest-shim-3.js",
    hosts: ["example.net"],
    matches: [
      "*://example.com/browser/browser/extensions/webcompat/tests/browser/shims_test_3.js",
    ],
  },
  {
    id: "MochitestShim5",
    platform: "all",
    name: "Test shim for Mochitests (branch)",
    bug: "mochitest",
    file: "mochitest-shim-3.js",
    branches: ["never matches"],
    matches: [
      "*://example.com/browser/browser/extensions/webcompat/tests/browser/shims_test_3.js",
    ],
  },
  {
    id: "MochitestShim6",
    platform: "never matches",
    name: "Test shim for Mochitests (platform)",
    bug: "mochitest",
    file: "mochitest-shim-3.js",
    matches: [
      "*://example.com/browser/browser/extensions/webcompat/tests/browser/shims_test_3.js",
    ],
  },
  {
    id: "AdNexus",
    platform: "all",
    name: "AdNexus",
    bug: "1713696",
    file: "empty-script.js",
    matches: [
      "*://acdn.adnxs.com/ast/ast.js",
      {
        patterns: ["*://*.adnxs.com/*/pb.js", "*://*.adnxs.com/*/prebid"],
        target: "adnexus-prebid.js",
        types: ["script"],
      },
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "AdSafeProtectedGoogleIMAAdapter",
    platform: "all",
    branches: ["nightly:android"],
    name: "Ad Safe Protected Google IMA Adapter",
    bug: "1508639",
    file: "adsafeprotected-ima.js",
    matches: ["*://static.adsafeprotected.com/vans-adapter-google-ima.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "AdsByGoogle",
    platform: "all",
    name: "Ads by Google",
    bug: "1629644",
    file: "empty-script.js",
    matches: ["*://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "AmazonTAM",
    platform: "all",
    name: "Amazon Transparent Ad Marketplace",
    bug: "1713698",
    file: "apstag.js",
    matches: ["*://c.amazon-adsystem.com/aax2/apstag.js"],
  },
  {
    id: "BmAuth",
    platform: "all",
    name: "BmAuth by 9c9media",
    bug: "1486337",
    file: "bmauth.js",
    matches: ["*://auth.9c9media.ca/auth/main.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Chartbeat",
    platform: "all",
    name: "Chartbeat",
    bug: "1713699",
    file: "chartbeat.js",
    matches: [
      "*://static.chartbeat.com/js/chartbeat.js",
      "*://static.chartbeat.com/js/chartbeat_video.js",
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Criteo",
    platform: "all",
    name: "Criteo",
    bug: "1713720",
    file: "criteo.js",
    matches: ["*://static.criteo.net/js/ld/publishertag.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Doubleclick",
    platform: "all",
    name: "Doubleclick",
    bug: "1713693",
    matches: [
      {
        patterns: [
          "*://securepubads.g.doubleclick.net/gampad/*ad-blk*",
          "*://pubads.g.doubleclick.net/gampad/*ad-blk*",
        ],
        target: "empty-shim.txt",
        types: ["image", "imageset", "xmlhttprequest"],
      },
      {
        patterns: [
          "*://securepubads.g.doubleclick.net/gampad/*xml_vmap1*",
          "*://pubads.g.doubleclick.net/gampad/*xml_vmap1*",
        ],
        target: "vmad.xml",
        types: ["image", "imageset", "xmlhttprequest"],
      },
      {
        patterns: [
          "*://securepubads.g.doubleclick.net/gampad/*xml_vmap2*",
          "*://pubads.g.doubleclick.net/gampad/*xml_vmap2*",
        ],
        target: "vast2.xml",
        types: ["image", "imageset", "xmlhttprequest"],
      },
      {
        patterns: [
          "*://securepubads.g.doubleclick.net/gampad/*ad*",
          "*://pubads.g.doubleclick.net/gampad/*ad*",
        ],
        target: "vast3.xml",
        types: ["image", "imageset", "xmlhttprequest"],
      },
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Eluminate",
    platform: "all",
    name: "Eluminate",
    bug: "1503211",
    file: "eluminate.js",
    matches: ["*://libs.coremetrics.com/eluminate.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "FacebookSDK",
    platform: "all",
    branches: ["nightly:android"],
    name: "Facebook SDK",
    bug: "1226498",
    file: "facebook-sdk.js",
    logos: ["facebook.svg", "play.svg"],
    matches: [
      "*://connect.facebook.net/*/sdk.js*",
      "*://connect.facebook.net/*/all.js*",
      {
        patterns: ["*://www.facebook.com/platform/impression.php*"],
        target: "tracking-pixel.png",
        types: ["image", "imageset", "xmlhttprequest"],
      },
    ],
    needsShimHelpers: ["optIn", "getOptions"],
    onlyIfBlockedByETP: true,
    unblocksOnOptIn: [
      "*://connect.facebook.net/*/sdk.js*",
      "*://connect.facebook.net/*/all.js*",
      "*://*.xx.fbcdn.net/*", // covers:
      // "*://scontent-.*-\d.xx.fbcdn.net/*",
      // "*://static.xx.fbcdn.net/rsrc.php/*",
      "*://graph.facebook.com/v2*access_token*",
      "*://graph.facebook.com/v*/me*",
      "*://graph.facebook.com/*/picture*",
      "*://www.facebook.com/*/plugins/login_button.php*",
      "*://www.facebook.com/x/oauth/status*",
      {
        patterns: [
          "*://www.facebook.com/*/plugins/video.php*",
          "*://www.facebook.com/rsrc.php/*",
        ],
        branches: ["nightly"],
      },
    ],
  },
  {
    id: "GoogleAnalyticsAndTagManager",
    platform: "all",
    name: "Google Analytics and Tag Manager",
    bug: "1713687",
    file: "google-analytics-and-tag-manager.js",
    matches: [
      "*://www.google-analytics.com/analytics.js*",
      "*://www.google-analytics.com/gtm/js*",
      "*://www.googletagmanager.com/gtm.js*",
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "GoogleAnalyticsECommercePlugin",
    platform: "all",
    name: "Google Analytics E-Commerce Plugin",
    bug: "1620533",
    file: "google-analytics-ecommerce-plugin.js",
    matches: ["*://www.google-analytics.com/plugins/ua/ec.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "GoogleAnalyticsLegacy",
    platform: "all",
    name: "Legacy Google Analytics",
    bug: "1487072",
    file: "google-analytics-legacy.js",
    matches: ["*://ssl.google-analytics.com/ga.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "GoogleIMA",
    platform: "all",
    name: "Google Interactive Media Ads",
    bug: "1713690",
    file: "google-ima.js",
    matches: [
      "*://s0.2mdn.net/instream/html5/ima3.js",
      "*://imasdk.googleapis.com/js/sdkloader/ima3.js",
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "GooglePublisherTags",
    platform: "all",
    name: "Google Publisher Tags",
    bug: "1713685",
    file: "google-publisher-tags.js",
    matches: [
      "*://www.googletagservices.com/tag/js/gpt.js",
      "*://securepubads.g.doubleclick.net/tag/js/gpt.js",
      "*://securepubads.g.doubleclick.net/gpt/pubads_impl_*.js",
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Google SafeFrame",
    platform: "all",
    name: "Google SafeFrame",
    bug: "1713691",
    matches: [
      {
        patterns: [
          "*://tpc.googlesyndication.com/safeframe/*/html/container.html",
          "*://*.safeframe.googlesyndication.com/safeframe/*/html/container.html",
        ],
        target: "google-safeframe.html",
        types: ["sub_frame"],
      },
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "IASPET",
    platform: "all",
    name: "Integral Ad Science PET",
    bug: "1713701",
    file: "iaspet.js",
    matches: ["*://cdn.adsafeprotected.com/iasPET.1.js"],
  },
  {
    id: "MNet",
    platform: "all",
    name: "Media.net Ads",
    bug: "1713703",
    file: "empty-script.js",
    matches: ["*://adservex.media.net/videoAds.js*"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Moat",
    platform: "all",
    name: "Moat",
    bug: "1713704",
    file: "moat.js",
    matches: [
      "*://*.moatads.com/*/moatad.js*",
      "*://*.moatads.com/*/moatapi.js*",
      "*://*.moatads.com/*/moatheader.js*",
      "*://*.moatads.com/*/yi.js*",
    ],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Optimizely",
    platform: "all",
    name: "Optimizely",
    bug: "1714431",
    file: "optimizely.js",
    matches: ["*://cdn.optimizely.com/js/*.js"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "Rambler",
    platform: "all",
    name: "Rambler Authenticator",
    bug: "1606428",
    file: "rambler-authenticator.js",
    matches: ["*://id.rambler.ru/rambler-id-helper/auth_events.js"],
    needsShimHelpers: ["optIn"],
    onlyIfBlockedByETP: true,
  },
  {
    id: "RichRelevance",
    platform: "all",
    name: "Rich Relevance",
    bug: "1713725",
    file: "rich-relevance.js",
    matches: ["*://media.richrelevance.com/rrserver/js/1.2/p13n.js"],
    onlyIfBlockedByETP: true,
  },
];

module.exports = AVAILABLE_SHIMS;
