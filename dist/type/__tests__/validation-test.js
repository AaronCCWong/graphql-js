"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _ = require("../../");

var _parser = require("../../language/parser");

var _validate = require("../validate");

var _buildASTSchema = require("../../utilities/buildASTSchema");

var _extendSchema = require("../../utilities/extendSchema");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SomeScalarType = new _.GraphQLScalarType({
  name: 'SomeScalar',
  serialize: function serialize() {},
  parseValue: function parseValue() {},
  parseLiteral: function parseLiteral() {}
});
var SomeInterfaceType = new _.GraphQLInterfaceType({
  name: 'SomeInterface',
  fields: function fields() {
    return {
      f: {
        type: SomeObjectType
      }
    };
  }
});
var SomeObjectType = new _.GraphQLObjectType({
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
var SomeUnionType = new _.GraphQLUnionType({
  name: 'SomeUnion',
  types: [SomeObjectType]
});
var SomeEnumType = new _.GraphQLEnumType({
  name: 'SomeEnum',
  values: {
    ONLY: {}
  }
});
var SomeInputObjectType = new _.GraphQLInputObjectType({
  name: 'SomeInputObject',
  fields: {
    val: {
      type: _.GraphQLString,
      defaultValue: 'hello'
    }
  }
});

function withModifiers(types) {
  return types.concat(types.map(function (type) {
    return (0, _.GraphQLList)(type);
  })).concat(types.map(function (type) {
    return (0, _.GraphQLNonNull)(type);
  })).concat(types.map(function (type) {
    return (0, _.GraphQLNonNull)((0, _.GraphQLList)(type));
  }));
}

var outputTypes = withModifiers([_.GraphQLString, SomeScalarType, SomeEnumType, SomeObjectType, SomeUnionType, SomeInterfaceType]);
var notOutputTypes = withModifiers([SomeInputObjectType]);
var inputTypes = withModifiers([_.GraphQLString, SomeScalarType, SomeEnumType, SomeInputObjectType]);
var notInputTypes = withModifiers([SomeObjectType, SomeUnionType, SomeInterfaceType]);

function schemaWithFieldType(type) {
  return new _.GraphQLSchema({
    query: new _.GraphQLObjectType({
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

(0, _mocha.describe)('Type System: A Schema must have Object root types', function () {
  (0, _mocha.it)('accepts a Schema whose query type is an object type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
    var schemaWithDef = (0, _buildASTSchema.buildSchema)("\n      schema {\n        query: QueryRoot\n      }\n\n      type QueryRoot {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schemaWithDef)).to.deep.equal([]);
  });
  (0, _mocha.it)('accepts a Schema whose query and mutation types are object types', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: String\n      }\n\n      type Mutation {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
    var schemaWithDef = (0, _buildASTSchema.buildSchema)("\n      schema {\n        query: QueryRoot\n        mutation: MutationRoot\n      }\n\n      type QueryRoot {\n        test: String\n      }\n\n      type MutationRoot {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schemaWithDef)).to.deep.equal([]);
  });
  (0, _mocha.it)('accepts a Schema whose query and subscription types are object types', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: String\n      }\n\n      type Subscription {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
    var schemaWithDef = (0, _buildASTSchema.buildSchema)("\n      schema {\n        query: QueryRoot\n        subscription: SubscriptionRoot\n      }\n\n      type QueryRoot {\n        test: String\n      }\n\n      type SubscriptionRoot {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schemaWithDef)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects a Schema without a query type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Mutation {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Query root type must be provided.'
    }]);
    var schemaWithDef = (0, _buildASTSchema.buildSchema)("\n      schema {\n        mutation: MutationRoot\n      }\n\n      type MutationRoot {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schemaWithDef)).to.deep.equal([{
      message: 'Query root type must be provided.',
      locations: [{
        line: 2,
        column: 7
      }]
    }]);
  });
  (0, _mocha.it)('rejects a Schema whose query root type is not an Object type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      input Query {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Query root type must be Object type, it cannot be Query.',
      locations: [{
        line: 2,
        column: 7
      }]
    }]);
    var schemaWithDef = (0, _buildASTSchema.buildSchema)("\n      schema {\n        query: SomeInputObject\n      }\n\n      input SomeInputObject {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schemaWithDef)).to.deep.equal([{
      message: 'Query root type must be Object type, it cannot be SomeInputObject.',
      locations: [{
        line: 3,
        column: 16
      }]
    }]);
  });
  (0, _mocha.it)('rejects a Schema whose mutation type is an input type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field: String\n      }\n\n      input Mutation {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Mutation root type must be Object type if provided, it cannot be Mutation.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
    var schemaWithDef = (0, _buildASTSchema.buildSchema)("\n      schema {\n        query: Query\n        mutation: SomeInputObject\n      }\n\n      type Query {\n        field: String\n      }\n\n      input SomeInputObject {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schemaWithDef)).to.deep.equal([{
      message: 'Mutation root type must be Object type if provided, it cannot be SomeInputObject.',
      locations: [{
        line: 4,
        column: 19
      }]
    }]);
  });
  (0, _mocha.it)('rejects a Schema whose subscription type is an input type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field: String\n      }\n\n      input Subscription {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Subscription root type must be Object type if provided, it cannot be Subscription.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
    var schemaWithDef = (0, _buildASTSchema.buildSchema)("\n      schema {\n        query: Query\n        subscription: SomeInputObject\n      }\n\n      type Query {\n        field: String\n      }\n\n      input SomeInputObject {\n        test: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schemaWithDef)).to.deep.equal([{
      message: 'Subscription root type must be Object type if provided, it cannot be SomeInputObject.',
      locations: [{
        line: 4,
        column: 23
      }]
    }]);
  });
  (0, _mocha.it)('rejects a schema extended with invalid root types', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      input SomeInputObject {\n        test: String\n      }\n    ");
    schema = (0, _extendSchema.extendSchema)(schema, (0, _parser.parse)("\n        extend schema {\n          query: SomeInputObject\n        }\n      "));
    schema = (0, _extendSchema.extendSchema)(schema, (0, _parser.parse)("\n        extend schema {\n          mutation: SomeInputObject\n        }\n      "));
    schema = (0, _extendSchema.extendSchema)(schema, (0, _parser.parse)("\n        extend schema {\n          subscription: SomeInputObject\n        }\n      "));
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects a Schema whose directives are incorrectly typed', function () {
    var schema = new _.GraphQLSchema({
      query: SomeObjectType,
      directives: ['somedirective']
    });
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Expected directive but got: somedirective.'
    }]);
  });
});
(0, _mocha.describe)('Type System: Objects must have fields', function () {
  (0, _mocha.it)('accepts an Object type with fields object', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field: SomeObject\n      }\n\n      type SomeObject {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects an Object type with missing fields', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: IncompleteObject\n      }\n\n      type IncompleteObject\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Type IncompleteObject must define one or more fields.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
    var manualSchema = schemaWithFieldType(new _.GraphQLObjectType({
      name: 'IncompleteObject',
      fields: {}
    }));
    (0, _chai.expect)((0, _validate.validateSchema)(manualSchema)).to.deep.equal([{
      message: 'Type IncompleteObject must define one or more fields.'
    }]);
    var manualSchema2 = schemaWithFieldType(new _.GraphQLObjectType({
      name: 'IncompleteObject',
      fields: function fields() {
        return {};
      }
    }));
    (0, _chai.expect)((0, _validate.validateSchema)(manualSchema2)).to.deep.equal([{
      message: 'Type IncompleteObject must define one or more fields.'
    }]);
  });
  (0, _mocha.it)('rejects an Object type with incorrectly named fields', function () {
    var schema = schemaWithFieldType(new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        'bad-name-with-dashes': {
          type: _.GraphQLString
        }
      }
    }));
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but ' + '"bad-name-with-dashes" does not.'
    }]);
  });
  (0, _mocha.it)('accepts an Object type with explicitly allowed legacy named fields', function () {
    var schemaBad = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          __badName: {
            type: _.GraphQLString
          }
        }
      })
    });
    var schemaOk = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          __badName: {
            type: _.GraphQLString
          }
        }
      }),
      allowedLegacyNames: ['__badName']
    });
    (0, _chai.expect)((0, _validate.validateSchema)(schemaBad)).to.deep.equal([{
      message: 'Name "__badName" must not begin with "__", which is reserved by ' + 'GraphQL introspection.'
    }]);
    (0, _chai.expect)((0, _validate.validateSchema)(schemaOk)).to.deep.equal([]);
  });
  (0, _mocha.it)('throws with bad value for explicitly allowed legacy names', function () {
    (0, _chai.expect)(function () {
      return new _.GraphQLSchema({
        query: new _.GraphQLObjectType({
          name: 'Query',
          fields: {
            __badName: {
              type: _.GraphQLString
            }
          }
        }),
        allowedLegacyNames: true
      });
    }).to.throw('"allowedLegacyNames" must be Array if provided but got: true.');
  });
});
(0, _mocha.describe)('Type System: Fields args must be properly named', function () {
  (0, _mocha.it)('accepts field args with valid names', function () {
    var schema = schemaWithFieldType(new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        goodField: {
          type: _.GraphQLString,
          args: {
            goodArg: {
              type: _.GraphQLString
            }
          }
        }
      }
    }));
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects field arg with invalid names', function () {
    var QueryType = new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        badField: {
          type: _.GraphQLString,
          args: {
            'bad-name-with-dashes': {
              type: _.GraphQLString
            }
          }
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: QueryType
    });
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "bad-name-with-dashes" does not.'
    }]);
  });
});
(0, _mocha.describe)('Type System: Union types must be valid', function () {
  (0, _mocha.it)('accepts a Union type with member types', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: GoodUnion\n      }\n\n      type TypeA {\n        field: String\n      }\n\n      type TypeB {\n        field: String\n      }\n\n      union GoodUnion =\n        | TypeA\n        | TypeB\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects a Union type with empty types', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: BadUnion\n      }\n\n      union BadUnion\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Union type BadUnion must define one or more member types.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
  (0, _mocha.it)('rejects a Union type with duplicated member type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: BadUnion\n      }\n\n      type TypeA {\n        field: String\n      }\n\n      type TypeB {\n        field: String\n      }\n\n      union BadUnion =\n        | TypeA\n        | TypeB\n        | TypeA\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects a Union type with non-Object members types', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: BadUnion\n      }\n\n      type TypeA {\n        field: String\n      }\n\n      type TypeB {\n        field: String\n      }\n\n      union BadUnion =\n        | TypeA\n        | String\n        | TypeB\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Union type BadUnion can only include Object types, ' + 'it cannot include String.',
      locations: [{
        line: 16,
        column: 11
      }]
    }]);
    var badUnionMemberTypes = [_.GraphQLString, new _.GraphQLNonNull(SomeObjectType), new _.GraphQLList(SomeObjectType), SomeInterfaceType, SomeUnionType, SomeEnumType, SomeInputObjectType];
    badUnionMemberTypes.forEach(function (memberType) {
      var badSchema = schemaWithFieldType(new _.GraphQLUnionType({
        name: 'BadUnion',
        types: [memberType]
      }));
      (0, _chai.expect)((0, _validate.validateSchema)(badSchema)).to.deep.equal([{
        message: 'Union type BadUnion can only include Object types, ' + "it cannot include ".concat(memberType, ".")
      }]);
    });
  });
});
(0, _mocha.describe)('Type System: Input Objects must have fields', function () {
  (0, _mocha.it)('accepts an Input Object type with fields', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field(arg: SomeInputObject): String\n      }\n\n      input SomeInputObject {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects an Input Object type with missing fields', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field(arg: SomeInputObject): String\n      }\n\n      input SomeInputObject\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Input Object type SomeInputObject must define one or more fields.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
  (0, _mocha.it)('rejects an Input Object type with incorrectly typed fields', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field(arg: SomeInputObject): String\n      }\n\n      type SomeObject {\n        field: String\n      }\n\n      union SomeUnion = SomeObject\n\n      input SomeInputObject {\n        badObject: SomeObject\n        badUnion: SomeUnion\n        goodInputObject: SomeInputObject\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
(0, _mocha.describe)('Type System: Enum types must be well defined', function () {
  (0, _mocha.it)('rejects an Enum type without values', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field: SomeEnum\n      }\n\n      enum SomeEnum\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Enum type SomeEnum must define one or more values.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
  (0, _mocha.it)('rejects an Enum type with duplicate values', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field: SomeEnum\n      }\n\n      enum SomeEnum {\n        SOME_VALUE\n        SOME_VALUE\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Enum type with incorrectly named values', function () {
    function schemaWithEnum(name) {
      return schemaWithFieldType(new _.GraphQLEnumType({
        name: 'SomeEnum',
        values: _defineProperty({}, name, {})
      }));
    }

    var schema1 = schemaWithEnum('#value');
    (0, _chai.expect)((0, _validate.validateSchema)(schema1)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "#value" does not.'
    }]);
    var schema2 = schemaWithEnum('1value');
    (0, _chai.expect)((0, _validate.validateSchema)(schema2)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "1value" does not.'
    }]);
    var schema3 = schemaWithEnum('KEBAB-CASE');
    (0, _chai.expect)((0, _validate.validateSchema)(schema3)).to.deep.equal([{
      message: 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "KEBAB-CASE" does not.'
    }]);
    var schema4 = schemaWithEnum('true');
    (0, _chai.expect)((0, _validate.validateSchema)(schema4)).to.deep.equal([{
      message: 'Enum type SomeEnum cannot include value: true.'
    }]);
    var schema5 = schemaWithEnum('false');
    (0, _chai.expect)((0, _validate.validateSchema)(schema5)).to.deep.equal([{
      message: 'Enum type SomeEnum cannot include value: false.'
    }]);
    var schema6 = schemaWithEnum('null');
    (0, _chai.expect)((0, _validate.validateSchema)(schema6)).to.deep.equal([{
      message: 'Enum type SomeEnum cannot include value: null.'
    }]);
  });
});
(0, _mocha.describe)('Type System: Object fields must have output types', function () {
  function schemaWithObjectFieldOfType(fieldType) {
    var BadObjectType = new _.GraphQLObjectType({
      name: 'BadObject',
      fields: {
        badField: {
          type: fieldType
        }
      }
    });
    return new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
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
    (0, _mocha.it)("accepts an output type as an Object field type: ".concat(type), function () {
      var schema = schemaWithObjectFieldOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
    });
  });
  (0, _mocha.it)('rejects an empty Object field type', function () {
    var schema = schemaWithObjectFieldOfType(undefined);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'The type of BadObject.badField must be Output Type but got: undefined.'
    }]);
  });
  notOutputTypes.forEach(function (type) {
    (0, _mocha.it)("rejects a non-output type as an Object field type: ".concat(type), function () {
      var schema = schemaWithObjectFieldOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
        message: "The type of BadObject.badField must be Output Type but got: ".concat(type, ".")
      }]);
    });
  });
  (0, _mocha.it)('rejects a non-type value as an Object field type', function () {
    var schema = schemaWithObjectFieldOfType(Number);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: "The type of BadObject.badField must be Output Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }]);
  });
  (0, _mocha.it)('rejects with relevant locations for a non-output type as an Object field type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        field: [SomeInputObject]\n      }\n\n      input SomeInputObject {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'The type of Query.field must be Output Type but got: [SomeInputObject].',
      locations: [{
        line: 3,
        column: 16
      }]
    }]);
  });
});
(0, _mocha.describe)('Type System: Objects can only implement unique interfaces', function () {
  (0, _mocha.it)('rejects an Object implementing a non-type values', function () {
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'BadObject',
        interfaces: [undefined],
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      })
    });
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Type BadObject must only implement Interface types, it cannot implement undefined.'
    }]);
  });
  (0, _mocha.it)('rejects an Object implementing a non-Interface type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: BadObject\n      }\n\n      input SomeInputObject {\n        field: String\n      }\n\n      type BadObject implements SomeInputObject {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Type BadObject must only implement Interface types, it cannot implement SomeInputObject.',
      locations: [{
        line: 10,
        column: 33
      }]
    }]);
  });
  (0, _mocha.it)('rejects an Object implementing the same interface twice', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface & AnotherInterface {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object implementing the same interface twice due to extension', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = (0, _extendSchema.extendSchema)(schema, (0, _parser.parse)('extend type AnotherObject implements AnotherInterface'));
    (0, _chai.expect)((0, _validate.validateSchema)(extendedSchema)).to.deep.equal([{
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
(0, _mocha.describe)('Type System: Interface extensions should be valid', function () {
  (0, _mocha.it)('rejects an Object implementing the extended interface due to missing field', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = (0, _extendSchema.extendSchema)(schema, (0, _parser.parse)("\n        extend interface AnotherInterface {\n          newField: String\n        }\n      "));
    (0, _chai.expect)((0, _validate.validateSchema)(extendedSchema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object implementing the extended interface due to missing field args', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = (0, _extendSchema.extendSchema)(schema, (0, _parser.parse)("\n        extend interface AnotherInterface {\n          newField(test: Boolean): String\n        }\n\n        extend type AnotherObject {\n          newField: String\n        }\n      "));
    (0, _chai.expect)((0, _validate.validateSchema)(extendedSchema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects Objects implementing the extended interface due to mismatching interface type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    var extendedSchema = (0, _extendSchema.extendSchema)(schema, (0, _parser.parse)("\n        extend interface AnotherInterface {\n          newInterfaceField: NewInterface\n        }\n\n        interface NewInterface {\n          newField: String\n        }\n\n        interface MismatchingInterface {\n          newField: String\n        }\n\n        extend type AnotherObject {\n          newInterfaceField: MismatchingInterface\n        }\n\n        # Required to prevent unused interface errors\n        type DummyObject implements NewInterface & MismatchingInterface {\n          newField: String\n        }\n      "));
    (0, _chai.expect)((0, _validate.validateSchema)(extendedSchema)).to.deep.equal([{
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
(0, _mocha.describe)('Type System: Interface fields must have output types', function () {
  function schemaWithInterfaceFieldOfType(fieldType) {
    var BadInterfaceType = new _.GraphQLInterfaceType({
      name: 'BadInterface',
      fields: {
        badField: {
          type: fieldType
        }
      }
    });
    var BadImplementingType = new _.GraphQLObjectType({
      name: 'BadImplementing',
      interfaces: [BadInterfaceType],
      fields: {
        badField: {
          type: fieldType
        }
      }
    });
    return new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
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
    (0, _mocha.it)("accepts an output type as an Interface field type: ".concat(type), function () {
      var schema = schemaWithInterfaceFieldOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
    });
  });
  (0, _mocha.it)('rejects an empty Interface field type', function () {
    var schema = schemaWithInterfaceFieldOfType(undefined);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'The type of BadInterface.badField must be Output Type but got: undefined.'
    }, {
      message: 'The type of BadImplementing.badField must be Output Type but got: undefined.'
    }]);
  });
  notOutputTypes.forEach(function (type) {
    (0, _mocha.it)("rejects a non-output type as an Interface field type: ".concat(type), function () {
      var schema = schemaWithInterfaceFieldOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
        message: "The type of BadInterface.badField must be Output Type but got: ".concat(type, ".")
      }, {
        message: "The type of BadImplementing.badField must be Output Type but got: ".concat(type, ".")
      }]);
    });
  });
  (0, _mocha.it)('rejects a non-type value as an Interface field type', function () {
    var schema = schemaWithInterfaceFieldOfType(Number);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: "The type of BadInterface.badField must be Output Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }, {
      message: "The type of BadImplementing.badField must be Output Type but got: ".concat(Number, ".")
    }]);
  });
  (0, _mocha.it)('rejects a non-output type as an Interface field type with locations', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: SomeInterface\n      }\n\n      interface SomeInterface {\n        field: SomeInputObject\n      }\n\n      input SomeInputObject {\n        foo: String\n      }\n\n      type SomeObject implements SomeInterface {\n        field: SomeInputObject\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an interface not implemented by at least one object', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: SomeInterface\n      }\n\n      interface SomeInterface {\n        foo: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'Interface SomeInterface must be implemented by at least one Object type.',
      locations: [{
        line: 6,
        column: 7
      }]
    }]);
  });
});
(0, _mocha.describe)('Type System: Field arguments must have input types', function () {
  function schemaWithArgOfType(argType) {
    var BadObjectType = new _.GraphQLObjectType({
      name: 'BadObject',
      fields: {
        badField: {
          type: _.GraphQLString,
          args: {
            badArg: {
              type: argType
            }
          }
        }
      }
    });
    return new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
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
    (0, _mocha.it)("accepts an input type as a field arg type: ".concat(type), function () {
      var schema = schemaWithArgOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
    });
  });
  (0, _mocha.it)('rejects an empty field arg type', function () {
    var schema = schemaWithArgOfType(undefined);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'The type of BadObject.badField(badArg:) must be Input Type but got: undefined.'
    }]);
  });
  notInputTypes.forEach(function (type) {
    (0, _mocha.it)("rejects a non-input type as a field arg type: ".concat(type), function () {
      var schema = schemaWithArgOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
        message: "The type of BadObject.badField(badArg:) must be Input Type but got: ".concat(type, ".")
      }]);
    });
  });
  (0, _mocha.it)('rejects a non-type value as a field arg type', function () {
    var schema = schemaWithArgOfType(Number);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: "The type of BadObject.badField(badArg:) must be Input Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }]);
  });
  (0, _mocha.it)('rejects a non-input type as a field arg with locations', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test(arg: SomeObject): String\n      }\n\n      type SomeObject {\n        foo: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'The type of Query.test(arg:) must be Input Type but got: SomeObject.',
      locations: [{
        line: 3,
        column: 19
      }]
    }]);
  });
});
(0, _mocha.describe)('Type System: Input Object fields must have input types', function () {
  function schemaWithInputFieldOfType(inputFieldType) {
    var BadInputObjectType = new _.GraphQLInputObjectType({
      name: 'BadInputObject',
      fields: {
        badField: {
          type: inputFieldType
        }
      }
    });
    return new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          f: {
            type: _.GraphQLString,
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
    (0, _mocha.it)("accepts an input type as an input field type: ".concat(type), function () {
      var schema = schemaWithInputFieldOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
    });
  });
  (0, _mocha.it)('rejects an empty input field type', function () {
    var schema = schemaWithInputFieldOfType(undefined);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'The type of BadInputObject.badField must be Input Type but got: undefined.'
    }]);
  });
  notInputTypes.forEach(function (type) {
    (0, _mocha.it)("rejects a non-input type as an input field type: ".concat(type), function () {
      var schema = schemaWithInputFieldOfType(type);
      (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
        message: "The type of BadInputObject.badField must be Input Type but got: ".concat(type, ".")
      }]);
    });
  });
  (0, _mocha.it)('rejects a non-type value as an input field type', function () {
    var schema = schemaWithInputFieldOfType(Number);
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: "The type of BadInputObject.badField must be Input Type but got: ".concat(Number, ".")
    }, {
      message: "Expected GraphQL named type but got: ".concat(Number, ".")
    }]);
  });
  (0, _mocha.it)('rejects a non-input type as an input object field with locations', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test(arg: SomeInputObject): String\n      }\n\n      input SomeInputObject {\n        foo: SomeObject\n      }\n\n      type SomeObject {\n        bar: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
      message: 'The type of SomeInputObject.foo must be Input Type but got: SomeObject.',
      locations: [{
        line: 7,
        column: 14
      }]
    }]);
  });
});
(0, _mocha.describe)('Objects must adhere to Interface they implement', function () {
  (0, _mocha.it)('accepts an Object which implements an Interface', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String): String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('accepts an Object which implements an Interface along with more fields', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String): String\n        anotherField: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('accepts an Object which implements an Interface field along with additional optional arguments', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String, anotherInput: String): String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects an Object missing an Interface field', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        anotherField: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object with an incorrectly typed Interface field', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String): Int\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object with a differently typed Interface field', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      type A { foo: String }\n      type B { foo: String }\n\n      interface AnotherInterface {\n        field: A\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: B\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('accepts an Object with a subtyped Interface field (interface)', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: AnotherInterface\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: AnotherObject\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('accepts an Object with a subtyped Interface field (union)', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      type SomeObject {\n        field: String\n      }\n\n      union SomeUnionType = SomeObject\n\n      interface AnotherInterface {\n        field: SomeUnionType\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: SomeObject\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects an Object missing an Interface argument', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object with an incorrectly typed Interface argument', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: Int): String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object with both an incorrectly typed field and argument', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: Int): Int\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object which implements an Interface field along with additional required arguments', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field(input: String): String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field(input: String, anotherInput: String!): String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('accepts an Object with an equivalently wrapped Interface field type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: [String]!\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: [String]!\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects an Object with a non-list Interface field list type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: [String]\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('rejects an Object with a list Interface field non-list type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: [String]\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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
  (0, _mocha.it)('accepts an Object with a subset non-null Interface field type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String!\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([]);
  });
  (0, _mocha.it)('rejects an Object with a superset nullable Interface field type', function () {
    var schema = (0, _buildASTSchema.buildSchema)("\n      type Query {\n        test: AnotherObject\n      }\n\n      interface AnotherInterface {\n        field: String!\n      }\n\n      type AnotherObject implements AnotherInterface {\n        field: String\n      }\n    ");
    (0, _chai.expect)((0, _validate.validateSchema)(schema)).to.deep.equal([{
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