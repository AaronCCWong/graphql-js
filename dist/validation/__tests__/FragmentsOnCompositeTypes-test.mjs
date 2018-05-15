/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { FragmentsOnCompositeTypes, inlineFragmentOnNonCompositeErrorMessage, fragmentOnNonCompositeErrorMessage } from '../rules/FragmentsOnCompositeTypes';

function error(fragName, typeName, line, column) {
  return {
    message: fragmentOnNonCompositeErrorMessage(fragName, typeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Fragments on composite types', function () {
  it('object is valid fragment type', function () {
    expectPassesRule(FragmentsOnCompositeTypes, "\n      fragment validFragment on Dog {\n        barks\n      }\n    ");
  });
  it('interface is valid fragment type', function () {
    expectPassesRule(FragmentsOnCompositeTypes, "\n      fragment validFragment on Pet {\n        name\n      }\n    ");
  });
  it('object is valid inline fragment type', function () {
    expectPassesRule(FragmentsOnCompositeTypes, "\n      fragment validFragment on Pet {\n        ... on Dog {\n          barks\n        }\n      }\n    ");
  });
  it('inline fragment without type is valid', function () {
    expectPassesRule(FragmentsOnCompositeTypes, "\n      fragment validFragment on Pet {\n        ... {\n          name\n        }\n      }\n    ");
  });
  it('union is valid fragment type', function () {
    expectPassesRule(FragmentsOnCompositeTypes, "\n      fragment validFragment on CatOrDog {\n        __typename\n      }\n    ");
  });
  it('scalar is invalid fragment type', function () {
    expectFailsRule(FragmentsOnCompositeTypes, "\n      fragment scalarFragment on Boolean {\n        bad\n      }\n    ", [error('scalarFragment', 'Boolean', 2, 34)]);
  });
  it('enum is invalid fragment type', function () {
    expectFailsRule(FragmentsOnCompositeTypes, "\n      fragment scalarFragment on FurColor {\n        bad\n      }\n    ", [error('scalarFragment', 'FurColor', 2, 34)]);
  });
  it('input object is invalid fragment type', function () {
    expectFailsRule(FragmentsOnCompositeTypes, "\n      fragment inputFragment on ComplexInput {\n        stringField\n      }\n    ", [error('inputFragment', 'ComplexInput', 2, 33)]);
  });
  it('scalar is invalid inline fragment type', function () {
    expectFailsRule(FragmentsOnCompositeTypes, "\n      fragment invalidFragment on Pet {\n        ... on String {\n          barks\n        }\n      }\n    ", [{
      message: inlineFragmentOnNonCompositeErrorMessage('String'),
      locations: [{
        line: 3,
        column: 16
      }]
    }]);
  });
});