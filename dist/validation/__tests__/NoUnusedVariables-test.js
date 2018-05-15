"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _NoUnusedVariables = require("../rules/NoUnusedVariables");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function unusedVar(varName, opName, line, column) {
  return {
    message: (0, _NoUnusedVariables.unusedVariableMessage)(varName, opName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: No unused variables', function () {
  (0, _mocha.it)('uses all variables', function () {
    (0, _harness.expectPassesRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query ($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ");
  });
  (0, _mocha.it)('uses all variables deeply', function () {
    (0, _harness.expectPassesRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a) {\n          field(b: $b) {\n            field(c: $c)\n          }\n        }\n      }\n    ");
  });
  (0, _mocha.it)('uses all variables deeply in inline fragments', function () {
    (0, _harness.expectPassesRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ... on Type {\n          field(a: $a) {\n            field(b: $b) {\n              ... on Type {\n                field(c: $c)\n              }\n            }\n          }\n        }\n      }\n    ");
  });
  (0, _mocha.it)('uses all variables in fragments', function () {
    (0, _harness.expectPassesRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ");
  });
  (0, _mocha.it)('variable used by fragment in multiple operations', function () {
    (0, _harness.expectPassesRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      query Bar($b: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ");
  });
  (0, _mocha.it)('variable used by recursive fragment', function () {
    (0, _harness.expectPassesRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragA\n        }\n      }\n    ");
  });
  (0, _mocha.it)('variable not used', function () {
    (0, _harness.expectFailsRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query ($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b)\n      }\n    ", [unusedVar('c', null, 2, 38)]);
  });
  (0, _mocha.it)('multiple variables not used', function () {
    (0, _harness.expectFailsRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(b: $b)\n      }\n    ", [unusedVar('a', 'Foo', 2, 17), unusedVar('c', 'Foo', 2, 41)]);
  });
  (0, _mocha.it)('variable not used in fragments', function () {
    (0, _harness.expectFailsRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field\n      }\n    ", [unusedVar('c', 'Foo', 2, 41)]);
  });
  (0, _mocha.it)('multiple variables not used in fragments', function () {
    (0, _harness.expectFailsRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field\n      }\n    ", [unusedVar('a', 'Foo', 2, 17), unusedVar('c', 'Foo', 2, 41)]);
  });
  (0, _mocha.it)('variable not used by unreferenced fragment', function () {
    (0, _harness.expectFailsRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ", [unusedVar('b', 'Foo', 2, 17)]);
  });
  (0, _mocha.it)('variable not used by fragment used by other operation', function () {
    (0, _harness.expectFailsRule)(_NoUnusedVariables.NoUnusedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      query Bar($a: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ", [unusedVar('b', 'Foo', 2, 17), unusedVar('a', 'Bar', 5, 17)]);
  });
});