/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { NoFragmentCycles, cycleErrorMessage } from '../rules/NoFragmentCycles';
describe('Validate: No circular fragment spreads', function () {
  it('single reference is valid', function () {
    expectPassesRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { name }\n    ");
  });
  it('spreading twice is not circular', function () {
    expectPassesRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB, ...fragB }\n      fragment fragB on Dog { name }\n    ");
  });
  it('spreading twice indirectly is not circular', function () {
    expectPassesRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB, ...fragC }\n      fragment fragB on Dog { ...fragC }\n      fragment fragC on Dog { name }\n    ");
  });
  it('double spread within abstract types', function () {
    expectPassesRule(NoFragmentCycles, "\n      fragment nameFragment on Pet {\n        ... on Dog { name }\n        ... on Cat { name }\n      }\n\n      fragment spreadsInAnon on Pet {\n        ... on Dog { ...nameFragment }\n        ... on Cat { ...nameFragment }\n      }\n    ");
  });
  it('does not false positive on unknown fragment', function () {
    expectPassesRule(NoFragmentCycles, "\n      fragment nameFragment on Pet {\n        ...UnknownFragment\n      }\n    ");
  });
  it('spreading recursively within field fails', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Human { relatives { ...fragA } },\n    ", [{
      message: cycleErrorMessage('fragA', []),
      locations: [{
        line: 2,
        column: 45
      }]
    }]);
  });
  it('no spreading itself directly', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragA }\n    ", [{
      message: cycleErrorMessage('fragA', []),
      locations: [{
        line: 2,
        column: 31
      }]
    }]);
  });
  it('no spreading itself directly within inline fragment', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Pet {\n        ... on Dog {\n          ...fragA\n        }\n      }\n    ", [{
      message: cycleErrorMessage('fragA', []),
      locations: [{
        line: 4,
        column: 11
      }]
    }]);
  });
  it('no spreading itself indirectly', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { ...fragA }\n    ", [{
      message: cycleErrorMessage('fragA', ['fragB']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 31
      }]
    }]);
  });
  it('no spreading itself indirectly reports opposite order', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragB on Dog { ...fragA }\n      fragment fragA on Dog { ...fragB }\n    ", [{
      message: cycleErrorMessage('fragB', ['fragA']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 31
      }]
    }]);
  });
  it('no spreading itself indirectly within inline fragment', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Pet {\n        ... on Dog {\n          ...fragB\n        }\n      }\n      fragment fragB on Pet {\n        ... on Dog {\n          ...fragA\n        }\n      }\n    ", [{
      message: cycleErrorMessage('fragA', ['fragB']),
      locations: [{
        line: 4,
        column: 11
      }, {
        line: 9,
        column: 11
      }]
    }]);
  });
  it('no spreading itself deeply', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { ...fragC }\n      fragment fragC on Dog { ...fragO }\n      fragment fragX on Dog { ...fragY }\n      fragment fragY on Dog { ...fragZ }\n      fragment fragZ on Dog { ...fragO }\n      fragment fragO on Dog { ...fragP }\n      fragment fragP on Dog { ...fragA, ...fragX }\n    ", [{
      message: cycleErrorMessage('fragA', ['fragB', 'fragC', 'fragO', 'fragP']),
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
      message: cycleErrorMessage('fragO', ['fragP', 'fragX', 'fragY', 'fragZ']),
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
  it('no spreading itself deeply two paths', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB, ...fragC }\n      fragment fragB on Dog { ...fragA }\n      fragment fragC on Dog { ...fragA }\n    ", [{
      message: cycleErrorMessage('fragA', ['fragB']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 3,
        column: 31
      }]
    }, {
      message: cycleErrorMessage('fragA', ['fragC']),
      locations: [{
        line: 2,
        column: 41
      }, {
        line: 4,
        column: 31
      }]
    }]);
  });
  it('no spreading itself deeply two paths -- alt traverse order', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragC }\n      fragment fragB on Dog { ...fragC }\n      fragment fragC on Dog { ...fragA, ...fragB }\n    ", [{
      message: cycleErrorMessage('fragA', ['fragC']),
      locations: [{
        line: 2,
        column: 31
      }, {
        line: 4,
        column: 31
      }]
    }, {
      message: cycleErrorMessage('fragC', ['fragB']),
      locations: [{
        line: 4,
        column: 41
      }, {
        line: 3,
        column: 31
      }]
    }]);
  });
  it('no spreading itself deeply and immediately', function () {
    expectFailsRule(NoFragmentCycles, "\n      fragment fragA on Dog { ...fragB }\n      fragment fragB on Dog { ...fragB, ...fragC }\n      fragment fragC on Dog { ...fragA, ...fragB }\n    ", [{
      message: cycleErrorMessage('fragB', []),
      locations: [{
        line: 3,
        column: 31
      }]
    }, {
      message: cycleErrorMessage('fragA', ['fragB', 'fragC']),
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
      message: cycleErrorMessage('fragB', ['fragC']),
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