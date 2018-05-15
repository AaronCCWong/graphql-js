/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { NoUnusedVariables, unusedVariableMessage } from '../rules/NoUnusedVariables';

function unusedVar(varName, opName, line, column) {
  return {
    message: unusedVariableMessage(varName, opName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: No unused variables', function () {
  it('uses all variables', function () {
    expectPassesRule(NoUnusedVariables, "\n      query ($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ");
  });
  it('uses all variables deeply', function () {
    expectPassesRule(NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(a: $a) {\n          field(b: $b) {\n            field(c: $c)\n          }\n        }\n      }\n    ");
  });
  it('uses all variables deeply in inline fragments', function () {
    expectPassesRule(NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ... on Type {\n          field(a: $a) {\n            field(b: $b) {\n              ... on Type {\n                field(c: $c)\n              }\n            }\n          }\n        }\n      }\n    ");
  });
  it('uses all variables in fragments', function () {
    expectPassesRule(NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field(c: $c)\n      }\n    ");
  });
  it('variable used by fragment in multiple operations', function () {
    expectPassesRule(NoUnusedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      query Bar($b: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ");
  });
  it('variable used by recursive fragment', function () {
    expectPassesRule(NoUnusedVariables, "\n      query Foo($a: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragA\n        }\n      }\n    ");
  });
  it('variable not used', function () {
    expectFailsRule(NoUnusedVariables, "\n      query ($a: String, $b: String, $c: String) {\n        field(a: $a, b: $b)\n      }\n    ", [unusedVar('c', null, 2, 38)]);
  });
  it('multiple variables not used', function () {
    expectFailsRule(NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        field(b: $b)\n      }\n    ", [unusedVar('a', 'Foo', 2, 17), unusedVar('c', 'Foo', 2, 41)]);
  });
  it('variable not used in fragments', function () {
    expectFailsRule(NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a) {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field\n      }\n    ", [unusedVar('c', 'Foo', 2, 41)]);
  });
  it('multiple variables not used in fragments', function () {
    expectFailsRule(NoUnusedVariables, "\n      query Foo($a: String, $b: String, $c: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field {\n          ...FragB\n        }\n      }\n      fragment FragB on Type {\n        field(b: $b) {\n          ...FragC\n        }\n      }\n      fragment FragC on Type {\n        field\n      }\n    ", [unusedVar('a', 'Foo', 2, 17), unusedVar('c', 'Foo', 2, 41)]);
  });
  it('variable not used by unreferenced fragment', function () {
    expectFailsRule(NoUnusedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ", [unusedVar('b', 'Foo', 2, 17)]);
  });
  it('variable not used by fragment used by other operation', function () {
    expectFailsRule(NoUnusedVariables, "\n      query Foo($b: String) {\n        ...FragA\n      }\n      query Bar($a: String) {\n        ...FragB\n      }\n      fragment FragA on Type {\n        field(a: $a)\n      }\n      fragment FragB on Type {\n        field(b: $b)\n      }\n    ", [unusedVar('b', 'Foo', 2, 17), unusedVar('a', 'Bar', 5, 17)]);
  });
});