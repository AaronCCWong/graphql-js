var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        ...Y\n        ...X\n      }\n\n      fragment X on T {\n        fieldX\n      }\n\n      fragment Y on T {\n        fieldY\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query One {\n        foo\n        bar\n        ...A\n        ...X\n      }\n\n      fragment A on T {\n        field\n        ...B\n      }\n\n      fragment X on T {\n        fieldX\n      }\n\n      fragment B on T {\n        something\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      fragment A on T {\n        field\n        ...B\n      }\n\n      query Two {\n        ...A\n        ...Y\n        baz\n      }\n\n      fragment Y on T {\n        fieldY\n      }\n\n      fragment B on T {\n        something\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query One {\n        ...A\n      }\n\n      fragment A on T {\n        ...B\n      }\n\n      fragment B on T {\n        ...A\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      fragment A on T {\n        ...B\n      }\n\n      fragment B on T {\n        ...A\n      }\n\n      query Two {\n        ...B\n      }\n    "]);

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
import { separateOperations } from '../separateOperations';
import { parse, print } from '../../language';
describe('separateOperations', function () {
  it('separates one AST into multiple, maintaining document order', function () {
    var ast = parse("\n      {\n        ...Y\n        ...X\n      }\n\n      query One {\n        foo\n        bar\n        ...A\n        ...X\n      }\n\n      fragment A on T {\n        field\n        ...B\n      }\n\n      fragment X on T {\n        fieldX\n      }\n\n      query Two {\n        ...A\n        ...Y\n        baz\n      }\n\n      fragment Y on T {\n        fieldY\n      }\n\n      fragment B on T {\n        something\n      }\n    ");
    var separatedASTs = separateOperations(ast);
    expect(Object.keys(separatedASTs)).to.deep.equal(['', 'One', 'Two']);
    expect(print(separatedASTs[''])).to.equal(dedent(_templateObject));
    expect(print(separatedASTs.One)).to.equal(dedent(_templateObject2));
    expect(print(separatedASTs.Two)).to.equal(dedent(_templateObject3));
  });
  it('survives circular dependencies', function () {
    var ast = parse("\n      query One {\n        ...A\n      }\n\n      fragment A on T {\n        ...B\n      }\n\n      fragment B on T {\n        ...A\n      }\n\n      query Two {\n        ...B\n      }\n    ");
    var separatedASTs = separateOperations(ast);
    expect(Object.keys(separatedASTs)).to.deep.equal(['One', 'Two']);
    expect(print(separatedASTs.One)).to.equal(dedent(_templateObject4));
    expect(print(separatedASTs.Two)).to.equal(dedent(_templateObject5));
  });
});