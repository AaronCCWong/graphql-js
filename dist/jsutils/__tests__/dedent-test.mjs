var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        me: User\n      }\n      \n      type User {\n        id: ID\n        name: String\n      }\n      "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n            qux\n              quux\n                quuux\n                  quuuux\n      "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Root {\n        field(arg: String = \"wi\th de\fault\"): String\n      }\n      "], ["\n      type Root {\n        field(arg: String = \"wi\\th de\\fault\"): String\n      }\n      "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        \t\t    type Query {\n        \t\t      me: User\n        \t\t    }\n      "], ["\n        \\t\\t    type Query {\n        \\t\\t      me: User\n        \\t\\t    }\n      "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n\n\n      type Query {\n        me: User\n      }"]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        me: User\n      }\n\n      "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        me: User\n      }\n          \t\t  \t "], ["\n      type Query {\n        me: User\n      }\n          \\t\\t  \\t "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["      type Query {\n        me: User\n      }"]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          \"me\": {\n            \"name\": \"", "\"\n            \"age\": ", "\n          }\n        }\n      "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import dedent from '../dedent';
describe('dedent', function () {
  it('removes indentation in typical usage', function () {
    var output = dedent(_templateObject);
    expect(output).to.equal(['type Query {', '  me: User', '}', '', 'type User {', '  id: ID', '  name: String', '}', ''].join('\n'));
  });
  it('removes only the first level of indentation', function () {
    var output = dedent(_templateObject2);
    expect(output).to.equal(['qux', '  quux', '    quuux', '      quuuux', ''].join('\n'));
  });
  it('does not escape special characters', function () {
    var output = dedent(_templateObject3);
    expect(output).to.equal(['type Root {', '  field(arg: String = "wi\th de\fault"): String', '}', ''].join('\n'));
  });
  it('also works as an ordinary function on strings', function () {
    var output = dedent("\n      type Query {\n        me: User\n      }\n      ");
    expect(output).to.equal(['type Query {', '  me: User', '}', ''].join('\n'));
  });
  it('also removes indentation using tabs', function () {
    var output = dedent(_templateObject4);
    expect(output).to.equal(['type Query {', '  me: User', '}', ''].join('\n'));
  });
  it('removes leading newlines', function () {
    var output = dedent(_templateObject5);
    expect(output).to.equal(['type Query {', '  me: User', '}'].join('\n'));
  });
  it('does not remove trailing newlines', function () {
    var output = dedent(_templateObject6);
    expect(output).to.equal(['type Query {', '  me: User', '}', '', ''].join('\n'));
  });
  it('removes all trailing spaces and tabs', function () {
    var output = dedent(_templateObject7);
    expect(output).to.equal(['type Query {', '  me: User', '}', ''].join('\n'));
  });
  it('works on text without leading newline', function () {
    var output = dedent(_templateObject8);
    expect(output).to.equal(['type Query {', '  me: User', '}'].join('\n'));
  });
  it('supports expression interpolation', function () {
    var name = 'Luke Skywalker';
    var age = 42;
    var output = dedent(_templateObject9, name, age);
    expect(output).to.equal(['{', '  "me": {', '    "name": "Luke Skywalker"', '    "age": 42', '  }', '}', ''].join('\n'));
  });
});