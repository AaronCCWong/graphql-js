"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _type = require("../../type");

var _schemaPrinter = require("../schemaPrinter");

var _buildClientSchema = require("../buildClientSchema");

var _introspectionFromSchema = require("../introspectionFromSchema");

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Simple\n      }\n\n      \"\"\"This is a simple type\"\"\"\n      type Simple {\n        \"\"\"This is a string field\"\"\"\n        string: String\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Simple\n      }\n\n      type Simple {\n        string: String\n      }\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function introspectionToSDL(introspection) {
  return (0, _schemaPrinter.printSchema)((0, _buildClientSchema.buildClientSchema)(introspection));
}

(0, _mocha.describe)('introspectionFromSchema', function () {
  var schema = new _type.GraphQLSchema({
    query: new _type.GraphQLObjectType({
      name: 'Simple',
      description: 'This is a simple type',
      fields: {
        string: {
          type: _type.GraphQLString,
          description: 'This is a string field'
        }
      }
    })
  });
  (0, _mocha.it)('converts a simple schema', function () {
    var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema);
    (0, _chai.expect)(introspectionToSDL(introspection)).to.deep.equal((0, _dedent.default)(_templateObject));
  });
  (0, _mocha.it)('converts a simple schema without descriptions', function () {
    var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema, {
      descriptions: false
    });
    (0, _chai.expect)(introspectionToSDL(introspection)).to.deep.equal((0, _dedent.default)(_templateObject2));
  });
});