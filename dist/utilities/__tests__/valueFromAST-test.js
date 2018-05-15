"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _valueFromAST = require("../valueFromAST");

var _type = require("../../type");

var _language = require("../../language");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('valueFromAST', function () {
  function testCase(type, valueText, expected) {
    (0, _chai.expect)((0, _valueFromAST.valueFromAST)((0, _language.parseValue)(valueText), type)).to.deep.equal(expected);
  }

  function testCaseWithVars(variables, type, valueText, expected) {
    (0, _chai.expect)((0, _valueFromAST.valueFromAST)((0, _language.parseValue)(valueText), type, variables)).to.deep.equal(expected);
  }

  (0, _mocha.it)('rejects empty input', function () {
    (0, _chai.expect)((0, _valueFromAST.valueFromAST)(null, _type.GraphQLBoolean)).to.deep.equal(undefined);
  });
  (0, _mocha.it)('converts according to input coercion rules', function () {
    testCase(_type.GraphQLBoolean, 'true', true);
    testCase(_type.GraphQLBoolean, 'false', false);
    testCase(_type.GraphQLInt, '123', 123);
    testCase(_type.GraphQLFloat, '123', 123);
    testCase(_type.GraphQLFloat, '123.456', 123.456);
    testCase(_type.GraphQLString, '"abc123"', 'abc123');
    testCase(_type.GraphQLID, '123456', '123456');
    testCase(_type.GraphQLID, '"123456"', '123456');
  });
  (0, _mocha.it)('does not convert when input coercion rules reject a value', function () {
    testCase(_type.GraphQLBoolean, '123', undefined);
    testCase(_type.GraphQLInt, '123.456', undefined);
    testCase(_type.GraphQLInt, 'true', undefined);
    testCase(_type.GraphQLInt, '"123"', undefined);
    testCase(_type.GraphQLFloat, '"123"', undefined);
    testCase(_type.GraphQLString, '123', undefined);
    testCase(_type.GraphQLString, 'true', undefined);
    testCase(_type.GraphQLID, '123.456', undefined);
  });
  var testEnum = new _type.GraphQLEnumType({
    name: 'TestColor',
    values: {
      RED: {
        value: 1
      },
      GREEN: {
        value: 2
      },
      BLUE: {
        value: 3
      },
      NULL: {
        value: null
      },
      UNDEFINED: {
        value: undefined
      }
    }
  });
  (0, _mocha.it)('converts enum values according to input coercion rules', function () {
    testCase(testEnum, 'RED', 1);
    testCase(testEnum, 'BLUE', 3);
    testCase(testEnum, '3', undefined);
    testCase(testEnum, '"BLUE"', undefined);
    testCase(testEnum, 'null', null);
    testCase(testEnum, 'NULL', null);
    testCase(testEnum, 'UNDEFINED', undefined);
  }); // Boolean!

  var nonNullBool = (0, _type.GraphQLNonNull)(_type.GraphQLBoolean); // [Boolean]

  var listOfBool = (0, _type.GraphQLList)(_type.GraphQLBoolean); // [Boolean!]

  var listOfNonNullBool = (0, _type.GraphQLList)(nonNullBool); // [Boolean]!

  var nonNullListOfBool = (0, _type.GraphQLNonNull)(listOfBool); // [Boolean!]!

  var nonNullListOfNonNullBool = (0, _type.GraphQLNonNull)(listOfNonNullBool);
  (0, _mocha.it)('coerces to null unless non-null', function () {
    testCase(_type.GraphQLBoolean, 'null', null);
    testCase(nonNullBool, 'null', undefined);
  });
  (0, _mocha.it)('coerces lists of values', function () {
    testCase(listOfBool, 'true', [true]);
    testCase(listOfBool, '123', undefined);
    testCase(listOfBool, 'null', null);
    testCase(listOfBool, '[true, false]', [true, false]);
    testCase(listOfBool, '[true, 123]', undefined);
    testCase(listOfBool, '[true, null]', [true, null]);
    testCase(listOfBool, '{ true: true }', undefined);
  });
  (0, _mocha.it)('coerces non-null lists of values', function () {
    testCase(nonNullListOfBool, 'true', [true]);
    testCase(nonNullListOfBool, '123', undefined);
    testCase(nonNullListOfBool, 'null', undefined);
    testCase(nonNullListOfBool, '[true, false]', [true, false]);
    testCase(nonNullListOfBool, '[true, 123]', undefined);
    testCase(nonNullListOfBool, '[true, null]', [true, null]);
  });
  (0, _mocha.it)('coerces lists of non-null values', function () {
    testCase(listOfNonNullBool, 'true', [true]);
    testCase(listOfNonNullBool, '123', undefined);
    testCase(listOfNonNullBool, 'null', null);
    testCase(listOfNonNullBool, '[true, false]', [true, false]);
    testCase(listOfNonNullBool, '[true, 123]', undefined);
    testCase(listOfNonNullBool, '[true, null]', undefined);
  });
  (0, _mocha.it)('coerces non-null lists of non-null values', function () {
    testCase(nonNullListOfNonNullBool, 'true', [true]);
    testCase(nonNullListOfNonNullBool, '123', undefined);
    testCase(nonNullListOfNonNullBool, 'null', undefined);
    testCase(nonNullListOfNonNullBool, '[true, false]', [true, false]);
    testCase(nonNullListOfNonNullBool, '[true, 123]', undefined);
    testCase(nonNullListOfNonNullBool, '[true, null]', undefined);
  });
  var testInputObj = new _type.GraphQLInputObjectType({
    name: 'TestInput',
    fields: {
      int: {
        type: _type.GraphQLInt,
        defaultValue: 42
      },
      bool: {
        type: _type.GraphQLBoolean
      },
      requiredBool: {
        type: nonNullBool
      }
    }
  });
  (0, _mocha.it)('coerces input objects according to input coercion rules', function () {
    testCase(testInputObj, 'null', null);
    testCase(testInputObj, '123', undefined);
    testCase(testInputObj, '[]', undefined);
    testCase(testInputObj, '{ int: 123, requiredBool: false }', {
      int: 123,
      requiredBool: false
    });
    testCase(testInputObj, '{ bool: true, requiredBool: false }', {
      int: 42,
      bool: true,
      requiredBool: false
    });
    testCase(testInputObj, '{ int: true, requiredBool: true }', undefined);
    testCase(testInputObj, '{ requiredBool: null }', undefined);
    testCase(testInputObj, '{ bool: true }', undefined);
  });
  (0, _mocha.it)('accepts variable values assuming already coerced', function () {
    testCaseWithVars({}, _type.GraphQLBoolean, '$var', undefined);
    testCaseWithVars({
      var: true
    }, _type.GraphQLBoolean, '$var', true);
    testCaseWithVars({
      var: null
    }, _type.GraphQLBoolean, '$var', null);
  });
  (0, _mocha.it)('asserts variables are provided as items in lists', function () {
    testCaseWithVars({}, listOfBool, '[ $foo ]', [null]);
    testCaseWithVars({}, listOfNonNullBool, '[ $foo ]', undefined);
    testCaseWithVars({
      foo: true
    }, listOfNonNullBool, '[ $foo ]', [true]); // Note: variables are expected to have already been coerced, so we
    // do not expect the singleton wrapping behavior for variables.

    testCaseWithVars({
      foo: true
    }, listOfNonNullBool, '$foo', true);
    testCaseWithVars({
      foo: [true]
    }, listOfNonNullBool, '$foo', [true]);
  });
  (0, _mocha.it)('omits input object fields for unprovided variables', function () {
    testCaseWithVars({}, testInputObj, '{ int: $foo, bool: $foo, requiredBool: true }', {
      int: 42,
      requiredBool: true
    });
    testCaseWithVars({}, testInputObj, '{ requiredBool: $foo }', undefined);
    testCaseWithVars({
      foo: true
    }, testInputObj, '{ requiredBool: $foo }', {
      int: 42,
      requiredBool: true
    });
  });
});