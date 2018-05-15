"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _harness = require("./harness");

var _ = require("../");

var _language = require("../../language");

var _TypeInfo = require("../../utilities/TypeInfo");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function expectValid(schema, queryString) {
  var errors = (0, _.validate)(schema, (0, _language.parse)(queryString));
  (0, _chai.expect)(errors).to.deep.equal([], 'Should validate');
}

(0, _mocha.describe)('Validate: Supports full validation', function () {
  (0, _mocha.it)('validates queries', function () {
    expectValid(_harness.testSchema, "\n      query {\n        catOrDog {\n          ... on Cat {\n            furColor\n          }\n          ... on Dog {\n            isHousetrained\n          }\n        }\n      }\n    ");
  });
  (0, _mocha.it)('detects bad scalar parse', function () {
    var doc = "\n      query {\n        invalidArg(arg: \"bad value\")\n      }\n    ";
    var errors = (0, _.validate)(_harness.testSchema, (0, _language.parse)(doc));
    (0, _chai.expect)(errors).to.deep.equal([{
      locations: [{
        line: 3,
        column: 25
      }],
      message: 'Expected type Invalid, found "bad value"; ' + 'Invalid scalar is always invalid: bad value'
    }]);
  }); // NOTE: experimental

  (0, _mocha.it)('validates using a custom TypeInfo', function () {
    // This TypeInfo will never return a valid field.
    var typeInfo = new _TypeInfo.TypeInfo(_harness.testSchema, function () {
      return null;
    });
    var ast = (0, _language.parse)("\n      query {\n        catOrDog {\n          ... on Cat {\n            furColor\n          }\n          ... on Dog {\n            isHousetrained\n          }\n        }\n      }\n    ");
    var errors = (0, _.validate)(_harness.testSchema, ast, _.specifiedRules, typeInfo);
    var errorMessages = errors.map(function (err) {
      return err.message;
    });
    (0, _chai.expect)(errorMessages).to.deep.equal(['Cannot query field "catOrDog" on type "QueryRoot". ' + 'Did you mean "catOrDog"?', 'Cannot query field "furColor" on type "Cat". ' + 'Did you mean "furColor"?', 'Cannot query field "isHousetrained" on type "Dog". ' + 'Did you mean "isHousetrained"?']);
  });
});