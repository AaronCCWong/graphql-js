function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { GraphQLSchema, GraphQLScalarType, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLEnumType, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from '../../';
import { parse } from '../../language/parser';
import { validateSchema } from '../validate';
import { buildSchema } from '../../utilities/buildASTSchema';
import { extendSchema } from '../../utilities/extendSchema';
var SomeScalarType = new GraphQLScalarType({
  name: 'SomeScalar',
  serialize: function serialize() {},
  parseValue: function parseValue() {},
  parseLiteral: function parseLiteral() {}
});
var SomeInterfaceType = new GraphQLInterfaceType({
  name: 'SomeInterface',
  fields: function fields() {
    return {
      f: {
        type: SomeObjectType
      }
    };
  }
});
var SomeObjectType = new GraphQLObjectType({
  name: 'SomeObject',
  fields: function fields() {
    return {
      f: {
        type: SomeObjectType
      }
    };
  },
  interfaces: [SomeInterfaceType]
});
var SomeUnionType = new GraphQLUnionType({
  name: 'SomeUnion',
  types: [SomeObjectType]
});
var SomeEnumType = new GraphQLEnumType({
  name: 'SomeEnum',
  values: {
    ONLY: {}
  }
});
var SomeInputObjectType = new GraphQLInputObjectType({
  name: 'SomeInputObject',
  fields: {
    val: {
      type: GraphQLString,
      defaultValue: 'hello'
    }
  }
});

function withModifiers(types) {
  return types.concat(types.map(function (type) {
    return GraphQLList(type);
  })).concat(types.map(function (type) {
    return GraphQLNonNull(type);
  })).concat(types.map(function (type) {
    return GraphQLNonNull(GraphQLList(type));
  }));
}

var outputTypes = withModifiers([GraphQLString, SomeScalarType, SomeEnumType, SomeObjectType, SomeUnionType, SomeInterfaceType]);
var notOutputTypes = withModifiers([SomeInputObjectType]);
var inputTypes = withModifiers([GraphQLString, SomeScalarType, SomeEnumType, SomeInputObjectType]);
var notInputTypes = withModifiers([SomeObjectType, SomeUnionType, SomeInterfaceType]);

function schemaWithFieldType(type) {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        f: {
          type: type
        }
      }
    }),
    types: [type]
  });
}

describe('Type System: A Schema must have Object root types', function () {
  it('accepts a Schema whose query type is an object type', function () {
    var schema = buildSchema("\n      type Query {\n        test: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
    var schemaWithDef = buildSchema("\n      schema {\n        query: QueryRoot\n      }\n\n      type QueryRoot {\n        test: String\n      }\n    ");
    expect(validateSchema(schemaWithDef)).to.deep.equal([]);
  });
  it('accepts a Schema whose query and mutation types are object types', function () {
    var schema = buildSchema("\n      type Query {\n        test: String\n      }\n\n      type Mutation {\n        test: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
    var schemaWithDef = buildSchema("\n      schema {\n        query: QueryRoot\n        mutation: MutationRoot\n      }\n\n      type QueryRoot {\n        test: String\n      }\n\n      type MutationRoot {\n        test: String\n      }\n    ");
    expect(validateSchema(schemaWithDef)).to.deep.equal([]);
  });
  it('accepts a Schema whose query and subscription types are object types', function () {
    var schema = buildSchema("\n      type Query {\n        test: String\n      }\n\n      type Subscription {\n        test: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
    var schemaWithDef = buildSchema("\n      schema {\n        query: QueryRoot\n        subscription: SubscriptionRoot\n      }\n\n      type QueryRoot {\n        test: String\n      }\n\n      type SubscriptionRoot {\n        test: String\n      }\n    ");
    expect(validateSchema(schemaWithDef)).to.deep.equal([]);
  });
  it('rejects a Schema without a query type', function () {
    var schema = buildSchema("\n      type Mutation {\n        test: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Query root type must be provided.'
    }]);
    var schemaWithDef = buildSchema("\n      schema {\n        mutation: MutationRoot\n      }\n\n      type MutationRoot {\n        test: String\n      }\n    ");
    expect(validateSchema(schemaWithDef)).to.deep.equal([{
      message: 'Query root type must be provided.',
      locations: [{
        line: 2,
        column: 7
      }]
    }]);
  });
  it('rejects a Schema whose query root type is not an Object type', function () {
    var schema = buildSchema("\n      input Query {\n        test: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Query root type must be Object type, it cannot be Query.',
      locations: [{
        line: 2,
        column: 7
      }]
    }]);
    var schemaWithDef = buildSchema("\n      schema {\n        query: SomeInputObject\n      }\n\n      input SomeInputObject {\n        test: String\n      }\n    ");
    expect(validateSchema(schemaWithDef)).to.deep.equal([{
      message: 'Query root type must be Object type, it cannot be SomeInputObject.',
      locations: [{
        line: 3,
        column: 16
      }]
    }]);
  });
  it('rejects a Schema whose mutation type is an input type', function () {
    var schema = buildSchema("\n      type Query {\n        field: String\n      }\n\n      input Mutation {\n        test: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Mutation root type must be Object type if provided, it cannot be Mutation.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
    var schemaWithDef = buildSchema("\n      schema {\n        query: Query\n        mutation: SomeInputObject\n      }\n\n      type Query {\n        field: String\n      }\n\n      input SomeInputObject {\n        test: String\n      }\n    ");
    expect(validateSchema(schemaWithDef)).to.deep.equal([{
      message: 'Mutation root type must be Object type if provided, it cannot be SomeInputObject.',
      locations: [{
        line: 4,
        column: 19
      }]
    }]);
  });
  it('rejects a Schema whose subscription type is an input type', function () {
    var schema = buildSchema("\n      type Query {\n        field: String\n      }\n\n      input Subscription {\n        test: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Subscription root type must be Object type if provided, it cannot be Subscription.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
    var schemaWithDef = buildSchema("\n      schema {\n        query: Query\n        subscription: SomeInputObject\n      }\n\n      type Query {\n        field: String\n      }\n\n      input SomeInputObject {\n        test: String\n      }\n    ");
    expect(validateSchema(schemaWithDef)).to.deep.equal([{
      message: 'Subscription root type must be Object type if provided, it cannot be SomeInputObject.',
      locations: [{
        line: 4,
        column: 23
      }]
    }]);
  });
  it('rejects a schema extended with invalid root types', function () {
    var schema = buildSchema("\n      input SomeInputObject {\n        test: String\n      }\n    ");
    schema = extendSchema(schema, parse("\n        extend schema {\n          query: SomeInputObject\n        }\n      "));
    schema = extendSchema(schema, parse("\n        extend schema {\n          mutation: SomeInputObject\n        }\n      "));
    schema = extendSchema(schema, parse("\n        extend schema {\n          subscription: SomeInputObject\n        }\n      "));
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Query root type must be Object type, it cannot be SomeInputObject.',
      locations: [{
        line: 3,
        column: 18
      }]
    }, {
      message: 'Mutation root type must be Object type if provided, it cannot be SomeInputObject.',
      locations: [{
        line: 3,
        column: 21
      }]
    }, {
      message: 'Subscription root type must be Object type if provided, it cannot be SomeInputObject.',
      locations: [{
        line: 3,
        column: 25
      }]
    }]);
  });
  it('rejects a Schema whose directives are incorrectly typed', function () {
    var schema = new GraphQLSchema({
      query: SomeObjectType,
      directives: ['somedirective']
    });
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Expected directive but got: somedirective.'
    }]);
  });
});
describe('Type System: Objects must have fields', function () {
  it('accepts an Object type with fields object', function () {
    var schema = buildSchema("\n      type Query {\n        field: SomeObject\n      }\n\n      type SomeObject {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects an Object type with missing fields', function () {
    var schema = buildSchema("\n      type Query {\n        test: IncompleteObject\n      }\n\n      type IncompleteObject\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Type IncompleteObject must define one or more fields.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
    var manualSchema = schemaWithFieldType(new GraphQLObjectType({
      name: 'IncompleteObject',
      fields: {}
    }));
    expect(validateSchema(manualSchema)).to.deep.equal([{
      message: 'Type IncompleteObject must define one or more fields.'
    }]);
    var manualSchema2 = schemaWithFieldType(new GraphQLObjectType({
      name: 'IncompleteObject',
      fields: function fields() {
        return {};
      }
    }));
    expect(validateSchema(manualSchema2)).to.deep.equal([{
      message: 'Type IncompleteObject must define one or more fields.'
    }]);
  });
  it('rejects an Object type with incorrectly named fields', function () {
    var schema = schemaWithFieldType(new GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        'bad-name-with-dashes': {
          type: GraphQLString
        }
      }
    }));
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but ' + '"bad-name-with-dashes" does not.'
    }]);
  });
  it('accepts an Object type with explicitly allowed legacy named fields', function () {
    var schemaBad = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          __badName: {
            type: GraphQLString
          }
        }
      })
    });
    var schemaOk = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          __badName: {
            type: GraphQLString
          }
        }
      }),
      allowedLegacyNames: ['__badName']
    });
    expect(validateSchema(schemaBad)).to.deep.equal([{
      message: 'Name "__badName" must not begin with "__", which is reserved by ' + 'GraphQL introspection.'
    }]);
    expect(validateSchema(schemaOk)).to.deep.equal([]);
  });
  it('throws with bad value for explicitly allowed legacy names', function () {
    expect(function () {
      return new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Query',
          fields: {
            __badName: {
              type: GraphQLString
            }
          }
        }),
        allowedLegacyNames: true
      });
    }).to.throw('"allowedLegacyNames" must be Array if provided but got: true.');
  });
});
describe('Type System: Fields args must be properly named', function () {
  it('accepts field args with valid names', function () {
    var schema = schemaWithFieldType(new GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        goodField: {
          type: GraphQLString,
          args: {
            goodArg: {
              type: GraphQLString
            }
          }
        }
      }
    }));
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects field arg with invalid names', function () {
    var QueryType = new GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        badField: {
          type: GraphQLString,
          args: {
            'bad-name-with-dashes': {
              type: GraphQLString
            }
          }
        }
      }
    });
    var schema = new GraphQLSchema({
      query: QueryType
    });
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "bad-name-with-dashes" does not.'
    }]);
  });
});
describe('Type System: Union types must be valid', function () {
  it('accepts a Union type with member types', function () {
    var schema = buildSchema("\n      type Query {\n        test: GoodUnion\n      }\n\n      type TypeA {\n        field: String\n      }\n\n      type TypeB {\n        field: String\n      }\n\n      union GoodUnion =\n        | TypeA\n        | TypeB\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects a Union type with empty types', function () {
    var schema = buildSchema("\n      type Query {\n        test: BadUnion\n      }\n\n      union BadUnion\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Union type BadUnion must define one or more member types.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
  it('rejects a Union type with duplicated member type', function () {
    var schema = buildSchema("\n      type Query {\n        test: BadUnion\n      }\n\n      type TypeA {\n        field: String\n      }\n\n      type TypeB {\n        field: String\n      }\n\n      union BadUnion =\n        | TypeA\n        | TypeB\n        | TypeA\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Union type BadUnion can only include type TypeA once.',
      locations: [{
        line: 15,
        column: 11
      }, {
        line: 17,
        column: 11
      }]
    }]);
  });
  it('rejects a Union type with non-Object members types', function () {
    var schema = buildSchema("\n      type Query {\n        test: BadUnion\n      }\n\n      type TypeA {\n        field: String\n      }\n\n      type TypeB {\n        field: String\n      }\n\n      union BadUnion =\n        | TypeA\n        | String\n        | TypeB\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Union type BadUnion can only include Object types, ' + 'it cannot include String.',
      locations: [{
        line: 16,
        column: 11
      }]
    }]);
    var badUnionMemberTypes = [GraphQLString, new GraphQLNonNull(SomeObjectType), new GraphQLList(SomeObjectType), SomeInterfaceType, SomeUnionType, SomeEnumType, SomeInputObjectType];
    badUnionMemberTypes.forEach(function (memberType) {
      var badSchema = schemaWithFieldType(new GraphQLUnionType({
        name: 'BadUnion',
        types: [memberType]
      }));
      expect(validateSchema(badSchema)).to.deep.equal([{
        message: 'Union type BadUnion can only include Object types, ' + "it cannot include ".concat(memberType, ".")
      }]);
    });
  });
});
describe('Type System: Input Objects must have fields', function () {
  it('accepts an Input Object type with fields', function () {
    var schema = buildSchema("\n      type Query {\n        field(arg: SomeInputObject): String\n      }\n\n      input SomeInputObject {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects an Input Object type with missing fields', function () {
    var schema = buildSchema("\n      type Query {\n        field(arg: SomeInputObject): String\n      }\n\n      input SomeInputObject\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Input Object type SomeInputObject must define one or more fields.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
  it('rejects an Input Object type with incorrectly typed fields', function () {
    var schema = buildSchema("\n      type Query {\n        field(arg: SomeInputObject): String\n      }\n\n      type SomeObject {\n        field: String\n      }\n\n      union SomeUnion = SomeObject\n\n      input SomeInputObject {\n        badObject: SomeObject\n        badUnion: SomeUnion\n        goodInputObject: SomeInputObject\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of SomeInputObject.badObject must be Input Type but got: SomeObject.',
      locations: [{
        line: 13,
        column: 20
      }]
    }, {
      message: 'The type of SomeInputObject.badUnion must be Input Type but got: SomeUnion.',
      locations: [{
        line: 14,
        column: 19
      }]
    }]);
  });
});
describe('Type System: Enum types must be well defined', function () {
  it('rejects an Enum type without values', function () {
    var schema = buildSchema("\n      type Query {\n        field: SomeEnum\n      }\n\n      enum SomeEnum\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Enum type SomeEnum must define one or more values.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
  it('rejects an Enum type with duplicate values', function () {
    var schema = buildSchema("\n      type Query {\n        field: SomeEnum\n      }\n\n      enum SomeEnum {\n        SOME_VALUE\n        SOME_VALUE\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Enum type SomeEnum can include value SOME_VALUE only once.',
      locations: [{
        line: 7,
        column: 9
      }, {
        line: 8,
        column: 9
      }]
    }]);
  });
  it('rejects an Enum type with incorrectly named values', function () {
    function schemaWithEnum(name) {
      return schemaWithFieldType(new GraphQLEnumType({
        name: 'SomeEnum',
        values: _defineProperty({}, name, {})
      }));
    }

    var schema1 = schemaWithEnum('#value');
    expect(validateSchema(schema1)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "#value" does not.'
    }]);
    var schema2 = schemaWithEnum('1value');
    expect(validateSchema(schema2)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "1value" does not.'
    }]);
    var schema3 = schemaWithEnum('KEBAB-CASE');
    expect(validateSchema(schema3)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "KEBAB-CASE" does not.'
    }]);
    var schema4 = schemaWithEnum('true');
    expect(validateSchema(schema4)).to.deep.equal([{
      message: 'Enum type SomeEnum cannot include value: true.'
    }]);
    var schema5 = schemaWithEnum('false');
    expect(validateSchema(schema5)).to.deep.equal([{
      message: 'Enum type SomeEnum cannot include value: false.'
    }]);
    var schema6 = schemaWithEnum('null');
    expect(validateSchema(schema6)).to.deep.equal([{
      message: 'Enum type SomeEnum cannot include value: null.'
    }]);
  });
});
describe('Type System: Object fields must have output types', function () {
  function schemaWithObjectFieldOfType(fieldType) {
    var BadObjectType = new GraphQLObjectType({
      name: 'BadObject',
      fields: {
        badField: {
          type: fieldType
        }
      }
    });
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          f: {
            type: BadObjectType
          }
        }
      }),
      types: [SomeObjectType]
    });
  }

  outputTypes.forEach(function (type) {
    it("accepts an output type as an Object field type: ".concat(type), function () {
      var schema = schemaWithObjectFieldOfType(type);
      expect(validateSchema(schema)).to.deep.equal([]);
    });
  });
  it('rejects an empty Object field type', function () {
    var schema = schemaWithObjectFieldOfType(undefined);
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of BadObject.badField must be Output Type but got: undefined.'
    }]);
  });
  notOutputTypes.forEach(function (type) {
    it("rejects a non-output type as an Object field type: ".concat(type), function () {
      var schema = schemaWithObjectFieldOfType(type);
      expect(validateSchema(schema)).to.deep.equal([{
        message: "The type of BadObject.badField must be Output Type but got: ".concat(type, ".")
      }]);
    });
  });
  it('rejects a non-type value as an Object field type', function () {
    var schema = schemaWithObjectFieldOfType(Number);
    expect(validateSchema(schema)).to.deep.equal([{
      message: "The type of BadObject.badField must be Output Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }]);
  });
  it('rejects with relevant locations for a non-output type as an Object field type', function () {
    var schema = buildSchema("\n      type Query {\n        field: [SomeInputObject]\n      }\n\n      input SomeInputObject {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of Query.field must be Output Type but got: [SomeInputObject].',
      locations: [{
        line: 3,
        column: 16
      }]
    }]);
  });
});
describe('Type System: Objects can only implement unique interfaces', function () {
  it('rejects an Object implementing a non-type values', function () {
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'BadObject',
        interfaces: [undefined],
        fields: {
          f: {
            type: GraphQLString
          }
        }
      })
    });
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Type BadObject must only implement Interface types, it cannot implement undefined.'
    }]);
  });
  it('rejects an Object implementing a non-Interface type', function () {
    var schema = buildSchema("\n      type Query {\n        test: BadObject\n      }\n\n      input SomeInputObject {\n        field: String\n      }\n\n      type BadObject implements SomeInputObject {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Type BadObject must only implement Interface types, it cannot implement SomeInputObject.',
      locations: [{
        line: 10,
        column: 33
      }]
    }]);
  });
  it('rejects an Object implementing the same interface twice', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface & AnotherInterface {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Type AnotherObject can only implement AnotherInterface once.',
      locations: [{
        line: 10,
        column: 37
      }, {
        line: 10,
        column: 56
      }]
    }]);
  });
  it('rejects an Object implementing the same interface twice due to extension', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = extendSchema(schema, parse('extend type AnotherObject implements AnotherInterface'));
    expect(validateSchema(extendedSchema)).to.deep.equal([{
      message: 'Type AnotherObject can only implement AnotherInterface once.',
      locations: [{
        line: 10,
        column: 37
      }, {
        line: 1,
        column: 38
      }]
    }]);
  });
});
describe('Type System: Interface extensions should be valid', function () {
  it('rejects an Object implementing the extended interface due to missing field', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = extendSchema(schema, parse("\n        extend interface AnotherInterface {\n          newField: String\n        }\n      "));
    expect(validateSchema(extendedSchema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.newField expected but AnotherObject does not provide it.',
      locations: [{
        line: 3,
        column: 11
      }, {
        line: 10,
        column: 7
      }]
    }]);
  });
  it('rejects an Object implementing the extended interface due to missing field args', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = extendSchema(schema, parse("\n        extend interface AnotherInterface {\n          newField(test: Boolean): String\n        }\n\n        extend type AnotherObject {\n          newField: String\n        }\n      "));
    expect(validateSchema(extendedSchema)).to.deep.equal([{
      message: 'Interface field argument AnotherInterface.newField(test:) expected but AnotherObject.newField does not provide it.',
      locations: [{
        line: 3,
        column: 20
      }, {
        line: 7,
        column: 11
      }]
    }]);
  });
  it('rejects Objects implementing the extended interface due to mismatching interface type', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = extendSchema(schema, parse("\n        extend interface AnotherInterface {\n          newInterfaceField: NewInterface\n        }\n\n        interface NewInterface {\n          newField: String\n        }\n\n        interface MismatchingInterface {\n          newField: String\n        }\n\n        extend type AnotherObject {\n          newInterfaceField: MismatchingInterface\n        }\n\n        # Required to prevent unused interface errors\n        type DummyObject implements NewInterface & MismatchingInterface {\n          newField: String\n        }\n      "));
    expect(validateSchema(extendedSchema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.newInterfaceField expects type NewInterface but AnotherObject.newInterfaceField is type MismatchingInterface.',
      locations: [{
        line: 3,
        column: 30
      }, {
        line: 15,
        column: 30
      }]
    }]);
  });
});
describe('Type System: Interface fields must have output types', function () {
  function schemaWithInterfaceFieldOfType(fieldType) {
    var BadInterfaceType = new GraphQLInterfaceType({
      name: 'BadInterface',
      fields: {
        badField: {
          type: fieldType
        }
      }
    });
    var BadImplementingType = new GraphQLObjectType({
      name: 'BadImplementing',
      interfaces: [BadInterfaceType],
      fields: {
        badField: {
          type: fieldType
        }
      }
    });
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          f: {
            type: BadInterfaceType
          }
        }
      }),
      types: [BadImplementingType, SomeObjectType]
    });
  }

  outputTypes.forEach(function (type) {
    it("accepts an output type as an Interface field type: ".concat(type), function () {
      var schema = schemaWithInterfaceFieldOfType(type);
      expect(validateSchema(schema)).to.deep.equal([]);
    });
  });
  it('rejects an empty Interface field type', function () {
    var schema = schemaWithInterfaceFieldOfType(undefined);
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of BadInterface.badField must be Output Type but got: undefined.'
    }, {
      message: 'The type of BadImplementing.badField must be Output Type but got: undefined.'
    }]);
  });
  notOutputTypes.forEach(function (type) {
    it("rejects a non-output type as an Interface field type: ".concat(type), function () {
      var schema = schemaWithInterfaceFieldOfType(type);
      expect(validateSchema(schema)).to.deep.equal([{
        message: "The type of BadInterface.badField must be Output Type but got: ".concat(type, ".")
      }, {
        message: "The type of BadImplementing.badField must be Output Type but got: ".concat(type, ".")
      }]);
    });
  });
  it('rejects a non-type value as an Interface field type', function () {
    var schema = schemaWithInterfaceFieldOfType(Number);
    expect(validateSchema(schema)).to.deep.equal([{
      message: "The type of BadInterface.badField must be Output Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }, {
      message: "The type of BadImplementing.badField must be Output Type but got: ".concat(Number, ".")
    }]);
  });
  it('rejects a non-output type as an Interface field type with locations', function () {
    var schema = buildSchema("\n      type Query {\n        test: SomeInterface\n      }\n\n      interface SomeInterface {\n        field: SomeInputObject\n      }\n\n      input SomeInputObject {\n        foo: String\n      }\n\n      type SomeObject implements SomeInterface {\n        field: SomeInputObject\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of SomeInterface.field must be Output Type but got: SomeInputObject.',
      locations: [{
        line: 7,
        column: 16
      }]
    }, {
      message: 'The type of SomeObject.field must be Output Type but got: SomeInputObject.',
      locations: [{
        line: 15,
        column: 16
      }]
    }]);
  });
  it('rejects an interface not implemented by at least one object', function () {
    var schema = buildSchema("\n      type Query {\n        test: SomeInterface\n      }\n\n      interface SomeInterface {\n        foo: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface SomeInterface must be implemented by at least one Object type.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
});
describe('Type System: Field arguments must have input types', function () {
  function schemaWithArgOfType(argType) {
    var BadObjectType = new GraphQLObjectType({
      name: 'BadObject',
      fields: {
        badField: {
          type: GraphQLString,
          args: {
            badArg: {
              type: argType
            }
          }
        }
      }
    });
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          f: {
            type: BadObjectType
          }
        }
      })
    });
  }

  inputTypes.forEach(function (type) {
    it("accepts an input type as a field arg type: ".concat(type), function () {
      var schema = schemaWithArgOfType(type);
      expect(validateSchema(schema)).to.deep.equal([]);
    });
  });
  it('rejects an empty field arg type', function () {
    var schema = schemaWithArgOfType(undefined);
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of BadObject.badField(badArg:) must be Input Type but got: undefined.'
    }]);
  });
  notInputTypes.forEach(function (type) {
    it("rejects a non-input type as a field arg type: ".concat(type), function () {
      var schema = schemaWithArgOfType(type);
      expect(validateSchema(schema)).to.deep.equal([{
        message: "The type of BadObject.badField(badArg:) must be Input Type but got: ".concat(type, ".")
      }]);
    });
  });
  it('rejects a non-type value as a field arg type', function () {
    var schema = schemaWithArgOfType(Number);
    expect(validateSchema(schema)).to.deep.equal([{
      message: "The type of BadObject.badField(badArg:) must be Input Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }]);
  });
  it('rejects a non-input type as a field arg with locations', function () {
    var schema = buildSchema("\n      type Query {\n        test(arg: SomeObject): String\n      }\n\n      type SomeObject {\n        foo: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of Query.test(arg:) must be Input Type but got: SomeObject.',
      locations: [{
        line: 3,
        column: 19
      }]
    }]);
  });
});
describe('Type System: Input Object fields must have input types', function () {
  function schemaWithInputFieldOfType(inputFieldType) {
    var BadInputObjectType = new GraphQLInputObjectType({
      name: 'BadInputObject',
      fields: {
        badField: {
          type: inputFieldType
        }
      }
    });
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          f: {
            type: GraphQLString,
            args: {
              badArg: {
                type: BadInputObjectType
              }
            }
          }
        }
      })
    });
  }

  inputTypes.forEach(function (type) {
    it("accepts an input type as an input field type: ".concat(type), function () {
      var schema = schemaWithInputFieldOfType(type);
      expect(validateSchema(schema)).to.deep.equal([]);
    });
  });
  it('rejects an empty input field type', function () {
    var schema = schemaWithInputFieldOfType(undefined);
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of BadInputObject.badField must be Input Type but got: undefined.'
    }]);
  });
  notInputTypes.forEach(function (type) {
    it("rejects a non-input type as an input field type: ".concat(type), function () {
      var schema = schemaWithInputFieldOfType(type);
      expect(validateSchema(schema)).to.deep.equal([{
        message: "The type of BadInputObject.badField must be Input Type but got: ".concat(type, ".")
      }]);
    });
  });
  it('rejects a non-type value as an input field type', function () {
    var schema = schemaWithInputFieldOfType(Number);
    expect(validateSchema(schema)).to.deep.equal([{
      message: "The type of BadInputObject.badField must be Input Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }]);
  });
  it('rejects a non-input type as an input object field with locations', function () {
    var schema = buildSchema("\n      type Query {\n        test(arg: SomeInputObject): String\n      }\n\n      input SomeInputObject {\n        foo: SomeObject\n      }\n\n      type SomeObject {\n        bar: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'The type of SomeInputObject.foo must be Input Type but got: SomeObject.',
      locations: [{
        line: 7,
        column: 14
      }]
    }]);
  });
});
describe('Objects must adhere to Interface they implement', function () {
  it('accepts an Object which implements an Interface', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String): String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('accepts an Object which implements an Interface along with more fields', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String): String\n        anotherField: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('accepts an Object which implements an Interface field along with additional optional arguments', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String, anotherInput: String): String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects an Object missing an Interface field', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        anotherField: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.field expected but ' + 'AnotherObject does not provide it.',
      locations: [{
        line: 7,
        column: 9
      }, {
        line: 10,
        column: 7
      }]
    }]);
  });
  it('rejects an Object with an incorrectly typed Interface field', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String): Int\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.field expects type String but ' + 'AnotherObject.field is type Int.',
      locations: [{
        line: 7,
        column: 31
      }, {
        line: 11,
        column: 31
      }]
    }]);
  });
  it('rejects an Object with a differently typed Interface field', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      type A { foo: String }\n      type B { foo: String }\n\n      interface AnotherInterface {\n        field: A\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: B\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.field expects type A but ' + 'AnotherObject.field is type B.',
      locations: [{
        line: 10,
        column: 16
      }, {
        line: 14,
        column: 16
      }]
    }]);
  });
  it('accepts an Object with a subtyped Interface field (interface)', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: AnotherInterface\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: AnotherObject\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('accepts an Object with a subtyped Interface field (union)', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      type SomeObject {\n        field: String\n      }\n\n      union SomeUnionType = SomeObject\n\n      interface AnotherInterface {\n        field: SomeUnionType\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: SomeObject\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects an Object missing an Interface argument', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field argument AnotherInterface.field(input:) expected ' + 'but AnotherObject.field does not provide it.',
      locations: [{
        line: 7,
        column: 15
      }, {
        line: 11,
        column: 9
      }]
    }]);
  });
  it('rejects an Object with an incorrectly typed Interface argument', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: Int): String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field argument AnotherInterface.field(input:) expects ' + 'type String but AnotherObject.field(input:) is type Int.',
      locations: [{
        line: 7,
        column: 22
      }, {
        line: 11,
        column: 22
      }]
    }]);
  });
  it('rejects an Object with both an incorrectly typed field and argument', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: Int): Int\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.field expects type String but ' + 'AnotherObject.field is type Int.',
      locations: [{
        line: 7,
        column: 31
      }, {
        line: 11,
        column: 28
      }]
    }, {
      message: 'Interface field argument AnotherInterface.field(input:) expects ' + 'type String but AnotherObject.field(input:) is type Int.',
      locations: [{
        line: 7,
        column: 22
      }, {
        line: 11,
        column: 22
      }]
    }]);
  });
  it('rejects an Object which implements an Interface field along with additional required arguments', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String, anotherInput: String!): String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Object field argument AnotherObject.field(anotherInput:) is of ' + 'required type String! but is not also provided by the Interface ' + 'field AnotherInterface.field.',
      locations: [{
        line: 11,
        column: 44
      }, {
        line: 7,
        column: 9
      }]
    }]);
  });
  it('accepts an Object with an equivalently wrapped Interface field type', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: [String]!\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: [String]!\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects an Object with a non-list Interface field list type', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: [String]\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.field expects type [String] ' + 'but AnotherObject.field is type String.',
      locations: [{
        line: 7,
        column: 16
      }, {
        line: 11,
        column: 16
      }]
    }]);
  });
  it('rejects an Object with a list Interface field non-list type', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: [String]\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.field expects type String but ' + 'AnotherObject.field is type [String].',
      locations: [{
        line: 7,
        column: 16
      }, {
        line: 11,
        column: 16
      }]
    }]);
  });
  it('accepts an Object with a subset non-null Interface field type', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String!\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  it('rejects an Object with a superset nullable Interface field type', function () {
    var schema = buildSchema("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String!\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    expect(validateSchema(schema)).to.deep.equal([{
      message: 'Interface field AnotherInterface.field expects type String! ' + 'but AnotherObject.field is type String.',
      locations: [{
        line: 7,
        column: 16
      }, {
        line: 11,
        column: 16
      }]
    }]);
  });
});