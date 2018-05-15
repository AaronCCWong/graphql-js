/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { ScalarLeafs, noSubselectionAllowedMessage, requiredSubselectionMessage } from '../rules/ScalarLeafs';

function noScalarSubselection(field, type, line, column) {
  return {
    message: noSubselectionAllowedMessage(field, type),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function missingObjSubselection(field, type, line, column) {
  return {
    message: requiredSubselectionMessage(field, type),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Scalar leafs', function () {
  it('valid scalar selection', function () {
    expectPassesRule(ScalarLeafs, "\n      fragment scalarSelection on Dog {\n        barks\n      }\n    ");
  });
  it('object type missing selection', function () {
    expectFailsRule(ScalarLeafs, "\n      query directQueryOnObjectWithoutSubFields {\n        human\n      }\n    ", [missingObjSubselection('human', 'Human', 3, 9)]);
  });
  it('interface type missing selection', function () {
    expectFailsRule(ScalarLeafs, "\n      {\n        human { pets }\n      }\n    ", [missingObjSubselection('pets', '[Pet]', 3, 17)]);
  });
  it('valid scalar selection with args', function () {
    expectPassesRule(ScalarLeafs, "\n      fragment scalarSelectionWithArgs on Dog {\n        doesKnowCommand(dogCommand: SIT)\n      }\n    ");
  });
  it('scalar selection not allowed on Boolean', function () {
    expectFailsRule(ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedOnBoolean on Dog {\n        barks { sinceWhen }\n      }\n    ", [noScalarSubselection('barks', 'Boolean', 3, 15)]);
  });
  it('scalar selection not allowed on Enum', function () {
    expectFailsRule(ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedOnEnum on Cat {\n        furColor { inHexdec }\n      }\n    ", [noScalarSubselection('furColor', 'FurColor', 3, 18)]);
  });
  it('scalar selection not allowed with args', function () {
    expectFailsRule(ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedWithArgs on Dog {\n        doesKnowCommand(dogCommand: SIT) { sinceWhen }\n      }\n    ", [noScalarSubselection('doesKnowCommand', 'Boolean', 3, 42)]);
  });
  it('Scalar selection not allowed with directives', function () {
    expectFailsRule(ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedWithDirectives on Dog {\n        name @include(if: true) { isAlsoHumanName }\n      }\n    ", [noScalarSubselection('name', 'String', 3, 33)]);
  });
  it('Scalar selection not allowed with directives and args', function () {
    expectFailsRule(ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedWithDirectivesAndArgs on Dog {\n        doesKnowCommand(dogCommand: SIT) @include(if: true) { sinceWhen }\n      }\n    ", [noScalarSubselection('doesKnowCommand', 'Boolean', 3, 61)]);
  });
});