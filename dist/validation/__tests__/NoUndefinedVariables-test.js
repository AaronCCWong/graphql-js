"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _NoUndefinedVariables = require("../rules/NoUndefinedVariables");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function undefVar(varName, l1, c1, opName, l2, c2) {
  return {
    message: (0, _NoUndefinedVariables.undefinedVarMessage)(varName, opName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

(0, _mocha.describe)('Validate: No undefined variables', function () {
  (0, _mocha.it)('all variables defined', function () {
    (0, _harness.expectPassesRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ");
  });
  (0, _mocha.it)('all variables deeply defined', function () {
    (0, _harness.expectPassesRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a) {\n          field(b: $b) {\n            field(c: $c)\n          }\n        }\n      }\n    ");
  });
  (0, _mocha.it)('all variables deeply in inline fragments defined', function () {
    (0, _harness.expectPassesRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ... on Type {\n          field(a: $a) {\n            field(b: $b) {\n              ... on Type {\n                field(c: $c)\n              }\n            }\n          }\n        }\n      }\n    ");
  });
  (0, _mocha.it)('all variables in fragments deeply defined', function () {
    (0, _harness.expectPassesRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ");
  });
  (0, _mocha.it)('variable within single fragment defined in multiple operations', function () {
    (0, _harness.expectPassesRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      query Bar($a: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n    ");
  });
  (0, _mocha.it)('variable within fragments defined in operations', function () {
    (0, _harness.expectPassesRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      query Bar($b: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ");
  });
  (0, _mocha.it)('variable within recursive fragment defined', function () {
    (0, _harness.expectPassesRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragA\n        }\n      }\n    ");
  });
  (0, _mocha.it)('variable not defined', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b, c: $c, d: $d)\n      }\n    ", [undefVar('d', 3, 39, 'Foo', 2, 7)]);
  });
  (0, _mocha.it)('variable not defined by un-named query', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      {\n        field(a: $a)\n      }\n    ", [undefVar('a', 3, 18, '', 2, 7)]);
  });
  (0, _mocha.it)('multiple variables not defined', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($b: String) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ", [undefVar('a', 3, 18, 'Foo', 2, 7), undefVar('c', 3, 32, 'Foo', 2, 7)]);
  });
  (0, _mocha.it)('variable in fragment not defined by un-named query', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n    ", [undefVar('a', 6, 18, '', 2, 7)]);
  });
  (0, _mocha.it)('variable in fragment not defined by operation', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String, $b: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ", [undefVar('c', 16, 18, 'Foo', 2, 7)]);
  });
  (0, _mocha.it)('multiple variables in fragments not defined', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ", [undefVar('a', 6, 18, 'Foo', 2, 7), undefVar('c', 16, 18, 'Foo', 2, 7)]);
  });
  (0, _mocha.it)('single variable in fragment not defined by multiple operations', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragAB\n      }\n      query Bar($a: String) {\n        ...FragAB\n      }\n      fragment FragAB on Type {\n        field(a: $a, b: $b)\n      }\n    ", [undefVar('b', 9, 25, 'Foo', 2, 7), undefVar('b', 9, 25, 'Bar', 5, 7)]);
  });
  (0, _mocha.it)('variables in fragment not defined by multiple operations', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragAB\n      }\n      query Bar($a: String) {\n        ...FragAB\n      }\n      fragment FragAB on Type {\n        field(a: $a, b: $b)\n      }\n    ", [undefVar('a', 9, 18, 'Foo', 2, 7), undefVar('b', 9, 25, 'Bar', 5, 7)]);
  });
  (0, _mocha.it)('variable in fragment used by other operation', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      query Bar($a: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ", [undefVar('a', 9, 18, 'Foo', 2, 7), undefVar('b', 12, 18, 'Bar', 5, 7)]);
  });
  (0, _mocha.it)('multiple undefined variables produce multiple errors', function () {
    (0, _harness.expectFailsRule)(_NoUndefinedVariables.NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragAB\n      }\n      query Bar($a: String) {\n        ...FragAB\n      }\n      fragment FragAB on Type {\n        field1(a: $a, b: $b)\n        ...FragC\n        field3(a: $a, b: $b)\n      }\n      fragment FragC on Type {\n        field2(c: $c)\n      }\n    ", [undefVar('a', 9, 19, 'Foo', 2, 7), undefVar('a', 11, 19, 'Foo', 2, 7), undefVar('c', 14, 19, 'Foo', 2, 7), undefVar('b', 9, 26, 'Bar', 5, 7), undefVar('b', 11, 26, 'Bar', 5, 7), undefVar('c', 14, 19, 'Bar', 5, 7)]);
  });
});