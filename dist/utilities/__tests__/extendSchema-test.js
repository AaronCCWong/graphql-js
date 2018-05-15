"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _extendSchema = require("../extendSchema");

var _language = require("../../language");

var _schemaPrinter = require("../schemaPrinter");

var _kinds = require("../../language/kinds");

var _ = require("../../");

var _type = require("../../type");

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Foo implements SomeInterface {\n        name: String\n        some: SomeInterface\n        tree: [Foo]!\n        newField: String\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Unused {\n        someField: String\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Foo implements SomeInterface {\n        name: String\n        some: SomeInterface\n        tree: [Foo]!\n        newField(arg1: String, arg2: NewInputObj!): String\n      }\n\n      input NewInputObj {\n        field1: Int\n        field2: [Float]\n        field3: String!\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Foo implements SomeInterface {\n        name: String\n        some: SomeInterface\n        tree: [Foo]!\n        newField(arg1: SomeEnum!): SomeEnum\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Biz implements SomeInterface {\n        fizz: String\n        name: String\n        some: SomeInterface\n      }\n    "]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Foo implements SomeInterface {\n        name: String\n        some: SomeInterface\n        tree: [Foo]!\n        newObject: NewObject\n        newInterface: NewInterface\n        newUnion: NewUnion\n        newScalar: NewScalar\n        newEnum: NewEnum\n        newTree: [Foo]!\n      }\n\n      enum NewEnum {\n        OPTION_A\n        OPTION_B\n      }\n\n      interface NewInterface {\n        baz: String\n      }\n\n      type NewObject implements NewInterface {\n        baz: String\n      }\n\n      type NewOtherObject {\n        fizz: Int\n      }\n\n      scalar NewScalar\n\n      union NewUnion = NewObject | NewOtherObject\n    "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Foo implements SomeInterface & NewInterface {\n        name: String\n        some: SomeInterface\n        tree: [Foo]!\n        baz: String\n      }\n\n      interface NewInterface {\n        baz: String\n      }\n    "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Biz implements NewInterface & SomeInterface {\n        fizz: String\n        buzz: String\n        name: String\n        some: SomeInterface\n        newFieldA: Int\n        newFieldB: Float\n      }\n\n      interface NewInterface {\n        buzz: String\n      }\n    "]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Bar implements SomeInterface {\n        name: String\n        some: SomeInterface\n        foo: Foo\n        newField: String\n      }\n\n      type Foo implements SomeInterface {\n        name: String\n        some: SomeInterface\n        tree: [Foo]!\n        newField: String\n      }\n\n      interface SomeInterface {\n        name: String\n        some: SomeInterface\n        newField: String\n      }\n    "]),
    _templateObject10 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      interface SomeInterface {\n        name: String\n        some: SomeInterface\n        newField: String\n      }\n    "]),
    _templateObject11 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      interface SomeInterface {\n        name: String\n        some: SomeInterface\n        newFieldA: Int\n        newFieldB(test: Boolean): String\n      }\n    "]),
    _templateObject12 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Mutation {\n        mutationField: String\n        newMutationField: Int\n      }\n\n      type Query {\n        queryField: String\n        newQueryField: Int\n      }\n\n      type Subscription {\n        subscriptionField: String\n        newSubscriptionField: Int\n      }\n    "]),
    _templateObject13 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        extend schema {\n          mutation: Mutation\n        }\n        extend schema {\n          subscription: Subscription\n        }\n        extend schema @foo\n      "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// Test schema.
var SomeInterfaceType = new _type.GraphQLInterfaceType({
  name: 'SomeInterface',
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString
      },
      some: {
        type: SomeInterfaceType
      }
    };
  }
});
var FooType = new _type.GraphQLObjectType({
  name: 'Foo',
  interfaces: [SomeInterfaceType],
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString
      },
      some: {
        type: SomeInterfaceType
      },
      tree: {
        type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(FooType))
      }
    };
  }
});
var BarType = new _type.GraphQLObjectType({
  name: 'Bar',
  interfaces: [SomeInterfaceType],
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString
      },
      some: {
        type: SomeInterfaceType
      },
      foo: {
        type: FooType
      }
    };
  }
});
var BizType = new _type.GraphQLObjectType({
  name: 'Biz',
  fields: function fields() {
    return {
      fizz: {
        type: _type.GraphQLString
      }
    };
  }
});
var SomeUnionType = new _type.GraphQLUnionType({
  name: 'SomeUnion',
  types: [FooType, BizType]
});
var SomeEnumType = new _type.GraphQLEnumType({
  name: 'SomeEnum',
  values: {
    ONE: {
      value: 1
    },
    TWO: {
      value: 2
    }
  }
});
var testSchema = new _type.GraphQLSchema({
  query: new _type.GraphQLObjectType({
    name: 'Query',
    fields: function fields() {
      return {
        foo: {
          type: FooType
        },
        someUnion: {
          type: SomeUnionType
        },
        someEnum: {
          type: SomeEnumType
        },
        someInterface: {
          args: {
            id: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLID)
            }
          },
          type: SomeInterfaceType
        }
      };
    }
  }),
  types: [FooType, BarType]
});

function extendTestSchema(sdl, options) {
  var originalPrint = (0, _schemaPrinter.printSchema)(testSchema);
  var ast = (0, _language.parse)(sdl);
  var extendedSchema = (0, _extendSchema.extendSchema)(testSchema, ast, options);
  (0, _chai.expect)((0, _schemaPrinter.printSchema)(testSchema)).to.equal(originalPrint);
  return extendedSchema;
}

var testSchemaAST = (0, _language.parse)((0, _schemaPrinter.printSchema)(testSchema));
var testSchemaDefinions = testSchemaAST.definitions.map(_language.print);

function printTestSchemaChanges(extendedSchema) {
  var ast = (0, _language.parse)((0, _schemaPrinter.printSchema)(extendedSchema));
  ast.definitions = ast.definitions.filter(function (node) {
    return !testSchemaDefinions.includes((0, _language.print)(node));
  });
  return (0, _language.print)(ast);
}

(0, _mocha.describe)('extendSchema', function () {
  (0, _mocha.it)('returns the original schema when there are no type definitions', function () {
    var extendedSchema = extendTestSchema('{ field }');
    (0, _chai.expect)(extendedSchema).to.equal(testSchema);
  });
  (0, _mocha.it)('extends without altering original schema', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        newField: String\n      }\n    ");
    (0, _chai.expect)(extendedSchema).to.not.equal(testSchema);
    (0, _chai.expect)((0, _schemaPrinter.printSchema)(extendedSchema)).to.contain('newField');
    (0, _chai.expect)((0, _schemaPrinter.printSchema)(testSchema)).to.not.contain('newField');
  });
  (0, _mocha.it)('can be used for limited execution', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        newField: String\n      }\n    ");
    var result = (0, _.graphqlSync)(extendedSchema, '{ newField }', {
      newField: 123
    });
    (0, _chai.expect)(result.data).to.deep.equal({
      newField: '123'
    });
  });
  (0, _mocha.it)('can describe the extended fields', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        \"New field description.\"\n        newField: String\n      }\n    ");
    (0, _chai.expect)(extendedSchema.getType('Query').getFields().newField.description).to.equal('New field description.');
  });
  (0, _mocha.it)('can describe the extended fields with legacy comments', function () {
    var extendedSchema = extendTestSchema("extend type Query {\n        # New field description.\n        newField: String\n      }", {
      commentDescriptions: true
    });
    (0, _chai.expect)(extendedSchema.getType('Query').getFields().newField.description).to.equal('New field description.');
  });
  (0, _mocha.it)('describes extended fields with strings when present', function () {
    var extendedSchema = extendTestSchema("extend type Query {\n        # New field description.\n        \"Actually use this description.\"\n        newField: String\n      }", {
      commentDescriptions: true
    });
    (0, _chai.expect)(extendedSchema.getType('Query').getFields().newField.description).to.equal('Actually use this description.');
  });
  (0, _mocha.it)('extends objects by adding new fields', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newField: String\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject));
  });
  (0, _mocha.it)('correctly assign AST nodes to new and extended types', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        newField(testArg: TestInput): TestEnum\n      }\n\n      enum TestEnum {\n        TEST_VALUE\n      }\n\n      input TestInput {\n        testInputField: TestEnum\n      }\n    ");
    var secondExtensionAST = (0, _language.parse)("\n      extend type Query {\n        oneMoreNewField: TestUnion\n      }\n\n      union TestUnion = TestType\n\n      interface TestInterface {\n        interfaceField: String\n      }\n\n      type TestType implements TestInterface {\n        interfaceField: String\n      }\n\n      directive @test(arg: Int) on FIELD\n    ");
    var extendedTwiceSchema = (0, _extendSchema.extendSchema)(extendedSchema, secondExtensionAST);
    var query = extendedTwiceSchema.getType('Query');
    var testInput = extendedTwiceSchema.getType('TestInput');
    var testEnum = extendedTwiceSchema.getType('TestEnum');
    var testUnion = extendedTwiceSchema.getType('TestUnion');
    var testInterface = extendedTwiceSchema.getType('TestInterface');
    var testType = extendedTwiceSchema.getType('TestType');
    var testDirective = extendedTwiceSchema.getDirective('test');
    (0, _chai.expect)(query.extensionASTNodes).to.have.lengthOf(2);
    (0, _chai.expect)(testType.extensionASTNodes).to.equal(undefined);
    var restoredExtensionAST = {
      kind: _kinds.Kind.DOCUMENT,
      definitions: query.extensionASTNodes.concat([testInput.astNode, testEnum.astNode, testUnion.astNode, testInterface.astNode, testType.astNode, testDirective.astNode])
    };
    (0, _chai.expect)((0, _schemaPrinter.printSchema)((0, _extendSchema.extendSchema)(testSchema, restoredExtensionAST))).to.be.equal((0, _schemaPrinter.printSchema)(extendedTwiceSchema));
    var newField = query.getFields().newField;
    (0, _chai.expect)((0, _language.print)(newField.astNode)).to.equal('newField(testArg: TestInput): TestEnum');
    (0, _chai.expect)((0, _language.print)(newField.args[0].astNode)).to.equal('testArg: TestInput');
    (0, _chai.expect)((0, _language.print)(query.getFields().oneMoreNewField.astNode)).to.equal('oneMoreNewField: TestUnion');
    (0, _chai.expect)((0, _language.print)(testInput.getFields().testInputField.astNode)).to.equal('testInputField: TestEnum');
    (0, _chai.expect)((0, _language.print)(testEnum.getValue('TEST_VALUE').astNode)).to.equal('TEST_VALUE');
    (0, _chai.expect)((0, _language.print)(testInterface.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    (0, _chai.expect)((0, _language.print)(testType.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    (0, _chai.expect)((0, _language.print)(testDirective.args[0].astNode)).to.equal('arg: Int');
  });
  (0, _mocha.it)('builds types with deprecated fields/values', function () {
    var extendedSchema = extendTestSchema("\n      type TypeWithDeprecatedField {\n        newDeprecatedField: String @deprecated(reason: \"not used anymore\")\n      }\n\n      enum EnumWithDeprecatedValue {\n        DEPRECATED @deprecated(reason: \"do not use\")\n      }\n    ");
    var deprecatedFieldDef = extendedSchema.getType('TypeWithDeprecatedField').getFields().newDeprecatedField;
    (0, _chai.expect)(deprecatedFieldDef.isDeprecated).to.equal(true);
    (0, _chai.expect)(deprecatedFieldDef.deprecationReason).to.equal('not used anymore');
    var deprecatedEnumDef = extendedSchema.getType('EnumWithDeprecatedValue').getValue('DEPRECATED');
    (0, _chai.expect)(deprecatedEnumDef.isDeprecated).to.equal(true);
    (0, _chai.expect)(deprecatedEnumDef.deprecationReason).to.equal('do not use');
  });
  (0, _mocha.it)('extends objects with deprecated fields', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        deprecatedField: String @deprecated(reason: \"not used anymore\")\n      }\n    ");
    var deprecatedFieldDef = extendedSchema.getType('Foo').getFields().deprecatedField;
    (0, _chai.expect)(deprecatedFieldDef.isDeprecated).to.equal(true);
    (0, _chai.expect)(deprecatedFieldDef.deprecationReason).to.equal('not used anymore');
  });
  (0, _mocha.it)('extends objects by adding new unused types', function () {
    var extendedSchema = extendTestSchema("\n      type Unused {\n        someField: String\n      }\n    ");
    (0, _chai.expect)(extendedSchema).to.not.equal(testSchema);
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject2));
  });
  (0, _mocha.it)('extends objects by adding new fields with arguments', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newField(arg1: String, arg2: NewInputObj!): String\n      }\n\n      input NewInputObj {\n        field1: Int\n        field2: [Float]\n        field3: String!\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject3));
  });
  (0, _mocha.it)('extends objects by adding new fields with existing types', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newField(arg1: SomeEnum!): SomeEnum\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject4));
  });
  (0, _mocha.it)('extends objects by adding implemented interfaces', function () {
    var extendedSchema = extendTestSchema("\n      extend type Biz implements SomeInterface {\n        name: String\n        some: SomeInterface\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject5));
  });
  (0, _mocha.it)('extends objects by including new types', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newObject: NewObject\n        newInterface: NewInterface\n        newUnion: NewUnion\n        newScalar: NewScalar\n        newEnum: NewEnum\n        newTree: [Foo]!\n      }\n\n      type NewObject implements NewInterface {\n        baz: String\n      }\n\n      type NewOtherObject {\n        fizz: Int\n      }\n\n      interface NewInterface {\n        baz: String\n      }\n\n      union NewUnion = NewObject | NewOtherObject\n\n      scalar NewScalar\n\n      enum NewEnum {\n        OPTION_A\n        OPTION_B\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject6));
  });
  (0, _mocha.it)('extends objects by adding implemented new interfaces', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo implements NewInterface {\n        baz: String\n      }\n\n      interface NewInterface {\n        baz: String\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject7));
  });
  (0, _mocha.it)('extends objects multiple times', function () {
    var extendedSchema = extendTestSchema("\n      extend type Biz implements NewInterface {\n        buzz: String\n      }\n\n      extend type Biz implements SomeInterface {\n        name: String\n        some: SomeInterface\n        newFieldA: Int\n      }\n\n      extend type Biz {\n        newFieldA: Int\n        newFieldB: Float\n      }\n\n      interface NewInterface {\n        buzz: String\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject8));
  });
  (0, _mocha.it)('extends interfaces by adding new fields', function () {
    var extendedSchema = extendTestSchema("\n      extend interface SomeInterface {\n        newField: String\n      }\n\n      extend type Bar {\n        newField: String\n      }\n\n      extend type Foo {\n        newField: String\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject9));
  });
  (0, _mocha.it)('allows extension of interface with missing Object fields', function () {
    var extendedSchema = extendTestSchema("\n      extend interface SomeInterface {\n        newField: String\n      }\n    ");
    var errors = (0, _type.validateSchema)(extendedSchema);
    (0, _chai.expect)(errors.length).to.be.above(0);
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject10));
  });
  (0, _mocha.it)('extends interfaces multiple times', function () {
    var extendedSchema = extendTestSchema("\n      extend interface SomeInterface {\n        newFieldA: Int\n      }\n\n      extend interface SomeInterface {\n        newFieldB(test: Boolean): String\n      }\n    ");
    (0, _chai.expect)(printTestSchemaChanges(extendedSchema)).to.equal((0, _dedent.default)(_templateObject11));
  });
  (0, _mocha.it)('may extend mutations and subscriptions', function () {
    var mutationSchema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Query',
        fields: function fields() {
          return {
            queryField: {
              type: _type.GraphQLString
            }
          };
        }
      }),
      mutation: new _type.GraphQLObjectType({
        name: 'Mutation',
        fields: function fields() {
          return {
            mutationField: {
              type: _type.GraphQLString
            }
          };
        }
      }),
      subscription: new _type.GraphQLObjectType({
        name: 'Subscription',
        fields: function fields() {
          return {
            subscriptionField: {
              type: _type.GraphQLString
            }
          };
        }
      })
    });
    var ast = (0, _language.parse)("\n      extend type Query {\n        newQueryField: Int\n      }\n\n      extend type Mutation {\n        newMutationField: Int\n      }\n\n      extend type Subscription {\n        newSubscriptionField: Int\n      }\n    ");
    var originalPrint = (0, _schemaPrinter.printSchema)(mutationSchema);
    var extendedSchema = (0, _extendSchema.extendSchema)(mutationSchema, ast);
    (0, _chai.expect)(extendedSchema).to.not.equal(mutationSchema);
    (0, _chai.expect)((0, _schemaPrinter.printSchema)(mutationSchema)).to.equal(originalPrint);
    (0, _chai.expect)((0, _schemaPrinter.printSchema)(extendedSchema)).to.equal((0, _dedent.default)(_templateObject12));
  });
  (0, _mocha.it)('may extend directives with new simple directive', function () {
    var extendedSchema = extendTestSchema("\n      directive @neat on QUERY\n    ");
    var newDirective = extendedSchema.getDirective('neat');
    (0, _chai.expect)(newDirective.name).to.equal('neat');
    (0, _chai.expect)(newDirective.locations).to.contain('QUERY');
  });
  (0, _mocha.it)('sets correct description when extending with a new directive', function () {
    var extendedSchema = extendTestSchema("\n      \"\"\"\n      new directive\n      \"\"\"\n      directive @new on QUERY\n    ");
    var newDirective = extendedSchema.getDirective('new');
    (0, _chai.expect)(newDirective.description).to.equal('new directive');
  });
  (0, _mocha.it)('sets correct description using legacy comments', function () {
    var extendedSchema = extendTestSchema("\n      # new directive\n      directive @new on QUERY\n    ", {
      commentDescriptions: true
    });
    var newDirective = extendedSchema.getDirective('new');
    (0, _chai.expect)(newDirective.description).to.equal('new directive');
  });
  (0, _mocha.it)('may extend directives with new complex directive', function () {
    var extendedSchema = extendTestSchema("\n      directive @profile(enable: Boolean! tag: String) on QUERY | FIELD\n    ");
    var extendedDirective = extendedSchema.getDirective('profile');
    (0, _chai.expect)(extendedDirective.locations).to.contain('QUERY');
    (0, _chai.expect)(extendedDirective.locations).to.contain('FIELD');
    var args = extendedDirective.args;
    var arg0 = args[0];
    var arg1 = args[1];
    (0, _chai.expect)(args.length).to.equal(2);
    (0, _chai.expect)(arg0.name).to.equal('enable');
    (0, _chai.expect)((0, _type.isNonNullType)(arg0.type)).to.equal(true);
    (0, _chai.expect)((0, _type.isScalarType)(arg0.type.ofType)).to.equal(true);
    (0, _chai.expect)(arg1.name).to.equal('tag');
    (0, _chai.expect)((0, _type.isScalarType)(arg1.type)).to.equal(true);
  });
  (0, _mocha.it)('does not allow replacing a default directive', function () {
    var ast = (0, _language.parse)("\n      directive @include(if: Boolean!) on FIELD | FRAGMENT_SPREAD\n    ");
    (0, _chai.expect)(function () {
      return (0, _extendSchema.extendSchema)(testSchema, ast);
    }).to.throw('Directive "include" already exists in the schema. It cannot be ' + 'redefined.');
  });
  (0, _mocha.it)('does not allow replacing a custom directive', function () {
    var extendedSchema = extendTestSchema("\n      directive @meow(if: Boolean!) on FIELD | FRAGMENT_SPREAD\n    ");
    var replacementAST = (0, _language.parse)("\n      directive @meow(if: Boolean!) on FIELD | QUERY\n    ");
    (0, _chai.expect)(function () {
      return (0, _extendSchema.extendSchema)(extendedSchema, replacementAST);
    }).to.throw('Directive "meow" already exists in the schema. It cannot be redefined.');
  });
  (0, _mocha.it)('does not allow replacing an existing type', function () {
    var ast = (0, _language.parse)("\n      type Bar {\n        baz: String\n      }\n    ");
    (0, _chai.expect)(function () {
      return (0, _extendSchema.extendSchema)(testSchema, ast);
    }).to.throw('Type "Bar" already exists in the schema. It cannot also be defined ' + 'in this type definition.');
  });
  (0, _mocha.it)('does not allow replacing an existing field', function () {
    var ast = (0, _language.parse)("\n      extend type Bar {\n        foo: Foo\n      }\n    ");
    (0, _chai.expect)(function () {
      return (0, _extendSchema.extendSchema)(testSchema, ast);
    }).to.throw('Field "Bar.foo" already exists in the schema. It cannot also be ' + 'defined in this type extension.');
  });
  (0, _mocha.it)('does not allow referencing an unknown type', function () {
    var ast = (0, _language.parse)("\n      extend type Bar {\n        quix: Quix\n      }\n    ");
    (0, _chai.expect)(function () {
      return (0, _extendSchema.extendSchema)(testSchema, ast);
    }).to.throw('Unknown type: "Quix". Ensure that this type exists either in the ' + 'original schema, or is added in a type definition.');
  });
  (0, _mocha.it)('does not allow extending an unknown type', function () {
    var ast = (0, _language.parse)("\n      extend type UnknownType {\n        baz: String\n      }\n    ");
    (0, _chai.expect)(function () {
      return (0, _extendSchema.extendSchema)(testSchema, ast);
    }).to.throw('Cannot extend type "UnknownType" because it does not exist in the ' + 'existing schema.');
  });
  (0, _mocha.it)('does not allow extending an unknown interface type', function () {
    var ast = (0, _language.parse)("\n      extend interface UnknownInterfaceType {\n        baz: String\n      }\n    ");
    (0, _chai.expect)(function () {
      return (0, _extendSchema.extendSchema)(testSchema, ast);
    }).to.throw('Cannot extend type "UnknownInterfaceType" because it does not ' + 'exist in the existing schema.');
  });
  (0, _mocha.it)('maintains configuration of the original schema object', function () {
    var testSchemaWithLegacyNames = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Query',
        fields: function fields() {
          return {
            id: {
              type: _type.GraphQLID
            }
          };
        }
      }),
      allowedLegacyNames: ['__badName']
    });
    var ast = (0, _language.parse)("\n      extend type Query {\n        __badName: String\n      }\n    ");
    var schema = (0, _extendSchema.extendSchema)(testSchemaWithLegacyNames, ast);
    (0, _chai.expect)(schema.__allowedLegacyNames).to.deep.equal(['__badName']);
  });
  (0, _mocha.it)('adds to the configuration of the original schema object', function () {
    var testSchemaWithLegacyNames = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Query',
        fields: function fields() {
          return {
            __badName: {
              type: _type.GraphQLString
            }
          };
        }
      }),
      allowedLegacyNames: ['__badName']
    });
    var ast = (0, _language.parse)("\n      extend type Query {\n        __anotherBadName: String\n      }\n    ");
    var schema = (0, _extendSchema.extendSchema)(testSchemaWithLegacyNames, ast, {
      allowedLegacyNames: ['__anotherBadName']
    });
    (0, _chai.expect)(schema.__allowedLegacyNames).to.deep.equal(['__badName', '__anotherBadName']);
  });
  (0, _mocha.describe)('does not allow extending a non-object type', function () {
    (0, _mocha.it)('not an object', function () {
      var ast = (0, _language.parse)("\n        extend type SomeInterface {\n          baz: String\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _extendSchema.extendSchema)(testSchema, ast);
      }).to.throw('Cannot extend non-object type "SomeInterface".');
    });
    (0, _mocha.it)('not an interface', function () {
      var ast = (0, _language.parse)("\n        extend interface Foo {\n          baz: String\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _extendSchema.extendSchema)(testSchema, ast);
      }).to.throw('Cannot extend non-interface type "Foo".');
    });
    (0, _mocha.it)('not a scalar', function () {
      var ast = (0, _language.parse)("\n        extend type String {\n          baz: String\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _extendSchema.extendSchema)(testSchema, ast);
      }).to.throw('Cannot extend non-object type "String".');
    });
  });
  (0, _mocha.describe)('can add additional root operation types', function () {
    (0, _mocha.it)('does not automatically include common root type names', function () {
      var ast = (0, _language.parse)("\n        type Mutation {\n          doSomething: String\n        }\n      ");
      var schema = (0, _extendSchema.extendSchema)(testSchema, ast);
      (0, _chai.expect)(schema.getMutationType()).to.equal(null);
    });
    (0, _mocha.it)('does not allow new schema within an extension', function () {
      var ast = (0, _language.parse)("\n        schema {\n          mutation: Mutation\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _extendSchema.extendSchema)(testSchema, ast);
      }).to.throw('Cannot define a new schema within a schema extension.');
    });
    (0, _mocha.it)('adds new root types via schema extension', function () {
      var ast = (0, _language.parse)("\n        extend schema {\n          mutation: Mutation\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n      ");
      var schema = (0, _extendSchema.extendSchema)(testSchema, ast);
      var mutationType = schema.getMutationType();
      (0, _chai.expect)(mutationType && mutationType.name).to.equal('Mutation');
    });
    (0, _mocha.it)('adds multiple new root types via schema extension', function () {
      var ast = (0, _language.parse)("\n        extend schema {\n          mutation: Mutation\n          subscription: Subscription\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type Subscription {\n          hearSomething: String\n        }\n      ");
      var schema = (0, _extendSchema.extendSchema)(testSchema, ast);
      var mutationType = schema.getMutationType();
      var subscriptionType = schema.getSubscriptionType();
      (0, _chai.expect)(mutationType && mutationType.name).to.equal('Mutation');
      (0, _chai.expect)(subscriptionType && subscriptionType.name).to.equal('Subscription');
    });
    (0, _mocha.it)('applies multiple schema extensions', function () {
      var ast = (0, _language.parse)("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          subscription: Subscription\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type Subscription {\n          hearSomething: String\n        }\n      ");
      var schema = (0, _extendSchema.extendSchema)(testSchema, ast);
      var mutationType = schema.getMutationType();
      var subscriptionType = schema.getSubscriptionType();
      (0, _chai.expect)(mutationType && mutationType.name).to.equal('Mutation');
      (0, _chai.expect)(subscriptionType && subscriptionType.name).to.equal('Subscription');
    });
    (0, _mocha.it)('schema extension AST are available from schema object', function () {
      var ast = (0, _language.parse)("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          subscription: Subscription\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type Subscription {\n          hearSomething: String\n        }\n      ");
      var schema = (0, _extendSchema.extendSchema)(testSchema, ast);
      var secondAST = (0, _language.parse)("\n        extend schema @foo\n\n        directive @foo on SCHEMA\n      ");
      schema = (0, _extendSchema.extendSchema)(schema, secondAST);
      var nodes = schema.extensionASTNodes;
      (0, _chai.expect)(nodes.map(function (n) {
        return (0, _language.print)(n) + '\n';
      }).join('')).to.equal((0, _dedent.default)(_templateObject13));
    });
    (0, _mocha.it)('does not allow redefining an existing root type', function () {
      var ast = (0, _language.parse)("\n        extend schema {\n          query: SomeType\n        }\n\n        type SomeType {\n          seeSomething: String\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _extendSchema.extendSchema)(testSchema, ast);
      }).to.throw('Must provide only one query type in schema.');
    });
    (0, _mocha.it)('does not allow defining a root operation type twice', function () {
      var ast = (0, _language.parse)("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          mutation: Mutation\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _extendSchema.extendSchema)(testSchema, ast);
      }).to.throw('Must provide only one mutation type in schema.');
    });
    (0, _mocha.it)('does not allow defining a root operation type with different types', function () {
      var ast = (0, _language.parse)("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          mutation: SomethingElse\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type SomethingElse {\n          doSomethingElse: String\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _extendSchema.extendSchema)(testSchema, ast);
      }).to.throw('Must provide only one mutation type in schema.');
    });
  });
});