/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { LoneAnonymousOperation, anonOperationNotAloneMessage } from '../rules/LoneAnonymousOperation';

function anonNotAlone(line, column) {
  return {
    message: anonOperationNotAloneMessage(),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Anonymous operation must be alone', function () {
  it('no operations', function () {
    expectPassesRule(LoneAnonymousOperation, "\n      fragment fragA on Type {\n        field\n      }\n    ");
  });
  it('one anon operation', function () {
    expectPassesRule(LoneAnonymousOperation, "\n      {\n        field\n      }\n    ");
  });
  it('multiple named operations', function () {
    expectPassesRule(LoneAnonymousOperation, "\n      query Foo {\n        field\n      }\n\n      query Bar {\n        field\n      }\n    ");
  });
  it('anon operation with fragment', function () {
    expectPassesRule(LoneAnonymousOperation, "\n      {\n        ...Foo\n      }\n      fragment Foo on Type {\n        field\n      }\n    ");
  });
  it('multiple anon operations', function () {
    expectFailsRule(LoneAnonymousOperation, "\n      {\n        fieldA\n      }\n      {\n        fieldB\n      }\n    ", [anonNotAlone(2, 7), anonNotAlone(5, 7)]);
  });
  it('anon operation with a mutation', function () {
    expectFailsRule(LoneAnonymousOperation, "\n      {\n        fieldA\n      }\n      mutation Foo {\n        fieldB\n      }\n    ", [anonNotAlone(2, 7)]);
  });
  it('anon operation with a subscription', function () {
    expectFailsRule(LoneAnonymousOperation, "\n      {\n        fieldA\n      }\n      subscription Foo {\n        fieldB\n      }\n    ", [anonNotAlone(2, 7)]);
  });
});