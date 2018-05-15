/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { ProvidedRequiredArguments, missingFieldArgMessage, missingDirectiveArgMessage } from '../rules/ProvidedRequiredArguments';

function missingFieldArg(fieldName, argName, typeName, line, column) {
  return {
    message: missingFieldArgMessage(fieldName, argName, typeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function missingDirectiveArg(directiveName, argName, typeName, line, column) {
  return {
    message: missingDirectiveArgMessage(directiveName, argName, typeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Provided required arguments', function () {
  it('ignores unknown arguments', function () {
    expectPassesRule(ProvidedRequiredArguments, "\n      {\n        dog {\n          isHousetrained(unknownArgument: true)\n        }\n      }\n    ");
  });
  describe('Valid non-nullable value', function () {
    it('Arg on optional arg', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          dog {\n            isHousetrained(atOtherHomes: true)\n          }\n        }\n      ");
    });
    it('No Arg on optional arg', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          dog {\n            isHousetrained\n          }\n        }\n      ");
    });
    it('No arg on non-null field with default', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            nonNullFieldWithDefault\n          }\n        }\n      ");
    });
    it('Multiple args', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: 1, req2: 2)\n          }\n        }\n      ");
    });
    it('Multiple args reverse order', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: 2, req1: 1)\n          }\n        }\n      ");
    });
    it('No args on multiple optional', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOpts\n          }\n        }\n      ");
    });
    it('One arg on multiple optional', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOpts(opt1: 1)\n          }\n        }\n      ");
    });
    it('Second arg on multiple optional', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOpts(opt2: 1)\n          }\n        }\n      ");
    });
    it('Multiple reqs on mixedList', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4)\n          }\n        }\n      ");
    });
    it('Multiple reqs and one opt on mixedList', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5)\n          }\n        }\n      ");
    });
    it('All reqs and opts on mixedList', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5, opt2: 6)\n          }\n        }\n      ");
    });
  });
  describe('Invalid non-nullable value', function () {
    it('Missing one non-nullable argument', function () {
      expectFailsRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: 2)\n          }\n        }\n      ", [missingFieldArg('multipleReqs', 'req1', 'Int!', 4, 13)]);
    });
    it('Missing multiple non-nullable arguments', function () {
      expectFailsRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs\n          }\n        }\n      ", [missingFieldArg('multipleReqs', 'req1', 'Int!', 4, 13), missingFieldArg('multipleReqs', 'req2', 'Int!', 4, 13)]);
    });
    it('Incorrect value and missing argument', function () {
      expectFailsRule(ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: \"one\")\n          }\n        }\n      ", [missingFieldArg('multipleReqs', 'req2', 'Int!', 4, 13)]);
    });
  });
  describe('Directive arguments', function () {
    it('ignores unknown directives', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          dog @unknown\n        }\n      ");
    });
    it('with directives of valid types', function () {
      expectPassesRule(ProvidedRequiredArguments, "\n        {\n          dog @include(if: true) {\n            name\n          }\n          human @skip(if: false) {\n            name\n          }\n        }\n      ");
    });
    it('with directive with missing types', function () {
      expectFailsRule(ProvidedRequiredArguments, "\n        {\n          dog @include {\n            name @skip\n          }\n        }\n      ", [missingDirectiveArg('include', 'if', 'Boolean!', 3, 15), missingDirectiveArg('skip', 'if', 'Boolean!', 4, 18)]);
    });
  });
});