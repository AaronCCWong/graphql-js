"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _dedent = _interopRequireDefault(require("../dedent"));

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        me: User\n      }\n      \n      type User {\n        id: ID\n        name: String\n      }\n      "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n            qux\n              quux\n                quuux\n                  quuuux\n      "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Root {\n        field(arg: String = \"wi\th de\fault\"): String\n      }\n      "], ["\n      type Root {\n        field(arg: String = \"wi\\th de\\fault\"): String\n      }\n      "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        \t\t    type Query {\n        \t\t      me: User\n        \t\t    }\n      "], ["\n        \\t\\t    type Query {\n        \\t\\t      me: User\n        \\t\\t    }\n      "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n\n\n      type Query {\n        me: User\n      }"]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        me: User\n      }\n\n      "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        me: User\n      }\n          \t\t  \t "], ["\n      type Query {\n        me: User\n      }\n          \\t\\t  \\t "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["      type Query {\n        me: User\n      }"]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          \"me\": {\n            \"name\": \"", "\"\n            \"age\": ", "\n          }\n        }\n      "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _mocha.describe)('dedent', function () {
  (0, _mocha.it)('removes indentation in typical usage', function () {
    var output = (0, _dedent.default)(_templateObject);
    (0, _chai.expect)(output).to.equal(['type Query {', '  me: User', '}', '', 'type User {', '  id: ID', '  name: String', '}', ''].join('\n'));
  });
  (0, _mocha.it)('removes only the first level of indentation', function () {
    var output = (0, _dedent.default)(_templateObject2);
    (0, _chai.expect)(output).to.equal(['qux', '  quux', '    quuux', '      quuuux', ''].join('\n'));
  });
  (0, _mocha.it)('does not escape special characters', function () {
    var output = (0, _dedent.default)(_templateObject3);
    (0, _chai.expect)(output).to.equal(['type Root {', '  field(arg: String = "wi\th de\fault"): String', '}', ''].join('\n'));
  });
  (0, _mocha.it)('also works as an ordinary function on strings', function () {
    var output = (0, _dedent.default)("\n      type Query {\n        me: User\n      }\n      ");
    (0, _chai.expect)(output).to.equal(['type Query {', '  me: User', '}', ''].join('\n'));
  });
  (0, _mocha.it)('also removes indentation using tabs', function () {
    var output = (0, _dedent.default)(_templateObject4);
    (0, _chai.expect)(output).to.equal(['type Query {', '  me: User', '}', ''].join('\n'));
  });
  (0, _mocha.it)('removes leading newlines', function () {
    var output = (0, _dedent.default)(_templateObject5);
    (0, _chai.expect)(output).to.equal(['type Query {', '  me: User', '}'].join('\n'));
  });
  (0, _mocha.it)('does not remove trailing newlines', function () {
    var output = (0, _dedent.default)(_templateObject6);
    (0, _chai.expect)(output).to.equal(['type Query {', '  me: User', '}', '', ''].join('\n'));
  });
  (0, _mocha.it)('removes all trailing spaces and tabs', function () {
    var output = (0, _dedent.default)(_templateObject7);
    (0, _chai.expect)(output).to.equal(['type Query {', '  me: User', '}', ''].join('\n'));
  });
  (0, _mocha.it)('works on text without leading newline', function () {
    var output = (0, _dedent.default)(_templateObject8);
    (0, _chai.expect)(output).to.equal(['type Query {', '  me: User', '}'].join('\n'));
  });
  (0, _mocha.it)('supports expression interpolation', function () {
    var name = 'Luke Skywalker';
    var age = 42;
    var output = (0, _dedent.default)(_templateObject9, name, age);
    (0, _chai.expect)(output).to.equal(['{', '  "me": {', '    "name": "Luke Skywalker"', '    "age": 42', '  }', '}', ''].join('\n'));
  });
});