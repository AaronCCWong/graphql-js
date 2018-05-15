"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _isValidLiteralValue = require("../isValidLiteralValue");

var _language = require("../../language");

var _type = require("../../type");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('isValidLiteralValue', function () {
  (0, _mocha.it)('Returns no errors for a valid value', function () {
    (0, _chai.expect)((0, _isValidLiteralValue.isValidLiteralValue)(_type.GraphQLInt, (0, _language.parseValue)('123'))).to.deep.equal([]);
  });
  (0, _mocha.it)('Returns errors for an invalid value', function () {
    (0, _chai.expect)((0, _isValidLiteralValue.isValidLiteralValue)(_type.GraphQLInt, (0, _language.parseValue)('"abc"'))).to.deep.equal([{
      message: 'Expected type Int, found "abc".',
      locations: [{
        line: 1,
        column: 1
      }]
    }]);
  });
});