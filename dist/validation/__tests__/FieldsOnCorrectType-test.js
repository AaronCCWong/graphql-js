"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _harness = require("./harness");

var _FieldsOnCorrectType = require("../rules/FieldsOnCorrectType");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function undefinedField(field, type, suggestedTypes, suggestedFields, line, column) {
  return {
    message: (0, _FieldsOnCorrectType.undefinedFieldMessage)(field, type, suggestedTypes, suggestedFields),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Fields on correct type', function () {
  (0, _mocha.it)('Object field selection', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment objectFieldSelection on Dog {\n        __typename\n        name\n      }\n    ");
  });
  (0, _mocha.it)('Aliased object field selection', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment aliasedObjectFieldSelection on Dog {\n        tn : __typename\n        otherName : name\n      }\n    ");
  });
  (0, _mocha.it)('Interface field selection', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment interfaceFieldSelection on Pet {\n        __typename\n        name\n      }\n    ");
  });
  (0, _mocha.it)('Aliased interface field selection', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment interfaceFieldSelection on Pet {\n        otherName : name\n      }\n    ");
  });
  (0, _mocha.it)('Lying alias selection', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment lyingAliasSelection on Dog {\n        name : nickname\n      }\n    ");
  });
  (0, _mocha.it)('Ignores fields on unknown type', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment unknownSelection on UnknownType {\n        unknownField\n      }\n    ");
  });
  (0, _mocha.it)('reports errors when type is known again', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment typeKnownAgain on Pet {\n        unknown_pet_field {\n          ... on Cat {\n            unknown_cat_field\n          }\n        }\n      }", [undefinedField('unknown_pet_field', 'Pet', [], [], 3, 9), undefinedField('unknown_cat_field', 'Cat', [], [], 5, 13)]);
  });
  (0, _mocha.it)('Field not defined on fragment', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment fieldNotDefined on Dog {\n        meowVolume\n      }", [undefinedField('meowVolume', 'Dog', [], ['barkVolume'], 3, 9)]);
  });
  (0, _mocha.it)('Ignores deeply unknown field', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment deepFieldNotDefined on Dog {\n        unknown_field {\n          deeper_unknown_field\n        }\n      }", [undefinedField('unknown_field', 'Dog', [], [], 3, 9)]);
  });
  (0, _mocha.it)('Sub-field not defined', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment subFieldNotDefined on Human {\n        pets {\n          unknown_field\n        }\n      }", [undefinedField('unknown_field', 'Pet', [], [], 4, 11)]);
  });
  (0, _mocha.it)('Field not defined on inline fragment', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment fieldNotDefined on Pet {\n        ... on Dog {\n          meowVolume\n        }\n      }", [undefinedField('meowVolume', 'Dog', [], ['barkVolume'], 4, 11)]);
  });
  (0, _mocha.it)('Aliased field target not defined', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment aliasedFieldTargetNotDefined on Dog {\n        volume : mooVolume\n      }", [undefinedField('mooVolume', 'Dog', [], ['barkVolume'], 3, 9)]);
  });
  (0, _mocha.it)('Aliased lying field target not defined', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment aliasedLyingFieldTargetNotDefined on Dog {\n        barkVolume : kawVolume\n      }", [undefinedField('kawVolume', 'Dog', [], ['barkVolume'], 3, 9)]);
  });
  (0, _mocha.it)('Not defined on interface', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment notDefinedOnInterface on Pet {\n        tailLength\n      }", [undefinedField('tailLength', 'Pet', [], [], 3, 9)]);
  });
  (0, _mocha.it)('Defined on implementors but not on interface', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment definedOnImplementorsButNotInterface on Pet {\n        nickname\n      }", [undefinedField('nickname', 'Pet', ['Dog', 'Cat'], ['name'], 3, 9)]);
  });
  (0, _mocha.it)('Meta field selection on union', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment directFieldSelectionOnUnion on CatOrDog {\n        __typename\n      }");
  });
  (0, _mocha.it)('Direct field selection on union', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment directFieldSelectionOnUnion on CatOrDog {\n        directField\n      }", [undefinedField('directField', 'CatOrDog', [], [], 3, 9)]);
  });
  (0, _mocha.it)('Defined on implementors queried on union', function () {
    (0, _harness.expectFailsRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment definedOnImplementorsQueriedOnUnion on CatOrDog {\n        name\n      }", [undefinedField('name', 'CatOrDog', ['Being', 'Pet', 'Canine', 'Dog', 'Cat'], [], 3, 9)]);
  });
  (0, _mocha.it)('valid field in inline fragment', function () {
    (0, _harness.expectPassesRule)(_FieldsOnCorrectType.FieldsOnCorrectType, "\n      fragment objectFieldSelection on Pet {\n        ... on Dog {\n          name\n        }\n        ... {\n          name\n        }\n      }\n    ");
  });
  (0, _mocha.describe)('Fields on correct type error message', function () {
    (0, _mocha.it)('Works with no suggestions', function () {
      (0, _chai.expect)((0, _FieldsOnCorrectType.undefinedFieldMessage)('f', 'T', [], [])).to.equal('Cannot query field "f" on type "T".');
    });
    (0, _mocha.it)('Works with no small numbers of type suggestions', function () {
      (0, _chai.expect)((0, _FieldsOnCorrectType.undefinedFieldMessage)('f', 'T', ['A', 'B'], [])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean to use an inline fragment on "A" or "B"?');
    });
    (0, _mocha.it)('Works with no small numbers of field suggestions', function () {
      (0, _chai.expect)((0, _FieldsOnCorrectType.undefinedFieldMessage)('f', 'T', [], ['z', 'y'])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean "z" or "y"?');
    });
    (0, _mocha.it)('Only shows one set of suggestions at a time, preferring types', function () {
      (0, _chai.expect)((0, _FieldsOnCorrectType.undefinedFieldMessage)('f', 'T', ['A', 'B'], ['z', 'y'])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean to use an inline fragment on "A" or "B"?');
    });
    (0, _mocha.it)('Limits lots of type suggestions', function () {
      (0, _chai.expect)((0, _FieldsOnCorrectType.undefinedFieldMessage)('f', 'T', ['A', 'B', 'C', 'D', 'E', 'F'], [])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean to use an inline fragment on "A", "B", "C", "D", or "E"?');
    });
    (0, _mocha.it)('Limits lots of field suggestions', function () {
      (0, _chai.expect)((0, _FieldsOnCorrectType.undefinedFieldMessage)('f', 'T', [], ['z', 'y', 'x', 'w', 'v', 'u'])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean "z", "y", "x", "w", or "v"?');
    });
  });
});