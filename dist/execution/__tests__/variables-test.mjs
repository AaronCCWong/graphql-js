/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { inspect } from 'util';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { execute } from '../execute';
import { parse } from '../../language';
import { GraphQLSchema, GraphQLObjectType, GraphQLInputObjectType, GraphQLList, GraphQLString, GraphQLNonNull, GraphQLScalarType } from '../../type';
var TestComplexScalar = new GraphQLScalarType({
  name: 'ComplexScalar',
  serialize: function serialize(value) {
    if (value === 'DeserializedValue') {
      return 'SerializedValue';
    }

    return null;
  },
  parseValue: function parseValue(value) {
    if (value === 'SerializedValue') {
      return 'DeserializedValue';
    }

    return null;
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.value === 'SerializedValue') {
      return 'DeserializedValue';
    }

    return null;
  }
});
var TestInputObject = new GraphQLInputObjectType({
  name: 'TestInputObject',
  fields: {
    a: {
      type: GraphQLString
    },
    b: {
      type: GraphQLList(GraphQLString)
    },
    c: {
      type: GraphQLNonNull(GraphQLString)
    },
    d: {
      type: TestComplexScalar
    }
  }
});
var TestNestedInputObject = new GraphQLInputObjectType({
  name: 'TestNestedInputObject',
  fields: {
    na: {
      type: GraphQLNonNull(TestInputObject)
    },
    nb: {
      type: GraphQLNonNull(GraphQLString)
    }
  }
});

function fieldWithInputArg(inputArg) {
  return {
    type: GraphQLString,
    args: {
      input: inputArg
    },
    resolve: function resolve(_, args) {
      if (args.hasOwnProperty('input')) {
        return inspect(args.input, {
          depth: null
        });
      }
    }
  };
}

var TestType = new GraphQLObjectType({
  name: 'TestType',
  fields: {
    fieldWithObjectInput: fieldWithInputArg({
      type: TestInputObject
    }),
    fieldWithNullableStringInput: fieldWithInputArg({
      type: GraphQLString
    }),
    fieldWithNonNullableStringInput: fieldWithInputArg({
      type: GraphQLNonNull(GraphQLString)
    }),
    fieldWithDefaultArgumentValue: fieldWithInputArg({
      type: GraphQLString,
      defaultValue: 'Hello World'
    }),
    fieldWithNonNullableStringInputAndDefaultArgumentValue: fieldWithInputArg({
      type: GraphQLNonNull(GraphQLString),
      defaultValue: 'Hello World'
    }),
    fieldWithNestedInputObject: fieldWithInputArg({
      type: TestNestedInputObject,
      defaultValue: 'Hello World'
    }),
    list: fieldWithInputArg({
      type: GraphQLList(GraphQLString)
    }),
    nnList: fieldWithInputArg({
      type: GraphQLNonNull(GraphQLList(GraphQLString))
    }),
    listNN: fieldWithInputArg({
      type: GraphQLList(GraphQLNonNull(GraphQLString))
    }),
    nnListNN: fieldWithInputArg({
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))
    })
  }
});
var schema = new GraphQLSchema({
  query: TestType
});

function executeQuery(query, variableValues) {
  var document = parse(query);
  return execute({
    schema: schema,
    document: document,
    variableValues: variableValues
  });
}

describe('Execute: Handles inputs', function () {
  describe('Handles objects and nullability', function () {
    describe('using inline structs', function () {
      it('executes with complex input', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {a: \"foo\", b: [\"bar\"], c: \"baz\"})\n          }\n        ");
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      it('properly parses single value to list', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {a: \"foo\", b: \"bar\", c: \"baz\"})\n          }\n        ");
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      it('properly parses null value to null', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {a: null, b: null, c: \"C\", d: null})\n          }\n        ");
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: null, b: null, c: 'C', d: null }"
          }
        });
      });
      it('properly parses null value in list', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {b: [\"A\",null,\"C\"], c: \"C\"})\n          }\n        ");
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ b: [ 'A', null, 'C' ], c: 'C' }"
          }
        });
      });
      it('does not use incorrect value', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: [\"foo\", \"bar\", \"baz\"])\n          }\n        ");
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: null
          },
          errors: [{
            message: 'Argument "input" has invalid value ["foo", "bar", "baz"].',
            path: ['fieldWithObjectInput'],
            locations: [{
              line: 3,
              column: 41
            }]
          }]
        });
      });
      it('properly runs parseLiteral on complex scalar types', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {c: \"foo\", d: \"SerializedValue\"})\n          }\n        ");
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ c: 'foo', d: 'DeserializedValue' }"
          }
        });
      });
    });
    describe('using variables', function () {
      var doc = "\n        query ($input: TestInputObject) {\n          fieldWithObjectInput(input: $input)\n        }\n      ";
      it('executes with complex input', function () {
        var params = {
          input: {
            a: 'foo',
            b: ['bar'],
            c: 'baz'
          }
        };
        var result = executeQuery(doc, params);
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      it('uses undefined when variable not provided', function () {
        var result = executeQuery("\n          query q($input: String) {\n            fieldWithNullableStringInput(input: $input)\n          }", {// Intentionally missing variable values.
        });
        expect(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: null
          }
        });
      });
      it('uses null when variable provided explicit null value', function () {
        var result = executeQuery("\n          query q($input: String) {\n            fieldWithNullableStringInput(input: $input)\n          }", {
          input: null
        });
        expect(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: 'null'
          }
        });
      });
      it('uses default value when not provided', function () {
        var result = executeQuery("\n          query ($input: TestInputObject = {a: \"foo\", b: [\"bar\"], c: \"baz\"}) {\n            fieldWithObjectInput(input: $input)\n          }\n        ");
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      it('does not use default value when provided', function () {
        var result = executeQuery("query q($input: String = \"Default value\") {\n            fieldWithNullableStringInput(input: $input)\n          }", {
          input: 'Variable value'
        });
        expect(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: "'Variable value'"
          }
        });
      });
      it('uses explicit null value instead of default value', function () {
        var result = executeQuery("\n          query q($input: String = \"Default value\") {\n            fieldWithNullableStringInput(input: $input)\n          }", {
          input: null
        });
        expect(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: 'null'
          }
        });
      });
      it('uses null default value when not provided', function () {
        var result = executeQuery("\n          query q($input: String = null) {\n            fieldWithNullableStringInput(input: $input)\n          }", {// Intentionally missing variable values.
        });
        expect(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: 'null'
          }
        });
      });
      it('properly parses single value to list', function () {
        var params = {
          input: {
            a: 'foo',
            b: 'bar',
            c: 'baz'
          }
        };
        var result = executeQuery(doc, params);
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      it('executes with complex scalar input', function () {
        var params = {
          input: {
            c: 'foo',
            d: 'SerializedValue'
          }
        };
        var result = executeQuery(doc, params);
        expect(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ c: 'foo', d: 'DeserializedValue' }"
          }
        });
      });
      it('errors on null for nested non-null', function () {
        var params = {
          input: {
            a: 'foo',
            b: 'bar',
            c: null
          }
        };
        var result = executeQuery(doc, params);
        expect(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value ' + '{"a":"foo","b":"bar","c":null}; ' + 'Expected non-nullable type String! not to be null at value.c.',
            locations: [{
              line: 2,
              column: 16
            }]
          }]
        });
      });
      it('errors on incorrect type', function () {
        var result = executeQuery(doc, {
          input: 'foo bar'
        });
        expect(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value "foo bar"; ' + 'Expected type TestInputObject to be an object.',
            locations: [{
              line: 2,
              column: 16
            }]
          }]
        });
      });
      it('errors on omission of nested non-null', function () {
        var result = executeQuery(doc, {
          input: {
            a: 'foo',
            b: 'bar'
          }
        });
        expect(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value {"a":"foo","b":"bar"}; ' + 'Field value.c of required type String! was not provided.',
            locations: [{
              line: 2,
              column: 16
            }]
          }]
        });
      });
      it('errors on deep nested errors and with many errors', function () {
        var nestedDoc = "\n          query ($input: TestNestedInputObject) {\n            fieldWithNestedObjectInput(input: $input)\n          }\n        ";
        var result = executeQuery(nestedDoc, {
          input: {
            na: {
              a: 'foo'
            }
          }
        });
        expect(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value {"na":{"a":"foo"}}; ' + 'Field value.na.c of required type String! was not provided.',
            locations: [{
              line: 2,
              column: 18
            }]
          }, {
            message: 'Variable "$input" got invalid value {"na":{"a":"foo"}}; ' + 'Field value.nb of required type String! was not provided.',
            locations: [{
              line: 2,
              column: 18
            }]
          }]
        });
      });
      it('errors on addition of unknown input field', function () {
        var params = {
          input: {
            a: 'foo',
            b: 'bar',
            c: 'baz',
            extra: 'dog'
          }
        };
        var result = executeQuery(doc, params);
        expect(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value ' + '{"a":"foo","b":"bar","c":"baz","extra":"dog"}; ' + 'Field "extra" is not defined by type TestInputObject.',
            locations: [{
              line: 2,
              column: 16
            }]
          }]
        });
      });
    });
  });
  describe('Handles nullable scalars', function () {
    it('allows nullable inputs to be omitted', function () {
      var result = executeQuery("\n        {\n          fieldWithNullableStringInput\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: null
        }
      });
    });
    it('allows nullable inputs to be omitted in a variable', function () {
      var result = executeQuery("\n        query ($value: String) {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: null
        }
      });
    });
    it('allows nullable inputs to be omitted in an unlisted variable', function () {
      var result = executeQuery("\n        query {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: null
        }
      });
    });
    it('allows nullable inputs to be set to null in a variable', function () {
      var doc = "\n        query ($value: String) {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: null
      });
      expect(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: 'null'
        }
      });
    });
    it('allows nullable inputs to be set to a value in a variable', function () {
      var doc = "\n        query ($value: String) {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: 'a'
      });
      expect(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: "'a'"
        }
      });
    });
    it('allows nullable inputs to be set to a value directly', function () {
      var result = executeQuery("\n        {\n          fieldWithNullableStringInput(input: \"a\")\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: "'a'"
        }
      });
    });
  });
  describe('Handles non-nullable scalars', function () {
    it('allows non-nullable inputs to be omitted given a default', function () {
      var result = executeQuery("\n        query ($value: String = \"default\") {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: "'default'"
        }
      });
    });
    it('does not allow non-nullable inputs to be omitted in a variable', function () {
      var result = executeQuery("\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ");
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$value" of required type "String!" was not provided.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    it('does not allow non-nullable inputs to be set to null in a variable', function () {
      var doc = "\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: null
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$value" of non-null type "String!" must not be null.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    it('allows non-nullable inputs to be set to a value in a variable', function () {
      var doc = "\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: 'a'
      });
      expect(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: "'a'"
        }
      });
    });
    it('allows non-nullable inputs to be set to a value directly', function () {
      var result = executeQuery("\n        {\n          fieldWithNonNullableStringInput(input: \"a\")\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: "'a'"
        }
      });
    });
    it('reports error for missing non-nullable inputs', function () {
      var result = executeQuery('{ fieldWithNonNullableStringInput }');
      expect(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: null
        },
        errors: [{
          message: 'Argument "input" of required type "String!" was not provided.',
          locations: [{
            line: 1,
            column: 3
          }],
          path: ['fieldWithNonNullableStringInput']
        }]
      });
    });
    it('reports error for array passed into string input', function () {
      var doc = "\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: [1, 2, 3]
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$value" got invalid value [1,2,3]; Expected type ' + 'String; String cannot represent an array value: [1,2,3]',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
      expect(result.errors[0].originalError).not.to.equal(undefined);
    });
    it('serializing an array via GraphQLString throws TypeError', function () {
      expect(function () {
        return GraphQLString.serialize([1, 2, 3]);
      }).to.throw(TypeError, 'String cannot represent an array value: [1,2,3]');
    });
    it('reports error for non-provided variables for non-nullable inputs', function () {
      // Note: this test would typically fail validation before encountering
      // this execution error, however for queries which previously validated
      // and are being run against a new schema which have introduced a breaking
      // change to make a formerly non-required argument required, this asserts
      // failure before allowing the underlying code to receive a non-null value.
      var result = executeQuery("\n        {\n          fieldWithNonNullableStringInput(input: $foo)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: null
        },
        errors: [{
          message: 'Argument "input" of required type "String!" was provided the ' + 'variable "$foo" which was not provided a runtime value.',
          locations: [{
            line: 3,
            column: 50
          }],
          path: ['fieldWithNonNullableStringInput']
        }]
      });
    });
  });
  describe('Handles lists and nullability', function () {
    it('allows lists to be null', function () {
      var doc = "\n        query ($input: [String]) {\n          list(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      expect(result).to.deep.equal({
        data: {
          list: 'null'
        }
      });
    });
    it('allows lists to contain values', function () {
      var doc = "\n        query ($input: [String]) {\n          list(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      expect(result).to.deep.equal({
        data: {
          list: "[ 'A' ]"
        }
      });
    });
    it('allows lists to contain null', function () {
      var doc = "\n        query ($input: [String]) {\n          list(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      expect(result).to.deep.equal({
        data: {
          list: "[ 'A', null, 'B' ]"
        }
      });
    });
    it('does not allow non-null lists to be null', function () {
      var doc = "\n        query ($input: [String]!) {\n          nnList(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" of non-null type "[String]!" must not be null.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    it('allows non-null lists to contain values', function () {
      var doc = "\n        query ($input: [String]!) {\n          nnList(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      expect(result).to.deep.equal({
        data: {
          nnList: "[ 'A' ]"
        }
      });
    });
    it('allows non-null lists to contain null', function () {
      var doc = "\n        query ($input: [String]!) {\n          nnList(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      expect(result).to.deep.equal({
        data: {
          nnList: "[ 'A', null, 'B' ]"
        }
      });
    });
    it('allows lists of non-nulls to be null', function () {
      var doc = "\n        query ($input: [String!]) {\n          listNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      expect(result).to.deep.equal({
        data: {
          listNN: 'null'
        }
      });
    });
    it('allows lists of non-nulls to contain values', function () {
      var doc = "\n        query ($input: [String!]) {\n          listNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      expect(result).to.deep.equal({
        data: {
          listNN: "[ 'A' ]"
        }
      });
    });
    it('does not allow lists of non-nulls to contain null', function () {
      var doc = "\n        query ($input: [String!]) {\n          listNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" got invalid value ["A",null,"B"]; ' + 'Expected non-nullable type String! not to be null at value[1].',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    it('does not allow non-null lists of non-nulls to be null', function () {
      var doc = "\n        query ($input: [String!]!) {\n          nnListNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" of non-null type "[String!]!" must not be null.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    it('allows non-null lists of non-nulls to contain values', function () {
      var doc = "\n        query ($input: [String!]!) {\n          nnListNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      expect(result).to.deep.equal({
        data: {
          nnListNN: "[ 'A' ]"
        }
      });
    });
    it('does not allow non-null lists of non-nulls to contain null', function () {
      var doc = "\n        query ($input: [String!]!) {\n          nnListNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" got invalid value ["A",null,"B"]; ' + 'Expected non-nullable type String! not to be null at value[1].',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    it('does not allow invalid types to be used as values', function () {
      var doc = "\n        query ($input: TestType!) {\n          fieldWithObjectInput(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: {
          list: ['A', 'B']
        }
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" expected value of type "TestType!" which ' + 'cannot be used as an input type.',
          locations: [{
            line: 2,
            column: 24
          }]
        }]
      });
    });
    it('does not allow unknown types to be used as values', function () {
      var doc = "\n        query ($input: UnknownType!) {\n          fieldWithObjectInput(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: 'whoknows'
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" expected value of type "UnknownType!" which ' + 'cannot be used as an input type.',
          locations: [{
            line: 2,
            column: 24
          }]
        }]
      });
    });
  });
  describe('Execute: Uses argument default values', function () {
    it('when no argument provided', function () {
      var result = executeQuery('{ fieldWithDefaultArgumentValue }');
      expect(result).to.deep.equal({
        data: {
          fieldWithDefaultArgumentValue: "'Hello World'"
        }
      });
    });
    it('when omitted variable provided', function () {
      var result = executeQuery("\n        query ($optional: String) {\n          fieldWithDefaultArgumentValue(input: $optional)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithDefaultArgumentValue: "'Hello World'"
        }
      });
    });
    it('not when argument cannot be coerced', function () {
      var result = executeQuery("\n        {\n          fieldWithDefaultArgumentValue(input: WRONG_TYPE)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithDefaultArgumentValue: null
        },
        errors: [{
          message: 'Argument "input" has invalid value WRONG_TYPE.',
          locations: [{
            line: 3,
            column: 48
          }],
          path: ['fieldWithDefaultArgumentValue']
        }]
      });
    });
    it('when no runtime value is provided to a non-null argument', function () {
      var result = executeQuery("\n        query optionalVariable($optional: String) {\n          fieldWithNonNullableStringInputAndDefaultArgumentValue(input: $optional)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInputAndDefaultArgumentValue: "'Hello World'"
        }
      });
    });
  });
});