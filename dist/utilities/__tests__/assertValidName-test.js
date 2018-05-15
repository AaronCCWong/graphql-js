"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _assertValidName = require("../assertValidName");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('assertValidName()', function () {
  (0, _mocha.it)('throws for use of leading double underscores', function () {
    (0, _chai.expect)(function () {
      return (0, _assertValidName.assertValidName)('__bad');
    }).to.throw('"__bad" must not begin with "__", which is reserved by GraphQL introspection.');
  });
  (0, _mocha.it)('throws for non-strings', function () {
    (0, _chai.expect)(function () {
      return (0, _assertValidName.assertValidName)({});
    }).to.throw(/Expected string/);
  });
  (0, _mocha.it)('throws for names with invalid characters', function () {
    (0, _chai.expect)(function () {
      return (0, _assertValidName.assertValidName)('>--()-->');
    }).to.throw(/Names must match/);
  });
});