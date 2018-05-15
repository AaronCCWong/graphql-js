"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _coerceValue = require("../coerceValue");

var _type = require("../../type");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function expectNoErrors(result) {
  (0, _chai.expect)(result.errors).to.equal(undefined);
  (0, _chai.expect)(result.value).not.to.equal(undefined);
}

function expectError(result, expected) {
  var messages = result.errors && result.errors.map(function (error) {
    return error.message;
  });
  (0, _chai.expect)(messages).to.deep.equal([expected]);
  (0, _chai.expect)(result.value).to.equal(undefined);
}

(0, _mocha.describe)('coerceValue', function () {
  (0, _mocha.it)('coercing an array to GraphQLString produces an error', function () {
    var result = (0, _coerceValue.coerceValue)([1, 2, 3], _type.GraphQLString);
    expectError(result, 'Expected type String; String cannot represent an array value: [1,2,3]');
    (0, _chai.expect)(result.errors[0].originalError.message).to.equal('String cannot represent an array value: [1,2,3]');
  });
  (0, _mocha.describe)('for GraphQLInt', function () {
    (0, _mocha.it)('returns no error for int input', function () {
      var result = (0, _coerceValue.coerceValue)('1', _type.GraphQLInt);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns no error for negative int input', function () {
      var result = (0, _coerceValue.coerceValue)('-1', _type.GraphQLInt);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns no error for exponent input', function () {
      var result = (0, _coerceValue.coerceValue)('1e3', _type.GraphQLInt);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns a single error for empty value', function () {
      var result = (0, _coerceValue.coerceValue)(null, _type.GraphQLInt);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns a single error for empty value', function () {
      var result = (0, _coerceValue.coerceValue)('', _type.GraphQLInt);
      expectError(result, 'Expected type Int; Int cannot represent non 32-bit signed integer value: (empty string)');
    });
    (0, _mocha.it)('returns error for float input as int', function () {
      var result = (0, _coerceValue.coerceValue)('1.5', _type.GraphQLInt);
      expectError(result, 'Expected type Int; Int cannot represent non-integer value: 1.5');
    });
    (0, _mocha.it)('returns a single error for char input', function () {
      var result = (0, _coerceValue.coerceValue)('a', _type.GraphQLInt);
      expectError(result, 'Expected type Int; Int cannot represent non 32-bit signed integer value: a');
    });
    (0, _mocha.it)('returns a single error for char input', function () {
      var result = (0, _coerceValue.coerceValue)('meow', _type.GraphQLInt);
      expectError(result, 'Expected type Int; Int cannot represent non 32-bit signed integer value: meow');
    });
  });
  (0, _mocha.describe)('for GraphQLFloat', function () {
    (0, _mocha.it)('returns no error for int input', function () {
      var result = (0, _coerceValue.coerceValue)('1', _type.GraphQLFloat);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns no error for exponent input', function () {
      var result = (0, _coerceValue.coerceValue)('1e3', _type.GraphQLFloat);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns no error for float input', function () {
      var result = (0, _coerceValue.coerceValue)('1.5', _type.GraphQLFloat);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns a single error for empty value', function () {
      var result = (0, _coerceValue.coerceValue)(null, _type.GraphQLFloat);
      expectNoErrors(result);
    });
    (0, _mocha.it)('returns a single error for empty value', function () {
      var result = (0, _coerceValue.coerceValue)('', _type.GraphQLFloat);
      expectError(result, 'Expected type Float; Float cannot represent non numeric value: (empty string)');
    });
    (0, _mocha.it)('returns a single error for char input', function () {
      var result = (0, _coerceValue.coerceValue)('a', _type.GraphQLFloat);
      expectError(result, 'Expected type Float; Float cannot represent non numeric value: a');
    });
    (0, _mocha.it)('returns a single error for char input', function () {
      var result = (0, _coerceValue.coerceValue)('meow', _type.GraphQLFloat);
      expectError(result, 'Expected type Float; Float cannot represent non numeric value: meow');
    });
  });
  (0, _mocha.describe)('for GraphQLEnum', function () {
    var TestEnum = new _type.GraphQLEnumType({
      name: 'TestEnum',
      values: {
        FOO: {
          value: 'InternalFoo'
        },
        BAR: {
          value: 123456789
        }
      }
    });
    (0, _mocha.it)('returns no error for a known enum name', function () {
      var fooResult = (0, _coerceValue.coerceValue)('FOO', TestEnum);
      expectNoErrors(fooResult);
      (0, _chai.expect)(fooResult.value).to.equal('InternalFoo');
      var barResult = (0, _coerceValue.coerceValue)('BAR', TestEnum);
      expectNoErrors(barResult);
      (0, _chai.expect)(barResult.value).to.equal(123456789);
    });
    (0, _mocha.it)('results error for misspelled enum value', function () {
      var result = (0, _coerceValue.coerceValue)('foo', TestEnum);
      expectError(result, 'Expected type TestEnum; did you mean FOO?');
    });
    (0, _mocha.it)('results error for incorrect value type', function () {
      var result1 = (0, _coerceValue.coerceValue)(123, TestEnum);
      expectError(result1, 'Expected type TestEnum.');
      var result2 = (0, _coerceValue.coerceValue)({
        field: 'value'
      }, TestEnum);
      expectError(result2, 'Expected type TestEnum.');
    });
  });
  (0, _mocha.describe)('for GraphQLInputObject', function () {
    var TestInputObject = new _type.GraphQLInputObjectType({
      name: 'TestInputObject',
      fields: {
        foo: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
        },
        bar: {
          type: _type.GraphQLInt
        }
      }
    });
    (0, _mocha.it)('returns no error for a valid input', function () {
      var result = (0, _coerceValue.coerceValue)({
        foo: 123
      }, TestInputObject);
      expectNoErrors(result);
      (0, _chai.expect)(result.value).to.deep.equal({
        foo: 123
      });
    });
    (0, _mocha.it)('returns no error for a non-object type', function () {
      var result = (0, _coerceValue.coerceValue)(123, TestInputObject);
      expectError(result, 'Expected type TestInputObject to be an object.');
    });
    (0, _mocha.it)('returns no error for an invalid field', function () {
      var result = (0, _coerceValue.coerceValue)({
        foo: 'abc'
      }, TestInputObject);
      expectError(result, 'Expected type Int at value.foo; Int cannot represent non 32-bit signed integer value: abc');
    });
    (0, _mocha.it)('returns multiple errors for multiple invalid fields', function () {
      var result = (0, _coerceValue.coerceValue)({
        foo: 'abc',
        bar: 'def'
      }, TestInputObject);
      (0, _chai.expect)(result.errors && result.errors.map(function (error) {
        return error.message;
      })).to.deep.equal(['Expected type Int at value.foo; Int cannot represent non 32-bit signed integer value: abc', 'Expected type Int at value.bar; Int cannot represent non 32-bit signed integer value: def']);
    });
    (0, _mocha.it)('returns error for a missing required field', function () {
      var result = (0, _coerceValue.coerceValue)({
        bar: 123
      }, TestInputObject);
      expectError(result, 'Field value.foo of required type Int! was not provided.');
    });
    (0, _mocha.it)('returns error for an unknown field', function () {
      var result = (0, _coerceValue.coerceValue)({
        foo: 123,
        unknownField: 123
      }, TestInputObject);
      expectError(result, 'Field "unknownField" is not defined by type TestInputObject.');
    });
    (0, _mocha.it)('returns error for a misspelled field', function () {
      var result = (0, _coerceValue.coerceValue)({
        foo: 123,
        bart: 123
      }, TestInputObject);
      expectError(result, 'Field "bart" is not defined by type TestInputObject; did you mean bar?');
    });
  });
});