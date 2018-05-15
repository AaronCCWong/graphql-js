"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _concatAST = require("../concatAST");

var _language = require("../../language");

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        a\n        b\n        ...Frag\n      }\n\n      fragment Frag on T {\n        c\n      }\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _mocha.describe)('concatAST', function () {
  (0, _mocha.it)('concats two ASTs together', function () {
    var sourceA = new _language.Source("\n      { a, b, ...Frag }\n    ");
    var sourceB = new _language.Source("\n      fragment Frag on T {\n        c\n      }\n    ");
    var astA = (0, _language.parse)(sourceA);
    var astB = (0, _language.parse)(sourceB);
    var astC = (0, _concatAST.concatAST)([astA, astB]);
    (0, _chai.expect)((0, _language.print)(astC)).to.equal((0, _dedent.default)(_templateObject));
  });
});