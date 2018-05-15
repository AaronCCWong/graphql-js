"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _UniqueVariableNames = require("../rules/UniqueVariableNames");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function duplicateVariable(name, l1, c1, l2, c2) {
  return {
    message: (0, _UniqueVariableNames.duplicateVariableMessage)(name),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

(0, _mocha.describe)('Validate: Unique variable names', function () {
  (0, _mocha.it)('unique variable names', function () {
    (0, _harness.expectPassesRule)(_UniqueVariableNames.UniqueVariableNames, "\n      query A($x: Int, $y: String) { __typename }\n      query B($x: String, $y: Int) { __typename }\n    ");
  });
  (0, _mocha.it)('duplicate variable names', function () {
    (0, _harness.expectFailsRule)(_UniqueVariableNames.UniqueVariableNames, "\n      query A($x: Int, $x: Int, $x: String) { __typename }\n      query B($x: String, $x: Int) { __typename }\n      query C($x: Int, $x: Int) { __typename }\n    ", [duplicateVariable('x', 2, 16, 2, 25), duplicateVariable('x', 2, 16, 2, 34), duplicateVariable('x', 3, 16, 3, 28), duplicateVariable('x', 4, 16, 4, 25)]);
  });
});