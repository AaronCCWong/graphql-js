"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _ = require("../../");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ColorType = new _.GraphQLEnumType({
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
var ComplexEnum = new _.GraphQLEnumType({
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
var QueryType = new _.GraphQLObjectType({
  name: 'Query',
  fields: {
    colorEnum: {
      type: ColorType,
      args: {
        fromEnum: {
          type: ColorType
        },
        fromInt: {
          type: _.GraphQLInt
        },
        fromString: {
          type: _.GraphQLString
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
      type: _.GraphQLInt,
      args: {
        fromEnum: {
          type: ColorType
        },
        fromInt: {
          type: _.GraphQLInt
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
          type: _.GraphQLBoolean
        },
        provideBadValue: {
          type: _.GraphQLBoolean
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
var MutationType = new _.GraphQLObjectType({
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
var SubscriptionType = new _.GraphQLObjectType({
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
var schema = new _.GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType
});

function executeQuery(source, variableValues) {
  return (0, _.graphqlSync)({
    schema: schema,
    source: source,
    variableValues: variableValues
  });
}

(0, _mocha.describe)('Type System: Enum Values', function () {
  (0, _mocha.it)('accepts enum literals as input', function () {
    var result = executeQuery('{ colorInt(fromEnum: GREEN) }');
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        colorInt: 1
      }
    });
  });
  (0, _mocha.it)('enum may be output type', function () {
    var result = executeQuery('{ colorEnum(fromInt: 1) }');
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        colorEnum: 'GREEN'
      }
    });
  });
  (0, _mocha.it)('enum may be both input and output type', function () {
    var result = executeQuery('{ colorEnum(fromEnum: GREEN) }');
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        colorEnum: 'GREEN'
      }
    });
  });
  (0, _mocha.it)('does not accept string literals', function () {
    var result = executeQuery('{ colorEnum(fromEnum: "GREEN") }');
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found "GREEN"; Did you mean the enum value GREEN?',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  (0, _mocha.it)('does not accept values not in the enum', function () {
    var result = executeQuery('{ colorEnum(fromEnum: GREENISH) }');
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found GREENISH; Did you mean the enum value GREEN?',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  (0, _mocha.it)('does not accept values with incorrect casing', function () {
    var result = executeQuery('{ colorEnum(fromEnum: green) }');
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found green; Did you mean the enum value GREEN?',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  (0, _mocha.it)('does not accept incorrect internal value', function () {
    var result = executeQuery('{ colorEnum(fromString: "GREEN") }');
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('does not accept internal value in place of enum literal', function () {
    var result = executeQuery('{ colorEnum(fromEnum: 1) }');
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Expected type Color, found 1.',
        locations: [{
          line: 1,
          column: 23
        }]
      }]
    });
  });
  (0, _mocha.it)('does not accept enum literal in place of int', function () {
    var result = executeQuery('{ colorEnum(fromInt: GREEN) }');
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Expected type Int, found GREEN.',
        locations: [{
          line: 1,
          column: 22
        }]
      }]
    });
  });
  (0, _mocha.it)('accepts JSON string as enum variable', function () {
    var doc = 'query ($color: Color!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 'BLUE'
    });
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        colorEnum: 'BLUE'
      }
    });
  });
  (0, _mocha.it)('accepts enum literals as input arguments to mutations', function () {
    var doc = 'mutation ($color: Color!) { favoriteEnum(color: $color) }';
    var result = executeQuery(doc, {
      color: 'GREEN'
    });
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        favoriteEnum: 'GREEN'
      }
    });
  });
  (0, _mocha.it)('accepts enum literals as input arguments to subscriptions', function () {
    var doc = 'subscription ($color: Color!) { subscribeToEnum(color: $color) }';
    var result = executeQuery(doc, {
      color: 'GREEN'
    });
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        subscribeToEnum: 'GREEN'
      }
    });
  });
  (0, _mocha.it)('does not accept internal value as enum variable', function () {
    var doc = 'query ($color: Color!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 2
    });
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Variable "$color" got invalid value 2; Expected type Color.',
        locations: [{
          line: 1,
          column: 8
        }]
      }]
    });
  });
  (0, _mocha.it)('does not accept string variables as enum input', function () {
    var doc = 'query ($color: String!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 'BLUE'
    });
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('does not accept internal value variable as enum input', function () {
    var doc = 'query ($color: Int!) { colorEnum(fromEnum: $color) }';
    var result = executeQuery(doc, {
      color: 2
    });
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('enum value may have an internal value of 0', function () {
    var result = executeQuery("\n      {\n        colorEnum(fromEnum: RED)\n        colorInt(fromEnum: RED)\n      }\n    ");
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        colorEnum: 'RED',
        colorInt: 0
      }
    });
  });
  (0, _mocha.it)('enum inputs may be nullable', function () {
    var result = executeQuery("\n      {\n        colorEnum\n        colorInt\n      }\n    ");
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        colorEnum: null,
        colorInt: null
      }
    });
  });
  (0, _mocha.it)('presents a getValues() API for complex enums', function () {
    var values = ComplexEnum.getValues();
    (0, _chai.expect)(values.length).to.equal(2);
    (0, _chai.expect)(values[0].name).to.equal('ONE');
    (0, _chai.expect)(values[0].value).to.equal(Complex1);
    (0, _chai.expect)(values[1].name).to.equal('TWO');
    (0, _chai.expect)(values[1].value).to.equal(Complex2);
  });
  (0, _mocha.it)('presents a getValue() API for complex enums', function () {
    var oneValue = ComplexEnum.getValue('ONE');
    (0, _chai.expect)(oneValue.name).to.equal('ONE');
    (0, _chai.expect)(oneValue.value).to.equal(Complex1);
    var badUsage = ComplexEnum.getValue(Complex1);
    (0, _chai.expect)(badUsage).to.equal(undefined);
  });
  (0, _mocha.it)('may be internally represented with complex values', function () {
    var result = executeQuery("\n      {\n        first: complexEnum\n        second: complexEnum(fromEnum: TWO)\n        good: complexEnum(provideGoodValue: true)\n        bad: complexEnum(provideBadValue: true)\n      }\n    ");
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('can be introspected without error', function () {
    (0, _chai.expect)(function () {
      return (0, _.introspectionFromSchema)(schema);
    }).to.not.throw();
  });
});