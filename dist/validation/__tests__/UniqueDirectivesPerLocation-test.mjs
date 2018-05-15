/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { UniqueDirectivesPerLocation, duplicateDirectiveMessage } from '../rules/UniqueDirectivesPerLocation';

function duplicateDirective(directiveName, l1, c1, l2, c2) {
  return {
    message: duplicateDirectiveMessage(directiveName),
    locations: [{
      line: l1,
      column: c1
    }, {
      line: l2,
      column: c2
    }]
  };
}

describe('Validate: Directives Are Unique Per Location', function () {
  it('no directives', function () {
    expectPassesRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field\n      }\n    ");
  });
  it('unique directives in different locations', function () {
    expectPassesRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type @directiveA {\n        field @directiveB\n      }\n    ");
  });
  it('unique directives in same locations', function () {
    expectPassesRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type @directiveA @directiveB {\n        field @directiveA @directiveB\n      }\n    ");
  });
  it('same directives in different locations', function () {
    expectPassesRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type @directiveA {\n        field @directiveA\n      }\n    ");
  });
  it('same directives in similar locations', function () {
    expectPassesRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directive\n        field @directive\n      }\n    ");
  });
  it('duplicate directives in one location', function () {
    expectFailsRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directive @directive\n      }\n    ", [duplicateDirective('directive', 3, 15, 3, 26)]);
  });
  it('many duplicate directives in one location', function () {
    expectFailsRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directive @directive @directive\n      }\n    ", [duplicateDirective('directive', 3, 15, 3, 26), duplicateDirective('directive', 3, 15, 3, 37)]);
  });
  it('different duplicate directives in one location', function () {
    expectFailsRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type {\n        field @directiveA @directiveB @directiveA @directiveB\n      }\n    ", [duplicateDirective('directiveA', 3, 15, 3, 39), duplicateDirective('directiveB', 3, 27, 3, 51)]);
  });
  it('duplicate directives in many locations', function () {
    expectFailsRule(UniqueDirectivesPerLocation, "\n      fragment Test on Type @directive @directive {\n        field @directive @directive\n      }\n    ", [duplicateDirective('directive', 2, 29, 2, 40), duplicateDirective('directive', 3, 15, 3, 26)]);
  });
});