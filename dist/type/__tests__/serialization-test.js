"use strict";

var _ = require("../");

var _mocha = require("mocha");

var _chai = require("chai");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Type System: Scalar coercion', function () {
  (0, _mocha.it)('serializes output int', function () {
    (0, _chai.expect)(_.GraphQLInt.serialize(1)).to.equal(1);
    (0, _chai.expect)(_.GraphQLInt.serialize('123')).to.equal(123);
    (0, _chai.expect)(_.GraphQLInt.serialize(0)).to.equal(0);
    (0, _chai.expect)(_.GraphQLInt.serialize(-1)).to.equal(-1);
    (0, _chai.expect)(_.GraphQLInt.serialize(1e5)).to.equal(100000); // The GraphQL specification does not allow serializing non-integer values
    // as Int to avoid accidental data loss.

    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(0.1);
    }).to.throw('Int cannot represent non-integer value: 0.1');
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(1.1);
    }).to.throw('Int cannot represent non-integer value: 1.1');
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(-1.1);
    }).to.throw('Int cannot represent non-integer value: -1.1');
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize('-1.1');
    }).to.throw('Int cannot represent non-integer value: -1.1'); // Maybe a safe JavaScript int, but bigger than 2^32, so not
    // representable as a GraphQL Int

    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(9876504321);
    }).to.throw('Int cannot represent non 32-bit signed integer value: 9876504321');
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(-9876504321);
    }).to.throw('Int cannot represent non 32-bit signed integer value: -9876504321'); // Too big to represent as an Int in JavaScript or GraphQL

    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(1e100);
    }).to.throw('Int cannot represent non 32-bit signed integer value: 1e+100');
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(-1e100);
    }).to.throw('Int cannot represent non 32-bit signed integer value: -1e+100');
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize('one');
    }).to.throw('Int cannot represent non 32-bit signed integer value: one');
    (0, _chai.expect)(_.GraphQLInt.serialize(false)).to.equal(0);
    (0, _chai.expect)(_.GraphQLInt.serialize(true)).to.equal(1);
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize('');
    }).to.throw('Int cannot represent non 32-bit signed integer value: (empty string)');
    (0, _chai.expect)(function () {
      return _.GraphQLInt.serialize(NaN);
    }).to.throw('Int cannot represent non 32-bit signed integer value: NaN');
  });
  (0, _mocha.it)('serializes output float', function () {
    (0, _chai.expect)(_.GraphQLFloat.serialize(1)).to.equal(1.0);
    (0, _chai.expect)(_.GraphQLFloat.serialize(0)).to.equal(0.0);
    (0, _chai.expect)(_.GraphQLFloat.serialize('123.5')).to.equal(123.5);
    (0, _chai.expect)(_.GraphQLFloat.serialize(-1)).to.equal(-1.0);
    (0, _chai.expect)(_.GraphQLFloat.serialize(0.1)).to.equal(0.1);
    (0, _chai.expect)(_.GraphQLFloat.serialize(1.1)).to.equal(1.1);
    (0, _chai.expect)(_.GraphQLFloat.serialize(-1.1)).to.equal(-1.1);
    (0, _chai.expect)(_.GraphQLFloat.serialize('-1.1')).to.equal(-1.1);
    (0, _chai.expect)(_.GraphQLFloat.serialize(false)).to.equal(0.0);
    (0, _chai.expect)(_.GraphQLFloat.serialize(true)).to.equal(1.0);
    (0, _chai.expect)(function () {
      return _.GraphQLFloat.serialize(NaN);
    }).to.throw('Float cannot represent non numeric value: NaN');
    (0, _chai.expect)(function () {
      return _.GraphQLFloat.serialize('one');
    }).to.throw('Float cannot represent non numeric value: one');
    (0, _chai.expect)(function () {
      return _.GraphQLFloat.serialize('');
    }).to.throw('Float cannot represent non numeric value: (empty string)');
  });
  (0, _mocha.it)('serializes output strings', function () {
    (0, _chai.expect)(_.GraphQLString.serialize('string')).to.equal('string');
    (0, _chai.expect)(_.GraphQLString.serialize(1)).to.equal('1');
    (0, _chai.expect)(_.GraphQLString.serialize(-1.1)).to.equal('-1.1');
    (0, _chai.expect)(_.GraphQLString.serialize(true)).to.equal('true');
    (0, _chai.expect)(_.GraphQLString.serialize(false)).to.equal('false');
  });
  (0, _mocha.it)('serializes output boolean', function () {
    (0, _chai.expect)(_.GraphQLBoolean.serialize('string')).to.equal(true);
    (0, _chai.expect)(_.GraphQLBoolean.serialize('')).to.equal(false);
    (0, _chai.expect)(_.GraphQLBoolean.serialize(1)).to.equal(true);
    (0, _chai.expect)(_.GraphQLBoolean.serialize(0)).to.equal(false);
    (0, _chai.expect)(_.GraphQLBoolean.serialize(true)).to.equal(true);
    (0, _chai.expect)(_.GraphQLBoolean.serialize(false)).to.equal(false);
  });
});