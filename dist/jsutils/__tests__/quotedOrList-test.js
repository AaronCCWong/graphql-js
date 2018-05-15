"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _quotedOrList = _interopRequireDefault(require("../quotedOrList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('quotedOrList', function () {
  (0, _mocha.it)('Does not accept an empty list', function () {
    (0, _chai.expect)(function () {
      return (0, _quotedOrList.default)([]);
    }).to.throw(TypeError);
  });
  (0, _mocha.it)('Returns single quoted item', function () {
    (0, _chai.expect)((0, _quotedOrList.default)(['A'])).to.equal('"A"');
  });
  (0, _mocha.it)('Returns two item list', function () {
    (0, _chai.expect)((0, _quotedOrList.default)(['A', 'B'])).to.equal('"A" or "B"');
  });
  (0, _mocha.it)('Returns comma separated many item list', function () {
    (0, _chai.expect)((0, _quotedOrList.default)(['A', 'B', 'C'])).to.equal('"A", "B", or "C"');
  });
  (0, _mocha.it)('Limits to five items', function () {
    (0, _chai.expect)((0, _quotedOrList.default)(['A', 'B', 'C', 'D', 'E', 'F'])).to.equal('"A", "B", "C", "D", or "E"');
  });
});