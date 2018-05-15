/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { parse } from '../../language';
import { validate } from '../validate';
import { GraphQLSchema, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLEnumType, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean, GraphQLID } from '../../type';
import { GraphQLDirective, GraphQLIncludeDirective, GraphQLSkipDirective } from '../../type/directives';
import { GraphQLScalarType } from '../../type/definition';
var Being = new GraphQLInterfaceType({
  name: 'Being',
  fields: function fields() {
    return {
      name: {
        type: GraphQLString,
        args: {
          surname: {
            type: GraphQLBoolean
          }
        }
      }
    };
  }
});
var Pet = new GraphQLInterfaceType({
  name: 'Pet',
  fields: function fields() {
    return {
      name: {
        type: GraphQLString,
        args: {
          surname: {
            type: GraphQLBoolean
          }
        }
      }
    };
  }
});
var Canine = new GraphQLInterfaceType({
  name: 'Canine',
  fields: function fields() {
    return {
      name: {
        type: GraphQLString,
        args: {
          surname: {
            type: GraphQLBoolean
          }
        }
      }
    };
  }
});
var DogCommand = new GraphQLEnumType({
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
var Dog = new GraphQLObjectType({
  name: 'Dog',
  fields: function fields() {
    return {
      name: {
        type: GraphQLString,
        args: {
          surname: {
            type: GraphQLBoolean
          }
        }
      },
      nickname: {
        type: GraphQLString
      },
      barkVolume: {
        type: GraphQLInt
      },
      barks: {
        type: GraphQLBoolean
      },
      doesKnowCommand: {
        type: GraphQLBoolean,
        args: {
          dogCommand: {
            type: DogCommand
          }
        }
      },
      isHousetrained: {
        type: GraphQLBoolean,
        args: {
          atOtherHomes: {
            type: GraphQLBoolean,
            defaultValue: true
          }
        }
      },
      isAtLocation: {
        type: GraphQLBoolean,
        args: {
          x: {
            type: GraphQLInt
          },
          y: {
            type: GraphQLInt
          }
        }
      }
    };
  },
  interfaces: [Being, Pet, Canine]
});
var Cat = new GraphQLObjectType({
  name: 'Cat',
  fields: function fields() {
    return {
      name: {
        type: GraphQLString,
        args: {
          surname: {
            type: GraphQLBoolean
          }
        }
      },
      nickname: {
        type: GraphQLString
      },
      meows: {
        type: GraphQLBoolean
      },
      meowVolume: {
        type: GraphQLInt
      },
      furColor: {
        type: FurColor
      }
    };
  },
  interfaces: [Being, Pet]
});
var CatOrDog = new GraphQLUnionType({
  name: 'CatOrDog',
  types: [Dog, Cat]
});
var Intelligent = new GraphQLInterfaceType({
  name: 'Intelligent',
  fields: {
    iq: {
      type: GraphQLInt
    }
  }
});
var Human = new GraphQLObjectType({
  name: 'Human',
  interfaces: [Being, Intelligent],
  fields: function fields() {
    return {
      name: {
        type: GraphQLString,
        args: {
          surname: {
            type: GraphQLBoolean
          }
        }
      },
      pets: {
        type: GraphQLList(Pet)
      },
      relatives: {
        type: GraphQLList(Human)
      },
      iq: {
        type: GraphQLInt
      }
    };
  }
});
var Alien = new GraphQLObjectType({
  name: 'Alien',
  interfaces: [Being, Intelligent],
  fields: {
    iq: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString,
      args: {
        surname: {
          type: GraphQLBoolean
        }
      }
    },
    numEyes: {
      type: GraphQLInt
    }
  }
});
var DogOrHuman = new GraphQLUnionType({
  name: 'DogOrHuman',
  types: [Dog, Human]
});
var HumanOrAlien = new GraphQLUnionType({
  name: 'HumanOrAlien',
  types: [Human, Alien]
});
var FurColor = new GraphQLEnumType({
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
var ComplexInput = new GraphQLInputObjectType({
  name: 'ComplexInput',
  fields: {
    requiredField: {
      type: GraphQLNonNull(GraphQLBoolean)
    },
    nonNullField: {
      type: GraphQLNonNull(GraphQLBoolean),
      defaultValue: false
    },
    intField: {
      type: GraphQLInt
    },
    stringField: {
      type: GraphQLString
    },
    booleanField: {
      type: GraphQLBoolean
    },
    stringListField: {
      type: GraphQLList(GraphQLString)
    }
  }
});
var ComplicatedArgs = new GraphQLObjectType({
  name: 'ComplicatedArgs',
  // TODO List
  // TODO Coercion
  // TODO NotNulls
  fields: function fields() {
    return {
      intArgField: {
        type: GraphQLString,
        args: {
          intArg: {
            type: GraphQLInt
          }
        }
      },
      nonNullIntArgField: {
        type: GraphQLString,
        args: {
          nonNullIntArg: {
            type: GraphQLNonNull(GraphQLInt)
          }
        }
      },
      stringArgField: {
        type: GraphQLString,
        args: {
          stringArg: {
            type: GraphQLString
          }
        }
      },
      booleanArgField: {
        type: GraphQLString,
        args: {
          booleanArg: {
            type: GraphQLBoolean
          }
        }
      },
      enumArgField: {
        type: GraphQLString,
        args: {
          enumArg: {
            type: FurColor
          }
        }
      },
      floatArgField: {
        type: GraphQLString,
        args: {
          floatArg: {
            type: GraphQLFloat
          }
        }
      },
      idArgField: {
        type: GraphQLString,
        args: {
          idArg: {
            type: GraphQLID
          }
        }
      },
      stringListArgField: {
        type: GraphQLString,
        args: {
          stringListArg: {
            type: GraphQLList(GraphQLString)
          }
        }
      },
      stringListNonNullArgField: {
        type: GraphQLString,
        args: {
          stringListNonNullArg: {
            type: GraphQLList(GraphQLNonNull(GraphQLString))
          }
        }
      },
      complexArgField: {
        type: GraphQLString,
        args: {
          complexArg: {
            type: ComplexInput
          }
        }
      },
      multipleReqs: {
        type: GraphQLString,
        args: {
          req1: {
            type: GraphQLNonNull(GraphQLInt)
          },
          req2: {
            type: GraphQLNonNull(GraphQLInt)
          }
        }
      },
      nonNullFieldWithDefault: {
        type: GraphQLString,
        args: {
          arg: {
            type: GraphQLNonNull(GraphQLInt),
            defaultValue: 0
          }
        }
      },
      multipleOpts: {
        type: GraphQLString,
        args: {
          opt1: {
            type: GraphQLInt,
            defaultValue: 0
          },
          opt2: {
            type: GraphQLInt,
            defaultValue: 0
          }
        }
      },
      multipleOptAndReq: {
        type: GraphQLString,
        args: {
          req1: {
            type: GraphQLNonNull(GraphQLInt)
          },
          req2: {
            type: GraphQLNonNull(GraphQLInt)
          },
          opt1: {
            type: GraphQLInt,
            defaultValue: 0
          },
          opt2: {
            type: GraphQLInt,
            defaultValue: 0
          }
        }
      }
    };
  }
});
var InvalidScalar = new GraphQLScalarType({
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
var AnyScalar = new GraphQLScalarType({
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
var QueryRoot = new GraphQLObjectType({
  name: 'QueryRoot',
  fields: function fields() {
    return {
      human: {
        args: {
          id: {
            type: GraphQLID
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
        type: GraphQLString
      },
      anyArg: {
        args: {
          arg: {
            type: AnyScalar
          }
        },
        type: GraphQLString
      }
    };
  }
});
export var testSchema = new GraphQLSchema({
  query: QueryRoot,
  types: [Cat, Dog, Human, Alien],
  directives: [GraphQLIncludeDirective, GraphQLSkipDirective, new GraphQLDirective({
    name: 'onQuery',
    locations: ['QUERY']
  }), new GraphQLDirective({
    name: 'onMutation',
    locations: ['MUTATION']
  }), new GraphQLDirective({
    name: 'onSubscription',
    locations: ['SUBSCRIPTION']
  }), new GraphQLDirective({
    name: 'onField',
    locations: ['FIELD']
  }), new GraphQLDirective({
    name: 'onFragmentDefinition',
    locations: ['FRAGMENT_DEFINITION']
  }), new GraphQLDirective({
    name: 'onFragmentSpread',
    locations: ['FRAGMENT_SPREAD']
  }), new GraphQLDirective({
    name: 'onInlineFragment',
    locations: ['INLINE_FRAGMENT']
  }), new GraphQLDirective({
    name: 'onSchema',
    locations: ['SCHEMA']
  }), new GraphQLDirective({
    name: 'onScalar',
    locations: ['SCALAR']
  }), new GraphQLDirective({
    name: 'onObject',
    locations: ['OBJECT']
  }), new GraphQLDirective({
    name: 'onFieldDefinition',
    locations: ['FIELD_DEFINITION']
  }), new GraphQLDirective({
    name: 'onArgumentDefinition',
    locations: ['ARGUMENT_DEFINITION']
  }), new GraphQLDirective({
    name: 'onInterface',
    locations: ['INTERFACE']
  }), new GraphQLDirective({
    name: 'onUnion',
    locations: ['UNION']
  }), new GraphQLDirective({
    name: 'onEnum',
    locations: ['ENUM']
  }), new GraphQLDirective({
    name: 'onEnumValue',
    locations: ['ENUM_VALUE']
  }), new GraphQLDirective({
    name: 'onInputObject',
    locations: ['INPUT_OBJECT']
  }), new GraphQLDirective({
    name: 'onInputFieldDefinition',
    locations: ['INPUT_FIELD_DEFINITION']
  })]
});

function expectValid(schema, rules, queryString) {
  var errors = validate(schema, parse(queryString), rules);
  expect(errors).to.deep.equal([], 'Should validate');
}

function expectInvalid(schema, rules, queryString, expectedErrors) {
  var errors = validate(schema, parse(queryString), rules);
  expect(errors).to.have.length.of.at.least(1, 'Should not validate');
  expect(errors).to.deep.equal(expectedErrors);
  return errors;
}

export function expectPassesRule(rule, queryString) {
  return expectValid(testSchema, [rule], queryString);
}
export function expectFailsRule(rule, queryString, errors) {
  return expectInvalid(testSchema, [rule], queryString, errors);
}
export function expectPassesRuleWithSchema(schema, rule, queryString, errors) {
  return expectValid(schema, [rule], queryString, errors);
}
export function expectFailsRuleWithSchema(schema, rule, queryString, errors) {
  return expectInvalid(schema, [rule], queryString, errors);
}