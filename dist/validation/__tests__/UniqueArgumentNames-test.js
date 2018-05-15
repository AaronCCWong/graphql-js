"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _UniqueArgumentNames = require("../rules/UniqueArgumentNames");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function duplicateArg(argName, l1, c1, l2, c2) {
  return {
    message: (0, _UniqueArgumentNames.duplicateArgMessage)(argName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

(0, _mocha.describe)('Validate: Unique argument names', function () {
  (0, _mocha.it)('no arguments on field', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('no arguments on directive', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field @directive\n      }\n    ");
  });
  (0, _mocha.it)('argument on field', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field(arg: \"value\")\n      }\n    ");
  });
  (0, _mocha.it)('argument on directive', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field @directive(arg: \"value\")\n      }\n    ");
  });
  (0, _mocha.it)('same argument on two fields', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        one: field(arg: \"value\")\n        two: field(arg: \"value\")\n      }\n    ");
  });
  (0, _mocha.it)('same argument on field and directive', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field(arg: \"value\") @directive(arg: \"value\")\n      }\n    ");
  });
  (0, _mocha.it)('same argument on two directives', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field @directive1(arg: \"value\") @directive2(arg: \"value\")\n      }\n    ");
  });
  (0, _mocha.it)('multiple field arguments', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field(arg1: \"value\", arg2: \"value\", arg3: \"value\")\n      }\n    ");
  });
  (0, _mocha.it)('multiple directive arguments', function () {
    (0, _harness.expectPassesRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field @directive(arg1: \"value\", arg2: \"value\", arg3: \"value\")\n      }\n    ");
  });
  (0, _mocha.it)('duplicate field arguments', function () {
    (0, _harness.expectFailsRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field(arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 15, 3, 30)]);
  });
  (0, _mocha.it)('many duplicate field arguments', function () {
    (0, _harness.expectFailsRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field(arg1: \"value\", arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 15, 3, 30), duplicateArg('arg1', 3, 15, 3, 45)]);
  });
  (0, _mocha.it)('duplicate directive arguments', function () {
    (0, _harness.expectFailsRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field @directive(arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 26, 3, 41)]);
  });
  (0, _mocha.it)('many duplicate directive arguments', function () {
    (0, _harness.expectFailsRule)(_UniqueArgumentNames.UniqueArgumentNames, "\n      {\n        field @directive(arg1: \"value\", arg1: \"value\", arg1: \"value\")\n      }\n    ", [duplicateArg('arg1', 3, 26, 3, 41), duplicateArg('arg1', 3, 26, 3, 56)]);
  });
});