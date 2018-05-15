"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _harness = require("./harness");

var _ValuesOfCorrectType = require("../rules/ValuesOfCorrectType");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function badValue(typeName, value, line, column, message) {
  return {
    message: (0, _ValuesOfCorrectType.badValueMessage)(typeName, value, message),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function requiredField(typeName, fieldName, fieldTypeName, line, column) {
  return {
    message: (0, _ValuesOfCorrectType.requiredFieldMessage)(typeName, fieldName, fieldTypeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function unknownField(typeName, fieldName, line, column, message) {
  return {
    message: (0, _ValuesOfCorrectType.unknownFieldMessage)(typeName, fieldName, message),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Values of correct type', function () {
  (0, _mocha.describe)('Valid values', function () {
    (0, _mocha.it)('Good int value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 2)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Good negative int value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: -2)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Good boolean value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: true)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Good string value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: \"foo\")\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Good float value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: 1.1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Good negative float value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: -1.1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Int into Float', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Int into ID', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('String into ID', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: \"someIdString\")\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Good enum value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: SIT)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Enum with undefined value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            enumArgField(enumArg: UNKNOWN)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Enum with null value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            enumArgField(enumArg: NO_FUR)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('null into nullable type', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: null)\n          }\n        }\n      ");
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog(a: null, b: null, c:{ requiredField: true, intField: null }) {\n            name\n          }\n        }\n      ");
    });
  });
  (0, _mocha.describe)('Invalid String values', function () {
    (0, _mocha.it)('Int into String', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: 1)\n          }\n        }\n      ", [badValue('String', '1', 4, 39)]);
    });
    (0, _mocha.it)('Float into String', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: 1.0)\n          }\n        }\n      ", [badValue('String', '1.0', 4, 39)]);
    });
    (0, _mocha.it)('Boolean into String', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: true)\n          }\n        }\n      ", [badValue('String', 'true', 4, 39)]);
    });
    (0, _mocha.it)('Unquoted String into String', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringArgField(stringArg: BAR)\n          }\n        }\n      ", [badValue('String', 'BAR', 4, 39)]);
    });
  });
  (0, _mocha.describe)('Invalid Int values', function () {
    (0, _mocha.it)('String into Int', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: \"3\")\n          }\n        }\n      ", [badValue('Int', '"3"', 4, 33)]);
    });
    (0, _mocha.it)('Big Int into Int', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 829384293849283498239482938)\n          }\n        }\n      ", [badValue('Int', '829384293849283498239482938', 4, 33)]);
    });
    (0, _mocha.it)('Unquoted String into Int', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: FOO)\n          }\n        }\n      ", [badValue('Int', 'FOO', 4, 33)]);
    });
    (0, _mocha.it)('Simple Float into Int', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 3.0)\n          }\n        }\n      ", [badValue('Int', '3.0', 4, 33)]);
    });
    (0, _mocha.it)('Float into Int', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            intArgField(intArg: 3.333)\n          }\n        }\n      ", [badValue('Int', '3.333', 4, 33)]);
    });
  });
  (0, _mocha.describe)('Invalid Float values', function () {
    (0, _mocha.it)('String into Float', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: \"3.333\")\n          }\n        }\n      ", [badValue('Float', '"3.333"', 4, 37)]);
    });
    (0, _mocha.it)('Boolean into Float', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: true)\n          }\n        }\n      ", [badValue('Float', 'true', 4, 37)]);
    });
    (0, _mocha.it)('Unquoted into Float', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            floatArgField(floatArg: FOO)\n          }\n        }\n      ", [badValue('Float', 'FOO', 4, 37)]);
    });
  });
  (0, _mocha.describe)('Invalid Boolean value', function () {
    (0, _mocha.it)('Int into Boolean', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: 2)\n          }\n        }\n      ", [badValue('Boolean', '2', 4, 41)]);
    });
    (0, _mocha.it)('Float into Boolean', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: 1.0)\n          }\n        }\n      ", [badValue('Boolean', '1.0', 4, 41)]);
    });
    (0, _mocha.it)('String into Boolean', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: \"true\")\n          }\n        }\n      ", [badValue('Boolean', '"true"', 4, 41)]);
    });
    (0, _mocha.it)('Unquoted into Boolean', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            booleanArgField(booleanArg: TRUE)\n          }\n        }\n      ", [badValue('Boolean', 'TRUE', 4, 41)]);
    });
  });
  (0, _mocha.describe)('Invalid ID value', function () {
    (0, _mocha.it)('Float into ID', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: 1.0)\n          }\n        }\n      ", [badValue('ID', '1.0', 4, 31)]);
    });
    (0, _mocha.it)('Boolean into ID', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: true)\n          }\n        }\n      ", [badValue('ID', 'true', 4, 31)]);
    });
    (0, _mocha.it)('Unquoted into ID', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            idArgField(idArg: SOMETHING)\n          }\n        }\n      ", [badValue('ID', 'SOMETHING', 4, 31)]);
    });
  });
  (0, _mocha.describe)('Invalid Enum value', function () {
    (0, _mocha.it)('Int into Enum', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: 2)\n          }\n        }\n      ", [badValue('DogCommand', '2', 4, 41)]);
    });
    (0, _mocha.it)('Float into Enum', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: 1.0)\n          }\n        }\n      ", [badValue('DogCommand', '1.0', 4, 41)]);
    });
    (0, _mocha.it)('String into Enum', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: \"SIT\")\n          }\n        }\n      ", [badValue('DogCommand', '"SIT"', 4, 41, 'Did you mean the enum value SIT?')]);
    });
    (0, _mocha.it)('Boolean into Enum', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: true)\n          }\n        }\n      ", [badValue('DogCommand', 'true', 4, 41)]);
    });
    (0, _mocha.it)('Unknown Enum Value into Enum', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: JUGGLE)\n          }\n        }\n      ", [badValue('DogCommand', 'JUGGLE', 4, 41)]);
    });
    (0, _mocha.it)('Different case Enum Value into Enum', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            doesKnowCommand(dogCommand: sit)\n          }\n        }\n      ", [badValue('DogCommand', 'sit', 4, 41, 'Did you mean the enum value SIT?')]);
    });
  });
  (0, _mocha.describe)('Valid List value', function () {
    (0, _mocha.it)('Good list value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: [\"one\", null, \"two\"])\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Empty list value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: [])\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Null value', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: null)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Single value into List', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: \"one\")\n          }\n        }\n      ");
    });
  });
  (0, _mocha.describe)('Invalid List value', function () {
    (0, _mocha.it)('Incorrect item type', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: [\"one\", 2])\n          }\n        }\n      ", [badValue('String', '2', 4, 55)]);
    });
    (0, _mocha.it)('Single value of incorrect type', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            stringListArgField(stringListArg: 1)\n          }\n        }\n      ", [badValue('[String]', '1', 4, 47)]);
    });
  });
  (0, _mocha.describe)('Valid non-nullable value', function () {
    (0, _mocha.it)('Arg on optional arg', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            isHousetrained(atOtherHomes: true)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('No Arg on optional arg', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog {\n            isHousetrained\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple args', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: 1, req2: 2)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple args reverse order', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: 2, req1: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('No args on multiple optional', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOpts\n          }\n        }\n      ");
    });
    (0, _mocha.it)('One arg on multiple optional', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOpts(opt1: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Second arg on multiple optional', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOpts(opt2: 1)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple reqs on mixedList', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Multiple reqs and one opt on mixedList', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5)\n          }\n        }\n      ");
    });
    (0, _mocha.it)('All reqs and opts on mixedList', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleOptAndReq(req1: 3, req2: 4, opt1: 5, opt2: 6)\n          }\n        }\n      ");
    });
  });
  (0, _mocha.describe)('Invalid non-nullable value', function () {
    (0, _mocha.it)('Incorrect value type', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req2: \"two\", req1: \"one\")\n          }\n        }\n      ", [badValue('Int!', '"two"', 4, 32), badValue('Int!', '"one"', 4, 45)]);
    });
    (0, _mocha.it)('Incorrect value and missing argument (ProvidedRequiredArguments)', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: \"one\")\n          }\n        }\n      ", [badValue('Int!', '"one"', 4, 32)]);
    });
    (0, _mocha.it)('Null value', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            multipleReqs(req1: null)\n          }\n        }\n      ", [badValue('Int!', 'null', 4, 32)]);
    });
  });
  (0, _mocha.describe)('Valid input object value', function () {
    (0, _mocha.it)('Optional arg, despite required field in type', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Partial object, only required', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { requiredField: true })\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Partial object, required field can be falsey', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { requiredField: false })\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Partial object, including required', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { requiredField: true, intField: 4 })\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Full object', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              requiredField: true,\n              intField: 4,\n              stringField: \"foo\",\n              booleanField: false,\n              stringListField: [\"one\", \"two\"]\n            })\n          }\n        }\n      ");
    });
    (0, _mocha.it)('Full object with fields in different order', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              stringListField: [\"one\", \"two\"],\n              booleanField: false,\n              requiredField: true,\n              stringField: \"foo\",\n              intField: 4,\n            })\n          }\n        }\n      ");
    });
  });
  (0, _mocha.describe)('Invalid input object value', function () {
    (0, _mocha.it)('Partial object, missing required', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: { intField: 4 })\n          }\n        }\n      ", [requiredField('ComplexInput', 'requiredField', 'Boolean!', 4, 41)]);
    });
    (0, _mocha.it)('Partial object, invalid field type', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              stringListField: [\"one\", 2],\n              requiredField: true,\n            })\n          }\n        }\n      ", [badValue('String', '2', 5, 40)]);
    });
    (0, _mocha.it)('Partial object, null to non-null field', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              requiredField: true,\n              nonNullField: null,\n            })\n          }\n        }\n      ", [badValue('Boolean!', 'null', 6, 29)]);
    });
    (0, _mocha.it)('Partial object, unknown field arg', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          complicatedArgs {\n            complexArgField(complexArg: {\n              requiredField: true,\n              unknownField: \"value\"\n            })\n          }\n        }\n      ", [unknownField('ComplexInput', 'unknownField', 6, 15, 'Did you mean nonNullField, intField, or booleanField?')]);
    });
    (0, _mocha.it)('reports original error for custom scalar which throws', function () {
      var errors = (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          invalidArg(arg: 123)\n        }\n      ", [badValue('Invalid', '123', 3, 27, 'Invalid scalar is always invalid: 123')]);
      (0, _chai.expect)(errors[0].originalError.message).to.equal('Invalid scalar is always invalid: 123');
    });
    (0, _mocha.it)('allows custom scalar to accept complex literals', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          test1: anyArg(arg: 123)\n          test2: anyArg(arg: \"abc\")\n          test3: anyArg(arg: [123, \"abc\"])\n          test4: anyArg(arg: {deep: [123, \"abc\"]})\n        }\n      ");
    });
  });
  (0, _mocha.describe)('Directive arguments', function () {
    (0, _mocha.it)('with directives of valid types', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog @include(if: true) {\n            name\n          }\n          human @skip(if: false) {\n            name\n          }\n        }\n      ");
    });
    (0, _mocha.it)('with directive with incorrect types', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        {\n          dog @include(if: \"yes\") {\n            name @skip(if: ENUM)\n          }\n        }\n      ", [badValue('Boolean!', '"yes"', 3, 28), badValue('Boolean!', 'ENUM', 4, 28)]);
    });
  });
  (0, _mocha.describe)('Variable default values', function () {
    (0, _mocha.it)('variables with valid default values', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: Int = 1,\n          $b: String = \"ok\",\n          $c: ComplexInput = { requiredField: true, intField: 3 }\n          $d: Int! = 123\n        ) {\n          dog { name }\n        }\n      ");
    });
    (0, _mocha.it)('variables with valid default null values', function () {
      (0, _harness.expectPassesRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: Int = null,\n          $b: String = null,\n          $c: ComplexInput = { requiredField: true, intField: null }\n        ) {\n          dog { name }\n        }\n      ");
    });
    (0, _mocha.it)('variables with invalid default null values', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: Int! = null,\n          $b: String! = null,\n          $c: ComplexInput = { requiredField: null, intField: null }\n        ) {\n          dog { name }\n        }\n      ", [badValue('Int!', 'null', 3, 22), badValue('String!', 'null', 4, 25), badValue('Boolean!', 'null', 5, 47)]);
    });
    (0, _mocha.it)('variables with invalid default values', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        query InvalidDefaultValues(\n          $a: Int = \"one\",\n          $b: String = 4,\n          $c: ComplexInput = \"notverycomplex\"\n        ) {\n          dog { name }\n        }\n      ", [badValue('Int', '"one"', 3, 21), badValue('String', '4', 4, 24), badValue('ComplexInput', '"notverycomplex"', 5, 30)]);
    });
    (0, _mocha.it)('variables with complex invalid default values', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        query WithDefaultValues(\n          $a: ComplexInput = { requiredField: 123, intField: \"abc\" }\n        ) {\n          dog { name }\n        }\n      ", [badValue('Boolean!', '123', 3, 47), badValue('Int', '"abc"', 3, 62)]);
    });
    (0, _mocha.it)('complex variables missing required field', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        query MissingRequiredField($a: ComplexInput = {intField: 3}) {\n          dog { name }\n        }\n      ", [requiredField('ComplexInput', 'requiredField', 'Boolean!', 2, 55)]);
    });
    (0, _mocha.it)('list variables with invalid item', function () {
      (0, _harness.expectFailsRule)(_ValuesOfCorrectType.ValuesOfCorrectType, "\n        query InvalidItem($a: [String] = [\"one\", 2]) {\n          dog { name }\n        }\n      ", [badValue('String', '2', 2, 50)]);
    });
  });
});