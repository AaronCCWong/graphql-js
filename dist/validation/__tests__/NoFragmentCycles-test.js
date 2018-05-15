"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _NoFragmentCycles = require("../rules/NoFragmentCycles");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Validate: No circular fragment spreads', function () {
  (0, _mocha.it)('single reference is valid', function () {
    (0, _harness.expectPassesRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { name }\n    ");
  });
  (0, _mocha.it)('spreading twice is not circular', function () {
    (0, _harness.expectPassesRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB, ...fragB }\n      fragment fragB on Dog { name }\n    ");
  });
  (0, _mocha.it)('spreading twice indirectly is not circular', function () {
    (0, _harness.expectPassesRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB, ...fragC }\n      fragment fragB on Dog { ...fragC }\n      fragment fragC on Dog { name }\n    ");
  });
  (0, _mocha.it)('double spread within abstract types', function () {
    (0, _harness.expectPassesRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment nameFragment on Pet {\n        ... on Dog { name }\n        ... on Cat { name }\n      }\n\n      fragment spreadsInAnon on Pet {\n        ... on Dog { ...nameFragment }\n        ... on Cat { ...nameFragment }\n      }\n    ");
  });
  (0, _mocha.it)('does not false positive on unknown fragment', function () {
    (0, _harness.expectPassesRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment nameFragment on Pet {\n        ...UnknownFragment\n      }\n    ");
  });
  (0, _mocha.it)('spreading recursively within field fails', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Human { relatives { ...fragA } },\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', []),
      locations: [{
        line: 2,
        column: 45
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself directly', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragA }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', []),
      locations: [{
        line: 2,
        column: 31
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself directly within inline fragment', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Pet {\n        ... on Dog {\n          ...fragA\n        }\n      }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', []),
      locations: [{
        line: 4,
        column: 11
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself indirectly', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { ...fragA }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', ['fragB']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 31
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself indirectly reports opposite order', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragB on Dog { ...fragA }\n      fragment fragA on Dog { ...fragB }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragB', ['fragA']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 31
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself indirectly within inline fragment', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Pet {\n        ... on Dog {\n          ...fragB\n        }\n      }\n      fragment fragB on Pet {\n        ... on Dog {\n          ...fragA\n        }\n      }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', ['fragB']),
      locations: [{
        line: 4,
        column: 11
      }, {
        line: 9,
        column: 11
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself deeply', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { ...fragC }\n      fragment fragC on Dog { ...fragO }\n      fragment fragX on Dog { ...fragY }\n      fragment fragY on Dog { ...fragZ }\n      fragment fragZ on Dog { ...fragO }\n      fragment fragO on Dog { ...fragP }\n      fragment fragP on Dog { ...fragA, ...fragX }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', ['fragB', 'fragC', 'fragO', 'fragP']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 31
      }, {
        line: 4,
        column: 31
      }, {
        line: 8,
        column: 31
      }, {
        line: 9,
        column: 31
      }]
    }, {
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragO', ['fragP', 'fragX', 'fragY', 'fragZ']),
      locations: [{
        line: 8,
        column: 31
      }, {
        line: 9,
        column: 41
      }, {
        line: 5,
        column: 31
      }, {
        line: 6,
        column: 31
      }, {
        line: 7,
        column: 31
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself deeply two paths', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB, ...fragC }\n      fragment fragB on Dog { ...fragA }\n      fragment fragC on Dog { ...fragA }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', ['fragB']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 31
      }]
    }, {
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', ['fragC']),
      locations: [{
        line: 2,
        column: 41
      }, {
        line: 4,
        column: 31
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself deeply two paths -- alt traverse order', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragC }\n      fragment fragB on Dog { ...fragC }\n      fragment fragC on Dog { ...fragA, ...fragB }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', ['fragC']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 4,
        column: 31
      }]
    }, {
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragC', ['fragB']),
      locations: [{
        line: 4,
        column: 41
      }, {
        line: 3,
        column: 31
      }]
    }]);
  });
  (0, _mocha.it)('no spreading itself deeply and immediately', function () {
    (0, _harness.expectFailsRule)(_NoFragmentCycles.NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { ...fragB, ...fragC }\n      fragment fragC on Dog { ...fragA, ...fragB }\n    ", [{
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragB', []),
      locations: [{
        line: 3,
        column: 31
      }]
    }, {
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragA', ['fragB', 'fragC']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 41
      }, {
        line: 4,
        column: 31
      }]
    }, {
      message: (0, _NoFragmentCycles.cycleErrorMessage)('fragB', ['fragC']),
      locations: [{
        line: 3,
        column: 41
      }, {
        line: 4,
        column: 41
      }]
    }]);
  });
});