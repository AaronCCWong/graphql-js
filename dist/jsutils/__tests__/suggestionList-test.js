"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _suggestionList = _interopRequireDefault(require("../suggestionList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('suggestionList', function () {
  (0, _mocha.it)('Returns results when input is empty', function () {
    (0, _chai.expect)((0, _suggestionList.default)('', ['a'])).to.deep.equal(['a']);
  });
  (0, _mocha.it)('Returns empty array when there are no options', function () {
    (0, _chai.expect)((0, _suggestionList.default)('input', [])).to.deep.equal([]);
  });
  (0, _mocha.it)('Returns options sorted based on similarity', function () {
    (0, _chai.expect)((0, _suggestionList.default)('abc', ['a', 'ab', 'abc'])).to.deep.equal(['abc', 'ab']);
  });
});