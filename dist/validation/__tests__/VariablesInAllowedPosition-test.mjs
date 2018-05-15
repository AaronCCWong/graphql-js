/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { VariablesInAllowedPosition, badVarPosMessage } from '../rules/VariablesInAllowedPosition';
describe('Validate: Variables are in allowed positions', function () {
  it('Boolean => Boolean', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($booleanArg: Boolean)\n      {\n        complicatedArgs {\n          booleanArgField(booleanArg: $booleanArg)\n        }\n      }\n    ");
  });
  it('Boolean => Boolean within fragment', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      fragment booleanArgFrag on ComplicatedArgs {\n        booleanArgField(booleanArg: $booleanArg)\n      }\n      query Query($booleanArg: Boolean)\n      {\n        complicatedArgs {\n          ...booleanArgFrag\n        }\n      }\n    ");
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($booleanArg: Boolean)\n      {\n        complicatedArgs {\n          ...booleanArgFrag\n        }\n      }\n      fragment booleanArgFrag on ComplicatedArgs {\n        booleanArgField(booleanArg: $booleanArg)\n      }\n    ");
  });
  it('Boolean! => Boolean', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($nonNullBooleanArg: Boolean!)\n      {\n        complicatedArgs {\n          booleanArgField(booleanArg: $nonNullBooleanArg)\n        }\n      }\n    ");
  });
  it('Boolean! => Boolean within fragment', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      fragment booleanArgFrag on ComplicatedArgs {\n        booleanArgField(booleanArg: $nonNullBooleanArg)\n      }\n\n      query Query($nonNullBooleanArg: Boolean!)\n      {\n        complicatedArgs {\n          ...booleanArgFrag\n        }\n      }\n    ");
  });
  it('[String] => [String]', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($stringListVar: [String])\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: $stringListVar)\n        }\n      }\n    ");
  });
  it('[String!] => [String]', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($stringListVar: [String!])\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: $stringListVar)\n        }\n      }\n    ");
  });
  it('String => [String] in item position', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($stringVar: String)\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: [$stringVar])\n        }\n      }\n    ");
  });
  it('String! => [String] in item position', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($stringVar: String!)\n      {\n        complicatedArgs {\n          stringListArgField(stringListArg: [$stringVar])\n        }\n      }\n    ");
  });
  it('ComplexInput => ComplexInput', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($complexVar: ComplexInput)\n      {\n        complicatedArgs {\n          complexArgField(complexArg: $complexVar)\n        }\n      }\n    ");
  });
  it('ComplexInput => ComplexInput in field position', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($boolVar: Boolean = false)\n      {\n        complicatedArgs {\n          complexArgField(complexArg: {requiredArg: $boolVar})\n        }\n      }\n    ");
  });
  it('Boolean! => Boolean! in directive', function () {
    expectPassesRule(VariablesInAllowedPosition, "\n      query Query($boolVar: Boolean!)\n      {\n        dog @include(if: $boolVar)\n      }\n    ");
  });
  it('Int => Int!', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      query Query($intArg: Int) {\n        complicatedArgs {\n          nonNullIntArgField(nonNullIntArg: $intArg)\n        }\n      }\n    ", [{
      message: badVarPosMessage('intArg', 'Int', 'Int!'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 4,
        column: 45
      }]
    }]);
  });
  it('Int => Int! within fragment', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      fragment nonNullIntArgFieldFrag on ComplicatedArgs {\n        nonNullIntArgField(nonNullIntArg: $intArg)\n      }\n\n      query Query($intArg: Int) {\n        complicatedArgs {\n          ...nonNullIntArgFieldFrag\n        }\n      }\n    ", [{
      message: badVarPosMessage('intArg', 'Int', 'Int!'),
      locations: [{
        line: 6,
        column: 19
      }, {
        line: 3,
        column: 43
      }]
    }]);
  });
  it('Int => Int! within nested fragment', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      fragment outerFrag on ComplicatedArgs {\n        ...nonNullIntArgFieldFrag\n      }\n\n      fragment nonNullIntArgFieldFrag on ComplicatedArgs {\n        nonNullIntArgField(nonNullIntArg: $intArg)\n      }\n\n      query Query($intArg: Int) {\n        complicatedArgs {\n          ...outerFrag\n        }\n      }\n    ", [{
      message: badVarPosMessage('intArg', 'Int', 'Int!'),
      locations: [{
        line: 10,
        column: 19
      }, {
        line: 7,
        column: 43
      }]
    }]);
  });
  it('String over Boolean', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      query Query($stringVar: String) {\n        complicatedArgs {\n          booleanArgField(booleanArg: $stringVar)\n        }\n      }\n    ", [{
      message: badVarPosMessage('stringVar', 'String', 'Boolean'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 4,
        column: 39
      }]
    }]);
  });
  it('String => [String]', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      query Query($stringVar: String) {\n        complicatedArgs {\n          stringListArgField(stringListArg: $stringVar)\n        }\n      }\n    ", [{
      message: badVarPosMessage('stringVar', 'String', '[String]'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 4,
        column: 45
      }]
    }]);
  });
  it('Boolean => Boolean! in directive', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      query Query($boolVar: Boolean) {\n        dog @include(if: $boolVar)\n      }\n    ", [{
      message: badVarPosMessage('boolVar', 'Boolean', 'Boolean!'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 3,
        column: 26
      }]
    }]);
  });
  it('String => Boolean! in directive', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      query Query($stringVar: String) {\n        dog @include(if: $stringVar)\n      }\n    ", [{
      message: badVarPosMessage('stringVar', 'String', 'Boolean!'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 3,
        column: 26
      }]
    }]);
  });
  it('[String] => [String!]', function () {
    expectFailsRule(VariablesInAllowedPosition, "\n      query Query($stringListVar: [String])\n      {\n        complicatedArgs {\n          stringListNonNullArgField(stringListNonNullArg: $stringListVar)\n        }\n      }\n    ", [{
      message: badVarPosMessage('stringListVar', '[String]', '[String!]'),
      locations: [{
        line: 2,
        column: 19
      }, {
        line: 5,
        column: 59
      }]
    }]);
  });
  describe('Allows optional (nullable) variables with default values', function () {
    it('Int => Int! fails when variable provides null default value', function () {
      expectFailsRule(VariablesInAllowedPosition, "\n        query Query($intVar: Int = null) {\n          complicatedArgs {\n            nonNullIntArgField(nonNullIntArg: $intVar)\n          }\n        }", [{
        message: badVarPosMessage('intVar', 'Int', 'Int!'),
        locations: [{
          line: 2,
          column: 21
        }, {
          line: 4,
          column: 47
        }]
      }]);
    });
    it('Int => Int! when variable provides non-null default value', function () {
      expectPassesRule(VariablesInAllowedPosition, "\n        query Query($intVar: Int = 1) {\n          complicatedArgs {\n            nonNullIntArgField(nonNullIntArg: $intVar)\n          }\n        }");
    });
    it('Int => Int! when optional argument provides default value', function () {
      expectPassesRule(VariablesInAllowedPosition, "\n        query Query($intVar: Int) {\n          complicatedArgs {\n            nonNullFieldWithDefault(nonNullIntArg: $intVar)\n          }\n        }");
    });
    it('Boolean => Boolean! in directive with default value with option', function () {
      expectPassesRule(VariablesInAllowedPosition, "\n        query Query($boolVar: Boolean = false) {\n          dog @include(if: $boolVar)\n        }");
    });
  });
});