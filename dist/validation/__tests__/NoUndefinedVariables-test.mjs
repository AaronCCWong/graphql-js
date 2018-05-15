/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { NoUndefinedVariables, undefinedVarMessage } from '../rules/NoUndefinedVariables';

function undefVar(varName, l1, c1, opName, l2, c2) {
  return {
    message: undefinedVarMessage(varName, opName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

describe('Validate: No undefined variables', function () {
  it('all variables defined', function () {
    expectPassesRule(NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ");
  });
  it('all variables deeply defined', function () {
    expectPassesRule(NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a) {\n          field(b: $b) {\n            field(c: $c)\n          }\n        }\n      }\n    ");
  });
  it('all variables deeply in inline fragments defined', function () {
    expectPassesRule(NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ... on Type {\n          field(a: $a) {\n            field(b: $b) {\n              ... on Type {\n                field(c: $c)\n              }\n            }\n          }\n        }\n      }\n    ");
  });
  it('all variables in fragments deeply defined', function () {
    expectPassesRule(NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ");
  });
  it('variable within single fragment defined in multiple operations', function () {
    expectPassesRule(NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      query Bar($a: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n    ");
  });
  it('variable within fragments defined in operations', function () {
    expectPassesRule(NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      query Bar($b: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ");
  });
  it('variable within recursive fragment defined', function () {
    expectPassesRule(NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragA\n        }\n      }\n    ");
  });
  it('variable not defined', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b, c: $c, d: $d)\n      }\n    ", [undefVar('d', 3, 39, 'Foo', 2, 7)]);
  });
  it('variable not defined by un-named query', function () {
    expectFailsRule(NoUndefinedVariables, "\n      {\n        field(a: $a)\n      }\n    ", [undefVar('a', 3, 18, '', 2, 7)]);
  });
  it('multiple variables not defined', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($b: String) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ", [undefVar('a', 3, 18, 'Foo', 2, 7), undefVar('c', 3, 32, 'Foo', 2, 7)]);
  });
  it('variable in fragment not defined by un-named query', function () {
    expectFailsRule(NoUndefinedVariables, "\n      {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n    ", [undefVar('a', 6, 18, '', 2, 7)]);
  });
  it('variable in fragment not defined by operation', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($a: String, $b: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ", [undefVar('c', 16, 18, 'Foo', 2, 7)]);
  });
  it('multiple variables in fragments not defined', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ", [undefVar('a', 6, 18, 'Foo', 2, 7), undefVar('c', 16, 18, 'Foo', 2, 7)]);
  });
  it('single variable in fragment not defined by multiple operations', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($a: String) {\n        ...FragAB\n      }\n      query Bar($a: String) {\n        ...FragAB\n      }\n      fragment FragAB on Type {\n        field(a: $a, b: $b)\n      }\n    ", [undefVar('b', 9, 25, 'Foo', 2, 7), undefVar('b', 9, 25, 'Bar', 5, 7)]);
  });
  it('variables in fragment not defined by multiple operations', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragAB\n      }\n      query Bar($a: String) {\n        ...FragAB\n      }\n      fragment FragAB on Type {\n        field(a: $a, b: $b)\n      }\n    ", [undefVar('a', 9, 18, 'Foo', 2, 7), undefVar('b', 9, 25, 'Bar', 5, 7)]);
  });
  it('variable in fragment used by other operation', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      query Bar($a: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ", [undefVar('a', 9, 18, 'Foo', 2, 7), undefVar('b', 12, 18, 'Bar', 5, 7)]);
  });
  it('multiple undefined variables produce multiple errors', function () {
    expectFailsRule(NoUndefinedVariables, "\n      query Foo($b: String) {\n        ...FragAB\n      }\n      query Bar($a: String) {\n        ...FragAB\n      }\n      fragment FragAB on Type {\n        field1(a: $a, b: $b)\n        ...FragC\n        field3(a: $a, b: $b)\n      }\n      fragment FragC on Type {\n        field2(c: $c)\n      }\n    ", [undefVar('a', 9, 19, 'Foo', 2, 7), undefVar('a', 11, 19, 'Foo', 2, 7), undefVar('c', 14, 19, 'Foo', 2, 7), undefVar('b', 9, 26, 'Bar', 5, 7), undefVar('b', 11, 26, 'Bar', 5, 7), undefVar('c', 14, 19, 'Bar', 5, 7)]);
  });
});