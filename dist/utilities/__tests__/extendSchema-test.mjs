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

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import dedent from '../../jsutils/dedent';
import { extendSchema } from '../extendSchema';
import { parse, print } from '../../language';
import { printSchema } from '../schemaPrinter';
import { Kind } from '../../language/kinds';
import { graphqlSync } from '../../';
import { GraphQLSchema, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLID, GraphQLString, GraphQLEnumType, GraphQLNonNull, GraphQLList, isScalarType, isNonNullType, validateSchema } from '../../type'; // Test schema.

var SomeInterfaceType = new GraphQLInterfaceType({
  name: 'SomeInterface',
  fields: function fields() {
    return {
      name: {
        type: GraphQLString
      },
      some: {
        type: SomeInterfaceType
      }
    };
  }
});
var FooType = new GraphQLObjectType({
  name: 'Foo',
  interfaces: [SomeInterfaceType],
  fields: function fields() {
    return {
      name: {
        type: GraphQLString
      },
      some: {
        type: SomeInterfaceType
      },
      tree: {
        type: GraphQLNonNull(GraphQLList(FooType))
      }
    };
  }
});
var BarType = new GraphQLObjectType({
  name: 'Bar',
  interfaces: [SomeInterfaceType],
  fields: function fields() {
    return {
      name: {
        type: GraphQLString
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
var BizType = new GraphQLObjectType({
  name: 'Biz',
  fields: function fields() {
    return {
      fizz: {
        type: GraphQLString
      }
    };
  }
});
var SomeUnionType = new GraphQLUnionType({
  name: 'SomeUnion',
  types: [FooType, BizType]
});
var SomeEnumType = new GraphQLEnumType({
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
var testSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
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
              type: GraphQLNonNull(GraphQLID)
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
  var originalPrint = printSchema(testSchema);
  var ast = parse(sdl);
  var extendedSchema = extendSchema(testSchema, ast, options);
  expect(printSchema(testSchema)).to.equal(originalPrint);
  return extendedSchema;
}

var testSchemaAST = parse(printSchema(testSchema));
var testSchemaDefinions = testSchemaAST.definitions.map(print);

function printTestSchemaChanges(extendedSchema) {
  var ast = parse(printSchema(extendedSchema));
  ast.definitions = ast.definitions.filter(function (node) {
    return !testSchemaDefinions.includes(print(node));
  });
  return print(ast);
}

describe('extendSchema', function () {
  it('returns the original schema when there are no type definitions', function () {
    var extendedSchema = extendTestSchema('{ field }');
    expect(extendedSchema).to.equal(testSchema);
  });
  it('extends without altering original schema', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        newField: String\n      }\n    ");
    expect(extendedSchema).to.not.equal(testSchema);
    expect(printSchema(extendedSchema)).to.contain('newField');
    expect(printSchema(testSchema)).to.not.contain('newField');
  });
  it('can be used for limited execution', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        newField: String\n      }\n    ");
    var result = graphqlSync(extendedSchema, '{ newField }', {
      newField: 123
    });
    expect(result.data).to.deep.equal({
      newField: '123'
    });
  });
  it('can describe the extended fields', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        \"New field description.\"\n        newField: String\n      }\n    ");
    expect(extendedSchema.getType('Query').getFields().newField.description).to.equal('New field description.');
  });
  it('can describe the extended fields with legacy comments', function () {
    var extendedSchema = extendTestSchema("extend type Query {\n        # New field description.\n        newField: String\n      }", {
      commentDescriptions: true
    });
    expect(extendedSchema.getType('Query').getFields().newField.description).to.equal('New field description.');
  });
  it('describes extended fields with strings when present', function () {
    var extendedSchema = extendTestSchema("extend type Query {\n        # New field description.\n        \"Actually use this description.\"\n        newField: String\n      }", {
      commentDescriptions: true
    });
    expect(extendedSchema.getType('Query').getFields().newField.description).to.equal('Actually use this description.');
  });
  it('extends objects by adding new fields', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newField: String\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject));
  });
  it('correctly assign AST nodes to new and extended types', function () {
    var extendedSchema = extendTestSchema("\n      extend type Query {\n        newField(testArg: TestInput): TestEnum\n      }\n\n      enum TestEnum {\n        TEST_VALUE\n      }\n\n      input TestInput {\n        testInputField: TestEnum\n      }\n    ");
    var secondExtensionAST = parse("\n      extend type Query {\n        oneMoreNewField: TestUnion\n      }\n\n      union TestUnion = TestType\n\n      interface TestInterface {\n        interfaceField: String\n      }\n\n      type TestType implements TestInterface {\n        interfaceField: String\n      }\n\n      directive @test(arg: Int) on FIELD\n    ");
    var extendedTwiceSchema = extendSchema(extendedSchema, secondExtensionAST);
    var query = extendedTwiceSchema.getType('Query');
    var testInput = extendedTwiceSchema.getType('TestInput');
    var testEnum = extendedTwiceSchema.getType('TestEnum');
    var testUnion = extendedTwiceSchema.getType('TestUnion');
    var testInterface = extendedTwiceSchema.getType('TestInterface');
    var testType = extendedTwiceSchema.getType('TestType');
    var testDirective = extendedTwiceSchema.getDirective('test');
    expect(query.extensionASTNodes).to.have.lengthOf(2);
    expect(testType.extensionASTNodes).to.equal(undefined);
    var restoredExtensionAST = {
      kind: Kind.DOCUMENT,
      definitions: query.extensionASTNodes.concat([testInput.astNode, testEnum.astNode, testUnion.astNode, testInterface.astNode, testType.astNode, testDirective.astNode])
    };
    expect(printSchema(extendSchema(testSchema, restoredExtensionAST))).to.be.equal(printSchema(extendedTwiceSchema));
    var newField = query.getFields().newField;
    expect(print(newField.astNode)).to.equal('newField(testArg: TestInput): TestEnum');
    expect(print(newField.args[0].astNode)).to.equal('testArg: TestInput');
    expect(print(query.getFields().oneMoreNewField.astNode)).to.equal('oneMoreNewField: TestUnion');
    expect(print(testInput.getFields().testInputField.astNode)).to.equal('testInputField: TestEnum');
    expect(print(testEnum.getValue('TEST_VALUE').astNode)).to.equal('TEST_VALUE');
    expect(print(testInterface.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    expect(print(testType.getFields().interfaceField.astNode)).to.equal('interfaceField: String');
    expect(print(testDirective.args[0].astNode)).to.equal('arg: Int');
  });
  it('builds types with deprecated fields/values', function () {
    var extendedSchema = extendTestSchema("\n      type TypeWithDeprecatedField {\n        newDeprecatedField: String @deprecated(reason: \"not used anymore\")\n      }\n\n      enum EnumWithDeprecatedValue {\n        DEPRECATED @deprecated(reason: \"do not use\")\n      }\n    ");
    var deprecatedFieldDef = extendedSchema.getType('TypeWithDeprecatedField').getFields().newDeprecatedField;
    expect(deprecatedFieldDef.isDeprecated).to.equal(true);
    expect(deprecatedFieldDef.deprecationReason).to.equal('not used anymore');
    var deprecatedEnumDef = extendedSchema.getType('EnumWithDeprecatedValue').getValue('DEPRECATED');
    expect(deprecatedEnumDef.isDeprecated).to.equal(true);
    expect(deprecatedEnumDef.deprecationReason).to.equal('do not use');
  });
  it('extends objects with deprecated fields', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        deprecatedField: String @deprecated(reason: \"not used anymore\")\n      }\n    ");
    var deprecatedFieldDef = extendedSchema.getType('Foo').getFields().deprecatedField;
    expect(deprecatedFieldDef.isDeprecated).to.equal(true);
    expect(deprecatedFieldDef.deprecationReason).to.equal('not used anymore');
  });
  it('extends objects by adding new unused types', function () {
    var extendedSchema = extendTestSchema("\n      type Unused {\n        someField: String\n      }\n    ");
    expect(extendedSchema).to.not.equal(testSchema);
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject2));
  });
  it('extends objects by adding new fields with arguments', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newField(arg1: String, arg2: NewInputObj!): String\n      }\n\n      input NewInputObj {\n        field1: Int\n        field2: [Float]\n        field3: String!\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject3));
  });
  it('extends objects by adding new fields with existing types', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newField(arg1: SomeEnum!): SomeEnum\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject4));
  });
  it('extends objects by adding implemented interfaces', function () {
    var extendedSchema = extendTestSchema("\n      extend type Biz implements SomeInterface {\n        name: String\n        some: SomeInterface\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject5));
  });
  it('extends objects by including new types', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo {\n        newObject: NewObject\n        newInterface: NewInterface\n        newUnion: NewUnion\n        newScalar: NewScalar\n        newEnum: NewEnum\n        newTree: [Foo]!\n      }\n\n      type NewObject implements NewInterface {\n        baz: String\n      }\n\n      type NewOtherObject {\n        fizz: Int\n      }\n\n      interface NewInterface {\n        baz: String\n      }\n\n      union NewUnion = NewObject | NewOtherObject\n\n      scalar NewScalar\n\n      enum NewEnum {\n        OPTION_A\n        OPTION_B\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject6));
  });
  it('extends objects by adding implemented new interfaces', function () {
    var extendedSchema = extendTestSchema("\n      extend type Foo implements NewInterface {\n        baz: String\n      }\n\n      interface NewInterface {\n        baz: String\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject7));
  });
  it('extends objects multiple times', function () {
    var extendedSchema = extendTestSchema("\n      extend type Biz implements NewInterface {\n        buzz: String\n      }\n\n      extend type Biz implements SomeInterface {\n        name: String\n        some: SomeInterface\n        newFieldA: Int\n      }\n\n      extend type Biz {\n        newFieldA: Int\n        newFieldB: Float\n      }\n\n      interface NewInterface {\n        buzz: String\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject8));
  });
  it('extends interfaces by adding new fields', function () {
    var extendedSchema = extendTestSchema("\n      extend interface SomeInterface {\n        newField: String\n      }\n\n      extend type Bar {\n        newField: String\n      }\n\n      extend type Foo {\n        newField: String\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject9));
  });
  it('allows extension of interface with missing Object fields', function () {
    var extendedSchema = extendTestSchema("\n      extend interface SomeInterface {\n        newField: String\n      }\n    ");
    var errors = validateSchema(extendedSchema);
    expect(errors.length).to.be.above(0);
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject10));
  });
  it('extends interfaces multiple times', function () {
    var extendedSchema = extendTestSchema("\n      extend interface SomeInterface {\n        newFieldA: Int\n      }\n\n      extend interface SomeInterface {\n        newFieldB(test: Boolean): String\n      }\n    ");
    expect(printTestSchemaChanges(extendedSchema)).to.equal(dedent(_templateObject11));
  });
  it('may extend mutations and subscriptions', function () {
    var mutationSchema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: function fields() {
          return {
            queryField: {
              type: GraphQLString
            }
          };
        }
      }),
      mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: function fields() {
          return {
            mutationField: {
              type: GraphQLString
            }
          };
        }
      }),
      subscription: new GraphQLObjectType({
        name: 'Subscription',
        fields: function fields() {
          return {
            subscriptionField: {
              type: GraphQLString
            }
          };
        }
      })
    });
    var ast = parse("\n      extend type Query {\n        newQueryField: Int\n      }\n\n      extend type Mutation {\n        newMutationField: Int\n      }\n\n      extend type Subscription {\n        newSubscriptionField: Int\n      }\n    ");
    var originalPrint = printSchema(mutationSchema);
    var extendedSchema = extendSchema(mutationSchema, ast);
    expect(extendedSchema).to.not.equal(mutationSchema);
    expect(printSchema(mutationSchema)).to.equal(originalPrint);
    expect(printSchema(extendedSchema)).to.equal(dedent(_templateObject12));
  });
  it('may extend directives with new simple directive', function () {
    var extendedSchema = extendTestSchema("\n      directive @neat on QUERY\n    ");
    var newDirective = extendedSchema.getDirective('neat');
    expect(newDirective.name).to.equal('neat');
    expect(newDirective.locations).to.contain('QUERY');
  });
  it('sets correct description when extending with a new directive', function () {
    var extendedSchema = extendTestSchema("\n      \"\"\"\n      new directive\n      \"\"\"\n      directive @new on QUERY\n    ");
    var newDirective = extendedSchema.getDirective('new');
    expect(newDirective.description).to.equal('new directive');
  });
  it('sets correct description using legacy comments', function () {
    var extendedSchema = extendTestSchema("\n      # new directive\n      directive @new on QUERY\n    ", {
      commentDescriptions: true
    });
    var newDirective = extendedSchema.getDirective('new');
    expect(newDirective.description).to.equal('new directive');
  });
  it('may extend directives with new complex directive', function () {
    var extendedSchema = extendTestSchema("\n      directive @profile(enable: Boolean! tag: String) on QUERY | FIELD\n    ");
    var extendedDirective = extendedSchema.getDirective('profile');
    expect(extendedDirective.locations).to.contain('QUERY');
    expect(extendedDirective.locations).to.contain('FIELD');
    var args = extendedDirective.args;
    var arg0 = args[0];
    var arg1 = args[1];
    expect(args.length).to.equal(2);
    expect(arg0.name).to.equal('enable');
    expect(isNonNullType(arg0.type)).to.equal(true);
    expect(isScalarType(arg0.type.ofType)).to.equal(true);
    expect(arg1.name).to.equal('tag');
    expect(isScalarType(arg1.type)).to.equal(true);
  });
  it('does not allow replacing a default directive', function () {
    var ast = parse("\n      directive @include(if: Boolean!) on FIELD | FRAGMENT_SPREAD\n    ");
    expect(function () {
      return extendSchema(testSchema, ast);
    }).to.throw('Directive "include" already exists in the schema. It cannot be ' + 'redefined.');
  });
  it('does not allow replacing a custom directive', function () {
    var extendedSchema = extendTestSchema("\n      directive @meow(if: Boolean!) on FIELD | FRAGMENT_SPREAD\n    ");
    var replacementAST = parse("\n      directive @meow(if: Boolean!) on FIELD | QUERY\n    ");
    expect(function () {
      return extendSchema(extendedSchema, replacementAST);
    }).to.throw('Directive "meow" already exists in the schema. It cannot be redefined.');
  });
  it('does not allow replacing an existing type', function () {
    var ast = parse("\n      type Bar {\n        baz: String\n      }\n    ");
    expect(function () {
      return extendSchema(testSchema, ast);
    }).to.throw('Type "Bar" already exists in the schema. It cannot also be defined ' + 'in this type definition.');
  });
  it('does not allow replacing an existing field', function () {
    var ast = parse("\n      extend type Bar {\n        foo: Foo\n      }\n    ");
    expect(function () {
      return extendSchema(testSchema, ast);
    }).to.throw('Field "Bar.foo" already exists in the schema. It cannot also be ' + 'defined in this type extension.');
  });
  it('does not allow referencing an unknown type', function () {
    var ast = parse("\n      extend type Bar {\n        quix: Quix\n      }\n    ");
    expect(function () {
      return extendSchema(testSchema, ast);
    }).to.throw('Unknown type: "Quix". Ensure that this type exists either in the ' + 'original schema, or is added in a type definition.');
  });
  it('does not allow extending an unknown type', function () {
    var ast = parse("\n      extend type UnknownType {\n        baz: String\n      }\n    ");
    expect(function () {
      return extendSchema(testSchema, ast);
    }).to.throw('Cannot extend type "UnknownType" because it does not exist in the ' + 'existing schema.');
  });
  it('does not allow extending an unknown interface type', function () {
    var ast = parse("\n      extend interface UnknownInterfaceType {\n        baz: String\n      }\n    ");
    expect(function () {
      return extendSchema(testSchema, ast);
    }).to.throw('Cannot extend type "UnknownInterfaceType" because it does not ' + 'exist in the existing schema.');
  });
  it('maintains configuration of the original schema object', function () {
    var testSchemaWithLegacyNames = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: function fields() {
          return {
            id: {
              type: GraphQLID
            }
          };
        }
      }),
      allowedLegacyNames: ['__badName']
    });
    var ast = parse("\n      extend type Query {\n        __badName: String\n      }\n    ");
    var schema = extendSchema(testSchemaWithLegacyNames, ast);
    expect(schema.__allowedLegacyNames).to.deep.equal(['__badName']);
  });
  it('adds to the configuration of the original schema object', function () {
    var testSchemaWithLegacyNames = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: function fields() {
          return {
            __badName: {
              type: GraphQLString
            }
          };
        }
      }),
      allowedLegacyNames: ['__badName']
    });
    var ast = parse("\n      extend type Query {\n        __anotherBadName: String\n      }\n    ");
    var schema = extendSchema(testSchemaWithLegacyNames, ast, {
      allowedLegacyNames: ['__anotherBadName']
    });
    expect(schema.__allowedLegacyNames).to.deep.equal(['__badName', '__anotherBadName']);
  });
  describe('does not allow extending a non-object type', function () {
    it('not an object', function () {
      var ast = parse("\n        extend type SomeInterface {\n          baz: String\n        }\n      ");
      expect(function () {
        return extendSchema(testSchema, ast);
      }).to.throw('Cannot extend non-object type "SomeInterface".');
    });
    it('not an interface', function () {
      var ast = parse("\n        extend interface Foo {\n          baz: String\n        }\n      ");
      expect(function () {
        return extendSchema(testSchema, ast);
      }).to.throw('Cannot extend non-interface type "Foo".');
    });
    it('not a scalar', function () {
      var ast = parse("\n        extend type String {\n          baz: String\n        }\n      ");
      expect(function () {
        return extendSchema(testSchema, ast);
      }).to.throw('Cannot extend non-object type "String".');
    });
  });
  describe('can add additional root operation types', function () {
    it('does not automatically include common root type names', function () {
      var ast = parse("\n        type Mutation {\n          doSomething: String\n        }\n      ");
      var schema = extendSchema(testSchema, ast);
      expect(schema.getMutationType()).to.equal(null);
    });
    it('does not allow new schema within an extension', function () {
      var ast = parse("\n        schema {\n          mutation: Mutation\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n      ");
      expect(function () {
        return extendSchema(testSchema, ast);
      }).to.throw('Cannot define a new schema within a schema extension.');
    });
    it('adds new root types via schema extension', function () {
      var ast = parse("\n        extend schema {\n          mutation: Mutation\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n      ");
      var schema = extendSchema(testSchema, ast);
      var mutationType = schema.getMutationType();
      expect(mutationType && mutationType.name).to.equal('Mutation');
    });
    it('adds multiple new root types via schema extension', function () {
      var ast = parse("\n        extend schema {\n          mutation: Mutation\n          subscription: Subscription\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type Subscription {\n          hearSomething: String\n        }\n      ");
      var schema = extendSchema(testSchema, ast);
      var mutationType = schema.getMutationType();
      var subscriptionType = schema.getSubscriptionType();
      expect(mutationType && mutationType.name).to.equal('Mutation');
      expect(subscriptionType && subscriptionType.name).to.equal('Subscription');
    });
    it('applies multiple schema extensions', function () {
      var ast = parse("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          subscription: Subscription\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type Subscription {\n          hearSomething: String\n        }\n      ");
      var schema = extendSchema(testSchema, ast);
      var mutationType = schema.getMutationType();
      var subscriptionType = schema.getSubscriptionType();
      expect(mutationType && mutationType.name).to.equal('Mutation');
      expect(subscriptionType && subscriptionType.name).to.equal('Subscription');
    });
    it('schema extension AST are available from schema object', function () {
      var ast = parse("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          subscription: Subscription\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type Subscription {\n          hearSomething: String\n        }\n      ");
      var schema = extendSchema(testSchema, ast);
      var secondAST = parse("\n        extend schema @foo\n\n        directive @foo on SCHEMA\n      ");
      schema = extendSchema(schema, secondAST);
      var nodes = schema.extensionASTNodes;
      expect(nodes.map(function (n) {
        return print(n) + '\n';
      }).join('')).to.equal(dedent(_templateObject13));
    });
    it('does not allow redefining an existing root type', function () {
      var ast = parse("\n        extend schema {\n          query: SomeType\n        }\n\n        type SomeType {\n          seeSomething: String\n        }\n      ");
      expect(function () {
        return extendSchema(testSchema, ast);
      }).to.throw('Must provide only one query type in schema.');
    });
    it('does not allow defining a root operation type twice', function () {
      var ast = parse("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          mutation: Mutation\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n      ");
      expect(function () {
        return extendSchema(testSchema, ast);
      }).to.throw('Must provide only one mutation type in schema.');
    });
    it('does not allow defining a root operation type with different types', function () {
      var ast = parse("\n        extend schema {\n          mutation: Mutation\n        }\n\n        extend schema {\n          mutation: SomethingElse\n        }\n\n        type Mutation {\n          doSomething: String\n        }\n\n        type SomethingElse {\n          doSomethingElse: String\n        }\n      ");
      expect(function () {
        return extendSchema(testSchema, ast);
      }).to.throw('Must provide only one mutation type in schema.');
    });
  });
});