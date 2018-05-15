"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _KnownTypeNames = require("../rules/KnownTypeNames");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function unknownType(typeName, suggestedTypes, line, column) {
  return {
    message: (0, _KnownTypeNames.unknownTypeMessage)(typeName, suggestedTypes),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Known type names', function () {
  (0, _mocha.it)('known type names are valid', function () {
    (0, _harness.expectPassesRule)(_KnownTypeNames.KnownTypeNames, "\n      query Foo($var: String, $required: [String!]!) {\n        user(id: 4) {\n          pets { ... on Pet { name }, ...PetFields, ... { name } }\n        }\n      }\n      fragment PetFields on Pet {\n        name\n      }\n    ");
  });
  (0, _mocha.it)('unknown type names are invalid', function () {
    (0, _harness.expectFailsRule)(_KnownTypeNames.KnownTypeNames, "\n      query Foo($var: JumbledUpLetters) {\n        user(id: 4) {\n          name\n          pets { ... on Badger { name }, ...PetFields }\n        }\n      }\n      fragment PetFields on Peettt {\n        name\n      }\n    ", [unknownType('JumbledUpLetters', [], 2, 23), unknownType('Badger', [], 5, 25), unknownType('Peettt', ['Pet'], 8, 29)]);
  });
  (0, _mocha.it)('ignores type definitions', function () {
    (0, _harness.expectFailsRule)(_KnownTypeNames.KnownTypeNames, "\n      type NotInTheSchema {\n        field: FooBar\n      }\n      interface FooBar {\n        field: NotInTheSchema\n      }\n      union U = A | B\n      input Blob {\n        field: UnknownType\n      }\n      query Foo($var: NotInTheSchema) {\n        user(id: $var) {\n          id\n        }\n      }\n    ", [unknownType('NotInTheSchema', [], 12, 23)]);
  });
});