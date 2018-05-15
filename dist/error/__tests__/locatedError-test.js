"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _ = require("../../");

var _locatedError = require("../locatedError");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('locatedError', function () {
  (0, _mocha.it)('passes GraphQLError through', function () {
    var e = new _.GraphQLError('msg', null, null, null, ['path', 3, 'to', 'field']);
    (0, _chai.expect)((0, _locatedError.locatedError)(e, [], [])).to.deep.equal(e);
  });
  (0, _mocha.it)('passes GraphQLError-ish through', function () {
    var e = new Error('I have a different prototype chain');
    e.locations = [];
    e.path = [];
    e.nodes = [];
    e.source = null;
    e.positions = [];
    e.name = 'GraphQLError';
    (0, _chai.expect)((0, _locatedError.locatedError)(e, [], [])).to.deep.equal(e);
  });
  (0, _mocha.it)('does not pass through elasticsearch-like errors', function () {
    var e = new Error('I am from elasticsearch');
    e.path = '/something/feed/_search';
    (0, _chai.expect)((0, _locatedError.locatedError)(e, [], [])).to.not.deep.equal(e);
  });
});