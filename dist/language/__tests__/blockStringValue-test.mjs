/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import blockStringValue from '../blockStringValue';
describe('blockStringValue', function () {
  it('removes uniform indentation from a string', function () {
    var rawValue = ['', '    Hello,', '      World!', '', '    Yours,', '      GraphQL.'].join('\n');
    expect(blockStringValue(rawValue)).to.equal(['Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  it('removes empty leading and trailing lines', function () {
    var rawValue = ['', '', '    Hello,', '      World!', '', '    Yours,', '      GraphQL.', '', ''].join('\n');
    expect(blockStringValue(rawValue)).to.equal(['Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  it('removes blank leading and trailing lines', function () {
    var rawValue = ['  ', '        ', '    Hello,', '      World!', '', '    Yours,', '      GraphQL.', '        ', '  '].join('\n');
    expect(blockStringValue(rawValue)).to.equal(['Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  it('retains indentation from first line', function () {
    var rawValue = ['    Hello,', '      World!', '', '    Yours,', '      GraphQL.'].join('\n');
    expect(blockStringValue(rawValue)).to.equal(['    Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  it('does not alter trailing spaces', function () {
    var rawValue = ['               ', '    Hello,     ', '      World!   ', '               ', '    Yours,     ', '      GraphQL. ', '               '].join('\n');
    expect(blockStringValue(rawValue)).to.equal(['Hello,     ', '  World!   ', '           ', 'Yours,     ', '  GraphQL. '].join('\n'));
  });
});