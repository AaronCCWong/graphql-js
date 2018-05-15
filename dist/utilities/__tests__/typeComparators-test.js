"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _type = require("../../type");

var _typeComparators = require("../typeComparators");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('typeComparators', function () {
  (0, _mocha.describe)('isEqualType', function () {
    (0, _mocha.it)('same reference are equal', function () {
      (0, _chai.expect)((0, _typeComparators.isEqualType)(_type.GraphQLString, _type.GraphQLString)).to.equal(true);
    });
    (0, _mocha.it)('int and float are not equal', function () {
      (0, _chai.expect)((0, _typeComparators.isEqualType)(_type.GraphQLInt, _type.GraphQLFloat)).to.equal(false);
    });
    (0, _mocha.it)('lists of same type are equal', function () {
      (0, _chai.expect)((0, _typeComparators.isEqualType)((0, _type.GraphQLList)(_type.GraphQLInt), (0, _type.GraphQLList)(_type.GraphQLInt))).to.equal(true);
    });
    (0, _mocha.it)('lists is not equal to item', function () {
      (0, _chai.expect)((0, _typeComparators.isEqualType)((0, _type.GraphQLList)(_type.GraphQLInt), _type.GraphQLInt)).to.equal(false);
    });
    (0, _mocha.it)('non-null of same type are equal', function () {
      (0, _chai.expect)((0, _typeComparators.isEqualType)((0, _type.GraphQLNonNull)(_type.GraphQLInt), (0, _type.GraphQLNonNull)(_type.GraphQLInt))).to.equal(true);
    });
    (0, _mocha.it)('non-null is not equal to nullable', function () {
      (0, _chai.expect)((0, _typeComparators.isEqualType)((0, _type.GraphQLNonNull)(_type.GraphQLInt), _type.GraphQLInt)).to.equal(false);
    });
  });
  (0, _mocha.describe)('isTypeSubTypeOf', function () {
    function testSchema(fields) {
      return new _type.GraphQLSchema({
        query: new _type.GraphQLObjectType({
          name: 'Query',
          fields: fields
        })
      });
    }

    (0, _mocha.it)('same reference is subtype', function () {
      var schema = testSchema({
        field: {
          type: _type.GraphQLString
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, _type.GraphQLString, _type.GraphQLString)).to.equal(true);
    });
    (0, _mocha.it)('int is not subtype of float', function () {
      var schema = testSchema({
        field: {
          type: _type.GraphQLString
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, _type.GraphQLInt, _type.GraphQLFloat)).to.equal(false);
    });
    (0, _mocha.it)('non-null is subtype of nullable', function () {
      var schema = testSchema({
        field: {
          type: _type.GraphQLString
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, (0, _type.GraphQLNonNull)(_type.GraphQLInt), _type.GraphQLInt)).to.equal(true);
    });
    (0, _mocha.it)('nullable is not subtype of non-null', function () {
      var schema = testSchema({
        field: {
          type: _type.GraphQLString
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, _type.GraphQLInt, (0, _type.GraphQLNonNull)(_type.GraphQLInt))).to.equal(false);
    });
    (0, _mocha.it)('item is not subtype of list', function () {
      var schema = testSchema({
        field: {
          type: _type.GraphQLString
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, _type.GraphQLInt, (0, _type.GraphQLList)(_type.GraphQLInt))).to.equal(false);
    });
    (0, _mocha.it)('list is not subtype of item', function () {
      var schema = testSchema({
        field: {
          type: _type.GraphQLString
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, (0, _type.GraphQLList)(_type.GraphQLInt), _type.GraphQLInt)).to.equal(false);
    });
    (0, _mocha.it)('member is subtype of union', function () {
      var member = new _type.GraphQLObjectType({
        name: 'Object',
        fields: {
          field: {
            type: _type.GraphQLString
          }
        }
      });
      var union = new _type.GraphQLUnionType({
        name: 'Union',
        types: [member]
      });
      var schema = testSchema({
        field: {
          type: union
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, member, union)).to.equal(true);
    });
    (0, _mocha.it)('implementation is subtype of interface', function () {
      var iface = new _type.GraphQLInterfaceType({
        name: 'Interface',
        fields: {
          field: {
            type: _type.GraphQLString
          }
        }
      });
      var impl = new _type.GraphQLObjectType({
        name: 'Object',
        interfaces: [iface],
        fields: {
          field: {
            type: _type.GraphQLString
          }
        }
      });
      var schema = testSchema({
        field: {
          type: impl
        }
      });
      (0, _chai.expect)((0, _typeComparators.isTypeSubTypeOf)(schema, impl, iface)).to.equal(true);
    });
  });
});