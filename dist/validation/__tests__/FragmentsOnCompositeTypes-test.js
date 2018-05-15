"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _FragmentsOnCompositeTypes = require("../rules/FragmentsOnCompositeTypes");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function error(fragName, typeName, line, column) {
  return {
    message: (0, _FragmentsOnCompositeTypes.fragmentOnNonCompositeErrorMessage)(fragName, typeName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Fragments on composite types', function () {
  (0, _mocha.it)('object is valid fragment type', function () {
    (0, _harness.expectPassesRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment validFragment on Dog {\n        barks\n      }\n    ");
  });
  (0, _mocha.it)('interface is valid fragment type', function () {
    (0, _harness.expectPassesRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment validFragment on Pet {\n        name\n      }\n    ");
  });
  (0, _mocha.it)('object is valid inline fragment type', function () {
    (0, _harness.expectPassesRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment validFragment on Pet {\n        ... on Dog {\n          barks\n        }\n      }\n    ");
  });
  (0, _mocha.it)('inline fragment without type is valid', function () {
    (0, _harness.expectPassesRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment validFragment on Pet {\n        ... {\n          name\n        }\n      }\n    ");
  });
  (0, _mocha.it)('union is valid fragment type', function () {
    (0, _harness.expectPassesRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment validFragment on CatOrDog {\n        __typename\n      }\n    ");
  });
  (0, _mocha.it)('scalar is invalid fragment type', function () {
    (0, _harness.expectFailsRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment scalarFragment on Boolean {\n        bad\n      }\n    ", [error('scalarFragment', 'Boolean', 2, 34)]);
  });
  (0, _mocha.it)('enum is invalid fragment type', function () {
    (0, _harness.expectFailsRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment scalarFragment on FurColor {\n        bad\n      }\n    ", [error('scalarFragment', 'FurColor', 2, 34)]);
  });
  (0, _mocha.it)('input object is invalid fragment type', function () {
    (0, _harness.expectFailsRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment inputFragment on ComplexInput {\n        stringField\n      }\n    ", [error('inputFragment', 'ComplexInput', 2, 33)]);
  });
  (0, _mocha.it)('scalar is invalid inline fragment type', function () {
    (0, _harness.expectFailsRule)(_FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, "\n      fragment invalidFragment on Pet {\n        ... on String {\n          barks\n        }\n      }\n    ", [{
      message: (0, _FragmentsOnCompositeTypes.inlineFragmentOnNonCompositeErrorMessage)('String'),
      locations: [{
        line: 3,
        column: 16
      }]
    }]);
  });
});