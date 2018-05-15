var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Single digit line number with no padding\n\n      Test (9:1)\n      9: *\n         ^\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Left padded first line number\n\n      Test (9:1)\n       9: *\n          ^\n      10: \n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        type Foo {\n          field: String\n        }"]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        type Foo {\n          field: Int\n        }"]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Example error with two nodes\n\n      SourceA (2:10)\n      1: type Foo {\n      2:   field: String\n                  ^\n      3: }\n\n      SourceB (2:10)\n      1: type Foo {\n      2:   field: Int\n                  ^\n      3: }\n    "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GraphQLError } from '../GraphQLError';
import { printError } from '../printError';
import { parse, Source } from '../../language';
import dedent from '../../jsutils/dedent';
describe('printError', function () {
  it('prints an line numbers with correct padding', function () {
    var singleDigit = new GraphQLError('Single digit line number with no padding', null, new Source('*', 'Test', {
      line: 9,
      column: 1
    }), [0]);
    expect(printError(singleDigit)).to.equal(dedent(_templateObject));
    var doubleDigit = new GraphQLError('Left padded first line number', null, new Source('*\n', 'Test', {
      line: 9,
      column: 1
    }), [0]);
    expect(printError(doubleDigit)).to.equal(dedent(_templateObject2));
  });
  it('prints an error with nodes from different sources', function () {
    var sourceA = parse(new Source(dedent(_templateObject3), 'SourceA'));
    var fieldTypeA = sourceA.definitions[0].fields[0].type;
    var sourceB = parse(new Source(dedent(_templateObject4), 'SourceB'));
    var fieldTypeB = sourceB.definitions[0].fields[0].type;
    var error = new GraphQLError('Example error with two nodes', [fieldTypeA, fieldTypeB]);
    expect(printError(error)).to.equal(dedent(_templateObject5));
  });
});