"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _UniqueDirectivesPerLocation = require("../rules/UniqueDirectivesPerLocation");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function duplicateDirective(directiveName, l1, c1, l2, c2) {
  return {
    message: (0, _UniqueDirectivesPerLocation.duplicateDirectiveMessage)(directiveName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

(0, _mocha.describe)('Validate: Directives Are Unique Per Location', function () {
  (0, _mocha.it)('no directives', function () {
    (0, _harness.expectPassesRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('unique directives in different locations', function () {
    (0, _harness.expectPassesRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type @directiveA {\n        field @directiveB\n      }\n    ");
  });
  (0, _mocha.it)('unique directives in same locations', function () {
    (0, _harness.expectPassesRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type @directiveA @directiveB {\n        field @directiveA @directiveB\n      }\n    ");
  });
  (0, _mocha.it)('same directives in different locations', function () {
    (0, _harness.expectPassesRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type @directiveA {\n        field @directiveA\n      }\n    ");
  });
  (0, _mocha.it)('same directives in similar locations', function () {
    (0, _harness.expectPassesRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directive\n        field @directive\n      }\n    ");
  });
  (0, _mocha.it)('duplicate directives in one location', function () {
    (0, _harness.expectFailsRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directive @directive\n      }\n    ", [duplicateDirective('directive', 3, 15, 3, 26)]);
  });
  (0, _mocha.it)('many duplicate directives in one location', function () {
    (0, _harness.expectFailsRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directive @directive @directive\n      }\n    ", [duplicateDirective('directive', 3, 15, 3, 26), duplicateDirective('directive', 3, 15, 3, 37)]);
  });
  (0, _mocha.it)('different duplicate directives in one location', function () {
    (0, _harness.expectFailsRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directiveA @directiveB @directiveA @directiveB\n      }\n    ", [duplicateDirective('directiveA', 3, 15, 3, 39), duplicateDirective('directiveB', 3, 27, 3, 51)]);
  });
  (0, _mocha.it)('duplicate directives in many locations', function () {
    (0, _harness.expectFailsRule)(_UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, "\n      fragment Test on Type @directive @directive {\n        field @directive @directive\n      }\n    ", [duplicateDirective('directive', 2, 29, 2, 40), duplicateDirective('directive', 3, 15, 3, 26)]);
  });
});