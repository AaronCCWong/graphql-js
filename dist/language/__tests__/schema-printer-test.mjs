var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: QueryType\n        mutation: MutationType\n      }\n\n      \"\"\"\n      This is a description\n      of the `Foo` type.\n      \"\"\"\n      type Foo implements Bar & Baz {\n        one: Type\n        \"\"\"\n        This is a description of the `two` field.\n        \"\"\"\n        two(\n          \"\"\"\n          This is a description of the `argument` argument.\n          \"\"\"\n          argument: InputType!\n        ): Type\n        three(argument: InputType, other: String): Int\n        four(argument: String = \"string\"): String\n        five(argument: [String] = [\"string\", \"string\"]): String\n        six(argument: InputType = {key: \"value\"}): Type\n        seven(argument: Int = null): Type\n      }\n\n      type AnnotatedObject @onObject(arg: \"value\") {\n        annotatedField(arg: Type = \"default\" @onArg): Type @onField\n      }\n\n      type UndefinedType\n\n      extend type Foo {\n        seven(argument: [String]): Type\n      }\n\n      extend type Foo @onType\n\n      interface Bar {\n        one: Type\n        four(argument: String = \"string\"): String\n      }\n\n      interface AnnotatedInterface @onInterface {\n        annotatedField(arg: Type @onArg): Type @onField\n      }\n\n      interface UndefinedInterface\n\n      extend interface Bar {\n        two(argument: InputType!): Type\n      }\n\n      extend interface Bar @onInterface\n\n      union Feed = Story | Article | Advert\n\n      union AnnotatedUnion @onUnion = A | B\n\n      union AnnotatedUnionTwo @onUnion = A | B\n\n      union UndefinedUnion\n\n      extend union Feed = Photo | Video\n\n      extend union Feed @onUnion\n\n      scalar CustomScalar\n\n      scalar AnnotatedScalar @onScalar\n\n      extend scalar CustomScalar @onScalar\n\n      enum Site {\n        DESKTOP\n        MOBILE\n      }\n\n      enum AnnotatedEnum @onEnum {\n        ANNOTATED_VALUE @onEnumValue\n        OTHER_VALUE\n      }\n\n      enum UndefinedEnum\n\n      extend enum Site {\n        VR\n      }\n\n      extend enum Site @onEnum\n\n      input InputType {\n        key: String!\n        answer: Int = 42\n      }\n\n      input AnnotatedInput @onInputObject {\n        annotatedField: Type @onField\n      }\n\n      input UndefinedInput\n\n      extend input InputType {\n        other: Float = 1.23e4\n      }\n\n      extend input InputType @onInputObject\n\n      directive @skip(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      directive @include(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      directive @include2(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      extend schema @onSchema\n\n      extend schema @onSchema {\n        subscription: SubscriptionType\n      }\n    "], ["\n      schema {\n        query: QueryType\n        mutation: MutationType\n      }\n\n      \"\"\"\n      This is a description\n      of the \\`Foo\\` type.\n      \"\"\"\n      type Foo implements Bar & Baz {\n        one: Type\n        \"\"\"\n        This is a description of the \\`two\\` field.\n        \"\"\"\n        two(\n          \"\"\"\n          This is a description of the \\`argument\\` argument.\n          \"\"\"\n          argument: InputType!\n        ): Type\n        three(argument: InputType, other: String): Int\n        four(argument: String = \"string\"): String\n        five(argument: [String] = [\"string\", \"string\"]): String\n        six(argument: InputType = {key: \"value\"}): Type\n        seven(argument: Int = null): Type\n      }\n\n      type AnnotatedObject @onObject(arg: \"value\") {\n        annotatedField(arg: Type = \"default\" @onArg): Type @onField\n      }\n\n      type UndefinedType\n\n      extend type Foo {\n        seven(argument: [String]): Type\n      }\n\n      extend type Foo @onType\n\n      interface Bar {\n        one: Type\n        four(argument: String = \"string\"): String\n      }\n\n      interface AnnotatedInterface @onInterface {\n        annotatedField(arg: Type @onArg): Type @onField\n      }\n\n      interface UndefinedInterface\n\n      extend interface Bar {\n        two(argument: InputType!): Type\n      }\n\n      extend interface Bar @onInterface\n\n      union Feed = Story | Article | Advert\n\n      union AnnotatedUnion @onUnion = A | B\n\n      union AnnotatedUnionTwo @onUnion = A | B\n\n      union UndefinedUnion\n\n      extend union Feed = Photo | Video\n\n      extend union Feed @onUnion\n\n      scalar CustomScalar\n\n      scalar AnnotatedScalar @onScalar\n\n      extend scalar CustomScalar @onScalar\n\n      enum Site {\n        DESKTOP\n        MOBILE\n      }\n\n      enum AnnotatedEnum @onEnum {\n        ANNOTATED_VALUE @onEnumValue\n        OTHER_VALUE\n      }\n\n      enum UndefinedEnum\n\n      extend enum Site {\n        VR\n      }\n\n      extend enum Site @onEnum\n\n      input InputType {\n        key: String!\n        answer: Int = 42\n      }\n\n      input AnnotatedInput @onInputObject {\n        annotatedField: Type @onField\n      }\n\n      input UndefinedInput\n\n      extend input InputType {\n        other: Float = 1.23e4\n      }\n\n      extend input InputType @onInputObject\n\n      directive @skip(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      directive @include(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      directive @include2(if: Boolean!) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      extend schema @onSchema\n\n      extend schema @onSchema {\n        subscription: SubscriptionType\n      }\n    "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from '../parser';
import { print } from '../printer';
import dedent from '../../jsutils/dedent';
describe('Printer: SDL document', function () {
  it('prints minimal ast', function () {
    var ast = {
      kind: 'ScalarTypeDefinition',
      name: {
        kind: 'Name',
        value: 'foo'
      }
    };
    expect(print(ast)).to.equal('scalar foo');
  });
  it('produces helpful error messages', function () {
    var badAst1 = {
      random: 'Data'
    };
    expect(function () {
      return print(badAst1);
    }).to.throw('Invalid AST Node: {"random":"Data"}');
  });
  var kitchenSink = readFileSync(join(__dirname, '/schema-kitchen-sink.graphql'), {
    encoding: 'utf8'
  });
  it('does not alter ast', function () {
    var ast = parse(kitchenSink);
    var astBefore = JSON.stringify(ast);
    print(ast);
    expect(JSON.stringify(ast)).to.equal(astBefore);
  });
  it('prints kitchen sink', function () {
    var ast = parse(kitchenSink);
    var printed = print(ast);
    expect(printed).to.equal(dedent(_templateObject));
  });
});