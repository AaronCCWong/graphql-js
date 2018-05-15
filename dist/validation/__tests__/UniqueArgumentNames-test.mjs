/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { UniqueArgumentNames, duplicateArgMessage } from '../rules/UniqueArgumentNames';

function duplicateArg(argName, l1, c1, l2, c2) {
  return {
    message: duplicateArgMessage(argName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

describe('Validate: Unique argument names', function () {
  it('no arguments on field', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field\n      }\n    ");
  });
  it('no arguments on directive', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field @directive\n      }\n    ");
  });
  it('argument on field', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field(arg: \"value\")\n      }\n    ");
  });
  it('argument on directive', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field @directive(arg: \"value\")\n      }\n    ");
  });
  it('same argument on two fields', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        one: field(arg: \"value\")\n        two: field(arg: \"value\")\n      }\n    ");
  });
  it('same argument on field and directive', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field(arg: \"value\") @directive(arg: \"value\")\n      }\n    ");
  });
  it('same argument on two directives', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field @directive1(arg: \"value\") @directive2(arg: \"value\")\n      }\n    ");
  });
  it('multiple field arguments', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field(arg1: \"value\", arg2: \"value\", arg3: \"value\")\n      }\n    ");
  });
  it('multiple directive arguments', function () {
    expectPassesRule(UniqueArgumentNames, "\n      {\n        field @directive(arg1: \"value\", arg2: \"value\", arg3: \"value\")\n      }\n    ");
  });
  it('duplicate field arguments', function () {
    expectFailsRule(UniqueArgumentNames, "\n      {\n        field(arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 15, 3, 30)]);
  });
  it('many duplicate field arguments', function () {
    expectFailsRule(UniqueArgumentNames, "\n      {\n        field(arg1: \"value\", arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 15, 3, 30), duplicateArg('arg1', 3, 15, 3, 45)]);
  });
  it('duplicate directive arguments', function () {
    expectFailsRule(UniqueArgumentNames, "\n      {\n        field @directive(arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 26, 3, 41)]);
  });
  it('many duplicate directive arguments', function () {
    expectFailsRule(UniqueArgumentNames, "\n      {\n        field @directive(arg1: \"value\", arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 26, 3, 41), duplicateArg('arg1', 3, 26, 3, 56)]);
  });
});