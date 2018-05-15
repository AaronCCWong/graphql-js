/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { ExecutableDefinitions, nonExecutableDefinitionMessage } from '../rules/ExecutableDefinitions';

function nonExecutableDefinition(defName, line, column) {
  return {
    message: nonExecutableDefinitionMessage(defName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Executable definitions', function () {
  it('with only operation', function () {
    expectPassesRule(ExecutableDefinitions, "\n      query Foo {\n        dog {\n          name\n        }\n      }\n    ");
  });
  it('with operation and fragment', function () {
    expectPassesRule(ExecutableDefinitions, "\n      query Foo {\n        dog {\n          name\n          ...Frag\n        }\n      }\n\n      fragment Frag on Dog {\n        name\n      }\n    ");
  });
  it('with type definition', function () {
    expectFailsRule(ExecutableDefinitions, "\n      query Foo {\n        dog {\n          name\n        }\n      }\n\n      type Cow {\n        name: String\n      }\n\n      extend type Dog {\n        color: String\n      }\n    ", [nonExecutableDefinition('Cow', 8, 7), nonExecutableDefinition('Dog', 12, 7)]);
  });
  it('with schema definition', function () {
    expectFailsRule(ExecutableDefinitions, "\n      schema {\n        query: Query\n      }\n\n      type Query {\n        test: String\n      }\n\n      extend schema @directive\n    ", [nonExecutableDefinition('schema', 2, 7), nonExecutableDefinition('Query', 6, 7), nonExecutableDefinition('schema', 10, 7)]);
  });
});