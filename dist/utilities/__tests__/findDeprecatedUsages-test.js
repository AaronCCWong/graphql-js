"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _findDeprecatedUsages = require("../findDeprecatedUsages");

var _language = require("../../language");

var _type = require("../../type");

/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('findDeprecatedUsages', function () {
  var enumType = new _type.GraphQLEnumType({
    name: 'EnumType',
    values: {
      ONE: {},
      TWO: {
        deprecationReason: 'Some enum reason.'
      }
    }
  });
  var schema = new _type.GraphQLSchema({
    query: new _type.GraphQLObjectType({
      name: 'Query',
      fields: {
        normalField: {
          args: {
            enumArg: {
              type: enumType
            }
          },
          type: _type.GraphQLString
        },
        deprecatedField: {
          type: _type.GraphQLString,
          deprecationReason: 'Some field reason.'
        }
      }
    })
  });
  (0, _mocha.it)('should report empty set for no deprecated usages', function () {
    var errors = (0, _findDeprecatedUsages.findDeprecatedUsages)(schema, (0, _language.parse)('{ normalField(enumArg: ONE) }'));
    (0, _chai.expect)(errors.length).to.equal(0);
  });
  (0, _mocha.it)('should report usage of deprecated fields', function () {
    var errors = (0, _findDeprecatedUsages.findDeprecatedUsages)(schema, (0, _language.parse)('{ normalField, deprecatedField }'));
    var errorMessages = errors.map(function (err) {
      return err.message;
    });
    (0, _chai.expect)(errorMessages).to.deep.equal(['The field Query.deprecatedField is deprecated. Some field reason.']);
  });
  (0, _mocha.it)('should report usage of deprecated enums', function () {
    var errors = (0, _findDeprecatedUsages.findDeprecatedUsages)(schema, (0, _language.parse)('{ normalField(enumArg: TWO) }'));
    var errorMessages = errors.map(function (err) {
      return err.message;
    });
    (0, _chai.expect)(errorMessages).to.deep.equal(['The enum value EnumType.TWO is deprecated. Some enum reason.']);
  });
});