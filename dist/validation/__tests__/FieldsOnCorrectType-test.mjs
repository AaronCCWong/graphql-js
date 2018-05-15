/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { FieldsOnCorrectType, undefinedFieldMessage } from '../rules/FieldsOnCorrectType';

function undefinedField(field, type, suggestedTypes, suggestedFields, line, column) {
  return {
    message: undefinedFieldMessage(field, type, suggestedTypes, suggestedFields),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Fields on correct type', function () {
  it('Object field selection', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment objectFieldSelection on Dog {\n        __typename\n        name\n      }\n    ");
  });
  it('Aliased object field selection', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment aliasedObjectFieldSelection on Dog {\n        tn : __typename\n        otherName : name\n      }\n    ");
  });
  it('Interface field selection', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment interfaceFieldSelection on Pet {\n        __typename\n        name\n      }\n    ");
  });
  it('Aliased interface field selection', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment interfaceFieldSelection on Pet {\n        otherName : name\n      }\n    ");
  });
  it('Lying alias selection', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment lyingAliasSelection on Dog {\n        name : nickname\n      }\n    ");
  });
  it('Ignores fields on unknown type', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment unknownSelection on UnknownType {\n        unknownField\n      }\n    ");
  });
  it('reports errors when type is known again', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment typeKnownAgain on Pet {\n        unknown_pet_field {\n          ... on Cat {\n            unknown_cat_field\n          }\n        }\n      }", [undefinedField('unknown_pet_field', 'Pet', [], [], 3, 9), undefinedField('unknown_cat_field', 'Cat', [], [], 5, 13)]);
  });
  it('Field not defined on fragment', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment fieldNotDefined on Dog {\n        meowVolume\n      }", [undefinedField('meowVolume', 'Dog', [], ['barkVolume'], 3, 9)]);
  });
  it('Ignores deeply unknown field', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment deepFieldNotDefined on Dog {\n        unknown_field {\n          deeper_unknown_field\n        }\n      }", [undefinedField('unknown_field', 'Dog', [], [], 3, 9)]);
  });
  it('Sub-field not defined', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment subFieldNotDefined on Human {\n        pets {\n          unknown_field\n        }\n      }", [undefinedField('unknown_field', 'Pet', [], [], 4, 11)]);
  });
  it('Field not defined on inline fragment', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment fieldNotDefined on Pet {\n        ... on Dog {\n          meowVolume\n        }\n      }", [undefinedField('meowVolume', 'Dog', [], ['barkVolume'], 4, 11)]);
  });
  it('Aliased field target not defined', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment aliasedFieldTargetNotDefined on Dog {\n        volume : mooVolume\n      }", [undefinedField('mooVolume', 'Dog', [], ['barkVolume'], 3, 9)]);
  });
  it('Aliased lying field target not defined', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment aliasedLyingFieldTargetNotDefined on Dog {\n        barkVolume : kawVolume\n      }", [undefinedField('kawVolume', 'Dog', [], ['barkVolume'], 3, 9)]);
  });
  it('Not defined on interface', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment notDefinedOnInterface on Pet {\n        tailLength\n      }", [undefinedField('tailLength', 'Pet', [], [], 3, 9)]);
  });
  it('Defined on implementors but not on interface', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment definedOnImplementorsButNotInterface on Pet {\n        nickname\n      }", [undefinedField('nickname', 'Pet', ['Dog', 'Cat'], ['name'], 3, 9)]);
  });
  it('Meta field selection on union', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment directFieldSelectionOnUnion on CatOrDog {\n        __typename\n      }");
  });
  it('Direct field selection on union', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment directFieldSelectionOnUnion on CatOrDog {\n        directField\n      }", [undefinedField('directField', 'CatOrDog', [], [], 3, 9)]);
  });
  it('Defined on implementors queried on union', function () {
    expectFailsRule(FieldsOnCorrectType, "\n      fragment definedOnImplementorsQueriedOnUnion on CatOrDog {\n        name\n      }", [undefinedField('name', 'CatOrDog', ['Being', 'Pet', 'Canine', 'Dog', 'Cat'], [], 3, 9)]);
  });
  it('valid field in inline fragment', function () {
    expectPassesRule(FieldsOnCorrectType, "\n      fragment objectFieldSelection on Pet {\n        ... on Dog {\n          name\n        }\n        ... {\n          name\n        }\n      }\n    ");
  });
  describe('Fields on correct type error message', function () {
    it('Works with no suggestions', function () {
      expect(undefinedFieldMessage('f', 'T', [], [])).to.equal('Cannot query field "f" on type "T".');
    });
    it('Works with no small numbers of type suggestions', function () {
      expect(undefinedFieldMessage('f', 'T', ['A', 'B'], [])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean to use an inline fragment on "A" or "B"?');
    });
    it('Works with no small numbers of field suggestions', function () {
      expect(undefinedFieldMessage('f', 'T', [], ['z', 'y'])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean "z" or "y"?');
    });
    it('Only shows one set of suggestions at a time, preferring types', function () {
      expect(undefinedFieldMessage('f', 'T', ['A', 'B'], ['z', 'y'])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean to use an inline fragment on "A" or "B"?');
    });
    it('Limits lots of type suggestions', function () {
      expect(undefinedFieldMessage('f', 'T', ['A', 'B', 'C', 'D', 'E', 'F'], [])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean to use an inline fragment on "A", "B", "C", "D", or "E"?');
    });
    it('Limits lots of field suggestions', function () {
      expect(undefinedFieldMessage('f', 'T', [], ['z', 'y', 'x', 'w', 'v', 'u'])).to.equal('Cannot query field "f" on type "T". ' + 'Did you mean "z", "y", "x", "w", or "v"?');
    });
  });
});