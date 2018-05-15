/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { KnownDirectives, unknownDirectiveMessage, misplacedDirectiveMessage } from '../rules/KnownDirectives';

function unknownDirective(directiveName, line, column) {
  return {
    message: unknownDirectiveMessage(directiveName),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function misplacedDirective(directiveName, placement, line, column) {
  return {
    message: misplacedDirectiveMessage(directiveName, placement),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Known directives', function () {
  it('with no directives', function () {
    expectPassesRule(KnownDirectives, "\n      query Foo {\n        name\n        ...Frag\n      }\n\n      fragment Frag on Dog {\n        name\n      }\n    ");
  });
  it('with known directives', function () {
    expectPassesRule(KnownDirectives, "\n      {\n        dog @include(if: true) {\n          name\n        }\n        human @skip(if: false) {\n          name\n        }\n      }\n    ");
  });
  it('with unknown directive', function () {
    expectFailsRule(KnownDirectives, "\n      {\n        dog @unknown(directive: \"value\") {\n          name\n        }\n      }\n    ", [unknownDirective('unknown', 3, 13)]);
  });
  it('with many unknown directives', function () {
    expectFailsRule(KnownDirectives, "\n      {\n        dog @unknown(directive: \"value\") {\n          name\n        }\n        human @unknown(directive: \"value\") {\n          name\n          pets @unknown(directive: \"value\") {\n            name\n          }\n        }\n      }\n    ", [unknownDirective('unknown', 3, 13), unknownDirective('unknown', 6, 15), unknownDirective('unknown', 8, 16)]);
  });
  it('with well placed directives', function () {
    expectPassesRule(KnownDirectives, "\n      query Foo @onQuery {\n        name @include(if: true)\n        ...Frag @include(if: true)\n        skippedField @skip(if: true)\n        ...SkippedFrag @skip(if: true)\n      }\n\n      mutation Bar @onMutation {\n        someField\n      }\n    ");
  });
  it('with misplaced directives', function () {
    expectFailsRule(KnownDirectives, "\n      query Foo @include(if: true) {\n        name @onQuery\n        ...Frag @onQuery\n      }\n\n      mutation Bar @onQuery {\n        someField\n      }\n    ", [misplacedDirective('include', 'QUERY', 2, 17), misplacedDirective('onQuery', 'FIELD', 3, 14), misplacedDirective('onQuery', 'FRAGMENT_SPREAD', 4, 17), misplacedDirective('onQuery', 'MUTATION', 7, 20)]);
  });
  describe('within schema language', function () {
    it('with well placed directives', function () {
      expectPassesRule(KnownDirectives, "\n        type MyObj implements MyInterface @onObject {\n          myField(myArg: Int @onArgumentDefinition): String @onFieldDefinition\n        }\n\n        extend type MyObj @onObject\n\n        scalar MyScalar @onScalar\n\n        extend scalar MyScalar @onScalar\n\n        interface MyInterface @onInterface {\n          myField(myArg: Int @onArgumentDefinition): String @onFieldDefinition\n        }\n\n        extend interface MyInterface @onInterface\n\n        union MyUnion @onUnion = MyObj | Other\n\n        extend union MyUnion @onUnion\n\n        enum MyEnum @onEnum {\n          MY_VALUE @onEnumValue\n        }\n\n        extend enum MyEnum @onEnum\n\n        input MyInput @onInputObject {\n          myField: Int @onInputFieldDefinition\n        }\n\n        extend input MyInput @onInputObject\n\n        schema @onSchema {\n          query: MyQuery\n        }\n\n        extend schema @onSchema\n      ");
    });
    it('with misplaced directives', function () {
      expectFailsRule(KnownDirectives, "\n        type MyObj implements MyInterface @onInterface {\n          myField(myArg: Int @onInputFieldDefinition): String @onInputFieldDefinition\n        }\n\n        scalar MyScalar @onEnum\n\n        interface MyInterface @onObject {\n          myField(myArg: Int @onInputFieldDefinition): String @onInputFieldDefinition\n        }\n\n        union MyUnion @onEnumValue = MyObj | Other\n\n        enum MyEnum @onScalar {\n          MY_VALUE @onUnion\n        }\n\n        input MyInput @onEnum {\n          myField: Int @onArgumentDefinition\n        }\n\n        schema @onObject {\n          query: MyQuery\n        }\n\n        extend schema @onObject\n      ", [misplacedDirective('onInterface', 'OBJECT', 2, 43), misplacedDirective('onInputFieldDefinition', 'ARGUMENT_DEFINITION', 3, 30), misplacedDirective('onInputFieldDefinition', 'FIELD_DEFINITION', 3, 63), misplacedDirective('onEnum', 'SCALAR', 6, 25), misplacedDirective('onObject', 'INTERFACE', 8, 31), misplacedDirective('onInputFieldDefinition', 'ARGUMENT_DEFINITION', 9, 30), misplacedDirective('onInputFieldDefinition', 'FIELD_DEFINITION', 9, 63), misplacedDirective('onEnumValue', 'UNION', 12, 23), misplacedDirective('onScalar', 'ENUM', 14, 21), misplacedDirective('onUnion', 'ENUM_VALUE', 15, 20), misplacedDirective('onEnum', 'INPUT_OBJECT', 18, 23), misplacedDirective('onArgumentDefinition', 'INPUT_FIELD_DEFINITION', 19, 24), misplacedDirective('onObject', 'SCHEMA', 22, 16), misplacedDirective('onObject', 'SCHEMA', 26, 23)]);
    });
  });
});