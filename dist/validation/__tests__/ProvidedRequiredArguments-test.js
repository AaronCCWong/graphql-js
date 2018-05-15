"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _ProvidedRequiredArguments = require("../rules/ProvidedRequiredArguments");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function missingFieldArg(fieldName, argName, typeName, line, column) {
  return {
    message: (0, _ProvidedRequiredArguments.missingFieldArgMessage)(fieldName, argName, typeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function missingDirectiveArg(directiveName, argName, typeName, line, column) {
  return {
    message: (0, _ProvidedRequiredArguments.missingDirectiveArgMessage)(directiveName, argName, typeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Provided required arguments', function () {
  (0, _mocha.it)('ignores unknown arguments', function () {
    (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n      {\n        dog {\n          isHousetrained(unknownArgument: true)\n        }\n      }\n    ");
  });
  (0, _mocha.describe)('Valid non-nullable value', function () {
    (0, _mocha.it)('Arg on optional arg', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          dog {\n            isHousetrained(atOtherHomes: true)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('No Arg on optional arg', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          dog {\n            isHousetrained\n          }\n        }\n      ");
    });
    (0, _mocha.it)('No arg on non-null field with default', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            nonNullFieldWithDefault\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple args', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: 1, req2: 2)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple args reverse order', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: 2, req1: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('No args on multiple optional', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOpts\n          }\n        }\n      ");
    });
    (0, _mocha.it)('One arg on multiple optional', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOpts(opt1: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Second arg on multiple optional', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOpts(opt2: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple reqs on mixedList', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple reqs and one opt on mixedList', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('All reqs and opts on mixedList', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5, opt2: 6)\n          }\n        }\n      ");
    });
  });
  (0, _mocha.describe)('Invalid non-nullable value', function () {
    (0, _mocha.it)('Missing one non-nullable argument', function () {
      (0, _harness.expectFailsRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: 2)\n          }\n        }\n      ", [missingFieldArg('multipleReqs', 'req1', 'Int!', 4, 13)]);
    });
    (0, _mocha.it)('Missing multiple non-nullable arguments', function () {
      (0, _harness.expectFailsRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs\n          }\n        }\n      ", [missingFieldArg('multipleReqs', 'req1', 'Int!', 4, 13), missingFieldArg('multipleReqs', 'req2', 'Int!', 4, 13)]);
    });
    (0, _mocha.it)('Incorrect value and missing argument', function () {
      (0, _harness.expectFailsRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: \"one\")\n          }\n        }\n      ", [missingFieldArg('multipleReqs', 'req2', 'Int!', 4, 13)]);
    });
  });
  (0, _mocha.describe)('Directive arguments', function () {
    (0, _mocha.it)('ignores unknown directives', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          dog @unknown\n        }\n      ");
    });
    (0, _mocha.it)('with directives of valid types', function () {
      (0, _harness.expectPassesRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          dog @include(if: true) {\n            name\n          }\n          human @skip(if: false) {\n            name\n          }\n        }\n      ");
    });
    (0, _mocha.it)('with directive with missing types', function () {
      (0, _harness.expectFailsRule)(_ProvidedRequiredArguments.ProvidedRequiredArguments, "\n        {\n          dog @include {\n            name @skip\n          }\n        }\n      ", [missingDirectiveArg('include', 'if', 'Boolean!', 3, 15), missingDirectiveArg('skip', 'if', 'Boolean!', 4, 18)]);
    });
  });
});