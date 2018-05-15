var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        str: String\n        int: Int\n        float: Float\n        id: ID\n        bool: Boolean\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @foo(arg: Int) on FIELD\n\n      type Query {\n        str: String\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      \"\"\"This is a directive\"\"\"\n      directive @foo(\n        \"\"\"It has an argument\"\"\"\n        arg: Int\n      ) on FIELD\n\n      \"\"\"With an enum\"\"\"\n      enum Color {\n        RED\n\n        \"\"\"Not a creative color\"\"\"\n        GREEN\n        BLUE\n      }\n\n      \"\"\"What a great type\"\"\"\n      type Query {\n        \"\"\"And a field to boot\"\"\"\n        str: String\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      # This is a directive\n      directive @foo(\n        # It has an argument\n        arg: Int\n      ) on FIELD\n\n      # With an enum\n      enum Color {\n        RED\n\n        # Not a creative color\n        GREEN\n        BLUE\n      }\n\n      # What a great type\n      type Query {\n        # And a field to boot\n        str: String\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        str: String\n      }\n    "]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @skip on FIELD\n      directive @include on FIELD\n      directive @deprecated on FIELD_DEFINITION\n\n      type Query {\n        str: String\n      }\n    "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @foo(arg: Int) on FIELD\n\n      type Query {\n        str: String\n      }\n    "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        nonNullStr: String!\n        listOfStrs: [String]\n        listOfNonNullStrs: [String!]\n        nonNullListOfStrs: [String]!\n        nonNullListOfNonNullStrs: [String!]!\n      }\n    "]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        str: String\n        recurse: Query\n      }\n    "]),
    _templateObject10 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: TypeOne\n      }\n\n      type TypeOne {\n        str: String\n        typeTwo: TypeTwo\n      }\n\n      type TypeTwo {\n        str: String\n        typeOne: TypeOne\n      }\n    "]),
    _templateObject11 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        str(int: Int): String\n        floatToStr(float: Float): String\n        idToStr(id: ID): String\n        booleanToStr(bool: Boolean): String\n        strToStr(bool: String): String\n      }\n    "]),
    _templateObject12 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        str(int: Int, bool: Boolean): String\n      }\n    "]),
    _templateObject13 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query implements WorldInterface {\n        str: String\n      }\n\n      interface WorldInterface {\n        str: String\n      }\n    "]),
    _templateObject14 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      enum Hello {\n        WORLD\n      }\n\n      type Query {\n        hello: Hello\n      }\n    "]),
    _templateObject15 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      enum Hello {\n        WORLD\n      }\n\n      type Query {\n        str(hello: Hello): String\n      }\n    "]),
    _templateObject16 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      enum Hello {\n        WO\n        RLD\n      }\n\n      type Query {\n        hello: Hello\n      }\n    "]),
    _templateObject17 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      union Hello = World\n\n      type Query {\n        hello: Hello\n      }\n\n      type World {\n        str: String\n      }\n    "]),
    _templateObject18 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      union Hello = WorldOne | WorldTwo\n\n      type Query {\n        hello: Hello\n      }\n\n      type WorldOne {\n        str: String\n      }\n\n      type WorldTwo {\n        str: String\n      }\n    "]),
    _templateObject19 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        fruits: [Fruit]\n      }\n\n      union Fruit = Apple | Banana\n\n      type Apple {\n        color: String\n      }\n\n      type Banana {\n        length: Int\n      }\n    "]),
    _templateObject20 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        characters: [Character]\n      }\n\n      interface Character {\n        name: String!\n      }\n\n      type Human implements Character {\n        name: String!\n        totalCredits: Int\n      }\n\n      type Droid implements Character {\n        name: String!\n        primaryFunction: String\n      }\n    "]),
    _templateObject21 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      scalar CustomScalar\n\n      type Query {\n        customScalar: CustomScalar\n      }\n    "]),
    _templateObject22 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      input Input {\n        int: Int\n      }\n\n      type Query {\n        field(in: Input): String\n      }\n    "]),
    _templateObject23 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        str(int: Int = 2): String\n      }\n    "]),
    _templateObject24 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      scalar CustomScalar\n\n      type Query {\n        str(int: CustomScalar = 2): String\n      }\n    "]),
    _templateObject25 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: HelloScalars\n        mutation: Mutation\n      }\n\n      type HelloScalars {\n        str: String\n        int: Int\n        bool: Boolean\n      }\n\n      type Mutation {\n        addHelloScalars(str: String, int: Int, bool: Boolean): HelloScalars\n      }\n    "]),
    _templateObject26 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: HelloScalars\n        subscription: Subscription\n      }\n\n      type HelloScalars {\n        str: String\n        int: Int\n        bool: Boolean\n      }\n\n      type Subscription {\n        sbscribeHelloScalars(str: String, int: Int, bool: Boolean): HelloScalars\n      }\n    "]),
    _templateObject27 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Concrete implements Iface {\n        key: String\n      }\n\n      interface Iface {\n        key: String\n      }\n\n      type Query {\n        iface: Iface\n      }\n    "]),
    _templateObject28 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Concrete {\n        key: String\n      }\n\n      type Query {\n        union: Union\n      }\n\n      union Union = Concrete\n    "]),
    _templateObject29 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      enum MyEnum {\n        VALUE\n        OLD_VALUE @deprecated\n        OTHER_VALUE @deprecated(reason: \"Terrible reasons\")\n      }\n\n      type Query {\n        field1: String @deprecated\n        field2: Int @deprecated(reason: \"Because I said so\")\n        enum: MyEnum\n      }\n    "]),
    _templateObject30 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Query\n      }\n\n      type Query {\n        testField(testArg: TestInput): TestUnion\n      }\n\n      input TestInput {\n        testInputField: TestEnum\n      }\n\n      enum TestEnum {\n        TEST_VALUE\n      }\n\n      union TestUnion = TestType\n\n      interface TestInterface {\n        interfaceField: String\n      }\n\n      type TestType implements TestInterface {\n        interfaceField: String\n      }\n\n      scalar TestScalar\n\n      directive @test(arg: TestScalar) on FIELD\n    "]),
    _templateObject31 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: SomeQuery\n        mutation: SomeMutation\n        subscription: SomeSubscription\n      }\n      type SomeQuery { str: String }\n      type SomeMutation { str: String }\n      type SomeSubscription { str: String }\n    "]),
    _templateObject32 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query { str: String }\n      type Mutation { str: String }\n      type Subscription { str: String }\n    "]),
    _templateObject33 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      # Invalid schema, because it is missing query root type\n      type Mutation {\n        str: String\n      }\n    "]),
    _templateObject34 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        __badName: String\n      }\n    "]),
    _templateObject35 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Hello\n      }\n\n      schema {\n        query: Hello\n      }\n\n      type Hello {\n        bar: Bar\n      }\n    "]),
    _templateObject36 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Hello\n        query: Yellow\n      }\n\n      type Hello {\n        bar: Bar\n      }\n\n      type Yellow {\n        isColor: Boolean\n      }\n    "]),
    _templateObject37 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Hello\n        mutation: Hello\n        mutation: Yellow\n      }\n\n      type Hello {\n        bar: Bar\n      }\n\n      type Yellow {\n        isColor: Boolean\n      }\n    "]),
    _templateObject38 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Hello\n        subscription: Hello\n        subscription: Yellow\n      }\n\n      type Hello {\n        bar: Bar\n      }\n\n      type Yellow {\n        isColor: Boolean\n      }\n    "]),
    _templateObject39 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Hello\n      }\n\n      type Hello {\n        bar: Bar\n      }\n    "]),
    _templateObject40 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query implements Bar {\n        field: String\n      }\n    "]),
    _templateObject41 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      union TestUnion = Bar\n      type Query { testUnion: TestUnion }\n    "]),
    _templateObject42 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Wat\n      }\n\n      type Hello {\n        str: String\n      }\n    "]),
    _templateObject43 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Hello\n        mutation: Wat\n      }\n\n      type Hello {\n        str: String\n      }\n    "]),
    _templateObject44 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Hello\n        mutation: Wat\n        subscription: Awesome\n      }\n\n      type Hello {\n        str: String\n      }\n\n      type Wat {\n        str: String\n      }\n    "]),
    _templateObject45 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Foo\n      }\n\n      query Foo { field }\n    "]),
    _templateObject46 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Foo\n      }\n\n      fragment Foo on Type { field }\n    "]),
    _templateObject47 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: Repeated\n      }\n\n      type Repeated {\n        id: Int\n      }\n\n      type Repeated {\n        id: String\n      }\n    "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parse, print } from '../../language';
import { printSchema } from '../schemaPrinter';
import { buildASTSchema, buildSchema } from '../buildASTSchema';
import dedent from '../../jsutils/dedent';
import { Kind } from '../../language/kinds';
import { graphqlSync, validateSchema, GraphQLSkipDirective, GraphQLIncludeDirective, GraphQLDeprecatedDirective } from '../../';
/**
 * This function does a full cycle of going from a
 * string with the contents of the DSL, parsed
 * in a schema AST, materializing that schema AST
 * into an in-memory GraphQLSchema, and then finally
 * printing that GraphQL into the DSL
 */

function cycleOutput(body, options) {
  var ast = parse(body);
  var schema = buildASTSchema(ast, options);
  return printSchema(schema, options);
}

describe('Schema Builder', function () {
  it('can use built schema for limited execution', function () {
    var schema = buildASTSchema(parse("\n        type Query {\n          str: String\n        }\n      "));
    var result = graphqlSync(schema, '{ str }', {
      str: 123
    });
    expect(result.data).to.deep.equal({
      str: '123'
    });
  });
  it('can build a schema directly from the source', function () {
    var schema = buildSchema("\n      type Query {\n        add(x: Int, y: Int): Int\n      }\n    ");
    var root = {
      add: function add(_ref) {
        var x = _ref.x,
            y = _ref.y;
        return x + y;
      }
    };
    expect(graphqlSync(schema, '{ add(x: 34, y: 55) }', root)).to.deep.equal({
      data: {
        add: 89
      }
    });
  });
  it('Simple type', function () {
    var body = dedent(_templateObject);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('With directives', function () {
    var body = dedent(_templateObject2);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Supports descriptions', function () {
    var body = dedent(_templateObject3);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Supports option for comment descriptions', function () {
    var body = dedent(_templateObject4);
    var output = cycleOutput(body, {
      commentDescriptions: true
    });
    expect(output).to.equal(body);
  });
  it('Maintains @skip & @include', function () {
    var body = dedent(_templateObject5);
    var schema = buildASTSchema(parse(body));
    expect(schema.getDirectives().length).to.equal(3);
    expect(schema.getDirective('skip')).to.equal(GraphQLSkipDirective);
    expect(schema.getDirective('include')).to.equal(GraphQLIncludeDirective);
    expect(schema.getDirective('deprecated')).to.equal(GraphQLDeprecatedDirective);
  });
  it('Overriding directives excludes specified', function () {
    var body = dedent(_templateObject6);
    var schema = buildASTSchema(parse(body));
    expect(schema.getDirectives().length).to.equal(3);
    expect(schema.getDirective('skip')).to.not.equal(GraphQLSkipDirective);
    expect(schema.getDirective('include')).to.not.equal(GraphQLIncludeDirective);
    expect(schema.getDirective('deprecated')).to.not.equal(GraphQLDeprecatedDirective);
  });
  it('Adding directives maintains @skip & @include', function () {
    var body = dedent(_templateObject7);
    var schema = buildASTSchema(parse(body));
    expect(schema.getDirectives().length).to.equal(4);
    expect(schema.getDirective('skip')).to.not.equal(undefined);
    expect(schema.getDirective('include')).to.not.equal(undefined);
    expect(schema.getDirective('deprecated')).to.not.equal(undefined);
  });
  it('Type modifiers', function () {
    var body = dedent(_templateObject8);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Recursive type', function () {
    var body = dedent(_templateObject9);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Two types circular', function () {
    var body = dedent(_templateObject10);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Single argument field', function () {
    var body = dedent(_templateObject11);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Simple type with multiple arguments', function () {
    var body = dedent(_templateObject12);
    var output = cycleOutput(body, 'Hello');
    expect(output).to.equal(body);
  });
  it('Simple type with interface', function () {
    var body = dedent(_templateObject13);
    var output = cycleOutput(body, 'Hello');
    expect(output).to.equal(body);
  });
  it('Simple output enum', function () {
    var body = dedent(_templateObject14);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Simple input enum', function () {
    var body = dedent(_templateObject15);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Multiple value enum', function () {
    var body = dedent(_templateObject16);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Simple Union', function () {
    var body = dedent(_templateObject17);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Multiple Union', function () {
    var body = dedent(_templateObject18);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Specifying Union type using __typename', function () {
    var schema = buildSchema(dedent(_templateObject19));
    var query = "\n      {\n        fruits {\n          ... on Apple {\n            color\n          }\n          ... on Banana {\n            length\n          }\n        }\n      }\n    ";
    var root = {
      fruits: [{
        color: 'green',
        __typename: 'Apple'
      }, {
        length: 5,
        __typename: 'Banana'
      }]
    };
    expect(graphqlSync(schema, query, root)).to.deep.equal({
      data: {
        fruits: [{
          color: 'green'
        }, {
          length: 5
        }]
      }
    });
  });
  it('Specifying Interface type using __typename', function () {
    var schema = buildSchema(dedent(_templateObject20));
    var query = "\n      {\n        characters {\n          name\n          ... on Human {\n            totalCredits\n          }\n          ... on Droid {\n            primaryFunction\n          }\n        }\n      }\n    ";
    var root = {
      characters: [{
        name: 'Han Solo',
        totalCredits: 10,
        __typename: 'Human'
      }, {
        name: 'R2-D2',
        primaryFunction: 'Astromech',
        __typename: 'Droid'
      }]
    };
    expect(graphqlSync(schema, query, root)).to.deep.equal({
      data: {
        characters: [{
          name: 'Han Solo',
          totalCredits: 10
        }, {
          name: 'R2-D2',
          primaryFunction: 'Astromech'
        }]
      }
    });
  });
  it('Custom Scalar', function () {
    var body = dedent(_templateObject21);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Input Object', function () {
    var body = dedent(_templateObject22);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Simple argument field with default', function () {
    var body = dedent(_templateObject23);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Custom scalar argument field with default', function () {
    var body = dedent(_templateObject24);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Simple type with mutation', function () {
    var body = dedent(_templateObject25);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Simple type with subscription', function () {
    var body = dedent(_templateObject26);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Unreferenced type implementing referenced interface', function () {
    var body = dedent(_templateObject27);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Unreferenced type implementing referenced union', function () {
    var body = dedent(_templateObject28);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
  });
  it('Supports @deprecated', function () {
    var body = dedent(_templateObject29);
    var output = cycleOutput(body);
    expect(output).to.equal(body);
    var ast = parse(body);
    var schema = buildASTSchema(ast);
    var myEnum = schema.getType('MyEnum');
    var value = myEnum.getValue('VALUE');
    expect(value.isDeprecated).to.equal(false);
    var oldValue = myEnum.getValue('OLD_VALUE');
    expect(oldValue.isDeprecated).to.equal(true);
    expect(oldValue.deprecationReason).to.equal('No longer supported');
    var otherValue = myEnum.getValue('OTHER_VALUE');
    expect(otherValue.isDeprecated).to.equal(true);
    expect(otherValue.deprecationReason).to.equal('Terrible reasons');
    var rootFields = schema.getType('Query').getFields();
    expect(rootFields.field1.isDeprecated).to.equal(true);
    expect(rootFields.field1.deprecationReason).to.equal('No longer supported');
    expect(rootFields.field2.isDeprecated).to.equal(true);
    expect(rootFields.field2.deprecationReason).to.equal('Because I said so');
  });
  it('Correctly assign AST nodes', function () {
    var schemaAST = parse(dedent(_templateObject30));
    var schema = buildASTSchema(schemaAST);
    var query = schema.getType('Query');
    var testInput = schema.getType('TestInput');
    var testEnum = schema.getType('TestEnum');
    var testUnion = schema.getType('TestUnion');
    var testInterface = schema.getType('TestInterface');
    var testType = schema.getType('TestType');
    var testScalar = schema.getType('TestScalar');
    var testDirective = schema.getDirective('test');
    var restoredSchemaAST = {
      kind: Kind.DOCUMENT,
      definitions: [schema.astNode, query.astNode, testInput.astNode, testEnum.astNode, testUnion.astNode, testInterface.astNode, testType.astNode, testScalar.astNode, testDirective.astNode]
    };
    expect(print(restoredSchemaAST)).to.be.equal(print(schemaAST));
    var testField = query.getFields().testField;
    expect(print(testField.astNode)).to.equal('testField(testArg: TestInput): TestUnion');
    expect(print(testField.args[0].astNode)).to.equal('testArg: TestInput');
    expect(print(testInput.getFields().testInputField.astNode)).to.equal('testInputField: TestEnum');
    expect(print(testEnum.getValue('TEST_VALUE').astNode)).to.equal('TEST_VALUE');
    expect(print(testInterface.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    expect(print(testType.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    expect(print(testDirective.args[0].astNode)).to.equal('arg: TestScalar');
  });
  it('Root operation types with custom names', function () {
    var schema = buildSchema(dedent(_templateObject31));
    expect(schema.getQueryType().name).to.equal('SomeQuery');
    expect(schema.getMutationType().name).to.equal('SomeMutation');
    expect(schema.getSubscriptionType().name).to.equal('SomeSubscription');
  });
  it('Default root operation type names', function () {
    var schema = buildSchema(dedent(_templateObject32));
    expect(schema.getQueryType().name).to.equal('Query');
    expect(schema.getMutationType().name).to.equal('Mutation');
    expect(schema.getSubscriptionType().name).to.equal('Subscription');
  });
  it('can build invalid schema', function () {
    var schema = buildSchema(dedent(_templateObject33));
    var errors = validateSchema(schema);
    expect(errors.length).to.be.above(0);
  });
  it('Accepts legacy names', function () {
    var doc = parse(dedent(_templateObject34));
    var schema = buildASTSchema(doc, {
      allowedLegacyNames: ['__badName']
    });
    var errors = validateSchema(schema);
    expect(errors.length).to.equal(0);
  });
});
describe('Failures', function () {
  it('Allows only a single schema definition', function () {
    var body = dedent(_templateObject35);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Must provide only one schema definition.');
  });
  it('Allows only a single query type', function () {
    var body = dedent(_templateObject36);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Must provide only one query type in schema.');
  });
  it('Allows only a single mutation type', function () {
    var body = dedent(_templateObject37);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Must provide only one mutation type in schema.');
  });
  it('Allows only a single subscription type', function () {
    var body = dedent(_templateObject38);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Must provide only one subscription type in schema.');
  });
  it('Unknown type referenced', function () {
    var body = dedent(_templateObject39);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Type "Bar" not found in document.');
  });
  it('Unknown type in interface list', function () {
    var body = dedent(_templateObject40);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Type "Bar" not found in document.');
  });
  it('Unknown type in union list', function () {
    var body = dedent(_templateObject41);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Type "Bar" not found in document.');
  });
  it('Unknown query type', function () {
    var body = dedent(_templateObject42);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Specified query type "Wat" not found in document.');
  });
  it('Unknown mutation type', function () {
    var body = dedent(_templateObject43);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Specified mutation type "Wat" not found in document.');
  });
  it('Unknown subscription type', function () {
    var body = dedent(_templateObject44);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Specified subscription type "Awesome" not found in document.');
  });
  it('Does not consider operation names', function () {
    var body = dedent(_templateObject45);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Specified query type "Foo" not found in document.');
  });
  it('Does not consider fragment names', function () {
    var body = dedent(_templateObject46);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Specified query type "Foo" not found in document.');
  });
  it('Forbids duplicate type definitions', function () {
    var body = dedent(_templateObject47);
    var doc = parse(body);
    expect(function () {
      return buildASTSchema(doc);
    }).to.throw('Type "Repeated" was defined more than once.');
  });
});