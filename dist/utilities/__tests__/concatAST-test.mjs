var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        a\n        b\n        ...Frag\n      }\n\n      fragment Frag on T {\n        c\n      }\n    "]);

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
import { concatAST } from '../concatAST';
import { Source, parse, print } from '../../language';
describe('concatAST', function () {
  it('concats two ASTs together', function () {
    var sourceA = new Source("\n      { a, b, ...Frag }\n    ");
    var sourceB = new Source("\n      fragment Frag on T {\n        c\n      }\n    ");
    var astA = parse(sourceA);
    var astB = parse(sourceB);
    var astC = concatAST([astA, astB]);
    expect(print(astC)).to.equal(dedent(_templateObject));
  });
});