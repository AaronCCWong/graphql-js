/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { UniqueInputFieldNames, duplicateInputFieldMessage } from '../rules/UniqueInputFieldNames';

function duplicateField(name, l1, c1, l2, c2) {
  return {
    message: duplicateInputFieldMessage(name),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

describe('Validate: Unique input field names', function () {
  it('input object with fields', function () {
    expectPassesRule(UniqueInputFieldNames, "\n      {\n        field(arg: { f: true })\n      }\n    ");
  });
  it('same input object within two args', function () {
    expectPassesRule(UniqueInputFieldNames, "\n      {\n        field(arg1: { f: true }, arg2: { f: true })\n      }\n    ");
  });
  it('multiple input object fields', function () {
    expectPassesRule(UniqueInputFieldNames, "\n      {\n        field(arg: { f1: \"value\", f2: \"value\", f3: \"value\" })\n      }\n    ");
  });
  it('allows for nested input objects with similar fields', function () {
    expectPassesRule(UniqueInputFieldNames, "\n      {\n        field(arg: {\n          deep: {\n            deep: {\n              id: 1\n            }\n            id: 1\n          }\n          id: 1\n        })\n      }\n    ");
  });
  it('duplicate input object fields', function () {
    expectFailsRule(UniqueInputFieldNames, "\n      {\n        field(arg: { f1: \"value\", f1: \"value\" })\n      }\n    ", [duplicateField('f1', 3, 22, 3, 35)]);
  });
  it('many duplicate input object fields', function () {
    expectFailsRule(UniqueInputFieldNames, "\n      {\n        field(arg: { f1: \"value\", f1: \"value\", f1: \"value\" })\n      }\n    ", [duplicateField('f1', 3, 22, 3, 35), duplicateField('f1', 3, 22, 3, 48)]);
  });
});