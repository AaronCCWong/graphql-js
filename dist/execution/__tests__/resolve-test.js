"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _ = require("../../");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Execute: resolve function', function () {
  function testSchema(testField) {
    return new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          test: testField
        }
      })
    });
  }

  (0, _mocha.it)('default function accesses properties', function () {
    var schema = testSchema({
      type: _.GraphQLString
    });
    var source = {
      test: 'testValue'
    };
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ test }', source)).to.deep.equal({
      data: {
        test: 'testValue'
      }
    });
  });
  (0, _mocha.it)('default function calls methods', function () {
    var schema = testSchema({
      type: _.GraphQLString
    });
    var source = {
      _secret: 'secretValue',
      test: function test() {
        return this._secret;
      }
    };
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ test }', source)).to.deep.equal({
      data: {
        test: 'secretValue'
      }
    });
  });
  (0, _mocha.it)('default function passes args and context', function () {
    var schema = testSchema({
      type: _.GraphQLInt,
      args: {
        addend1: {
          type: _.GraphQLInt
        }
      }
    });

    var Adder =
    /*#__PURE__*/
    function () {
      function Adder(num) {
        this._num = num;
      }

      var _proto = Adder.prototype;

      _proto.test = function test(_ref, context) {
        var addend1 = _ref.addend1;
        return this._num + addend1 + context.addend2;
      };

      return Adder;
    }();

    var source = new Adder(700);
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ test(addend1: 80) }', source, {
      addend2: 9
    })).to.deep.equal({
      data: {
        test: 789
      }
    });
  });
  (0, _mocha.it)('uses provided resolve function', function () {
    var schema = testSchema({
      type: _.GraphQLString,
      args: {
        aStr: {
          type: _.GraphQLString
        },
        aInt: {
          type: _.GraphQLInt
        }
      },
      resolve: function resolve(source, args) {
        return JSON.stringify([source, args]);
      }
    });
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ test }')).to.deep.equal({
      data: {
        test: '[null,{}]'
      }
    });
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ test }', 'Source!')).to.deep.equal({
      data: {
        test: '["Source!",{}]'
      }
    });
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ test(aStr: "String!") }', 'Source!')).to.deep.equal({
      data: {
        test: '["Source!",{"aStr":"String!"}]'
      }
    });
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ test(aInt: -123, aStr: "String!") }', 'Source!')).to.deep.equal({
      data: {
        test: '["Source!",{"aStr":"String!","aInt":-123}]'
      }
    });
  });
});