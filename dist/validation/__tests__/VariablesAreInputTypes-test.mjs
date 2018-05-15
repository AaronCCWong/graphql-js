/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { VariablesAreInputTypes, nonInputTypeOnVarMessage } from '../rules/VariablesAreInputTypes';
describe('Validate: Variables are input types', function () {
  it('input types are valid', function () {
    expectPassesRule(VariablesAreInputTypes, "\n      query Foo($a: String, $b: [Boolean!]!, $c: ComplexInput) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ");
  });
  it('output types are invalid', function () {
    expectFailsRule(VariablesAreInputTypes, "\n      query Foo($a: Dog, $b: [[CatOrDog!]]!, $c: Pet) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ", [{
      locations: [{
        line: 2,
        column: 21
      }],
      message: nonInputTypeOnVarMessage('a', 'Dog')
    }, {
      locations: [{
        line: 2,
        column: 30
      }],
      message: nonInputTypeOnVarMessage('b', '[[CatOrDog!]]!')
    }, {
      locations: [{
        line: 2,
        column: 50
      }],
      message: nonInputTypeOnVarMessage('c', 'Pet')
    }]);
  });
});