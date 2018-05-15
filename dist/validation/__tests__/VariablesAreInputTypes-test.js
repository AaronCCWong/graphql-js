"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _VariablesAreInputTypes = require("../rules/VariablesAreInputTypes");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Validate: Variables are input types', function () {
  (0, _mocha.it)('input types are valid', function () {
    (0, _harness.expectPassesRule)(_VariablesAreInputTypes.VariablesAreInputTypes, "\n      query Foo($a: String, $b: [Boolean!]!, $c: ComplexInput) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ");
  });
  (0, _mocha.it)('output types are invalid', function () {
    (0, _harness.expectFailsRule)(_VariablesAreInputTypes.VariablesAreInputTypes, "\n      query Foo($a: Dog, $b: [[CatOrDog!]]!, $c: Pet) {\n        field(a: $a, b: $b, c: $c)\n      }\n    ", [{
      locations: [{
        line: 2,
        column: 21
      }],
      message: (0, _VariablesAreInputTypes.nonInputTypeOnVarMessage)('a', 'Dog')
    }, {
      locations: [{
        line: 2,
        column: 30
      }],
      message: (0, _VariablesAreInputTypes.nonInputTypeOnVarMessage)('b', '[[CatOrDog!]]!')
    }, {
      locations: [{
        line: 2,
        column: 50
      }],
      message: (0, _VariablesAreInputTypes.nonInputTypeOnVarMessage)('c', 'Pet')
    }]);
  });
});