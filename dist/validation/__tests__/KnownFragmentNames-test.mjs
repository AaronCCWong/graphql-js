/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { KnownFragmentNames, unknownFragmentMessage } from '../rules/KnownFragmentNames';

function undefFrag(fragName, line, column) {
  return {
    message: unknownFragmentMessage(fragName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Known fragment names', function () {
  it('known fragment names are valid', function () {
    expectPassesRule(KnownFragmentNames, "\n      {\n        human(id: 4) {\n          ...HumanFields1\n          ... on Human {\n            ...HumanFields2\n          }\n          ... {\n            name\n          }\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n    ");
  });
  it('unknown fragment names are invalid', function () {
    expectFailsRule(KnownFragmentNames, "\n      {\n        human(id: 4) {\n          ...UnknownFragment1\n          ... on Human {\n            ...UnknownFragment2\n          }\n        }\n      }\n      fragment HumanFields on Human {\n        name\n        ...UnknownFragment3\n      }\n    ", [undefFrag('UnknownFragment1', 4, 14), undefFrag('UnknownFragment2', 6, 16), undefFrag('UnknownFragment3', 12, 12)]);
  });
});