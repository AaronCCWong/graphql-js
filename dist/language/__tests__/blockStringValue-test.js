"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _blockStringValue = _interopRequireDefault(require("../blockStringValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('blockStringValue', function () {
  (0, _mocha.it)('removes uniform indentation from a string', function () {
    var rawValue = ['', '    Hello,', '      World!', '', '    Yours,', '      GraphQL.'].join('\n');
    (0, _chai.expect)((0, _blockStringValue.default)(rawValue)).to.equal(['Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  (0, _mocha.it)('removes empty leading and trailing lines', function () {
    var rawValue = ['', '', '    Hello,', '      World!', '', '    Yours,', '      GraphQL.', '', ''].join('\n');
    (0, _chai.expect)((0, _blockStringValue.default)(rawValue)).to.equal(['Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  (0, _mocha.it)('removes blank leading and trailing lines', function () {
    var rawValue = ['  ', '        ', '    Hello,', '      World!', '', '    Yours,', '      GraphQL.', '        ', '  '].join('\n');
    (0, _chai.expect)((0, _blockStringValue.default)(rawValue)).to.equal(['Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  (0, _mocha.it)('retains indentation from first line', function () {
    var rawValue = ['    Hello,', '      World!', '', '    Yours,', '      GraphQL.'].join('\n');
    (0, _chai.expect)((0, _blockStringValue.default)(rawValue)).to.equal(['    Hello,', '  World!', '', 'Yours,', '  GraphQL.'].join('\n'));
  });
  (0, _mocha.it)('does not alter trailing spaces', function () {
    var rawValue = ['               ', '    Hello,     ', '      World!   ', '               ', '    Yours,     ', '      GraphQL. ', '               '].join('\n');
    (0, _chai.expect)((0, _blockStringValue.default)(rawValue)).to.equal(['Hello,     ', '  World!   ', '           ', 'Yours,     ', '  GraphQL. '].join('\n'));
  });
});