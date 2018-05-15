/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { graphqlSync, GraphQLSchema, GraphQLEnumType, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, introspectionFromSchema } from '../../';
var ColorType = new GraphQLEnumType({
  name: 'Color',
  values: {
    RED: {
      value: 0
    },
    GREEN: {
      value: 1
    },
    BLUE: {
      value: 2
    }
  }
});
var Complex1 = {
  someRandomFunction: function someRandomFunction() {}
};
var Complex2 = {
  someRandomValue: 123
};
var ComplexEnum = new GraphQLEnumType({
  name: 'Complex',
  values: {
    ONE: {
      value: Complex1
    },
    TWO: {
      value: Complex2
    }
  }
});
var QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    colorEnum: {
      type: ColorType,
      args: {
        fromEnum: {
          type: ColorType
        },
        fromInt: {
          type: GraphQLInt
        },
        fromString: {
          type: GraphQLString
        }
      },
      resolve: function resolve(value, _ref) {
        var fromEnum = _ref.fromEnum,
            fromInt = _ref.fromInt,
            fromString = _ref.fromString;
        return fromInt !== undefined ? fromInt : fromString !== undefined ? fromString : fromEnum;
      }
    },
    colorInt: {
      type: GraphQLInt,
      args: {
        fromEnum: {
          type: ColorType
        },
        fromInt: {
          type: GraphQLInt
        }
      },
      resolve: function resolve(value, _ref2) {
        var fromEnum = _ref2.fromEnum,
            fromInt = _ref2.fromInt;
        return fromInt !== undefined ? fromInt : fromEnum;
      }
    },
    complexEnum: {
      type: ComplexEnum,
      args: {
        fromEnum: {
          type: ComplexEnum,
          // Note: defaultValue is provided an *internal* representation for
          // Enums, rather than the string name.
          defaultValue: Complex1
        },
        provideGoodValue: {
          type: GraphQLBoolean
        },
        provideBadValue: {
          type: GraphQLBoolean
        }
      },
      resolve: function resolve(value, _ref3) {
        var fromEnum = _ref3.fromEnum,
            provideGoodValue = _ref3.provideGoodValue,
            provideBadValue = _ref3.provideBadValue;

        if (provideGoodValue) {
          // Note: this is one of the references of the internal values which
          // ComplexEnum allows.
          return Complex2;
        }

        if (provideBadValue) {
          // Note: similar shape, but not the same *reference*
          // as Complex2 above. Enum internal values require === equality.
          return {
            someRandomValue: 123
          };
        }

        return fromEnum;
      }
    }
  }
});
var MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    favoriteEnum: {
      type: ColorType,
      args: {
        color: {
          type: ColorType
        }
      },
      resolve: function resolve(value, _ref4) {
        var color = _ref4.color;
        return color;
      }
    }
  }
});
var SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    subscribeToEnum: {
      type: ColorType,
      args: {
        color: {
          type: ColorType
        }
      },
      resolve: function resolve(value, _ref5) {
        var color = _ref5.color;
        return color;
      }
    }
  }
});
var schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType
});

function executeQuery(source, variableValues) {
  return graphqlSync({
    schema: schema,
    source: source,
    variableValues: variableValues
  });
}

describe('Type System: Enum Values', function () {
  it('accepts enum literals as input', function () {
    var result = executeQuery('{ colorInt(fromEnum: GREEN) }');
    expect(result).to.deep.equal({
      data: {
        colorInt: 1
      }
    });
  });
  it('enum may be output type', function () {
    var result = executeQuery('{ colorEnum(fromInt: 1) }');
    expect(result).to.deep.equal({
      data: {
        colorEnum: 'GREEN'
      }
    });
  });
  it('enum may be both input and output type', function () {
    var result = executeQuery('{ colorEnum(fromEnum: GREEN) }');
    expect(result).to.deep.equal({
      data: {
        colorEnum: 'GREEN'
      }
    });
  });
  it('does not accept string literals', function () {
    var result = executeQuery('{ colorEnum(fromEnum: "GREEN") }');
    expect(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found "GREEN"; Did you mean the enum value GREEN?',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  it('does not accept values not in the enum', function () {
    var result = executeQuery('{ colorEnum(fromEnum: GREENISH) }');
    expect(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found GREENISH; Did you mean the enum value GREEN?',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  it('does not accept values with incorrect casing', function () {
    var result = executeQuery('{ colorEnum(fromEnum: green) }');
    expect(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found green; Did you mean the enum value GREEN?',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  it('does not accept incorrect internal value', function () {
    var result = executeQuery('{ colorEnum(fromString: "GREEN") }');
    expect(result).to.deep.equal({
      data: {
        colorEnum: null
      },
      errors: [{
        message: 'Expected a value of type "Color" but received: GREEN',
        locations: [{
          line: 1,
          column: 3
        }],
        path: ['colorEnum']
      }]
    });
  });
  it('does not accept internal value in place of enum literal', function () {
    var result = executeQuery('{ colorEnum(fromEnum: 1) }');
    expect(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found 1.',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  it('does not accept enum literal in place of int', function () {
    var result = executeQuery('{ colorEnum(fromInt: GREEN) }');
    expect(result).to.deep.equal({
      errors: [{
        message: 'Expected type Int, found GREEN.',
        locations: [{
          line: 1,
          column: 22
        }]
      }]
    });
  });
  it('accepts JSON string as enum variable', function () {
    var doc = 'query ($color: Color!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 'BLUE'
    });
    expect(result).to.deep.equal({
      data: {
        colorEnum: 'BLUE'
      }
    });
  });
  it('accepts enum literals as input arguments to mutations', function () {
    var doc = 'mutation ($color: Color!) { favoriteEnum(color: $color) }';
    var result = executeQuery(doc, {
      color: 'GREEN'
    });
    expect(result).to.deep.equal({
      data: {
        favoriteEnum: 'GREEN'
      }
    });
  });
  it('accepts enum literals as input arguments to subscriptions', function () {
    var doc = 'subscription ($color: Color!) { subscribeToEnum(color: $color) }';
    var result = executeQuery(doc, {
      color: 'GREEN'
    });
    expect(result).to.deep.equal({
      data: {
        subscribeToEnum: 'GREEN'
      }
    });
  });
  it('does not accept internal value as enum variable', function () {
    var doc = 'query ($color: Color!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 2
    });
    expect(result).to.deep.equal({
      errors: [{
        message: 'Variable "$color" got invalid value 2; Expected type Color.',
        locations: [{
          line: 1,
          column: 8
        }]
      }]
    });
  });
  it('does not accept string variables as enum input', function () {
    var doc = 'query ($color: String!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 'BLUE'
    });
    expect(result).to.deep.equal({
      errors: [{
        message: 'Variable "$color" of type "String!" used in position ' + 'expecting type "Color".',
        locations: [{
          line: 1,
          column: 8
        }, {
          line: 1,
          column: 47
        }]
      }]
    });
  });
  it('does not accept internal value variable as enum input', function () {
    var doc = 'query ($color: Int!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 2
    });
    expect(result).to.deep.equal({
      errors: [{
        message: 'Variable "$color" of type "Int!" used in position ' + 'expecting type "Color".',
        locations: [{
          line: 1,
          column: 8
        }, {
          line: 1,
          column: 44
        }]
      }]
    });
  });
  it('enum value may have an internal value of 0', function () {
    var result = executeQuery("\n      {\n        colorEnum(fromEnum: RED)\n        colorInt(fromEnum: RED)\n      }\n    ");
    expect(result).to.deep.equal({
      data: {
        colorEnum: 'RED',
        colorInt: 0
      }
    });
  });
  it('enum inputs may be nullable', function () {
    var result = executeQuery("\n      {\n        colorEnum\n        colorInt\n      }\n    ");
    expect(result).to.deep.equal({
      data: {
        colorEnum: null,
        colorInt: null
      }
    });
  });
  it('presents a getValues() API for complex enums', function () {
    var values = ComplexEnum.getValues();
    expect(values.length).to.equal(2);
    expect(values[0].name).to.equal('ONE');
    expect(values[0].value).to.equal(Complex1);
    expect(values[1].name).to.equal('TWO');
    expect(values[1].value).to.equal(Complex2);
  });
  it('presents a getValue() API for complex enums', function () {
    var oneValue = ComplexEnum.getValue('ONE');
    expect(oneValue.name).to.equal('ONE');
    expect(oneValue.value).to.equal(Complex1);
    var badUsage = ComplexEnum.getValue(Complex1);
    expect(badUsage).to.equal(undefined);
  });
  it('may be internally represented with complex values', function () {
    var result = executeQuery("\n      {\n        first: complexEnum\n        second: complexEnum(fromEnum: TWO)\n        good: complexEnum(provideGoodValue: true)\n        bad: complexEnum(provideBadValue: true)\n      }\n    ");
    expect(result).to.deep.equal({
      data: {
        first: 'ONE',
        second: 'TWO',
        good: 'TWO',
        bad: null
      },
      errors: [{
        message: 'Expected a value of type "Complex" but received: [object Object]',
        locations: [{
          line: 6,
          column: 9
        }],
        path: ['bad']
      }]
    });
  });
  it('can be introspected without error', function () {
    expect(function () {
      return introspectionFromSchema(schema);
    }).to.not.throw();
  });
});