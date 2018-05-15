/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { KnownTypeNames, unknownTypeMessage } from '../rules/KnownTypeNames';

function unknownType(typeName, suggestedTypes, line, column) {
  return {
    message: unknownTypeMessage(typeName, suggestedTypes),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Known type names', function () {
  it('known type names are valid', function () {
    expectPassesRule(KnownTypeNames, "\n      query Foo($var: String, $required: [String!]!) {\n        user(id: 4) {\n          pets { ... on Pet { name }, ...PetFields, ... { name } }\n        }\n      }\n      fragment PetFields on Pet {\n        name\n      }\n    ");
  });
  it('unknown type names are invalid', function () {
    expectFailsRule(KnownTypeNames, "\n      query Foo($var: JumbledUpLetters) {\n        user(id: 4) {\n          name\n          pets { ... on Badger { name }, ...PetFields }\n        }\n      }\n      fragment PetFields on Peettt {\n        name\n      }\n    ", [unknownType('JumbledUpLetters', [], 2, 23), unknownType('Badger', [], 5, 25), unknownType('Peettt', ['Pet'], 8, 29)]);
  });
  it('ignores type definitions', function () {
    expectFailsRule(KnownTypeNames, "\n      type NotInTheSchema {\n        field: FooBar\n      }\n      interface FooBar {\n        field: NotInTheSchema\n      }\n      union U = A | B\n      input Blob {\n        field: UnknownType\n      }\n      query Foo($var: NotInTheSchema) {\n        user(id: $var) {\n          id\n        }\n      }\n    ", [unknownType('NotInTheSchema', [], 12, 23)]);
  });
});