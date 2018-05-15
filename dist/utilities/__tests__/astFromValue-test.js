"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _astFromValue = require("../astFromValue");

var _type = require("../../type");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('astFromValue', function () {
  (0, _mocha.it)('converts boolean values to ASTs', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)(true, _type.GraphQLBoolean)).to.deep.equal({
      kind: 'BooleanValue',
      value: true
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(false, _type.GraphQLBoolean)).to.deep.equal({
      kind: 'BooleanValue',
      value: false
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(undefined, _type.GraphQLBoolean)).to.deep.equal(null);
    (0, _chai.expect)((0, _astFromValue.astFromValue)(NaN, _type.GraphQLInt)).to.deep.equal(null);
    (0, _chai.expect)((0, _astFromValue.astFromValue)(null, _type.GraphQLBoolean)).to.deep.equal({
      kind: 'NullValue'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(0, _type.GraphQLBoolean)).to.deep.equal({
      kind: 'BooleanValue',
      value: false
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(1, _type.GraphQLBoolean)).to.deep.equal({
      kind: 'BooleanValue',
      value: true
    });
    var NonNullBoolean = (0, _type.GraphQLNonNull)(_type.GraphQLBoolean);
    (0, _chai.expect)((0, _astFromValue.astFromValue)(0, NonNullBoolean)).to.deep.equal({
      kind: 'BooleanValue',
      value: false
    });
  });
  (0, _mocha.it)('converts Int values to Int ASTs', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)(-1, _type.GraphQLInt)).to.deep.equal({
      kind: 'IntValue',
      value: '-1'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(123.0, _type.GraphQLInt)).to.deep.equal({
      kind: 'IntValue',
      value: '123'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(1e4, _type.GraphQLInt)).to.deep.equal({
      kind: 'IntValue',
      value: '10000'
    }); // GraphQL spec does not allow coercing non-integer values to Int to avoid
    // accidental data loss.

    (0, _chai.expect)(function () {
      return (0, _astFromValue.astFromValue)(123.5, _type.GraphQLInt);
    }).to.throw('Int cannot represent non-integer value: 123.5'); // Note: outside the bounds of 32bit signed int.

    (0, _chai.expect)(function () {
      return (0, _astFromValue.astFromValue)(1e40, _type.GraphQLInt);
    }).to.throw('Int cannot represent non 32-bit signed integer value: 1e+40');
  });
  (0, _mocha.it)('converts Float values to Int/Float ASTs', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)(-1, _type.GraphQLFloat)).to.deep.equal({
      kind: 'IntValue',
      value: '-1'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(123.0, _type.GraphQLFloat)).to.deep.equal({
      kind: 'IntValue',
      value: '123'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(123.5, _type.GraphQLFloat)).to.deep.equal({
      kind: 'FloatValue',
      value: '123.5'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(1e4, _type.GraphQLFloat)).to.deep.equal({
      kind: 'IntValue',
      value: '10000'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(1e40, _type.GraphQLFloat)).to.deep.equal({
      kind: 'FloatValue',
      value: '1e+40'
    });
  });
  (0, _mocha.it)('converts String values to String ASTs', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)('hello', _type.GraphQLString)).to.deep.equal({
      kind: 'StringValue',
      value: 'hello'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)('VALUE', _type.GraphQLString)).to.deep.equal({
      kind: 'StringValue',
      value: 'VALUE'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)('VA\nLUE', _type.GraphQLString)).to.deep.equal({
      kind: 'StringValue',
      value: 'VA\nLUE'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(123, _type.GraphQLString)).to.deep.equal({
      kind: 'StringValue',
      value: '123'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(false, _type.GraphQLString)).to.deep.equal({
      kind: 'StringValue',
      value: 'false'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(null, _type.GraphQLString)).to.deep.equal({
      kind: 'NullValue'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(undefined, _type.GraphQLString)).to.deep.equal(null);
  });
  (0, _mocha.it)('converts ID values to Int/String ASTs', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)('hello', _type.GraphQLID)).to.deep.equal({
      kind: 'StringValue',
      value: 'hello'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)('VALUE', _type.GraphQLID)).to.deep.equal({
      kind: 'StringValue',
      value: 'VALUE'
    }); // Note: EnumValues cannot contain non-identifier characters

    (0, _chai.expect)((0, _astFromValue.astFromValue)('VA\nLUE', _type.GraphQLID)).to.deep.equal({
      kind: 'StringValue',
      value: 'VA\nLUE'
    }); // Note: IntValues are used when possible.

    (0, _chai.expect)((0, _astFromValue.astFromValue)(-1, _type.GraphQLID)).to.deep.equal({
      kind: 'IntValue',
      value: '-1'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(123, _type.GraphQLID)).to.deep.equal({
      kind: 'IntValue',
      value: '123'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)('123', _type.GraphQLID)).to.deep.equal({
      kind: 'IntValue',
      value: '123'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)('01', _type.GraphQLID)).to.deep.equal({
      kind: 'StringValue',
      value: '01'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(false, _type.GraphQLID)).to.deep.equal({
      kind: 'StringValue',
      value: 'false'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(null, _type.GraphQLID)).to.deep.equal({
      kind: 'NullValue'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(undefined, _type.GraphQLID)).to.deep.equal(null);
  });
  (0, _mocha.it)('does not converts NonNull values to NullValue', function () {
    var NonNullBoolean = (0, _type.GraphQLNonNull)(_type.GraphQLBoolean);
    (0, _chai.expect)((0, _astFromValue.astFromValue)(null, NonNullBoolean)).to.deep.equal(null);
  });
  var complexValue = {
    someArbitrary: 'complexValue'
  };
  var myEnum = new _type.GraphQLEnumType({
    name: 'MyEnum',
    values: {
      HELLO: {},
      GOODBYE: {},
      COMPLEX: {
        value: complexValue
      }
    }
  });
  (0, _mocha.it)('converts string values to Enum ASTs if possible', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)('HELLO', myEnum)).to.deep.equal({
      kind: 'EnumValue',
      value: 'HELLO'
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(complexValue, myEnum)).to.deep.equal({
      kind: 'EnumValue',
      value: 'COMPLEX'
    }); // Note: case sensitive

    (0, _chai.expect)((0, _astFromValue.astFromValue)('hello', myEnum)).to.deep.equal(null); // Note: Not a valid enum value

    (0, _chai.expect)((0, _astFromValue.astFromValue)('VALUE', myEnum)).to.deep.equal(null);
  });
  (0, _mocha.it)('converts array values to List ASTs', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)(['FOO', 'BAR'], (0, _type.GraphQLList)(_type.GraphQLString))).to.deep.equal({
      kind: 'ListValue',
      values: [{
        kind: 'StringValue',
        value: 'FOO'
      }, {
        kind: 'StringValue',
        value: 'BAR'
      }]
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)(['HELLO', 'GOODBYE'], (0, _type.GraphQLList)(myEnum))).to.deep.equal({
      kind: 'ListValue',
      values: [{
        kind: 'EnumValue',
        value: 'HELLO'
      }, {
        kind: 'EnumValue',
        value: 'GOODBYE'
      }]
    });
  });
  (0, _mocha.it)('converts list singletons', function () {
    (0, _chai.expect)((0, _astFromValue.astFromValue)('FOO', (0, _type.GraphQLList)(_type.GraphQLString))).to.deep.equal({
      kind: 'StringValue',
      value: 'FOO'
    });
  });
  (0, _mocha.it)('converts input objects', function () {
    var inputObj = new _type.GraphQLInputObjectType({
      name: 'MyInputObj',
      fields: {
        foo: {
          type: _type.GraphQLFloat
        },
        bar: {
          type: myEnum
        }
      }
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)({
      foo: 3,
      bar: 'HELLO'
    }, inputObj)).to.deep.equal({
      kind: 'ObjectValue',
      fields: [{
        kind: 'ObjectField',
        name: {
          kind: 'Name',
          value: 'foo'
        },
        value: {
          kind: 'IntValue',
          value: '3'
        }
      }, {
        kind: 'ObjectField',
        name: {
          kind: 'Name',
          value: 'bar'
        },
        value: {
          kind: 'EnumValue',
          value: 'HELLO'
        }
      }]
    });
  });
  (0, _mocha.it)('converts input objects with explicit nulls', function () {
    var inputObj = new _type.GraphQLInputObjectType({
      name: 'MyInputObj',
      fields: {
        foo: {
          type: _type.GraphQLFloat
        },
        bar: {
          type: myEnum
        }
      }
    });
    (0, _chai.expect)((0, _astFromValue.astFromValue)({
      foo: null
    }, inputObj)).to.deep.equal({
      kind: 'ObjectValue',
      fields: [{
        kind: 'ObjectField',
        name: {
          kind: 'Name',
          value: 'foo'
        },
        value: {
          kind: 'NullValue'
        }
      }]
    });
  });
});