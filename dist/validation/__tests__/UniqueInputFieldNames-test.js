"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _UniqueInputFieldNames = require("../rules/UniqueInputFieldNames");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function duplicateField(name, l1, c1, l2, c2) {
  return {
    message: (0, _UniqueInputFieldNames.duplicateInputFieldMessage)(name),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

(0, _mocha.describe)('Validate: Unique input field names', function () {
  (0, _mocha.it)('input object with fields', function () {
    (0, _harness.expectPassesRule)(_UniqueInputFieldNames.UniqueInputFieldNames, "\n      {\n        field(arg: { f: true })\n      }\n    ");
  });
  (0, _mocha.it)('same input object within two args', function () {
    (0, _harness.expectPassesRule)(_UniqueInputFieldNames.UniqueInputFieldNames, "\n      {\n        field(arg1: { f: true }, arg2: { f: true })\n      }\n    ");
  });
  (0, _mocha.it)('multiple input object fields', function () {
    (0, _harness.expectPassesRule)(_UniqueInputFieldNames.UniqueInputFieldNames, "\n      {\n        field(arg: { f1: \"value\", f2: \"value\", f3: \"value\" })\n      }\n    ");
  });
  (0, _mocha.it)('allows for nested input objects with similar fields', function () {
    (0, _harness.expectPassesRule)(_UniqueInputFieldNames.UniqueInputFieldNames, "\n      {\n        field(arg: {\n          deep: {\n            deep: {\n              id: 1\n            }\n            id: 1\n          }\n          id: 1\n        })\n      }\n    ");
  });
  (0, _mocha.it)('duplicate input object fields', function () {
    (0, _harness.expectFailsRule)(_UniqueInputFieldNames.UniqueInputFieldNames, "\n      {\n        field(arg: { f1: \"value\", f1: \"value\" })\n      }\n    ", [duplicateField('f1', 3, 22, 3, 35)]);
  });
  (0, _mocha.it)('many duplicate input object fields', function () {
    (0, _harness.expectFailsRule)(_UniqueInputFieldNames.UniqueInputFieldNames, "\n      {\n        field(arg: { f1: \"value\", f1: \"value\", f1: \"value\" })\n      }\n    ", [duplicateField('f1', 3, 22, 3, 35), duplicateField('f1', 3, 22, 3, 48)]);
  });
});