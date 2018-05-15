/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { KnownArgumentNames, unknownArgMessage, unknownDirectiveArgMessage } from '../rules/KnownArgumentNames';

function unknownArg(argName, fieldName, typeName, suggestedArgs, line, column) {
  return {
    message: unknownArgMessage(argName, fieldName, typeName, suggestedArgs),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function unknownDirectiveArg(argName, directiveName, suggestedArgs, line, column) {
  return {
    message: unknownDirectiveArgMessage(argName, directiveName, suggestedArgs),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Known argument names', function () {
  it('single arg is known', function () {
    expectPassesRule(KnownArgumentNames, "\n      fragment argOnRequiredArg on Dog {\n        doesKnowCommand(dogCommand: SIT)\n      }\n    ");
  });
  it('multiple args are known', function () {
    expectPassesRule(KnownArgumentNames, "\n      fragment multipleArgs on ComplicatedArgs {\n        multipleReqs(req1: 1, req2: 2)\n      }\n    ");
  });
  it('ignores args of unknown fields', function () {
    expectPassesRule(KnownArgumentNames, "\n      fragment argOnUnknownField on Dog {\n        unknownField(unknownArg: SIT)\n      }\n    ");
  });
  it('multiple args in reverse order are known', function () {
    expectPassesRule(KnownArgumentNames, "\n      fragment multipleArgsReverseOrder on ComplicatedArgs {\n        multipleReqs(req2: 2, req1: 1)\n      }\n    ");
  });
  it('no args on optional arg', function () {
    expectPassesRule(KnownArgumentNames, "\n      fragment noArgOnOptionalArg on Dog {\n        isHousetrained\n      }\n    ");
  });
  it('args are known deeply', function () {
    expectPassesRule(KnownArgumentNames, "\n      {\n        dog {\n          doesKnowCommand(dogCommand: SIT)\n        }\n        human {\n          pet {\n            ... on Dog {\n              doesKnowCommand(dogCommand: SIT)\n            }\n          }\n        }\n      }\n    ");
  });
  it('directive args are known', function () {
    expectPassesRule(KnownArgumentNames, "\n      {\n        dog @skip(if: true)\n      }\n    ");
  });
  it('undirective args are invalid', function () {
    expectFailsRule(KnownArgumentNames, "\n      {\n        dog @skip(unless: true)\n      }\n    ", [unknownDirectiveArg('unless', 'skip', [], 3, 19)]);
  });
  it('misspelled directive args are reported', function () {
    expectFailsRule(KnownArgumentNames, "\n      {\n        dog @skip(iff: true)\n      }\n    ", [unknownDirectiveArg('iff', 'skip', ['if'], 3, 19)]);
  });
  it('invalid arg name', function () {
    expectFailsRule(KnownArgumentNames, "\n      fragment invalidArgName on Dog {\n        doesKnowCommand(unknown: true)\n      }\n    ", [unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 3, 25)]);
  });
  it('misspelled arg name is reported', function () {
    expectFailsRule(KnownArgumentNames, "\n      fragment invalidArgName on Dog {\n        doesKnowCommand(dogcommand: true)\n      }\n    ", [unknownArg('dogcommand', 'doesKnowCommand', 'Dog', ['dogCommand'], 3, 25)]);
  });
  it('unknown args amongst known args', function () {
    expectFailsRule(KnownArgumentNames, "\n      fragment oneGoodArgOneInvalidArg on Dog {\n        doesKnowCommand(whoknows: 1, dogCommand: SIT, unknown: true)\n      }\n    ", [unknownArg('whoknows', 'doesKnowCommand', 'Dog', [], 3, 25), unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 3, 55)]);
  });
  it('unknown args deeply', function () {
    expectFailsRule(KnownArgumentNames, "\n      {\n        dog {\n          doesKnowCommand(unknown: true)\n        }\n        human {\n          pet {\n            ... on Dog {\n              doesKnowCommand(unknown: true)\n            }\n          }\n        }\n      }\n    ", [unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 4, 27), unknownArg('unknown', 'doesKnowCommand', 'Dog', [], 9, 31)]);
  });
});