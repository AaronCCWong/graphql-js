/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { UniqueFragmentNames, duplicateFragmentNameMessage } from '../rules/UniqueFragmentNames';

function duplicateFrag(fragName, l1, c1, l2, c2) {
  return {
    message: duplicateFragmentNameMessage(fragName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

describe('Validate: Unique fragment names', function () {
  it('no fragments', function () {
    expectPassesRule(UniqueFragmentNames, "\n      {\n        field\n      }\n    ");
  });
  it('one fragment', function () {
    expectPassesRule(UniqueFragmentNames, "\n      {\n        ...fragA\n      }\n\n      fragment fragA on Type {\n        field\n      }\n    ");
  });
  it('many fragments', function () {
    expectPassesRule(UniqueFragmentNames, "\n      {\n        ...fragA\n        ...fragB\n        ...fragC\n      }\n      fragment fragA on Type {\n        fieldA\n      }\n      fragment fragB on Type {\n        fieldB\n      }\n      fragment fragC on Type {\n        fieldC\n      }\n    ");
  });
  it('inline fragments are always unique', function () {
    expectPassesRule(UniqueFragmentNames, "\n      {\n        ...on Type {\n          fieldA\n        }\n        ...on Type {\n          fieldB\n        }\n      }\n    ");
  });
  it('fragment and operation named the same', function () {
    expectPassesRule(UniqueFragmentNames, "\n      query Foo {\n        ...Foo\n      }\n      fragment Foo on Type {\n        field\n      }\n    ");
  });
  it('fragments named the same', function () {
    expectFailsRule(UniqueFragmentNames, "\n      {\n        ...fragA\n      }\n      fragment fragA on Type {\n        fieldA\n      }\n      fragment fragA on Type {\n        fieldB\n      }\n    ", [duplicateFrag('fragA', 5, 16, 8, 16)]);
  });
  it('fragments named the same without being referenced', function () {
    expectFailsRule(UniqueFragmentNames, "\n      fragment fragA on Type {\n        fieldA\n      }\n      fragment fragA on Type {\n        fieldB\n      }\n    ", [duplicateFrag('fragA', 2, 16, 5, 16)]);
  });
});