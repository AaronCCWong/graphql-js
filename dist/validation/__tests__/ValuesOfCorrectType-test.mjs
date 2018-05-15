/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { expectPassesRule, expectFailsRule } from './harness';
import { ValuesOfCorrectType, badValueMessage, requiredFieldMessage, unknownFieldMessage } from '../rules/ValuesOfCorrectType';

function badValue(typeName, value, line, column, message) {
  return {
    message: badValueMessage(typeName, value, message),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function requiredField(typeName, fieldName, fieldTypeName, line, column) {
  return {
    message: requiredFieldMessage(typeName, fieldName, fieldTypeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function unknownField(typeName, fieldName, line, column, message) {
  return {
    message: unknownFieldMessage(typeName, fieldName, message),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Values of correct type', function () {
  describe('Valid values', function () {
    it('Good int value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 2)\n          }\n        }\n      ");
    });
    it('Good negative int value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: -2)\n          }\n        }\n      ");
    });
    it('Good boolean value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: true)\n          }\n        }\n      ");
    });
    it('Good string value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: \"foo\")\n          }\n        }\n      ");
    });
    it('Good float value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: 1.1)\n          }\n        }\n      ");
    });
    it('Good negative float value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: -1.1)\n          }\n        }\n      ");
    });
    it('Int into Float', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: 1)\n          }\n        }\n      ");
    });
    it('Int into ID', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: 1)\n          }\n        }\n      ");
    });
    it('String into ID', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: \"someIdString\")\n          }\n        }\n      ");
    });
    it('Good enum value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: SIT)\n          }\n        }\n      ");
    });
    it('Enum with undefined value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            enumArgField(enumArg: UNKNOWN)\n          }\n        }\n      ");
    });
    it('Enum with null value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            enumArgField(enumArg: NO_FUR)\n          }\n        }\n      ");
    });
    it('null into nullable type', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: null)\n          }\n        }\n      ");
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          dog(a: null, b: null, c:{ requiredField: true, intField: null }) {\n            name\n          }\n        }\n      ");
    });
  });
  describe('Invalid String values', function () {
    it('Int into String', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: 1)\n          }\n        }\n      ", [badValue('String', '1', 4, 39)]);
    });
    it('Float into String', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: 1.0)\n          }\n        }\n      ", [badValue('String', '1.0', 4, 39)]);
    });
    it('Boolean into String', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: true)\n          }\n        }\n      ", [badValue('String', 'true', 4, 39)]);
    });
    it('Unquoted String into String', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: BAR)\n          }\n        }\n      ", [badValue('String', 'BAR', 4, 39)]);
    });
  });
  describe('Invalid Int values', function () {
    it('String into Int', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: \"3\")\n          }\n        }\n      ", [badValue('Int', '"3"', 4, 33)]);
    });
    it('Big Int into Int', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 829384293849283498239482938)\n          }\n        }\n      ", [badValue('Int', '829384293849283498239482938', 4, 33)]);
    });
    it('Unquoted String into Int', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: FOO)\n          }\n        }\n      ", [badValue('Int', 'FOO', 4, 33)]);
    });
    it('Simple Float into Int', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 3.0)\n          }\n        }\n      ", [badValue('Int', '3.0', 4, 33)]);
    });
    it('Float into Int', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 3.333)\n          }\n        }\n      ", [badValue('Int', '3.333', 4, 33)]);
    });
  });
  describe('Invalid Float values', function () {
    it('String into Float', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: \"3.333\")\n          }\n        }\n      ", [badValue('Float', '"3.333"', 4, 37)]);
    });
    it('Boolean into Float', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: true)\n          }\n        }\n      ", [badValue('Float', 'true', 4, 37)]);
    });
    it('Unquoted into Float', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: FOO)\n          }\n        }\n      ", [badValue('Float', 'FOO', 4, 37)]);
    });
  });
  describe('Invalid Boolean value', function () {
    it('Int into Boolean', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: 2)\n          }\n        }\n      ", [badValue('Boolean', '2', 4, 41)]);
    });
    it('Float into Boolean', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: 1.0)\n          }\n        }\n      ", [badValue('Boolean', '1.0', 4, 41)]);
    });
    it('String into Boolean', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: \"true\")\n          }\n        }\n      ", [badValue('Boolean', '"true"', 4, 41)]);
    });
    it('Unquoted into Boolean', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: TRUE)\n          }\n        }\n      ", [badValue('Boolean', 'TRUE', 4, 41)]);
    });
  });
  describe('Invalid ID value', function () {
    it('Float into ID', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: 1.0)\n          }\n        }\n      ", [badValue('ID', '1.0', 4, 31)]);
    });
    it('Boolean into ID', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: true)\n          }\n        }\n      ", [badValue('ID', 'true', 4, 31)]);
    });
    it('Unquoted into ID', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: SOMETHING)\n          }\n        }\n      ", [badValue('ID', 'SOMETHING', 4, 31)]);
    });
  });
  describe('Invalid Enum value', function () {
    it('Int into Enum', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: 2)\n          }\n        }\n      ", [badValue('DogCommand', '2', 4, 41)]);
    });
    it('Float into Enum', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: 1.0)\n          }\n        }\n      ", [badValue('DogCommand', '1.0', 4, 41)]);
    });
    it('String into Enum', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: \"SIT\")\n          }\n        }\n      ", [badValue('DogCommand', '"SIT"', 4, 41, 'Did you mean the enum value SIT?')]);
    });
    it('Boolean into Enum', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: true)\n          }\n        }\n      ", [badValue('DogCommand', 'true', 4, 41)]);
    });
    it('Unknown Enum Value into Enum', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: JUGGLE)\n          }\n        }\n      ", [badValue('DogCommand', 'JUGGLE', 4, 41)]);
    });
    it('Different case Enum Value into Enum', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: sit)\n          }\n        }\n      ", [badValue('DogCommand', 'sit', 4, 41, 'Did you mean the enum value SIT?')]);
    });
  });
  describe('Valid List value', function () {
    it('Good list value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: [\"one\", null, \"two\"])\n          }\n        }\n      ");
    });
    it('Empty list value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: [])\n          }\n        }\n      ");
    });
    it('Null value', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: null)\n          }\n        }\n      ");
    });
    it('Single value into List', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: \"one\")\n          }\n        }\n      ");
    });
  });
  describe('Invalid List value', function () {
    it('Incorrect item type', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: [\"one\", 2])\n          }\n        }\n      ", [badValue('String', '2', 4, 55)]);
    });
    it('Single value of incorrect type', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: 1)\n          }\n        }\n      ", [badValue('[String]', '1', 4, 47)]);
    });
  });
  describe('Valid non-nullable value', function () {
    it('Arg on optional arg', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          dog {\n            isHousetrained(atOtherHomes: true)\n          }\n        }\n      ");
    });
    it('No Arg on optional arg', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          dog {\n            isHousetrained\n          }\n        }\n      ");
    });
    it('Multiple args', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: 1, req2: 2)\n          }\n        }\n      ");
    });
    it('Multiple args reverse order', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: 2, req1: 1)\n          }\n        }\n      ");
    });
    it('No args on multiple optional', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOpts\n          }\n        }\n      ");
    });
    it('One arg on multiple optional', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOpts(opt1: 1)\n          }\n        }\n      ");
    });
    it('Second arg on multiple optional', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOpts(opt2: 1)\n          }\n        }\n      ");
    });
    it('Multiple reqs on mixedList', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4)\n          }\n        }\n      ");
    });
    it('Multiple reqs and one opt on mixedList', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5)\n          }\n        }\n      ");
    });
    it('All reqs and opts on mixedList', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5, opt2: 6)\n          }\n        }\n      ");
    });
  });
  describe('Invalid non-nullable value', function () {
    it('Incorrect value type', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: \"two\", req1: \"one\")\n          }\n        }\n      ", [badValue('Int!', '"two"', 4, 32), badValue('Int!', '"one"', 4, 45)]);
    });
    it('Incorrect value and missing argument (ProvidedRequiredArguments)', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: \"one\")\n          }\n        }\n      ", [badValue('Int!', '"one"', 4, 32)]);
    });
    it('Null value', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: null)\n          }\n        }\n      ", [badValue('Int!', 'null', 4, 32)]);
    });
  });
  describe('Valid input object value', function () {
    it('Optional arg, despite required field in type', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField\n          }\n        }\n      ");
    });
    it('Partial object, only required', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { requiredField: true })\n          }\n        }\n      ");
    });
    it('Partial object, required field can be falsey', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { requiredField: false })\n          }\n        }\n      ");
    });
    it('Partial object, including required', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { requiredField: true, intField: 4 })\n          }\n        }\n      ");
    });
    it('Full object', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              requiredField: true,\n              intField: 4,\n              stringField: \"foo\",\n              booleanField: false,\n              stringListField: [\"one\", \"two\"]\n            })\n          }\n        }\n      ");
    });
    it('Full object with fields in different order', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              stringListField: [\"one\", \"two\"],\n              booleanField: false,\n              requiredField: true,\n              stringField: \"foo\",\n              intField: 4,\n            })\n          }\n        }\n      ");
    });
  });
  describe('Invalid input object value', function () {
    it('Partial object, missing required', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { intField: 4 })\n          }\n        }\n      ", [requiredField('ComplexInput', 'requiredField', 'Boolean!', 4, 41)]);
    });
    it('Partial object, invalid field type', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              stringListField: [\"one\", 2],\n              requiredField: true,\n            })\n          }\n        }\n      ", [badValue('String', '2', 5, 40)]);
    });
    it('Partial object, null to non-null field', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              requiredField: true,\n              nonNullField: null,\n            })\n          }\n        }\n      ", [badValue('Boolean!', 'null', 6, 29)]);
    });
    it('Partial object, unknown field arg', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              requiredField: true,\n              unknownField: \"value\"\n            })\n          }\n        }\n      ", [unknownField('ComplexInput', 'unknownField', 6, 15, 'Did you mean nonNullField, intField, or booleanField?')]);
    });
    it('reports original error for custom scalar which throws', function () {
      var errors = expectFailsRule(ValuesOfCorrectType, "\n        {\n          invalidArg(arg: 123)\n        }\n      ", [badValue('Invalid', '123', 3, 27, 'Invalid scalar is always invalid: 123')]);
      expect(errors[0].originalError.message).to.equal('Invalid scalar is always invalid: 123');
    });
    it('allows custom scalar to accept complex literals', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          test1: anyArg(arg: 123)\n          test2: anyArg(arg: \"abc\")\n          test3: anyArg(arg: [123, \"abc\"])\n          test4: anyArg(arg: {deep: [123, \"abc\"]})\n        }\n      ");
    });
  });
  describe('Directive arguments', function () {
    it('with directives of valid types', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        {\n          dog @include(if: true) {\n            name\n          }\n          human @skip(if: false) {\n            name\n          }\n        }\n      ");
    });
    it('with directive with incorrect types', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        {\n          dog @include(if: \"yes\") {\n            name @skip(if: ENUM)\n          }\n        }\n      ", [badValue('Boolean!', '"yes"', 3, 28), badValue('Boolean!', 'ENUM', 4, 28)]);
    });
  });
  describe('Variable default values', function () {
    it('variables with valid default values', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: Int = 1,\n          $b: String = \"ok\",\n          $c: ComplexInput = { requiredField: true, intField: 3 }\n          $d: Int! = 123\n        ) {\n          dog { name }\n        }\n      ");
    });
    it('variables with valid default null values', function () {
      expectPassesRule(ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: Int = null,\n          $b: String = null,\n          $c: ComplexInput = { requiredField: true, intField: null }\n        ) {\n          dog { name }\n        }\n      ");
    });
    it('variables with invalid default null values', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: Int! = null,\n          $b: String! = null,\n          $c: ComplexInput = { requiredField: null, intField: null }\n        ) {\n          dog { name }\n        }\n      ", [badValue('Int!', 'null', 3, 22), badValue('String!', 'null', 4, 25), badValue('Boolean!', 'null', 5, 47)]);
    });
    it('variables with invalid default values', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        query InvalidDefaultValues(\n          $a: Int = \"one\",\n          $b: String = 4,\n          $c: ComplexInput = \"notverycomplex\"\n        ) {\n          dog { name }\n        }\n      ", [badValue('Int', '"one"', 3, 21), badValue('String', '4', 4, 24), badValue('ComplexInput', '"notverycomplex"', 5, 30)]);
    });
    it('variables with complex invalid default values', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: ComplexInput = { requiredField: 123, intField: \"abc\" }\n        ) {\n          dog { name }\n        }\n      ", [badValue('Boolean!', '123', 3, 47), badValue('Int', '"abc"', 3, 62)]);
    });
    it('complex variables missing required field', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        query MissingRequiredField($a: ComplexInput = {intField: 3}) {\n          dog { name }\n        }\n      ", [requiredField('ComplexInput', 'requiredField', 'Boolean!', 2, 55)]);
    });
    it('list variables with invalid item', function () {
      expectFailsRule(ValuesOfCorrectType, "\n        query InvalidItem($a: [String] = [\"one\", 2]) {\n          dog { name }\n        }\n      ", [badValue('String', '2', 2, 50)]);
    });
  });
});