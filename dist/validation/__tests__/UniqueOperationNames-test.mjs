/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { UniqueOperationNames, duplicateOperationNameMessage } from '../rules/UniqueOperationNames';

function duplicateOp(opName, l1, c1, l2, c2) {
  return {
    message: duplicateOperationNameMessage(opName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

describe('Validate: Unique operation names', function () {
  it('no operations', function () {
    expectPassesRule(UniqueOperationNames, "\n      fragment fragA on Type {\n        field\n      }\n    ");
  });
  it('one anon operation', function () {
    expectPassesRule(UniqueOperationNames, "\n      {\n        field\n      }\n    ");
  });
  it('one named operation', function () {
    expectPassesRule(UniqueOperationNames, "\n      query Foo {\n        field\n      }\n    ");
  });
  it('multiple operations', function () {
    expectPassesRule(UniqueOperationNames, "\n      query Foo {\n        field\n      }\n\n      query Bar {\n        field\n      }\n    ");
  });
  it('multiple operations of different types', function () {
    expectPassesRule(UniqueOperationNames, "\n      query Foo {\n        field\n      }\n\n      mutation Bar {\n        field\n      }\n\n      subscription Baz {\n        field\n      }\n    ");
  });
  it('fragment and operation named the same', function () {
    expectPassesRule(UniqueOperationNames, "\n      query Foo {\n        ...Foo\n      }\n      fragment Foo on Type {\n        field\n      }\n    ");
  });
  it('multiple operations of same name', function () {
    expectFailsRule(UniqueOperationNames, "\n      query Foo {\n        fieldA\n      }\n      query Foo {\n        fieldB\n      }\n    ", [duplicateOp('Foo', 2, 13, 5, 13)]);
  });
  it('multiple ops of same name of different types (mutation)', function () {
    expectFailsRule(UniqueOperationNames, "\n      query Foo {\n        fieldA\n      }\n      mutation Foo {\n        fieldB\n      }\n    ", [duplicateOp('Foo', 2, 13, 5, 16)]);
  });
  it('multiple ops of same name of different types (subscription)', function () {
    expectFailsRule(UniqueOperationNames, "\n      query Foo {\n        fieldA\n      }\n      subscription Foo {\n        fieldB\n      }\n    ", [duplicateOp('Foo', 2, 13, 5, 20)]);
  });
});