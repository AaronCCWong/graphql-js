"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _language = require("../../language");

var _getOperationAST = require("../getOperationAST");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('getOperationAST', function () {
  (0, _mocha.it)('Gets an operation from a simple document', function () {
    var doc = (0, _language.parse)('{ field }');
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc)).to.equal(doc.definitions[0]);
  });
  (0, _mocha.it)('Gets an operation from a document with named op (mutation)', function () {
    var doc = (0, _language.parse)('mutation Test { field }');
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc)).to.equal(doc.definitions[0]);
  });
  (0, _mocha.it)('Gets an operation from a document with named op (subscription)', function () {
    var doc = (0, _language.parse)('subscription Test { field }');
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc)).to.equal(doc.definitions[0]);
  });
  (0, _mocha.it)('Does not get missing operation', function () {
    var doc = (0, _language.parse)('type Foo { field: String }');
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc)).to.equal(null);
  });
  (0, _mocha.it)('Does not get ambiguous unnamed operation', function () {
    var doc = (0, _language.parse)("\n      { field }\n      mutation Test { field }\n      subscription TestSub { field }");
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc)).to.equal(null);
  });
  (0, _mocha.it)('Does not get ambiguous named operation', function () {
    var doc = (0, _language.parse)("\n      query TestQ { field }\n      mutation TestM { field }\n      subscription TestS { field }");
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc)).to.equal(null);
  });
  (0, _mocha.it)('Does not get misnamed operation', function () {
    var doc = (0, _language.parse)("\n      query TestQ { field }\n      mutation TestM { field }\n      subscription TestS { field }");
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc, 'Unknown')).to.equal(null);
  });
  (0, _mocha.it)('Gets named operation', function () {
    var doc = (0, _language.parse)("\n      query TestQ { field }\n      mutation TestM { field }\n      subscription TestS { field }");
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc, 'TestQ')).to.equal(doc.definitions[0]);
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc, 'TestM')).to.equal(doc.definitions[1]);
    (0, _chai.expect)((0, _getOperationAST.getOperationAST)(doc, 'TestS')).to.equal(doc.definitions[2]);
  });
});