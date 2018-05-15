"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _UniqueFragmentNames = require("../rules/UniqueFragmentNames");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function duplicateFrag(fragName, l1, c1, l2, c2) {
  return {
    message: (0, _UniqueFragmentNames.duplicateFragmentNameMessage)(fragName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

(0, _mocha.describe)('Validate: Unique fragment names', function () {
  (0, _mocha.it)('no fragments', function () {
    (0, _harness.expectPassesRule)(_UniqueFragmentNames.UniqueFragmentNames, "\n      {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('one fragment', function () {
    (0, _harness.expectPassesRule)(_UniqueFragmentNames.UniqueFragmentNames, "\n      {\n        ...fragA\n      }\n\n      fragment fragA on Type {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('many fragments', function () {
    (0, _harness.expectPassesRule)(_UniqueFragmentNames.UniqueFragmentNames, "\n      {\n        ...fragA\n        ...fragB\n        ...fragC\n      }\n      fragment fragA on Type {\n        fieldA\n      }\n      fragment fragB on Type {\n        fieldB\n      }\n      fragment fragC on Type {\n        fieldC\n      }\n    ");
  });
  (0, _mocha.it)('inline fragments are always unique', function () {
    (0, _harness.expectPassesRule)(_UniqueFragmentNames.UniqueFragmentNames, "\n      {\n        ...on Type {\n          fieldA\n        }\n        ...on Type {\n          fieldB\n        }\n      }\n    ");
  });
  (0, _mocha.it)('fragment and operation named the same', function () {
    (0, _harness.expectPassesRule)(_UniqueFragmentNames.UniqueFragmentNames, "\n      query Foo {\n        ...Foo\n      }\n      fragment Foo on Type {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('fragments named the same', function () {
    (0, _harness.expectFailsRule)(_UniqueFragmentNames.UniqueFragmentNames, "\n      {\n        ...fragA\n      }\n      fragment fragA on Type {\n        fieldA\n      }\n      fragment fragA on Type {\n        fieldB\n      }\n    ", [duplicateFrag('fragA', 5, 16, 8, 16)]);
  });
  (0, _mocha.it)('fragments named the same without being referenced', function () {
    (0, _harness.expectFailsRule)(_UniqueFragmentNames.UniqueFragmentNames, "\n      fragment fragA on Type {\n        fieldA\n      }\n      fragment fragA on Type {\n        fieldB\n      }\n    ", [duplicateFrag('fragA', 2, 16, 5, 16)]);
  });
});