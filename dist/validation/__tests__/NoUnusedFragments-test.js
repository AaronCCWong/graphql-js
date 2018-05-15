"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _NoUnusedFragments = require("../rules/NoUnusedFragments");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function unusedFrag(fragName, line, column) {
  return {
    message: (0, _NoUnusedFragments.unusedFragMessage)(fragName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: No unused fragments', function () {
  (0, _mocha.it)('all fragment names are used', function () {
    (0, _harness.expectPassesRule)(_NoUnusedFragments.NoUnusedFragments, "\n      {\n        human(id: 4) {\n          ...HumanFields1\n          ... on Human {\n            ...HumanFields2\n          }\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n    ");
  });
  (0, _mocha.it)('all fragment names are used by multiple operations', function () {
    (0, _harness.expectPassesRule)(_NoUnusedFragments.NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...HumanFields1\n        }\n      }\n      query Bar {\n        human(id: 4) {\n          ...HumanFields2\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n    ");
  });
  (0, _mocha.it)('contains unknown fragments', function () {
    (0, _harness.expectFailsRule)(_NoUnusedFragments.NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...HumanFields1\n        }\n      }\n      query Bar {\n        human(id: 4) {\n          ...HumanFields2\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n      fragment Unused1 on Human {\n        name\n      }\n      fragment Unused2 on Human {\n        name\n      }\n    ", [unusedFrag('Unused1', 22, 7), unusedFrag('Unused2', 25, 7)]);
  });
  (0, _mocha.it)('contains unknown fragments with ref cycle', function () {
    (0, _harness.expectFailsRule)(_NoUnusedFragments.NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...HumanFields1\n        }\n      }\n      query Bar {\n        human(id: 4) {\n          ...HumanFields2\n        }\n      }\n      fragment HumanFields1 on Human {\n        name\n        ...HumanFields3\n      }\n      fragment HumanFields2 on Human {\n        name\n      }\n      fragment HumanFields3 on Human {\n        name\n      }\n      fragment Unused1 on Human {\n        name\n        ...Unused2\n      }\n      fragment Unused2 on Human {\n        name\n        ...Unused1\n      }\n    ", [unusedFrag('Unused1', 22, 7), unusedFrag('Unused2', 26, 7)]);
  });
  (0, _mocha.it)('contains unknown and undef fragments', function () {
    (0, _harness.expectFailsRule)(_NoUnusedFragments.NoUnusedFragments, "\n      query Foo {\n        human(id: 4) {\n          ...bar\n        }\n      }\n      fragment foo on Human {\n        name\n      }\n    ", [unusedFrag('foo', 7, 7)]);
  });
});