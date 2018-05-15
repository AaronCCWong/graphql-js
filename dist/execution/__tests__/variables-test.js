"use strict";

var _util = require("util");

var _chai = require("chai");

var _mocha = require("mocha");

var _execute = require("../execute");

var _language = require("../../language");

var _type = require("../../type");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var TestComplexScalar = new _type.GraphQLScalarType({
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
var TestInputObject = new _type.GraphQLInputObjectType({
  name: 'TestInputObject',
  fields: {
    a: {
      type: _type.GraphQLString
    },
    b: {
      type: (0, _type.GraphQLList)(_type.GraphQLString)
    },
    c: {
      type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
    },
    d: {
      type: TestComplexScalar
    }
  }
});
var TestNestedInputObject = new _type.GraphQLInputObjectType({
  name: 'TestNestedInputObject',
  fields: {
    na: {
      type: (0, _type.GraphQLNonNull)(TestInputObject)
    },
    nb: {
      type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
    }
  }
});

function fieldWithInputArg(inputArg) {
  return {
    type: _type.GraphQLString,
    args: {
      input: inputArg
    },
    resolve: function resolve(_, args) {
      if (args.hasOwnProperty('input')) {
        return (0, _util.inspect)(args.input, {
          depth: null
        });
      }
    }
  };
}

var TestType = new _type.GraphQLObjectType({
  name: 'TestType',
  fields: {
    fieldWithObjectInput: fieldWithInputArg({
      type: TestInputObject
    }),
    fieldWithNullableStringInput: fieldWithInputArg({
      type: _type.GraphQLString
    }),
    fieldWithNonNullableStringInput: fieldWithInputArg({
      type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
    }),
    fieldWithDefaultArgumentValue: fieldWithInputArg({
      type: _type.GraphQLString,
      defaultValue: 'Hello World'
    }),
    fieldWithNonNullableStringInputAndDefaultArgumentValue: fieldWithInputArg({
      type: (0, _type.GraphQLNonNull)(_type.GraphQLString),
      defaultValue: 'Hello World'
    }),
    fieldWithNestedInputObject: fieldWithInputArg({
      type: TestNestedInputObject,
      defaultValue: 'Hello World'
    }),
    list: fieldWithInputArg({
      type: (0, _type.GraphQLList)(_type.GraphQLString)
    }),
    nnList: fieldWithInputArg({
      type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLString))
    }),
    listNN: fieldWithInputArg({
      type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLString))
    }),
    nnListNN: fieldWithInputArg({
      type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLString)))
    })
  }
});
var schema = new _type.GraphQLSchema({
  query: TestType
});

function executeQuery(query, variableValues) {
  var document = (0, _language.parse)(query);
  return (0, _execute.execute)({
    schema: schema,
    document: document,
    variableValues: variableValues
  });
}

(0, _mocha.describe)('Execute: Handles inputs', function () {
  (0, _mocha.describe)('Handles objects and nullability', function () {
    (0, _mocha.describe)('using inline structs', function () {
      (0, _mocha.it)('executes with complex input', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {a: \"foo\", b: [\"bar\"], c: \"baz\"})\n          }\n        ");
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      (0, _mocha.it)('properly parses single value to list', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {a: \"foo\", b: \"bar\", c: \"baz\"})\n          }\n        ");
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      (0, _mocha.it)('properly parses null value to null', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {a: null, b: null, c: \"C\", d: null})\n          }\n        ");
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: null, b: null, c: 'C', d: null }"
          }
        });
      });
      (0, _mocha.it)('properly parses null value in list', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {b: [\"A\",null,\"C\"], c: \"C\"})\n          }\n        ");
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ b: [ 'A', null, 'C' ], c: 'C' }"
          }
        });
      });
      (0, _mocha.it)('does not use incorrect value', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: [\"foo\", \"bar\", \"baz\"])\n          }\n        ");
        (0, _chai.expect)(result).to.deep.equal({
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
      (0, _mocha.it)('properly runs parseLiteral on complex scalar types', function () {
        var result = executeQuery("\n          {\n            fieldWithObjectInput(input: {c: \"foo\", d: \"SerializedValue\"})\n          }\n        ");
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ c: 'foo', d: 'DeserializedValue' }"
          }
        });
      });
    });
    (0, _mocha.describe)('using variables', function () {
      var doc = "\n        query ($input: TestInputObject) {\n          fieldWithObjectInput(input: $input)\n        }\n      ";
      (0, _mocha.it)('executes with complex input', function () {
        var params = {
          input: {
            a: 'foo',
            b: ['bar'],
            c: 'baz'
          }
        };
        var result = executeQuery(doc, params);
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      (0, _mocha.it)('uses undefined when variable not provided', function () {
        var result = executeQuery("\n          query q($input: String) {\n            fieldWithNullableStringInput(input: $input)\n          }", {// Intentionally missing variable values.
        });
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: null
          }
        });
      });
      (0, _mocha.it)('uses null when variable provided explicit null value', function () {
        var result = executeQuery("\n          query q($input: String) {\n            fieldWithNullableStringInput(input: $input)\n          }", {
          input: null
        });
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: 'null'
          }
        });
      });
      (0, _mocha.it)('uses default value when not provided', function () {
        var result = executeQuery("\n          query ($input: TestInputObject = {a: \"foo\", b: [\"bar\"], c: \"baz\"}) {\n            fieldWithObjectInput(input: $input)\n          }\n        ");
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      (0, _mocha.it)('does not use default value when provided', function () {
        var result = executeQuery("query q($input: String = \"Default value\") {\n            fieldWithNullableStringInput(input: $input)\n          }", {
          input: 'Variable value'
        });
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: "'Variable value'"
          }
        });
      });
      (0, _mocha.it)('uses explicit null value instead of default value', function () {
        var result = executeQuery("\n          query q($input: String = \"Default value\") {\n            fieldWithNullableStringInput(input: $input)\n          }", {
          input: null
        });
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: 'null'
          }
        });
      });
      (0, _mocha.it)('uses null default value when not provided', function () {
        var result = executeQuery("\n          query q($input: String = null) {\n            fieldWithNullableStringInput(input: $input)\n          }", {// Intentionally missing variable values.
        });
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithNullableStringInput: 'null'
          }
        });
      });
      (0, _mocha.it)('properly parses single value to list', function () {
        var params = {
          input: {
            a: 'foo',
            b: 'bar',
            c: 'baz'
          }
        };
        var result = executeQuery(doc, params);
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ a: 'foo', b: [ 'bar' ], c: 'baz' }"
          }
        });
      });
      (0, _mocha.it)('executes with complex scalar input', function () {
        var params = {
          input: {
            c: 'foo',
            d: 'SerializedValue'
          }
        };
        var result = executeQuery(doc, params);
        (0, _chai.expect)(result).to.deep.equal({
          data: {
            fieldWithObjectInput: "{ c: 'foo', d: 'DeserializedValue' }"
          }
        });
      });
      (0, _mocha.it)('errors on null for nested non-null', function () {
        var params = {
          input: {
            a: 'foo',
            b: 'bar',
            c: null
          }
        };
        var result = executeQuery(doc, params);
        (0, _chai.expect)(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value ' + '{"a":"foo","b":"bar","c":null}; ' + 'Expected non-nullable type String! not to be null at value.c.',
            locations: [{
              line: 2,
              column: 16
            }]
          }]
        });
      });
      (0, _mocha.it)('errors on incorrect type', function () {
        var result = executeQuery(doc, {
          input: 'foo bar'
        });
        (0, _chai.expect)(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value "foo bar"; ' + 'Expected type TestInputObject to be an object.',
            locations: [{
              line: 2,
              column: 16
            }]
          }]
        });
      });
      (0, _mocha.it)('errors on omission of nested non-null', function () {
        var result = executeQuery(doc, {
          input: {
            a: 'foo',
            b: 'bar'
          }
        });
        (0, _chai.expect)(result).to.deep.equal({
          errors: [{
            message: 'Variable "$input" got invalid value {"a":"foo","b":"bar"}; ' + 'Field value.c of required type String! was not provided.',
            locations: [{
              line: 2,
              column: 16
            }]
          }]
        });
      });
      (0, _mocha.it)('errors on deep nested errors and with many errors', function () {
        var nestedDoc = "\n          query ($input: TestNestedInputObject) {\n            fieldWithNestedObjectInput(input: $input)\n          }\n        ";
        var result = executeQuery(nestedDoc, {
          input: {
            na: {
              a: 'foo'
            }
          }
        });
        (0, _chai.expect)(result).to.deep.equal({
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
      (0, _mocha.it)('errors on addition of unknown input field', function () {
        var params = {
          input: {
            a: 'foo',
            b: 'bar',
            c: 'baz',
            extra: 'dog'
          }
        };
        var result = executeQuery(doc, params);
        (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.describe)('Handles nullable scalars', function () {
    (0, _mocha.it)('allows nullable inputs to be omitted', function () {
      var result = executeQuery("\n        {\n          fieldWithNullableStringInput\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: null
        }
      });
    });
    (0, _mocha.it)('allows nullable inputs to be omitted in a variable', function () {
      var result = executeQuery("\n        query ($value: String) {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: null
        }
      });
    });
    (0, _mocha.it)('allows nullable inputs to be omitted in an unlisted variable', function () {
      var result = executeQuery("\n        query {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: null
        }
      });
    });
    (0, _mocha.it)('allows nullable inputs to be set to null in a variable', function () {
      var doc = "\n        query ($value: String) {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: null
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: 'null'
        }
      });
    });
    (0, _mocha.it)('allows nullable inputs to be set to a value in a variable', function () {
      var doc = "\n        query ($value: String) {\n          fieldWithNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: 'a'
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: "'a'"
        }
      });
    });
    (0, _mocha.it)('allows nullable inputs to be set to a value directly', function () {
      var result = executeQuery("\n        {\n          fieldWithNullableStringInput(input: \"a\")\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNullableStringInput: "'a'"
        }
      });
    });
  });
  (0, _mocha.describe)('Handles non-nullable scalars', function () {
    (0, _mocha.it)('allows non-nullable inputs to be omitted given a default', function () {
      var result = executeQuery("\n        query ($value: String = \"default\") {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: "'default'"
        }
      });
    });
    (0, _mocha.it)('does not allow non-nullable inputs to be omitted in a variable', function () {
      var result = executeQuery("\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$value" of required type "String!" was not provided.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    (0, _mocha.it)('does not allow non-nullable inputs to be set to null in a variable', function () {
      var doc = "\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: null
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$value" of non-null type "String!" must not be null.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    (0, _mocha.it)('allows non-nullable inputs to be set to a value in a variable', function () {
      var doc = "\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: 'a'
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: "'a'"
        }
      });
    });
    (0, _mocha.it)('allows non-nullable inputs to be set to a value directly', function () {
      var result = executeQuery("\n        {\n          fieldWithNonNullableStringInput(input: \"a\")\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInput: "'a'"
        }
      });
    });
    (0, _mocha.it)('reports error for missing non-nullable inputs', function () {
      var result = executeQuery('{ fieldWithNonNullableStringInput }');
      (0, _chai.expect)(result).to.deep.equal({
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
    (0, _mocha.it)('reports error for array passed into string input', function () {
      var doc = "\n        query ($value: String!) {\n          fieldWithNonNullableStringInput(input: $value)\n        }\n      ";
      var result = executeQuery(doc, {
        value: [1, 2, 3]
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$value" got invalid value [1,2,3]; Expected type ' + 'String; String cannot represent an array value: [1,2,3]',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
      (0, _chai.expect)(result.errors[0].originalError).not.to.equal(undefined);
    });
    (0, _mocha.it)('serializing an array via GraphQLString throws TypeError', function () {
      (0, _chai.expect)(function () {
        return _type.GraphQLString.serialize([1, 2, 3]);
      }).to.throw(TypeError, 'String cannot represent an array value: [1,2,3]');
    });
    (0, _mocha.it)('reports error for non-provided variables for non-nullable inputs', function () {
      // Note: this test would typically fail validation before encountering
      // this execution error, however for queries which previously validated
      // and are being run against a new schema which have introduced a breaking
      // change to make a formerly non-required argument required, this asserts
      // failure before allowing the underlying code to receive a non-null value.
      var result = executeQuery("\n        {\n          fieldWithNonNullableStringInput(input: $foo)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.describe)('Handles lists and nullability', function () {
    (0, _mocha.it)('allows lists to be null', function () {
      var doc = "\n        query ($input: [String]) {\n          list(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          list: 'null'
        }
      });
    });
    (0, _mocha.it)('allows lists to contain values', function () {
      var doc = "\n        query ($input: [String]) {\n          list(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          list: "[ 'A' ]"
        }
      });
    });
    (0, _mocha.it)('allows lists to contain null', function () {
      var doc = "\n        query ($input: [String]) {\n          list(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          list: "[ 'A', null, 'B' ]"
        }
      });
    });
    (0, _mocha.it)('does not allow non-null lists to be null', function () {
      var doc = "\n        query ($input: [String]!) {\n          nnList(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" of non-null type "[String]!" must not be null.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    (0, _mocha.it)('allows non-null lists to contain values', function () {
      var doc = "\n        query ($input: [String]!) {\n          nnList(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          nnList: "[ 'A' ]"
        }
      });
    });
    (0, _mocha.it)('allows non-null lists to contain null', function () {
      var doc = "\n        query ($input: [String]!) {\n          nnList(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          nnList: "[ 'A', null, 'B' ]"
        }
      });
    });
    (0, _mocha.it)('allows lists of non-nulls to be null', function () {
      var doc = "\n        query ($input: [String!]) {\n          listNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          listNN: 'null'
        }
      });
    });
    (0, _mocha.it)('allows lists of non-nulls to contain values', function () {
      var doc = "\n        query ($input: [String!]) {\n          listNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          listNN: "[ 'A' ]"
        }
      });
    });
    (0, _mocha.it)('does not allow lists of non-nulls to contain null', function () {
      var doc = "\n        query ($input: [String!]) {\n          listNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" got invalid value ["A",null,"B"]; ' + 'Expected non-nullable type String! not to be null at value[1].',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    (0, _mocha.it)('does not allow non-null lists of non-nulls to be null', function () {
      var doc = "\n        query ($input: [String!]!) {\n          nnListNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: null
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" of non-null type "[String!]!" must not be null.',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    (0, _mocha.it)('allows non-null lists of non-nulls to contain values', function () {
      var doc = "\n        query ($input: [String!]!) {\n          nnListNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A']
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          nnListNN: "[ 'A' ]"
        }
      });
    });
    (0, _mocha.it)('does not allow non-null lists of non-nulls to contain null', function () {
      var doc = "\n        query ($input: [String!]!) {\n          nnListNN(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: ['A', null, 'B']
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" got invalid value ["A",null,"B"]; ' + 'Expected non-nullable type String! not to be null at value[1].',
          locations: [{
            line: 2,
            column: 16
          }]
        }]
      });
    });
    (0, _mocha.it)('does not allow invalid types to be used as values', function () {
      var doc = "\n        query ($input: TestType!) {\n          fieldWithObjectInput(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: {
          list: ['A', 'B']
        }
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Variable "$input" expected value of type "TestType!" which ' + 'cannot be used as an input type.',
          locations: [{
            line: 2,
            column: 24
          }]
        }]
      });
    });
    (0, _mocha.it)('does not allow unknown types to be used as values', function () {
      var doc = "\n        query ($input: UnknownType!) {\n          fieldWithObjectInput(input: $input)\n        }\n      ";
      var result = executeQuery(doc, {
        input: 'whoknows'
      });
      (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.describe)('Execute: Uses argument default values', function () {
    (0, _mocha.it)('when no argument provided', function () {
      var result = executeQuery('{ fieldWithDefaultArgumentValue }');
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithDefaultArgumentValue: "'Hello World'"
        }
      });
    });
    (0, _mocha.it)('when omitted variable provided', function () {
      var result = executeQuery("\n        query ($optional: String) {\n          fieldWithDefaultArgumentValue(input: $optional)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithDefaultArgumentValue: "'Hello World'"
        }
      });
    });
    (0, _mocha.it)('not when argument cannot be coerced', function () {
      var result = executeQuery("\n        {\n          fieldWithDefaultArgumentValue(input: WRONG_TYPE)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
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
    (0, _mocha.it)('when no runtime value is provided to a non-null argument', function () {
      var result = executeQuery("\n        query optionalVariable($optional: String) {\n          fieldWithNonNullableStringInputAndDefaultArgumentValue(input: $optional)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          fieldWithNonNullableStringInputAndDefaultArgumentValue: "'Hello World'"
        }
      });
    });
  });
});