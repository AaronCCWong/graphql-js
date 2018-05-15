"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _getOperationRootType = require("../getOperationRootType");

var _ = require("../../");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var queryType = new _.GraphQLObjectType({
  name: 'FooQuery',
  fields: function fields() {
    return {
      field: {
        type: _.GraphQLString
      }
    };
  }
});
var mutationType = new _.GraphQLObjectType({
  name: 'FooMutation',
  fields: function fields() {
    return {
      field: {
        type: _.GraphQLString
      }
    };
  }
});
var subscriptionType = new _.GraphQLObjectType({
  name: 'FooSubscription',
  fields: function fields() {
    return {
      field: {
        type: _.GraphQLString
      }
    };
  }
});
(0, _mocha.describe)('getOperationRootType', function () {
  (0, _mocha.it)('Gets a Query type for an unnamed OperationDefinitionNode', function () {
    var testSchema = new _.GraphQLSchema({
      query: queryType
    });
    var doc = (0, _.parse)('{ field }');
    (0, _chai.expect)((0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0])).to.equal(queryType);
  });
  (0, _mocha.it)('Gets a Query type for an named OperationDefinitionNode', function () {
    var testSchema = new _.GraphQLSchema({
      query: queryType
    });
    var doc = (0, _.parse)('query Q { field }');
    (0, _chai.expect)((0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0])).to.equal(queryType);
  });
  (0, _mocha.it)('Gets a type for OperationTypeDefinitionNodes', function () {
    var testSchema = new _.GraphQLSchema({
      query: queryType,
      mutation: mutationType,
      subscription: subscriptionType
    });
    var doc = (0, _.parse)('schema { query: FooQuery mutation: FooMutation subscription: FooSubscription }');
    var operationTypes = doc.definitions[0].operationTypes;
    (0, _chai.expect)((0, _getOperationRootType.getOperationRootType)(testSchema, operationTypes[0])).to.equal(queryType);
    (0, _chai.expect)((0, _getOperationRootType.getOperationRootType)(testSchema, operationTypes[1])).to.equal(mutationType);
    (0, _chai.expect)((0, _getOperationRootType.getOperationRootType)(testSchema, operationTypes[2])).to.equal(subscriptionType);
  });
  (0, _mocha.it)('Gets a Mutation type for an OperationDefinitionNode', function () {
    var testSchema = new _.GraphQLSchema({
      mutation: mutationType
    });
    var doc = (0, _.parse)('mutation { field }');
    (0, _chai.expect)((0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0])).to.equal(mutationType);
  });
  (0, _mocha.it)('Gets a Subscription type for an OperationDefinitionNode', function () {
    var testSchema = new _.GraphQLSchema({
      subscription: subscriptionType
    });
    var doc = (0, _.parse)('subscription { field }');
    (0, _chai.expect)((0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0])).to.equal(subscriptionType);
  });
  (0, _mocha.it)('Throws when query type not defined in schema', function () {
    var testSchema = new _.GraphQLSchema({});
    var doc = (0, _.parse)('query { field }');
    (0, _chai.expect)(function () {
      return (0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0]);
    }).to.throw('Schema does not define the required query root type.');
  });
  (0, _mocha.it)('Throws when mutation type not defined in schema', function () {
    var testSchema = new _.GraphQLSchema({});
    var doc = (0, _.parse)('mutation { field }');
    (0, _chai.expect)(function () {
      return (0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0]);
    }).to.throw('Schema is not configured for mutations.');
  });
  (0, _mocha.it)('Throws when subscription type not defined in schema', function () {
    var testSchema = new _.GraphQLSchema({});
    var doc = (0, _.parse)('subscription { field }');
    (0, _chai.expect)(function () {
      return (0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0]);
    }).to.throw('Schema is not configured for subscriptions.');
  });
  (0, _mocha.it)('Throws when operation not a valid operation kind', function () {
    var testSchema = new _.GraphQLSchema({});
    var doc = (0, _.parse)('{ field }');
    doc.definitions[0].operation = 'non_existent_operation';
    (0, _chai.expect)(function () {
      return (0, _getOperationRootType.getOperationRootType)(testSchema, doc.definitions[0]);
    }).to.throw('Can only have query, mutation and subscription operations.');
  });
});