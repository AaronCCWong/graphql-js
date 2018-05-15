/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { assertValidName } from '../assertValidName';
describe('assertValidName()', function () {
  it('throws for use of leading double underscores', function () {
    expect(function () {
      return assertValidName('__bad');
    }).to.throw('"__bad" must not begin with "__", which is reserved by GraphQL introspection.');
  });
  it('throws for non-strings', function () {
    expect(function () {
      return assertValidName({});
    }).to.throw(/Expected string/);
  });
  it('throws for names with invalid characters', function () {
    expect(function () {
      return assertValidName('>--()-->');
    }).to.throw(/Names must match/);
  });
});