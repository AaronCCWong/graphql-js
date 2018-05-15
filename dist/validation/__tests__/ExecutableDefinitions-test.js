"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _ExecutableDefinitions = require("../rules/ExecutableDefinitions");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function nonExecutableDefinition(defName, line, column) {
  return {
    message: (0, _ExecutableDefinitions.nonExecutableDefinitionMessage)(defName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Executable definitions', function () {
  (0, _mocha.it)('with only operation', function () {
    (0, _harness.expectPassesRule)(_ExecutableDefinitions.ExecutableDefinitions, "\n      query Foo {\n        dog {\n          name\n        }\n      }\n    ");
  });
  (0, _mocha.it)('with operation and fragment', function () {
    (0, _harness.expectPassesRule)(_ExecutableDefinitions.ExecutableDefinitions, "\n      query Foo {\n        dog {\n          name\n          ...Frag\n        }\n      }\n\n      fragment Frag on Dog {\n        name\n      }\n    ");
  });
  (0, _mocha.it)('with type definition', function () {
    (0, _harness.expectFailsRule)(_ExecutableDefinitions.ExecutableDefinitions, "\n      query Foo {\n        dog {\n          name\n        }\n      }\n\n      type Cow {\n        name: String\n      }\n\n      extend type Dog {\n        color: String\n      }\n    ", [nonExecutableDefinition('Cow', 8, 7), nonExecutableDefinition('Dog', 12, 7)]);
  });
  (0, _mocha.it)('with schema definition', function () {
    (0, _harness.expectFailsRule)(_ExecutableDefinitions.ExecutableDefinitions, "\n      schema {\n        query: Query\n      }\n\n      type Query {\n        test: String\n      }\n\n      extend schema @directive\n    ", [nonExecutableDefinition('schema', 2, 7), nonExecutableDefinition('Query', 6, 7), nonExecutableDefinition('schema', 10, 7)]);
  });
});