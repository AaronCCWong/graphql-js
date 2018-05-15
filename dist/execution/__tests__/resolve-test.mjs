/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { graphqlSync, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } from '../../';
describe('Execute: resolve function', function () {
  function testSchema(testField) {
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          test: testField
        }
      })
    });
  }

  it('default function accesses properties', function () {
    var schema = testSchema({
      type: GraphQLString
    });
    var source = {
      test: 'testValue'
    };
    expect(graphqlSync(schema, '{ test }', source)).to.deep.equal({
      data: {
        test: 'testValue'
      }
    });
  });
  it('default function calls methods', function () {
    var schema = testSchema({
      type: GraphQLString
    });
    var source = {
      _secret: 'secretValue',
      test: function test() {
        return this._secret;
      }
    };
    expect(graphqlSync(schema, '{ test }', source)).to.deep.equal({
      data: {
        test: 'secretValue'
      }
    });
  });
  it('default function passes args and context', function () {
    var schema = testSchema({
      type: GraphQLInt,
      args: {
        addend1: {
          type: GraphQLInt
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
    expect(graphqlSync(schema, '{ test(addend1: 80) }', source, {
      addend2: 9
    })).to.deep.equal({
      data: {
        test: 789
      }
    });
  });
  it('uses provided resolve function', function () {
    var schema = testSchema({
      type: GraphQLString,
      args: {
        aStr: {
          type: GraphQLString
        },
        aInt: {
          type: GraphQLInt
        }
      },
      resolve: function resolve(source, args) {
        return JSON.stringify([source, args]);
      }
    });
    expect(graphqlSync(schema, '{ test }')).to.deep.equal({
      data: {
        test: '[null,{}]'
      }
    });
    expect(graphqlSync(schema, '{ test }', 'Source!')).to.deep.equal({
      data: {
        test: '["Source!",{}]'
      }
    });
    expect(graphqlSync(schema, '{ test(aStr: "String!") }', 'Source!')).to.deep.equal({
      data: {
        test: '["Source!",{"aStr":"String!"}]'
      }
    });
    expect(graphqlSync(schema, '{ test(aInt: -123, aStr: "String!") }', 'Source!')).to.deep.equal({
      data: {
        test: '["Source!",{"aStr":"String!","aInt":-123}]'
      }
    });
  });
});