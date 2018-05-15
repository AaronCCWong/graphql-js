"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectPassesRule = expectPassesRule;
exports.expectFailsRule = expectFailsRule;
exports.expectPassesRuleWithSchema = expectPassesRuleWithSchema;
exports.expectFailsRuleWithSchema = expectFailsRuleWithSchema;
exports.testSchema = void 0;

var _chai = require("chai");

var _language = require("../../language");

var _validate = require("../validate");

var _type = require("../../type");

var _directives = require("../../type/directives");

var _definition = require("../../type/definition");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Being = new _type.GraphQLInterfaceType({
  name: 'Being',
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString,
        args: {
          surname: {
            type: _type.GraphQLBoolean
          }
        }
      }
    };
  }
});
var Pet = new _type.GraphQLInterfaceType({
  name: 'Pet',
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString,
        args: {
          surname: {
            type: _type.GraphQLBoolean
          }
        }
      }
    };
  }
});
var Canine = new _type.GraphQLInterfaceType({
  name: 'Canine',
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString,
        args: {
          surname: {
            type: _type.GraphQLBoolean
          }
        }
      }
    };
  }
});
var DogCommand = new _type.GraphQLEnumType({
  name: 'DogCommand',
  values: {
    SIT: {
      value: 0
    },
    HEEL: {
      value: 1
    },
    DOWN: {
      value: 2
    }
  }
});
var Dog = new _type.GraphQLObjectType({
  name: 'Dog',
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString,
        args: {
          surname: {
            type: _type.GraphQLBoolean
          }
        }
      },
      nickname: {
        type: _type.GraphQLString
      },
      barkVolume: {
        type: _type.GraphQLInt
      },
      barks: {
        type: _type.GraphQLBoolean
      },
      doesKnowCommand: {
        type: _type.GraphQLBoolean,
        args: {
          dogCommand: {
            type: DogCommand
          }
        }
      },
      isHousetrained: {
        type: _type.GraphQLBoolean,
        args: {
          atOtherHomes: {
            type: _type.GraphQLBoolean,
            defaultValue: true
          }
        }
      },
      isAtLocation: {
        type: _type.GraphQLBoolean,
        args: {
          x: {
            type: _type.GraphQLInt
          },
          y: {
            type: _type.GraphQLInt
          }
        }
      }
    };
  },
  interfaces: [Being, Pet, Canine]
});
var Cat = new _type.GraphQLObjectType({
  name: 'Cat',
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString,
        args: {
          surname: {
            type: _type.GraphQLBoolean
          }
        }
      },
      nickname: {
        type: _type.GraphQLString
      },
      meows: {
        type: _type.GraphQLBoolean
      },
      meowVolume: {
        type: _type.GraphQLInt
      },
      furColor: {
        type: FurColor
      }
    };
  },
  interfaces: [Being, Pet]
});
var CatOrDog = new _type.GraphQLUnionType({
  name: 'CatOrDog',
  types: [Dog, Cat]
});
var Intelligent = new _type.GraphQLInterfaceType({
  name: 'Intelligent',
  fields: {
    iq: {
      type: _type.GraphQLInt
    }
  }
});
var Human = new _type.GraphQLObjectType({
  name: 'Human',
  interfaces: [Being, Intelligent],
  fields: function fields() {
    return {
      name: {
        type: _type.GraphQLString,
        args: {
          surname: {
            type: _type.GraphQLBoolean
          }
        }
      },
      pets: {
        type: (0, _type.GraphQLList)(Pet)
      },
      relatives: {
        type: (0, _type.GraphQLList)(Human)
      },
      iq: {
        type: _type.GraphQLInt
      }
    };
  }
});
var Alien = new _type.GraphQLObjectType({
  name: 'Alien',
  interfaces: [Being, Intelligent],
  fields: {
    iq: {
      type: _type.GraphQLInt
    },
    name: {
      type: _type.GraphQLString,
      args: {
        surname: {
          type: _type.GraphQLBoolean
        }
      }
    },
    numEyes: {
      type: _type.GraphQLInt
    }
  }
});
var DogOrHuman = new _type.GraphQLUnionType({
  name: 'DogOrHuman',
  types: [Dog, Human]
});
var HumanOrAlien = new _type.GraphQLUnionType({
  name: 'HumanOrAlien',
  types: [Human, Alien]
});
var FurColor = new _type.GraphQLEnumType({
  name: 'FurColor',
  values: {
    BROWN: {
      value: 0
    },
    BLACK: {
      value: 1
    },
    TAN: {
      value: 2
    },
    SPOTTED: {
      value: 3
    },
    NO_FUR: {
      value: null
    },
    UNKNOWN: {
      value: undefined
    }
  }
});
var ComplexInput = new _type.GraphQLInputObjectType({
  name: 'ComplexInput',
  fields: {
    requiredField: {
      type: (0, _type.GraphQLNonNull)(_type.GraphQLBoolean)
    },
    nonNullField: {
      type: (0, _type.GraphQLNonNull)(_type.GraphQLBoolean),
      defaultValue: false
    },
    intField: {
      type: _type.GraphQLInt
    },
    stringField: {
      type: _type.GraphQLString
    },
    booleanField: {
      type: _type.GraphQLBoolean
    },
    stringListField: {
      type: (0, _type.GraphQLList)(_type.GraphQLString)
    }
  }
});
var ComplicatedArgs = new _type.GraphQLObjectType({
  name: 'ComplicatedArgs',
  // TODO List
  // TODO Coercion
  // TODO NotNulls
  fields: function fields() {
    return {
      intArgField: {
        type: _type.GraphQLString,
        args: {
          intArg: {
            type: _type.GraphQLInt
          }
        }
      },
      nonNullIntArgField: {
        type: _type.GraphQLString,
        args: {
          nonNullIntArg: {
            type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
          }
        }
      },
      stringArgField: {
        type: _type.GraphQLString,
        args: {
          stringArg: {
            type: _type.GraphQLString
          }
        }
      },
      booleanArgField: {
        type: _type.GraphQLString,
        args: {
          booleanArg: {
            type: _type.GraphQLBoolean
          }
        }
      },
      enumArgField: {
        type: _type.GraphQLString,
        args: {
          enumArg: {
            type: FurColor
          }
        }
      },
      floatArgField: {
        type: _type.GraphQLString,
        args: {
          floatArg: {
            type: _type.GraphQLFloat
          }
        }
      },
      idArgField: {
        type: _type.GraphQLString,
        args: {
          idArg: {
            type: _type.GraphQLID
          }
        }
      },
      stringListArgField: {
        type: _type.GraphQLString,
        args: {
          stringListArg: {
            type: (0, _type.GraphQLList)(_type.GraphQLString)
          }
        }
      },
      stringListNonNullArgField: {
        type: _type.GraphQLString,
        args: {
          stringListNonNullArg: {
            type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLString))
          }
        }
      },
      complexArgField: {
        type: _type.GraphQLString,
        args: {
          complexArg: {
            type: ComplexInput
          }
        }
      },
      multipleReqs: {
        type: _type.GraphQLString,
        args: {
          req1: {
            type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
          },
          req2: {
            type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
          }
        }
      },
      nonNullFieldWithDefault: {
        type: _type.GraphQLString,
        args: {
          arg: {
            type: (0, _type.GraphQLNonNull)(_type.GraphQLInt),
            defaultValue: 0
          }
        }
      },
      multipleOpts: {
        type: _type.GraphQLString,
        args: {
          opt1: {
            type: _type.GraphQLInt,
            defaultValue: 0
          },
          opt2: {
            type: _type.GraphQLInt,
            defaultValue: 0
          }
        }
      },
      multipleOptAndReq: {
        type: _type.GraphQLString,
        args: {
          req1: {
            type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
          },
          req2: {
            type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
          },
          opt1: {
            type: _type.GraphQLInt,
            defaultValue: 0
          },
          opt2: {
            type: _type.GraphQLInt,
            defaultValue: 0
          }
        }
      }
    };
  }
});
var InvalidScalar = new _definition.GraphQLScalarType({
  name: 'Invalid',
  serialize: function serialize(value) {
    return value;
  },
  parseLiteral: function parseLiteral(node) {
    throw new Error('Invalid scalar is always invalid: ' + node.value);
  },
  parseValue: function parseValue(node) {
    throw new Error('Invalid scalar is always invalid: ' + node);
  }
});
var AnyScalar = new _definition.GraphQLScalarType({
  name: 'Any',
  serialize: function serialize(value) {
    return value;
  },
  parseLiteral: function parseLiteral(node) {
    return node; // Allows any value
  },
  parseValue: function parseValue(value) {
    return value; // Allows any value
  }
});
var QueryRoot = new _type.GraphQLObjectType({
  name: 'QueryRoot',
  fields: function fields() {
    return {
      human: {
        args: {
          id: {
            type: _type.GraphQLID
          }
        },
        type: Human
      },
      alien: {
        type: Alien
      },
      dog: {
        type: Dog
      },
      cat: {
        type: Cat
      },
      pet: {
        type: Pet
      },
      catOrDog: {
        type: CatOrDog
      },
      dogOrHuman: {
        type: DogOrHuman
      },
      humanOrAlien: {
        type: HumanOrAlien
      },
      complicatedArgs: {
        type: ComplicatedArgs
      },
      invalidArg: {
        args: {
          arg: {
            type: InvalidScalar
          }
        },
        type: _type.GraphQLString
      },
      anyArg: {
        args: {
          arg: {
            type: AnyScalar
          }
        },
        type: _type.GraphQLString
      }
    };
  }
});
var testSchema = new _type.GraphQLSchema({
  query: QueryRoot,
  types: [Cat, Dog, Human, Alien],
  directives: [_directives.GraphQLIncludeDirective, _directives.GraphQLSkipDirective, new _directives.GraphQLDirective({
    name: 'onQuery',
    locations: ['QUERY']
  }), new _directives.GraphQLDirective({
    name: 'onMutation',
    locations: ['MUTATION']
  }), new _directives.GraphQLDirective({
    name: 'onSubscription',
    locations: ['SUBSCRIPTION']
  }), new _directives.GraphQLDirective({
    name: 'onField',
    locations: ['FIELD']
  }), new _directives.GraphQLDirective({
    name: 'onFragmentDefinition',
    locations: ['FRAGMENT_DEFINITION']
  }), new _directives.GraphQLDirective({
    name: 'onFragmentSpread',
    locations: ['FRAGMENT_SPREAD']
  }), new _directives.GraphQLDirective({
    name: 'onInlineFragment',
    locations: ['INLINE_FRAGMENT']
  }), new _directives.GraphQLDirective({
    name: 'onSchema',
    locations: ['SCHEMA']
  }), new _directives.GraphQLDirective({
    name: 'onScalar',
    locations: ['SCALAR']
  }), new _directives.GraphQLDirective({
    name: 'onObject',
    locations: ['OBJECT']
  }), new _directives.GraphQLDirective({
    name: 'onFieldDefinition',
    locations: ['FIELD_DEFINITION']
  }), new _directives.GraphQLDirective({
    name: 'onArgumentDefinition',
    locations: ['ARGUMENT_DEFINITION']
  }), new _directives.GraphQLDirective({
    name: 'onInterface',
    locations: ['INTERFACE']
  }), new _directives.GraphQLDirective({
    name: 'onUnion',
    locations: ['UNION']
  }), new _directives.GraphQLDirective({
    name: 'onEnum',
    locations: ['ENUM']
  }), new _directives.GraphQLDirective({
    name: 'onEnumValue',
    locations: ['ENUM_VALUE']
  }), new _directives.GraphQLDirective({
    name: 'onInputObject',
    locations: ['INPUT_OBJECT']
  }), new _directives.GraphQLDirective({
    name: 'onInputFieldDefinition',
    locations: ['INPUT_FIELD_DEFINITION']
  })]
});
exports.testSchema = testSchema;

function expectValid(schema, rules, queryString) {
  var errors = (0, _validate.validate)(schema, (0, _language.parse)(queryString), rules);
  (0, _chai.expect)(errors).to.deep.equal([], 'Should validate');
}

function expectInvalid(schema, rules, queryString, expectedErrors) {
  var errors = (0, _validate.validate)(schema, (0, _language.parse)(queryString), rules);
  (0, _chai.expect)(errors).to.have.length.of.at.least(1, 'Should not validate');
  (0, _chai.expect)(errors).to.deep.equal(expectedErrors);
  return errors;
}

function expectPassesRule(rule, queryString) {
  return expectValid(testSchema, [rule], queryString);
}

function expectFailsRule(rule, queryString, errors) {
  return expectInvalid(testSchema, [rule], queryString, errors);
}

function expectPassesRuleWithSchema(schema, rule, queryString, errors) {
  return expectValid(schema, [rule], queryString, errors);
}

function expectFailsRuleWithSchema(schema, rule, queryString, errors) {
  return expectInvalid(schema, [rule], queryString, errors);
}