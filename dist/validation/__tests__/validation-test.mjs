/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { testSchema } from './harness';
import { validate, specifiedRules } from '../';
import { parse } from '../../language';
import { TypeInfo } from '../../utilities/TypeInfo';

function expectValid(schema, queryString) {
  var errors = validate(schema, parse(queryString));
  expect(errors).to.deep.equal([], 'Should validate');
}

describe('Validate: Supports full validation', function () {
  it('validates queries', function () {
    expectValid(testSchema, "\n      query {\n        catOrDog {\n          ... on Cat {\n            furColor\n          }\n          ... on Dog {\n            isHousetrained\n          }\n        }\n      }\n    ");
  });
  it('detects bad scalar parse', function () {
    var doc = "\n      query {\n        invalidArg(arg: \"bad value\")\n      }\n    ";
    var errors = validate(testSchema, parse(doc));
    expect(errors).to.deep.equal([{
      locations: [{
        line: 3,
        column: 25
      }],
      message: 'Expected type Invalid, found "bad value"; ' + 'Invalid scalar is always invalid: bad value'
    }]);
  }); // NOTE: experimental

  it('validates using a custom TypeInfo', function () {
    // This TypeInfo will never return a valid field.
    var typeInfo = new TypeInfo(testSchema, function () {
      return null;
    });
    var ast = parse("\n      query {\n        catOrDog {\n          ... on Cat {\n            furColor\n          }\n          ... on Dog {\n            isHousetrained\n          }\n        }\n      }\n    ");
    var errors = validate(testSchema, ast, specifiedRules, typeInfo);
    var errorMessages = errors.map(function (err) {
      return err.message;
    });
    expect(errorMessages).to.deep.equal(['Cannot query field "catOrDog" on type "QueryRoot". ' + 'Did you mean "catOrDog"?', 'Cannot query field "furColor" on type "Cat". ' + 'Did you mean "furColor"?', 'Cannot query field "isHousetrained" on type "Dog". ' + 'Did you mean "isHousetrained"?']);
  });
});