"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _ScalarLeafs = require("../rules/ScalarLeafs");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function noScalarSubselection(field, type, line, column) {
  return {
    message: (0, _ScalarLeafs.noSubselectionAllowedMessage)(field, type),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function missingObjSubselection(field, type, line, column) {
  return {
    message: (0, _ScalarLeafs.requiredSubselectionMessage)(field, type),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Scalar leafs', function () {
  (0, _mocha.it)('valid scalar selection', function () {
    (0, _harness.expectPassesRule)(_ScalarLeafs.ScalarLeafs, "\n      fragment scalarSelection on Dog {\n        barks\n      }\n    ");
  });
  (0, _mocha.it)('object type missing selection', function () {
    (0, _harness.expectFailsRule)(_ScalarLeafs.ScalarLeafs, "\n      query directQueryOnObjectWithoutSubFields {\n        human\n      }\n    ", [missingObjSubselection('human', 'Human', 3, 9)]);
  });
  (0, _mocha.it)('interface type missing selection', function () {
    (0, _harness.expectFailsRule)(_ScalarLeafs.ScalarLeafs, "\n      {\n        human { pets }\n      }\n    ", [missingObjSubselection('pets', '[Pet]', 3, 17)]);
  });
  (0, _mocha.it)('valid scalar selection with args', function () {
    (0, _harness.expectPassesRule)(_ScalarLeafs.ScalarLeafs, "\n      fragment scalarSelectionWithArgs on Dog {\n        doesKnowCommand(dogCommand: SIT)\n      }\n    ");
  });
  (0, _mocha.it)('scalar selection not allowed on Boolean', function () {
    (0, _harness.expectFailsRule)(_ScalarLeafs.ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedOnBoolean on Dog {\n        barks { sinceWhen }\n      }\n    ", [noScalarSubselection('barks', 'Boolean', 3, 15)]);
  });
  (0, _mocha.it)('scalar selection not allowed on Enum', function () {
    (0, _harness.expectFailsRule)(_ScalarLeafs.ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedOnEnum on Cat {\n        furColor { inHexdec }\n      }\n    ", [noScalarSubselection('furColor', 'FurColor', 3, 18)]);
  });
  (0, _mocha.it)('scalar selection not allowed with args', function () {
    (0, _harness.expectFailsRule)(_ScalarLeafs.ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedWithArgs on Dog {\n        doesKnowCommand(dogCommand: SIT) { sinceWhen }\n      }\n    ", [noScalarSubselection('doesKnowCommand', 'Boolean', 3, 42)]);
  });
  (0, _mocha.it)('Scalar selection not allowed with directives', function () {
    (0, _harness.expectFailsRule)(_ScalarLeafs.ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedWithDirectives on Dog {\n        name @include(if: true) { isAlsoHumanName }\n      }\n    ", [noScalarSubselection('name', 'String', 3, 33)]);
  });
  (0, _mocha.it)('Scalar selection not allowed with directives and args', function () {
    (0, _harness.expectFailsRule)(_ScalarLeafs.ScalarLeafs, "\n      fragment scalarSelectionsNotAllowedWithDirectivesAndArgs on Dog {\n        doesKnowCommand(dogCommand: SIT) @include(if: true) { sinceWhen }\n      }\n    ", [noScalarSubselection('doesKnowCommand', 'Boolean', 3, 61)]);
  });
});