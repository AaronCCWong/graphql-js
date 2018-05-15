/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GraphQLError } from '../../';
import { locatedError } from '../locatedError';
describe('locatedError', function () {
  it('passes GraphQLError through', function () {
    var e = new GraphQLError('msg', null, null, null, ['path', 3, 'to', 'field']);
    expect(locatedError(e, [], [])).to.deep.equal(e);
  });
  it('passes GraphQLError-ish through', function () {
    var e = new Error('I have a different prototype chain');
    e.locations = [];
    e.path = [];
    e.nodes = [];
    e.source = null;
    e.positions = [];
    e.name = 'GraphQLError';
    expect(locatedError(e, [], [])).to.deep.equal(e);
  });
  it('does not pass through elasticsearch-like errors', function () {
    var e = new Error('I am from elasticsearch');
    e.path = '/something/feed/_search';
    expect(locatedError(e, [], [])).to.not.deep.equal(e);
  });
});