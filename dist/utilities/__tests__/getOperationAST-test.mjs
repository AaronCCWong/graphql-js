/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parse } from '../../language';
import { getOperationAST } from '../getOperationAST';
describe('getOperationAST', function () {
  it('Gets an operation from a simple document', function () {
    var doc = parse('{ field }');
    expect(getOperationAST(doc)).to.equal(doc.definitions[0]);
  });
  it('Gets an operation from a document with named op (mutation)', function () {
    var doc = parse('mutation Test { field }');
    expect(getOperationAST(doc)).to.equal(doc.definitions[0]);
  });
  it('Gets an operation from a document with named op (subscription)', function () {
    var doc = parse('subscription Test { field }');
    expect(getOperationAST(doc)).to.equal(doc.definitions[0]);
  });
  it('Does not get missing operation', function () {
    var doc = parse('type Foo { field: String }');
    expect(getOperationAST(doc)).to.equal(null);
  });
  it('Does not get ambiguous unnamed operation', function () {
    var doc = parse("\n      { field }\n      mutation Test { field }\n      subscription TestSub { field }");
    expect(getOperationAST(doc)).to.equal(null);
  });
  it('Does not get ambiguous named operation', function () {
    var doc = parse("\n      query TestQ { field }\n      mutation TestM { field }\n      subscription TestS { field }");
    expect(getOperationAST(doc)).to.equal(null);
  });
  it('Does not get misnamed operation', function () {
    var doc = parse("\n      query TestQ { field }\n      mutation TestM { field }\n      subscription TestS { field }");
    expect(getOperationAST(doc, 'Unknown')).to.equal(null);
  });
  it('Gets named operation', function () {
    var doc = parse("\n      query TestQ { field }\n      mutation TestM { field }\n      subscription TestS { field }");
    expect(getOperationAST(doc, 'TestQ')).to.equal(doc.definitions[0]);
    expect(getOperationAST(doc, 'TestM')).to.equal(doc.definitions[1]);
    expect(getOperationAST(doc, 'TestS')).to.equal(doc.definitions[2]);
  });
});