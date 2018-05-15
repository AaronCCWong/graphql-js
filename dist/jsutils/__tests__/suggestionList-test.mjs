/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import suggestionList from '../suggestionList';
describe('suggestionList', function () {
  it('Returns results when input is empty', function () {
    expect(suggestionList('', ['a'])).to.deep.equal(['a']);
  });
  it('Returns empty array when there are no options', function () {
    expect(suggestionList('input', [])).to.deep.equal([]);
  });
  it('Returns options sorted based on similarity', function () {
    expect(suggestionList('abc', ['a', 'ab', 'abc'])).to.deep.equal(['abc', 'ab']);
  });
});