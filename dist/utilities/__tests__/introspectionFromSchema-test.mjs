var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Simple\n      }\n\n      \"\"\"This is a simple type\"\"\"\n      type Simple {\n        \"\"\"This is a string field\"\"\"\n        string: String\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Simple\n      }\n\n      type Simple {\n        string: String\n      }\n    "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import dedent from '../../jsutils/dedent';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from '../../type';
import { printSchema } from '../schemaPrinter';
import { buildClientSchema } from '../buildClientSchema';
import { introspectionFromSchema } from '../introspectionFromSchema';

function introspectionToSDL(introspection) {
  return printSchema(buildClientSchema(introspection));
}

describe('introspectionFromSchema', function () {
  var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Simple',
      description: 'This is a simple type',
      fields: {
        string: {
          type: GraphQLString,
          description: 'This is a string field'
        }
      }
    })
  });
  it('converts a simple schema', function () {
    var introspection = introspectionFromSchema(schema);
    expect(introspectionToSDL(introspection)).to.deep.equal(dedent(_templateObject));
  });
  it('converts a simple schema without descriptions', function () {
    var introspection = introspectionFromSchema(schema, {
      descriptions: false
    });
    expect(introspectionToSDL(introspection)).to.deep.equal(dedent(_templateObject2));
  });
});