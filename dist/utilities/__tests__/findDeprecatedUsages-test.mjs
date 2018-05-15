/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { findDeprecatedUsages } from '../findDeprecatedUsages';
import { parse } from '../../language';
import { GraphQLEnumType, GraphQLObjectType, GraphQLSchema, GraphQLString } from '../../type';
describe('findDeprecatedUsages', function () {
  var enumType = new GraphQLEnumType({
    name: 'EnumType',
    values: {
      ONE: {},
      TWO: {
        deprecationReason: 'Some enum reason.'
      }
    }
  });
  var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        normalField: {
          args: {
            enumArg: {
              type: enumType
            }
          },
          type: GraphQLString
        },
        deprecatedField: {
          type: GraphQLString,
          deprecationReason: 'Some field reason.'
        }
      }
    })
  });
  it('should report empty set for no deprecated usages', function () {
    var errors = findDeprecatedUsages(schema, parse('{ normalField(enumArg: ONE) }'));
    expect(errors.length).to.equal(0);
  });
  it('should report usage of deprecated fields', function () {
    var errors = findDeprecatedUsages(schema, parse('{ normalField, deprecatedField }'));
    var errorMessages = errors.map(function (err) {
      return err.message;
    });
    expect(errorMessages).to.deep.equal(['The field Query.deprecatedField is deprecated. Some field reason.']);
  });
  it('should report usage of deprecated enums', function () {
    var errors = findDeprecatedUsages(schema, parse('{ normalField(enumArg: TWO) }'));
    var errorMessages = errors.map(function (err) {
      return err.message;
    });
    expect(errorMessages).to.deep.equal(['The enum value EnumType.TWO is deprecated. Some enum reason.']);
  });
});