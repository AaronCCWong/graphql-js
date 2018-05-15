"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _UniqueOperationNames = require("../rules/UniqueOperationNames");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function duplicateOp(opName, l1, c1, l2, c2) {
  return {
    message: (0, _UniqueOperationNames.duplicateOperationNameMessage)(opName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

(0, _mocha.describe)('Validate: Unique operation names', function () {
  (0, _mocha.it)('no operations', function () {
    (0, _harness.expectPassesRule)(_UniqueOperationNames.UniqueOperationNames, "\n      fragment fragA on Type {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('one anon operation', function () {
    (0, _harness.expectPassesRule)(_UniqueOperationNames.UniqueOperationNames, "\n      {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('one named operation', function () {
    (0, _harness.expectPassesRule)(_UniqueOperationNames.UniqueOperationNames, "\n      query Foo {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('multiple operations', function () {
    (0, _harness.expectPassesRule)(_UniqueOperationNames.UniqueOperationNames, "\n      query Foo {\n        field\n      }\n\n      query Bar {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('multiple operations of different types', function () {
    (0, _harness.expectPassesRule)(_UniqueOperationNames.UniqueOperationNames, "\n      query Foo {\n        field\n      }\n\n      mutation Bar {\n        field\n      }\n\n      subscription Baz {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('fragment and operation named the same', function () {
    (0, _harness.expectPassesRule)(_UniqueOperationNames.UniqueOperationNames, "\n      query Foo {\n        ...Foo\n      }\n      fragment Foo on Type {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('multiple operations of same name', function () {
    (0, _harness.expectFailsRule)(_UniqueOperationNames.UniqueOperationNames, "\n      query Foo {\n        fieldA\n      }\n      query Foo {\n        fieldB\n      }\n    ", [duplicateOp('Foo', 2, 13, 5, 13)]);
  });
  (0, _mocha.it)('multiple ops of same name of different types (mutation)', function () {
    (0, _harness.expectFailsRule)(_UniqueOperationNames.UniqueOperationNames, "\n      query Foo {\n        fieldA\n      }\n      mutation Foo {\n        fieldB\n      }\n    ", [duplicateOp('Foo', 2, 13, 5, 16)]);
  });
  (0, _mocha.it)('multiple ops of same name of different types (subscription)', function () {
    (0, _harness.expectFailsRule)(_UniqueOperationNames.UniqueOperationNames, "\n      query Foo {\n        fieldA\n      }\n      subscription Foo {\n        fieldB\n      }\n    ", [duplicateOp('Foo', 2, 13, 5, 20)]);
  });
});