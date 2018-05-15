"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _language = require("../../language");

var _schemaPrinter = require("../schemaPrinter");

var _buildASTSchema = require("../buildASTSchema");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _kinds = require("../../language/kinds");

var _ = require("../../");

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * This function does a full cycle of going from a
 * string with the contents of the DSL, parsed
 * in a schema AST, materializing that schema AST
 * into an in-memory GraphQLSchema, and then finally
 * printing that GraphQL into the DSL
 */
function cycleOutput(body, options) {
  var ast = (0, _language.parse)(body);
  var schema = (0, _buildASTSchema.buildASTSchema)(ast, options);
  return (0, _schemaPrinter.printSchema)(schema, options);
}

(0, _mocha.describe)('Schema Builder', function () {
  (0, _mocha.it)('can use built schema for limited execution', function () {
    var schema = (0, _buildASTSchema.buildASTSchema)((0, _language.parse)("\n        type Query {\n          str: String\n        }\n      "));
    var result = (0, _.graphqlSync)(schema, '{ str }', {
      str: 123
    });
    (0, _chai.expect)(result.data).to.deep.equal({
      str: '123'
    });
  });
  (0, _mocha.it)('can build a schema directly from the source', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        add(x: Int, y: Int): Int\n      }\n    ");
    var root = {
      add: function add(_ref) {
        var x = _ref.x,
            y = _ref.y;
        return x + y;
      }
    };
    (0, _chai.expect)((0, _.graphqlSync)(schema, '{ add(x: 34, y: 55) }', root)).to.deep.equal({
      data: {
        add: 89
      }
    });
  });
  (0, _mocha.it)('Simple type', function () {
    var body = (0, _dedent.default)(_templateObject);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('With directives', function () {
    var body = (0, _dedent.default)(_templateObject2);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Supports descriptions', function () {
    var body = (0, _dedent.default)(_templateObject3);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Supports option for comment descriptions', function () {
    var body = (0, _dedent.default)(_templateObject4);
    var output = cycleOutput(body, {
      commentDescriptions: true
    });
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Maintains @skip & @include', function () {
    var body = (0, _dedent.default)(_templateObject5);
    var schema = (0, _buildASTSchema.buildASTSchema)((0, _language.parse)(body));
    (0, _chai.expect)(schema.getDirectives().length).to.equal(3);
    (0, _chai.expect)(schema.getDirective('skip')).to.equal(_.GraphQLSkipDirective);
    (0, _chai.expect)(schema.getDirective('include')).to.equal(_.GraphQLIncludeDirective);
    (0, _chai.expect)(schema.getDirective('deprecated')).to.equal(_.GraphQLDeprecatedDirective);
  });
  (0, _mocha.it)('Overriding directives excludes specified', function () {
    var body = (0, _dedent.default)(_templateObject6);
    var schema = (0, _buildASTSchema.buildASTSchema)((0, _language.parse)(body));
    (0, _chai.expect)(schema.getDirectives().length).to.equal(3);
    (0, _chai.expect)(schema.getDirective('skip')).to.not.equal(_.GraphQLSkipDirective);
    (0, _chai.expect)(schema.getDirective('include')).to.not.equal(_.GraphQLIncludeDirective);
    (0, _chai.expect)(schema.getDirective('deprecated')).to.not.equal(_.GraphQLDeprecatedDirective);
  });
  (0, _mocha.it)('Adding directives maintains @skip & @include', function () {
    var body = (0, _dedent.default)(_templateObject7);
    var schema = (0, _buildASTSchema.buildASTSchema)((0, _language.parse)(body));
    (0, _chai.expect)(schema.getDirectives().length).to.equal(4);
    (0, _chai.expect)(schema.getDirective('skip')).to.not.equal(undefined);
    (0, _chai.expect)(schema.getDirective('include')).to.not.equal(undefined);
    (0, _chai.expect)(schema.getDirective('deprecated')).to.not.equal(undefined);
  });
  (0, _mocha.it)('Type modifiers', function () {
    var body = (0, _dedent.default)(_templateObject8);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Recursive type', function () {
    var body = (0, _dedent.default)(_templateObject9);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Two types circular', function () {
    var body = (0, _dedent.default)(_templateObject10);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Single argument field', function () {
    var body = (0, _dedent.default)(_templateObject11);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple type with multiple arguments', function () {
    var body = (0, _dedent.default)(_templateObject12);
    var output = cycleOutput(body, 'Hello');
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple type with interface', function () {
    var body = (0, _dedent.default)(_templateObject13);
    var output = cycleOutput(body, 'Hello');
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple output enum', function () {
    var body = (0, _dedent.default)(_templateObject14);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple input enum', function () {
    var body = (0, _dedent.default)(_templateObject15);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Multiple value enum', function () {
    var body = (0, _dedent.default)(_templateObject16);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple Union', function () {
    var body = (0, _dedent.default)(_templateObject17);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Multiple Union', function () {
    var body = (0, _dedent.default)(_templateObject18);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Specifying Union type using __typename', function () {
    var schema = (0, _buildASTSchema.buildSchema)((0, _dedent.default)(_templateObject19));
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
    (0, _chai.expect)((0, _.graphqlSync)(schema, query, root)).to.deep.equal({
      data: {
        fruits: [{
          color: 'green'
        }, {
          length: 5
        }]
      }
    });
  });
  (0, _mocha.it)('Specifying Interface type using __typename', function () {
    var schema = (0, _buildASTSchema.buildSchema)((0, _dedent.default)(_templateObject20));
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
    (0, _chai.expect)((0, _.graphqlSync)(schema, query, root)).to.deep.equal({
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
  (0, _mocha.it)('Custom Scalar', function () {
    var body = (0, _dedent.default)(_templateObject21);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Input Object', function () {
    var body = (0, _dedent.default)(_templateObject22);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple argument field with default', function () {
    var body = (0, _dedent.default)(_templateObject23);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Custom scalar argument field with default', function () {
    var body = (0, _dedent.default)(_templateObject24);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple type with mutation', function () {
    var body = (0, _dedent.default)(_templateObject25);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Simple type with subscription', function () {
    var body = (0, _dedent.default)(_templateObject26);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Unreferenced type implementing referenced interface', function () {
    var body = (0, _dedent.default)(_templateObject27);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Unreferenced type implementing referenced union', function () {
    var body = (0, _dedent.default)(_templateObject28);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
  });
  (0, _mocha.it)('Supports @deprecated', function () {
    var body = (0, _dedent.default)(_templateObject29);
    var output = cycleOutput(body);
    (0, _chai.expect)(output).to.equal(body);
    var ast = (0, _language.parse)(body);
    var schema = (0, _buildASTSchema.buildASTSchema)(ast);
    var myEnum = schema.getType('MyEnum');
    var value = myEnum.getValue('VALUE');
    (0, _chai.expect)(value.isDeprecated).to.equal(false);
    var oldValue = myEnum.getValue('OLD_VALUE');
    (0, _chai.expect)(oldValue.isDeprecated).to.equal(true);
    (0, _chai.expect)(oldValue.deprecationReason).to.equal('No longer supported');
    var otherValue = myEnum.getValue('OTHER_VALUE');
    (0, _chai.expect)(otherValue.isDeprecated).to.equal(true);
    (0, _chai.expect)(otherValue.deprecationReason).to.equal('Terrible reasons');
    var rootFields = schema.getType('Query').getFields();
    (0, _chai.expect)(rootFields.field1.isDeprecated).to.equal(true);
    (0, _chai.expect)(rootFields.field1.deprecationReason).to.equal('No longer supported');
    (0, _chai.expect)(rootFields.field2.isDeprecated).to.equal(true);
    (0, _chai.expect)(rootFields.field2.deprecationReason).to.equal('Because I said so');
  });
  (0, _mocha.it)('Correctly assign AST nodes', function () {
    var schemaAST = (0, _language.parse)((0, _dedent.default)(_templateObject30));
    var schema = (0, _buildASTSchema.buildASTSchema)(schemaAST);
    var query = schema.getType('Query');
    var testInput = schema.getType('TestInput');
    var testEnum = schema.getType('TestEnum');
    var testUnion = schema.getType('TestUnion');
    var testInterface = schema.getType('TestInterface');
    var testType = schema.getType('TestType');
    var testScalar = schema.getType('TestScalar');
    var testDirective = schema.getDirective('test');
    var restoredSchemaAST = {
      kind: _kinds.Kind.DOCUMENT,
      definitions: [schema.astNode, query.astNode, testInput.astNode, testEnum.astNode, testUnion.astNode, testInterface.astNode, testType.astNode, testScalar.astNode, testDirective.astNode]
    };
    (0, _chai.expect)((0, _language.print)(restoredSchemaAST)).to.be.equal((0, _language.print)(schemaAST));
    var testField = query.getFields().testField;
    (0, _chai.expect)((0, _language.print)(testField.astNode)).to.equal('testField(testArg: TestInput): TestUnion');
    (0, _chai.expect)((0, _language.print)(testField.args[0].astNode)).to.equal('testArg: TestInput');
    (0, _chai.expect)((0, _language.print)(testInput.getFields().testInputField.astNode)).to.equal('testInputField: TestEnum');
    (0, _chai.expect)((0, _language.print)(testEnum.getValue('TEST_VALUE').astNode)).to.equal('TEST_VALUE');
    (0, _chai.expect)((0, _language.print)(testInterface.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    (0, _chai.expect)((0, _language.print)(testType.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    (0, _chai.expect)((0, _language.print)(testDirective.args[0].astNode)).to.equal('arg: TestScalar');
  });
  (0, _mocha.it)('Root operation types with custom names', function () {
    var schema = (0, _buildASTSchema.buildSchema)((0, _dedent.default)(_templateObject31));
    (0, _chai.expect)(schema.getQueryType().name).to.equal('SomeQuery');
    (0, _chai.expect)(schema.getMutationType().name).to.equal('SomeMutation');
    (0, _chai.expect)(schema.getSubscriptionType().name).to.equal('SomeSubscription');
  });
  (0, _mocha.it)('Default root operation type names', function () {
    var schema = (0, _buildASTSchema.buildSchema)((0, _dedent.default)(_templateObject32));
    (0, _chai.expect)(schema.getQueryType().name).to.equal('Query');
    (0, _chai.expect)(schema.getMutationType().name).to.equal('Mutation');
    (0, _chai.expect)(schema.getSubscriptionType().name).to.equal('Subscription');
  });
  (0, _mocha.it)('can build invalid schema', function () {
    var schema = (0, _buildASTSchema.buildSchema)((0, _dedent.default)(_templateObject33));
    var errors = (0, _.validateSchema)(schema);
    (0, _chai.expect)(errors.length).to.be.above(0);
  });
  (0, _mocha.it)('Accepts legacy names', function () {
    var doc = (0, _language.parse)((0, _dedent.default)(_templateObject34));
    var schema = (0, _buildASTSchema.buildASTSchema)(doc, {
      allowedLegacyNames: ['__badName']
    });
    var errors = (0, _.validateSchema)(schema);
    (0, _chai.expect)(errors.length).to.equal(0);
  });
});
(0, _mocha.describe)('Failures', function () {
  (0, _mocha.it)('Allows only a single schema definition', function () {
    var body = (0, _dedent.default)(_templateObject35);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Must provide only one schema definition.');
  });
  (0, _mocha.it)('Allows only a single query type', function () {
    var body = (0, _dedent.default)(_templateObject36);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Must provide only one query type in schema.');
  });
  (0, _mocha.it)('Allows only a single mutation type', function () {
    var body = (0, _dedent.default)(_templateObject37);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Must provide only one mutation type in schema.');
  });
  (0, _mocha.it)('Allows only a single subscription type', function () {
    var body = (0, _dedent.default)(_templateObject38);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Must provide only one subscription type in schema.');
  });
  (0, _mocha.it)('Unknown type referenced', function () {
    var body = (0, _dedent.default)(_templateObject39);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Type "Bar" not found in document.');
  });
  (0, _mocha.it)('Unknown type in interface list', function () {
    var body = (0, _dedent.default)(_templateObject40);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Type "Bar" not found in document.');
  });
  (0, _mocha.it)('Unknown type in union list', function () {
    var body = (0, _dedent.default)(_templateObject41);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Type "Bar" not found in document.');
  });
  (0, _mocha.it)('Unknown query type', function () {
    var body = (0, _dedent.default)(_templateObject42);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Specified query type "Wat" not found in document.');
  });
  (0, _mocha.it)('Unknown mutation type', function () {
    var body = (0, _dedent.default)(_templateObject43);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Specified mutation type "Wat" not found in document.');
  });
  (0, _mocha.it)('Unknown subscription type', function () {
    var body = (0, _dedent.default)(_templateObject44);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Specified subscription type "Awesome" not found in document.');
  });
  (0, _mocha.it)('Does not consider operation names', function () {
    var body = (0, _dedent.default)(_templateObject45);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Specified query type "Foo" not found in document.');
  });
  (0, _mocha.it)('Does not consider fragment names', function () {
    var body = (0, _dedent.default)(_templateObject46);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Specified query type "Foo" not found in document.');
  });
  (0, _mocha.it)('Forbids duplicate type definitions', function () {
    var body = (0, _dedent.default)(_templateObject47);
    var doc = (0, _language.parse)(body);
    (0, _chai.expect)(function () {
      return (0, _buildASTSchema.buildASTSchema)(doc);
    }).to.throw('Type "Repeated" was defined more than once.');
  });
});