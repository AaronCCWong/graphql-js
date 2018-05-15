"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _separateOperations = require("../separateOperations");

var _language = require("../../language");

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        ...Y\n        ...X\n      }\n\n      fragment X on T {\n        fieldX\n      }\n\n      fragment Y on T {\n        fieldY\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query One {\n        foo\n        bar\n        ...A\n        ...X\n      }\n\n      fragment A on T {\n        field\n        ...B\n      }\n\n      fragment X on T {\n        fieldX\n      }\n\n      fragment B on T {\n        something\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      fragment A on T {\n        field\n        ...B\n      }\n\n      query Two {\n        ...A\n        ...Y\n        baz\n      }\n\n      fragment Y on T {\n        fieldY\n      }\n\n      fragment B on T {\n        something\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query One {\n        ...A\n      }\n\n      fragment A on T {\n        ...B\n      }\n\n      fragment B on T {\n        ...A\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      fragment A on T {\n        ...B\n      }\n\n      fragment B on T {\n        ...A\n      }\n\n      query Two {\n        ...B\n      }\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _mocha.describe)('separateOperations', function () {
  (0, _mocha.it)('separates one AST into multiple, maintaining document order', function () {
    var ast = (0, _language.parse)("\n      {\n        ...Y\n        ...X\n      }\n\n      query One {\n        foo\n        bar\n        ...A\n        ...X\n      }\n\n      fragment A on T {\n        field\n        ...B\n      }\n\n      fragment X on T {\n        fieldX\n      }\n\n      query Two {\n        ...A\n        ...Y\n        baz\n      }\n\n      fragment Y on T {\n        fieldY\n      }\n\n      fragment B on T {\n        something\n      }\n    ");
    var separatedASTs = (0, _separateOperations.separateOperations)(ast);
    (0, _chai.expect)(Object.keys(separatedASTs)).to.deep.equal(['', 'One', 'Two']);
    (0, _chai.expect)((0, _language.print)(separatedASTs[''])).to.equal((0, _dedent.default)(_templateObject));
    (0, _chai.expect)((0, _language.print)(separatedASTs.One)).to.equal((0, _dedent.default)(_templateObject2));
    (0, _chai.expect)((0, _language.print)(separatedASTs.Two)).to.equal((0, _dedent.default)(_templateObject3));
  });
  (0, _mocha.it)('survives circular dependencies', function () {
    var ast = (0, _language.parse)("\n      query One {\n        ...A\n      }\n\n      fragment A on T {\n        ...B\n      }\n\n      fragment B on T {\n        ...A\n      }\n\n      query Two {\n        ...B\n      }\n    ");
    var separatedASTs = (0, _separateOperations.separateOperations)(ast);
    (0, _chai.expect)(Object.keys(separatedASTs)).to.deep.equal(['One', 'Two']);
    (0, _chai.expect)((0, _language.print)(separatedASTs.One)).to.equal((0, _dedent.default)(_templateObject4));
    (0, _chai.expect)((0, _language.print)(separatedASTs.Two)).to.equal((0, _dedent.default)(_templateObject5));
  });
});