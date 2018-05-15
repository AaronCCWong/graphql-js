/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { GraphQLSchema, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType } from '../../type';
import { isEqualType, isTypeSubTypeOf } from '../typeComparators';
describe('typeComparators', function () {
  describe('isEqualType', function () {
    it('same reference are equal', function () {
      expect(isEqualType(GraphQLString, GraphQLString)).to.equal(true);
    });
    it('int and float are not equal', function () {
      expect(isEqualType(GraphQLInt, GraphQLFloat)).to.equal(false);
    });
    it('lists of same type are equal', function () {
      expect(isEqualType(GraphQLList(GraphQLInt), GraphQLList(GraphQLInt))).to.equal(true);
    });
    it('lists is not equal to item', function () {
      expect(isEqualType(GraphQLList(GraphQLInt), GraphQLInt)).to.equal(false);
    });
    it('non-null of same type are equal', function () {
      expect(isEqualType(GraphQLNonNull(GraphQLInt), GraphQLNonNull(GraphQLInt))).to.equal(true);
    });
    it('non-null is not equal to nullable', function () {
      expect(isEqualType(GraphQLNonNull(GraphQLInt), GraphQLInt)).to.equal(false);
    });
  });
  describe('isTypeSubTypeOf', function () {
    function testSchema(fields) {
      return new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Query',
          fields: fields
        })
      });
    }

    it('same reference is subtype', function () {
      var schema = testSchema({
        field: {
          type: GraphQLString
        }
      });
      expect(isTypeSubTypeOf(schema, GraphQLString, GraphQLString)).to.equal(true);
    });
    it('int is not subtype of float', function () {
      var schema = testSchema({
        field: {
          type: GraphQLString
        }
      });
      expect(isTypeSubTypeOf(schema, GraphQLInt, GraphQLFloat)).to.equal(false);
    });
    it('non-null is subtype of nullable', function () {
      var schema = testSchema({
        field: {
          type: GraphQLString
        }
      });
      expect(isTypeSubTypeOf(schema, GraphQLNonNull(GraphQLInt), GraphQLInt)).to.equal(true);
    });
    it('nullable is not subtype of non-null', function () {
      var schema = testSchema({
        field: {
          type: GraphQLString
        }
      });
      expect(isTypeSubTypeOf(schema, GraphQLInt, GraphQLNonNull(GraphQLInt))).to.equal(false);
    });
    it('item is not subtype of list', function () {
      var schema = testSchema({
        field: {
          type: GraphQLString
        }
      });
      expect(isTypeSubTypeOf(schema, GraphQLInt, GraphQLList(GraphQLInt))).to.equal(false);
    });
    it('list is not subtype of item', function () {
      var schema = testSchema({
        field: {
          type: GraphQLString
        }
      });
      expect(isTypeSubTypeOf(schema, GraphQLList(GraphQLInt), GraphQLInt)).to.equal(false);
    });
    it('member is subtype of union', function () {
      var member = new GraphQLObjectType({
        name: 'Object',
        fields: {
          field: {
            type: GraphQLString
          }
        }
      });
      var union = new GraphQLUnionType({
        name: 'Union',
        types: [member]
      });
      var schema = testSchema({
        field: {
          type: union
        }
      });
      expect(isTypeSubTypeOf(schema, member, union)).to.equal(true);
    });
    it('implementation is subtype of interface', function () {
      var iface = new GraphQLInterfaceType({
        name: 'Interface',
        fields: {
          field: {
            type: GraphQLString
          }
        }
      });
      var impl = new GraphQLObjectType({
        name: 'Object',
        interfaces: [iface],
        fields: {
          field: {
            type: GraphQLString
          }
        }
      });
      var schema = testSchema({
        field: {
          type: impl
        }
      });
      expect(isTypeSubTypeOf(schema, impl, iface)).to.equal(true);
    });
  });
});