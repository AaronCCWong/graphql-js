"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _KnownArgumentNames = require("../rules/KnownArgumentNames");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function unknownArg(argName, fieldName, typeName, suggestedArgs, line, column) {
  return {
    message: (0, _KnownArgumentNames.unknownArgMessage)(argName, fieldName, typeName, suggestedArgs),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function unknownDirectiveArg(argName, directiveName, suggestedArgs, line, column) {
  return {
    message: (0, _KnownArgumentNames.unknownDirectiveArgMessage)(argName, directiveName, suggestedArgs),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Known argument names', function () {
  (0, _mocha.it)('single arg is known', function () {
    (0, _harness.expectPassesRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment argOnRequiredArg on Dog {\n        doesKnowCommand(dogCommand: SIT)\n      }\n    ");
  });
  (0, _mocha.it)('multiple args are known', function () {
    (0, _harness.expectPassesRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment multipleArgs on ComplicatedArgs {\n        multipleReqs(req1: 1, req2: 2)\n      }\n    ");
  });
  (0, _mocha.it)('ignores args of unknown fields', function () {
    (0, _harness.expectPassesRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment argOnUnknownField on Dog {\n        unknownField(unknownArg: SIT)\n      }\n    ");
  });
  (0, _mocha.it)('multiple args in reverse order are known', function () {
    (0, _harness.expectPassesRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment multipleArgsReverseOrder on ComplicatedArgs {\n        multipleReqs(req2: 2, req1: 1)\n      }\n    ");
  });
  (0, _mocha.it)('no args on optional arg', function () {
    (0, _harness.expectPassesRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment noArgOnOptionalArg on Dog {\n        isHousetrained\n      }\n    ");
  });
  (0, _mocha.it)('args are known deeply', function () {
    (0, _harness.expectPassesRule)(_KnownArgumentNames.KnownArgumentNames, "\n      {\n        dog {\n          doesKnowCommand(dogCommand: SIT)\n        }\n        human {\n          pet {\n            ... on Dog {\n              doesKnowCommand(dogCommand: SIT)\n            }\n          }\n        }\n      }\n    ");
  });
  (0, _mocha.it)('directive args are known', function () {
    (0, _harness.expectPassesRule)(_KnownArgumentNames.KnownArgumentNames, "\n      {\n        dog @skip(if: true)\n      }\n    ");
  });
  (0, _mocha.it)('undirective args are invalid', function () {
    (0, _harness.expectFailsRule)(_KnownArgumentNames.KnownArgumentNames, "\n      {\n        dog @skip(unless: true)\n      }\n    ", [unknownDirectiveArg('unless', 'skip', [], 3, 19)]);
  });
  (0, _mocha.it)('misspelled directive args are reported', function () {
    (0, _harness.expectFailsRule)(_KnownArgumentNames.KnownArgumentNames, "\n      {\n        dog @skip(iff: true)\n      }\n    ", [unknownDirectiveArg('iff', 'skip', ['if'], 3, 19)]);
  });
  (0, _mocha.it)('invalid arg name', function () {
    (0, _harness.expectFailsRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment invalidArgName on Dog {\n        doesKnowCommand(unknown: true)\n      }\n    ", [unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 3, 25)]);
  });
  (0, _mocha.it)('misspelled arg name is reported', function () {
    (0, _harness.expectFailsRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment invalidArgName on Dog {\n        doesKnowCommand(dogcommand: true)\n      }\n    ", [unknownArg('dogcommand', 'doesKnowCommand', 'Dog', ['dogCommand'], 3, 25)]);
  });
  (0, _mocha.it)('unknown args amongst known args', function () {
    (0, _harness.expectFailsRule)(_KnownArgumentNames.KnownArgumentNames, "\n      fragment oneGoodArgOneInvalidArg on Dog {\n        doesKnowCommand(whoknows: 1, dogCommand: SIT, unknown: true)\n      }\n    ", [unknownArg('whoknows', 'doesKnowCommand', 'Dog', [], 3, 25), unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 3, 55)]);
  });
  (0, _mocha.it)('unknown args deeply', function () {
    (0, _harness.expectFailsRule)(_KnownArgumentNames.KnownArgumentNames, "\n      {\n        dog {\n          doesKnowCommand(unknown: true)\n        }\n        human {\n          pet {\n            ... on Dog {\n              doesKnowCommand(unknown: true)\n            }\n          }\n        }\n      }\n    ", [unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 4, 27), unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 9, 31)]);
  });
});