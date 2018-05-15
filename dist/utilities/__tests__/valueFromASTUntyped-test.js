"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _valueFromASTUntyped = require("../valueFromASTUntyped");

var _language = require("../../language");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
(0, _mocha.describe)('valueFromASTUntyped', function () {
  function testCase(valueText, expected) {
    (0, _chai.expect)((0, _valueFromASTUntyped.valueFromASTUntyped)((0, _language.parseValue)(valueText))).to.deep.equal(expected);
  }

  function testCaseWithVars(valueText, variables, expected) {
    (0, _chai.expect)((0, _valueFromASTUntyped.valueFromASTUntyped)((0, _language.parseValue)(valueText), variables)).to.deep.equal(expected);
  }

  (0, _mocha.it)('parses simple values', function () {
    testCase('null', null);
    testCase('true', true);
    testCase('false', false);
    testCase('123', 123);
    testCase('123.456', 123.456);
    testCase('"abc123"', 'abc123');
  });
  (0, _mocha.it)('parses lists of values', function () {
    testCase('[true, false]', [true, false]);
    testCase('[true, 123.45]', [true, 123.45]);
    testCase('[true, null]', [true, null]);
    testCase('[true, ["foo", 1.2]]', [true, ['foo', 1.2]]);
  });
  (0, _mocha.it)('parses input objects', function () {
    testCase('{ int: 123, bool: false }', {
      int: 123,
      bool: false
    });
    testCase('{ foo: [ { bar: "baz"} ] }', {
      foo: [{
        bar: 'baz'
      }]
    });
  });
  (0, _mocha.it)('parses enum values as plain strings', function () {
    testCase('TEST_ENUM_VALUE', 'TEST_ENUM_VALUE');
    testCase('[TEST_ENUM_VALUE]', ['TEST_ENUM_VALUE']);
  });
  (0, _mocha.it)('parses variables', function () {
    testCaseWithVars('$testVariable', {
      testVariable: 'foo'
    }, 'foo');
    testCaseWithVars('[$testVariable]', {
      testVariable: 'foo'
    }, ['foo']);
    testCaseWithVars('{a:[$testVariable]}', {
      testVariable: 'foo'
    }, {
      a: ['foo']
    });
    testCaseWithVars('$testVariable', {
      testVariable: null
    }, null);
    testCaseWithVars('$testVariable', {}, undefined);
  });
});