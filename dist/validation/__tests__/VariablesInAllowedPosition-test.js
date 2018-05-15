"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _VariablesInAllowedPosition = require("../rules/VariablesInAllowedPosition");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Validate: Variables are in allowed positions', function () {
  (0, _mocha.it)('Boolean => Boolean', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($booleanArg: Boolean)\n      {\n        complicatedArgs {\n          booleanArgField(booleanArg: $booleanArg)\n        }\n      }\n    ");
  });
  (0, _mocha.it)('Boolean => Boolean within fragment', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      fragment booleanArgFrag on ComplicatedArgs {\n        booleanArgField(booleanArg: $booleanArg)\n      }\n      query Query($booleanArg: Boolean)\n      {\n        complicatedArgs {\n          ...booleanArgFrag\n        }\n      }\n    ");
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($booleanArg: Boolean)\n      {\n        complicatedArgs {\n          ...booleanArgFrag\n        }\n      }\n      fragment booleanArgFrag on ComplicatedArgs {\n        booleanArgField(booleanArg: $booleanArg)\n      }\n    ");
  });
  (0, _mocha.it)('Boolean! => Boolean', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($nonNullBooleanArg: Boolean!)\n      {\n        complicatedArgs {\n          booleanArgField(booleanArg: $nonNullBooleanArg)\n        }\n      }\n    ");
  });
  (0, _mocha.it)('Boolean! => Boolean within fragment', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      fragment booleanArgFrag on ComplicatedArgs {\n        booleanArgField(booleanArg: $nonNullBooleanArg)\n      }\n\n      query Query($nonNullBooleanArg: Boolean!)\n      {\n        complicatedArgs {\n          ...booleanArgFrag\n        }\n      }\n    ");
  });
  (0, _mocha.it)('[String] => [String]', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringListVar: [String])\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: $stringListVar)\n        }\n      }\n    ");
  });
  (0, _mocha.it)('[String!] => [String]', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringListVar: [String!])\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: $stringListVar)\n        }\n      }\n    ");
  });
  (0, _mocha.it)('String => [String] in item position', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringVar: String)\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: [$stringVar])\n        }\n      }\n    ");
  });
  (0, _mocha.it)('String! => [String] in item position', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringVar: String!)\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: [$stringVar])\n        }\n      }\n    ");
  });
  (0, _mocha.it)('ComplexInput => ComplexInput', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($complexVar: ComplexInput)\n      {\n        complicatedArgs {\n          complexArgField(complexArg: $complexVar)\n        }\n      }\n    ");
  });
  (0, _mocha.it)('ComplexInput => ComplexInput in field position', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($boolVar: Boolean = false)\n      {\n        complicatedArgs {\n          complexArgField(complexArg: {requiredArg: $boolVar})\n        }\n      }\n    ");
  });
  (0, _mocha.it)('Boolean! => Boolean! in directive', function () {
    (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($boolVar: Boolean!)\n      {\n        dog @include(if: $boolVar)\n      }\n    ");
  });
  (0, _mocha.it)('Int => Int!', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($intArg: Int) {\n        complicatedArgs {\n          nonNullIntArgField(nonNullIntArg: $intArg)\n        }\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('intArg', 'Int', 'Int!'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 4,
        column: 45
      }]
    }]);
  });
  (0, _mocha.it)('Int => Int! within fragment', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      fragment nonNullIntArgFieldFrag on ComplicatedArgs {\n        nonNullIntArgField(nonNullIntArg: $intArg)\n      }\n\n      query Query($intArg: Int) {\n        complicatedArgs {\n          ...nonNullIntArgFieldFrag\n        }\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('intArg', 'Int', 'Int!'),
      locations: [{
        line: 6,
        column: 19
      }, {
        line: 3,
        column: 43
      }]
    }]);
  });
  (0, _mocha.it)('Int => Int! within nested fragment', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      fragment outerFrag on ComplicatedArgs {\n        ...nonNullIntArgFieldFrag\n      }\n\n      fragment nonNullIntArgFieldFrag on ComplicatedArgs {\n        nonNullIntArgField(nonNullIntArg: $intArg)\n      }\n\n      query Query($intArg: Int) {\n        complicatedArgs {\n          ...outerFrag\n        }\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('intArg', 'Int', 'Int!'),
      locations: [{
        line: 10,
        column: 19
      }, {
        line: 7,
        column: 43
      }]
    }]);
  });
  (0, _mocha.it)('String over Boolean', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringVar: String) {\n        complicatedArgs {\n          booleanArgField(booleanArg: $stringVar)\n        }\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('stringVar', 'String', 'Boolean'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 4,
        column: 39
      }]
    }]);
  });
  (0, _mocha.it)('String => [String]', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringVar: String) {\n        complicatedArgs {\n          stringListArgField(stringListArg: $stringVar)\n        }\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('stringVar', 'String', '[String]'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 4,
        column: 45
      }]
    }]);
  });
  (0, _mocha.it)('Boolean => Boolean! in directive', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($boolVar: Boolean) {\n        dog @include(if: $boolVar)\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('boolVar', 'Boolean', 'Boolean!'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 3,
        column: 26
      }]
    }]);
  });
  (0, _mocha.it)('String => Boolean! in directive', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringVar: String) {\n        dog @include(if: $stringVar)\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('stringVar', 'String', 'Boolean!'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 3,
        column: 26
      }]
    }]);
  });
  (0, _mocha.it)('[String] => [String!]', function () {
    (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n      query Query($stringListVar: [String])\n      {\n        complicatedArgs {\n          stringListNonNullArgField(stringListNonNullArg: $stringListVar)\n        }\n      }\n    ", [{
      message: (0, _VariablesInAllowedPosition.badVarPosMessage)('stringListVar', '[String]', '[String!]'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 5,
        column: 59
      }]
    }]);
  });
  (0, _mocha.describe)('Allows optional (nullable) variables with default values', function () {
    (0, _mocha.it)('Int => Int! fails when variable provides null default value', function () {
      (0, _harness.expectFailsRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n        query Query($intVar: Int = null) {\n          complicatedArgs {\n            nonNullIntArgField(nonNullIntArg: $intVar)\n          }\n        }", [{
        message: (0, _VariablesInAllowedPosition.badVarPosMessage)('intVar', 'Int', 'Int!'),
        locations: [{
          line: 2,
          column: 21
        }, {
          line: 4,
          column: 47
        }]
      }]);
    });
    (0, _mocha.it)('Int => Int! when variable provides non-null default value', function () {
      (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n        query Query($intVar: Int = 1) {\n          complicatedArgs {\n            nonNullIntArgField(nonNullIntArg: $intVar)\n          }\n        }");
    });
    (0, _mocha.it)('Int => Int! when optional argument provides default value', function () {
      (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n        query Query($intVar: Int) {\n          complicatedArgs {\n            nonNullFieldWithDefault(nonNullIntArg: $intVar)\n          }\n        }");
    });
    (0, _mocha.it)('Boolean => Boolean! in directive with default value with option', function () {
      (0, _harness.expectPassesRule)(_VariablesInAllowedPosition.VariablesInAllowedPosition, "\n        query Query($boolVar: Boolean = false) {\n          dog @include(if: $boolVar)\n        }");
    });
  });
});