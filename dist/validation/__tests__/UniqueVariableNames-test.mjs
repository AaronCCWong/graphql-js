/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { UniqueVariableNames, duplicateVariableMessage } from '../rules/UniqueVariableNames';

function duplicateVariable(name, l1, c1, l2, c2) {
  return {
    message: duplicateVariableMessage(name),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

describe('Validate: Unique variable names', function () {
  it('unique variable names', function () {
    expectPassesRule(UniqueVariableNames, "\n      query A($x: Int, $y: String) { __typename }\n      query B($x: String, $y: Int) { __typename }\n    ");
  });
  it('duplicate variable names', function () {
    expectFailsRule(UniqueVariableNames, "\n      query A($x: Int, $x: Int, $x: String) { __typename }\n      query B($x: String, $x: Int) { __typename }\n      query C($x: Int, $x: Int) { __typename }\n    ", [duplicateVariable('x', 2, 16, 2, 25), duplicateVariable('x', 2, 16, 2, 34), duplicateVariable('x', 3, 16, 3, 28), duplicateVariable('x', 4, 16, 4, 25)]);
  });
});