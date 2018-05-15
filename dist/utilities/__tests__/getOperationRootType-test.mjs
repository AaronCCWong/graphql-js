/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getOperationRootType } from '../getOperationRootType';
import { parse, GraphQLSchema, GraphQLObjectType, GraphQLString } from '../../';
var queryType = new GraphQLObjectType({
  name: 'FooQuery',
  fields: function fields() {
    return {
      field: {
        type: GraphQLString
      }
    };
  }
});
var mutationType = new GraphQLObjectType({
  name: 'FooMutation',
  fields: function fields() {
    return {
      field: {
        type: GraphQLString
      }
    };
  }
});
var subscriptionType = new GraphQLObjectType({
  name: 'FooSubscription',
  fields: function fields() {
    return {
      field: {
        type: GraphQLString
      }
    };
  }
});
describe('getOperationRootType', function () {
  it('Gets a Query type for an unnamed OperationDefinitionNode', function () {
    var testSchema = new GraphQLSchema({
      query: queryType
    });
    var doc = parse('{ field }');
    expect(getOperationRootType(testSchema, doc.definitions[0])).to.equal(queryType);
  });
  it('Gets a Query type for an named OperationDefinitionNode', function () {
    var testSchema = new GraphQLSchema({
      query: queryType
    });
    var doc = parse('query Q { field }');
    expect(getOperationRootType(testSchema, doc.definitions[0])).to.equal(queryType);
  });
  it('Gets a type for OperationTypeDefinitionNodes', function () {
    var testSchema = new GraphQLSchema({
      query: queryType,
      mutation: mutationType,
      subscription: subscriptionType
    });
    var doc = parse('schema { query: FooQuery mutation: FooMutation subscription: FooSubscription }');
    var operationTypes = doc.definitions[0].operationTypes;
    expect(getOperationRootType(testSchema, operationTypes[0])).to.equal(queryType);
    expect(getOperationRootType(testSchema, operationTypes[1])).to.equal(mutationType);
    expect(getOperationRootType(testSchema, operationTypes[2])).to.equal(subscriptionType);
  });
  it('Gets a Mutation type for an OperationDefinitionNode', function () {
    var testSchema = new GraphQLSchema({
      mutation: mutationType
    });
    var doc = parse('mutation { field }');
    expect(getOperationRootType(testSchema, doc.definitions[0])).to.equal(mutationType);
  });
  it('Gets a Subscription type for an OperationDefinitionNode', function () {
    var testSchema = new GraphQLSchema({
      subscription: subscriptionType
    });
    var doc = parse('subscription { field }');
    expect(getOperationRootType(testSchema, doc.definitions[0])).to.equal(subscriptionType);
  });
  it('Throws when query type not defined in schema', function () {
    var testSchema = new GraphQLSchema({});
    var doc = parse('query { field }');
    expect(function () {
      return getOperationRootType(testSchema, doc.definitions[0]);
    }).to.throw('Schema does not define the required query root type.');
  });
  it('Throws when mutation type not defined in schema', function () {
    var testSchema = new GraphQLSchema({});
    var doc = parse('mutation { field }');
    expect(function () {
      return getOperationRootType(testSchema, doc.definitions[0]);
    }).to.throw('Schema is not configured for mutations.');
  });
  it('Throws when subscription type not defined in schema', function () {
    var testSchema = new GraphQLSchema({});
    var doc = parse('subscription { field }');
    expect(function () {
      return getOperationRootType(testSchema, doc.definitions[0]);
    }).to.throw('Schema is not configured for subscriptions.');
  });
  it('Throws when operation not a valid operation kind', function () {
    var testSchema = new GraphQLSchema({});
    var doc = parse('{ field }');
    doc.definitions[0].operation = 'non_existent_operation';
    expect(function () {
      return getOperationRootType(testSchema, doc.definitions[0]);
    }).to.throw('Can only have query, mutation and subscription operations.');
  });
});