"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _GraphQLError = require("../GraphQLError");

var _printError = require("../printError");

var _language = require("../../language");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Single digit line number with no padding\n\n      Test (9:1)\n      9: *\n         ^\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Left padded first line number\n\n      Test (9:1)\n       9: *\n          ^\n      10: \n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        type Foo {\n          field: String\n        }"]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        type Foo {\n          field: Int\n        }"]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Example error with two nodes\n\n      SourceA (2:10)\n      1: type Foo {\n      2:   field: String\n                  ^\n      3: }\n\n      SourceB (2:10)\n      1: type Foo {\n      2:   field: Int\n                  ^\n      3: }\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _mocha.describe)('printError', function () {
  (0, _mocha.it)('prints an line numbers with correct padding', function () {
    var singleDigit = new _GraphQLError.GraphQLError('Single digit line number with no padding', null, new _language.Source('*', 'Test', {
      line: 9,
      column: 1
    }), [0]);
    (0, _chai.expect)((0, _printError.printError)(singleDigit)).to.equal((0, _dedent.default)(_templateObject));
    var doubleDigit = new _GraphQLError.GraphQLError('Left padded first line number', null, new _language.Source('*\n', 'Test', {
      line: 9,
      column: 1
    }), [0]);
    (0, _chai.expect)((0, _printError.printError)(doubleDigit)).to.equal((0, _dedent.default)(_templateObject2));
  });
  (0, _mocha.it)('prints an error with nodes from different sources', function () {
    var sourceA = (0, _language.parse)(new _language.Source((0, _dedent.default)(_templateObject3), 'SourceA'));
    var fieldTypeA = sourceA.definitions[0].fields[0].type;
    var sourceB = (0, _language.parse)(new _language.Source((0, _dedent.default)(_templateObject4), 'SourceB'));
    var fieldTypeB = sourceB.definitions[0].fields[0].type;
    var error = new _GraphQLError.GraphQLError('Example error with two nodes', [fieldTypeA, fieldTypeB]);
    (0, _chai.expect)((0, _printError.printError)(error)).to.equal((0, _dedent.default)(_templateObject5));
  });
});