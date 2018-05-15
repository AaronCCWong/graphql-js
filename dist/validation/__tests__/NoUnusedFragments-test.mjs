/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { NoUnusedFragments, unusedFragMessage } from '../rules/NoUnusedFragments';

function unusedFrag(fragName, line, column) {
  return {
    message: unusedFragMessage(fragName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: No unused fragments', function () {
  it('all fragment names are used', function () {
    expectPassesRule(NoUnusedFragments, "\n      {\n        human(id: 4) {\n          ...HumanFields1\n          ... on Human {\n            ...HumanFields2\n          }\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n    ");
  });
  it('all fragment names are used by multiple operations', function () {
    expectPassesRule(NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...HumanFields1\n        }\n      }\n      query Bar {\n        human(id: 4) {\n          ...HumanFields2\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n    ");
  });
  it('contains unknown fragments', function () {
    expectFailsRule(NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...HumanFields1\n        }\n      }\n      query Bar {\n        human(id: 4) {\n          ...HumanFields2\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n      fragment Unused1 on Human {\n        name\n      }\n      fragment Unused2 on Human {\n        name\n      }\n    ", [unusedFrag('Unused1', 22, 7), unusedFrag('Unused2', 25, 7)]);
  });
  it('contains unknown fragments with ref cycle', function () {
    expectFailsRule(NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...HumanFields1\n        }\n      }\n      query Bar {\n        human(id: 4) {\n          ...HumanFields2\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n      fragment Unused1 on Human {\n        name\n        ...Unused2\n      }\n      fragment Unused2 on Human {\n        name\n        ...Unused1\n      }\n    ", [unusedFrag('Unused1', 22, 7), unusedFrag('Unused2', 26, 7)]);
  });
  it('contains unknown and undef fragments', function () {
    expectFailsRule(NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...bar\n        }\n      }\n      fragment foo on Human {\n        name\n      }\n    ", [unusedFrag('foo', 7, 7)]);
  });
});