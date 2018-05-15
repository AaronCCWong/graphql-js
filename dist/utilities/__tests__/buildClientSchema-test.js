"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _buildClientSchema = require("../buildClientSchema");

var _introspectionFromSchema = require("../introspectionFromSchema");

var _ = require("../../");

var _directives = require("../../type/directives");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Test property:
// Given a server's schema, a client may query that server with introspection,
// and use the result to produce a client-side representation of the schema
// by using "buildClientSchema". If the client then runs the introspection
// query against the client-side schema, it should get a result identical to
// what was returned by the server.
function testSchema(serverSchema) {
  var initialIntrospection = (0, _introspectionFromSchema.introspectionFromSchema)(serverSchema);
  var clientSchema = (0, _buildClientSchema.buildClientSchema)(initialIntrospection);
  var secondIntrospection = (0, _introspectionFromSchema.introspectionFromSchema)(clientSchema);
  (0, _chai.expect)(secondIntrospection).to.deep.equal(initialIntrospection);
}

(0, _mocha.describe)('Type System: build schema from introspection', function () {
  (0, _mocha.it)('builds a simple schema', function () {
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Simple',
        description: 'This is a simple type',
        fields: {
          string: {
            type: _.GraphQLString,
            description: 'This is a string field'
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a simple schema with all operation types', function () {
    var queryType = new _.GraphQLObjectType({
      name: 'QueryType',
      description: 'This is a simple query type',
      fields: {
        string: {
          type: _.GraphQLString,
          description: 'This is a string field'
        }
      }
    });
    var mutationType = new _.GraphQLObjectType({
      name: 'MutationType',
      description: 'This is a simple mutation type',
      fields: {
        setString: {
          type: _.GraphQLString,
          description: 'Set the string field',
          args: {
            value: {
              type: _.GraphQLString
            }
          }
        }
      }
    });
    var subscriptionType = new _.GraphQLObjectType({
      name: 'SubscriptionType',
      description: 'This is a simple subscription type',
      fields: {
        string: {
          type: _.GraphQLString,
          description: 'This is a string field'
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: queryType,
      mutation: mutationType,
      subscription: subscriptionType
    });
    testSchema(schema);
  });
  (0, _mocha.it)('uses built-in scalars when possible', function () {
    var customScalar = new _.GraphQLScalarType({
      name: 'CustomScalar',
      serialize: function serialize() {
        return null;
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Scalars',
        fields: {
          int: {
            type: _.GraphQLInt
          },
          float: {
            type: _.GraphQLFloat
          },
          string: {
            type: _.GraphQLString
          },
          boolean: {
            type: _.GraphQLBoolean
          },
          id: {
            type: _.GraphQLID
          },
          custom: {
            type: customScalar
          }
        }
      })
    });
    testSchema(schema);
    var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema);
    var clientSchema = (0, _buildClientSchema.buildClientSchema)(introspection); // Built-ins are used

    (0, _chai.expect)(clientSchema.getType('Int')).to.equal(_.GraphQLInt);
    (0, _chai.expect)(clientSchema.getType('Float')).to.equal(_.GraphQLFloat);
    (0, _chai.expect)(clientSchema.getType('String')).to.equal(_.GraphQLString);
    (0, _chai.expect)(clientSchema.getType('Boolean')).to.equal(_.GraphQLBoolean);
    (0, _chai.expect)(clientSchema.getType('ID')).to.equal(_.GraphQLID); // Custom are built

    (0, _chai.expect)(clientSchema.getType('CustomScalar')).not.to.equal(customScalar);
  });
  (0, _mocha.it)('builds a schema with a recursive type reference', function () {
    var recurType = new _.GraphQLObjectType({
      name: 'Recur',
      fields: function fields() {
        return {
          recur: {
            type: recurType
          }
        };
      }
    });
    var schema = new _.GraphQLSchema({
      query: recurType
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with a circular type reference', function () {
    var dogType = new _.GraphQLObjectType({
      name: 'Dog',
      fields: function fields() {
        return {
          bestFriend: {
            type: humanType
          }
        };
      }
    });
    var humanType = new _.GraphQLObjectType({
      name: 'Human',
      fields: function fields() {
        return {
          bestFriend: {
            type: dogType
          }
        };
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Circular',
        fields: {
          dog: {
            type: dogType
          },
          human: {
            type: humanType
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with an interface', function () {
    var friendlyType = new _.GraphQLInterfaceType({
      name: 'Friendly',
      fields: function fields() {
        return {
          bestFriend: {
            type: friendlyType,
            description: 'The best friend of this friendly thing'
          }
        };
      }
    });
    var dogType = new _.GraphQLObjectType({
      name: 'Dog',
      interfaces: [friendlyType],
      fields: function fields() {
        return {
          bestFriend: {
            type: friendlyType
          }
        };
      }
    });
    var humanType = new _.GraphQLObjectType({
      name: 'Human',
      interfaces: [friendlyType],
      fields: function fields() {
        return {
          bestFriend: {
            type: friendlyType
          }
        };
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'WithInterface',
        fields: {
          friendly: {
            type: friendlyType
          }
        }
      }),
      types: [dogType, humanType]
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with an implicit interface', function () {
    var friendlyType = new _.GraphQLInterfaceType({
      name: 'Friendly',
      fields: function fields() {
        return {
          bestFriend: {
            type: friendlyType,
            description: 'The best friend of this friendly thing'
          }
        };
      }
    });
    var dogType = new _.GraphQLObjectType({
      name: 'Dog',
      interfaces: [friendlyType],
      fields: function fields() {
        return {
          bestFriend: {
            type: dogType
          }
        };
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'WithInterface',
        fields: {
          dog: {
            type: dogType
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with a union', function () {
    var dogType = new _.GraphQLObjectType({
      name: 'Dog',
      fields: function fields() {
        return {
          bestFriend: {
            type: friendlyType
          }
        };
      }
    });
    var humanType = new _.GraphQLObjectType({
      name: 'Human',
      fields: function fields() {
        return {
          bestFriend: {
            type: friendlyType
          }
        };
      }
    });
    var friendlyType = new _.GraphQLUnionType({
      name: 'Friendly',
      types: [dogType, humanType]
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'WithUnion',
        fields: {
          friendly: {
            type: friendlyType
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with complex field values', function () {
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'ComplexFields',
        fields: {
          string: {
            type: _.GraphQLString
          },
          listOfString: {
            type: (0, _.GraphQLList)(_.GraphQLString)
          },
          nonNullString: {
            type: (0, _.GraphQLNonNull)(_.GraphQLString)
          },
          nonNullListOfString: {
            type: (0, _.GraphQLNonNull)((0, _.GraphQLList)(_.GraphQLString))
          },
          nonNullListOfNonNullString: {
            type: (0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)(_.GraphQLString)))
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with field arguments', function () {
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'ArgFields',
        fields: {
          one: {
            description: 'A field with a single arg',
            type: _.GraphQLString,
            args: {
              intArg: {
                description: 'This is an int arg',
                type: _.GraphQLInt
              }
            }
          },
          two: {
            description: 'A field with a two args',
            type: _.GraphQLString,
            args: {
              listArg: {
                description: 'This is an list of int arg',
                type: (0, _.GraphQLList)(_.GraphQLInt)
              },
              requiredArg: {
                description: 'This is a required arg',
                type: (0, _.GraphQLNonNull)(_.GraphQLBoolean)
              }
            }
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with default value on custom scalar field', function () {
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'ArgFields',
        fields: {
          testField: {
            type: _.GraphQLString,
            args: {
              testArg: {
                type: new _.GraphQLScalarType({
                  name: 'CustomScalar',
                  serialize: function serialize(value) {
                    return value;
                  }
                }),
                defaultValue: 'default'
              }
            }
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with an enum', function () {
    var foodEnum = new _.GraphQLEnumType({
      name: 'Food',
      description: 'Varieties of food stuffs',
      values: {
        VEGETABLES: {
          description: 'Foods that are vegetables.',
          value: 1
        },
        FRUITS: {
          description: 'Foods that are fruits.',
          value: 2
        },
        OILS: {
          description: 'Foods that are oils.',
          value: 3
        },
        DAIRY: {
          description: 'Foods that are dairy.',
          value: 4
        },
        MEAT: {
          description: 'Foods that are meat.',
          value: 5
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'EnumFields',
        fields: {
          food: {
            description: 'Repeats the arg you give it',
            type: foodEnum,
            args: {
              kind: {
                description: 'what kind of food?',
                type: foodEnum
              }
            }
          }
        }
      })
    });
    testSchema(schema);
    var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema);
    var clientSchema = (0, _buildClientSchema.buildClientSchema)(introspection);
    var clientFoodEnum = clientSchema.getType('Food'); // It's also an Enum type on the client.

    (0, _chai.expect)(clientFoodEnum).to.be.an.instanceOf(_.GraphQLEnumType); // Client types do not get server-only values, so `value` mirrors `name`,
    // rather than using the integers defined in the "server" schema.

    (0, _chai.expect)(clientFoodEnum.getValues()).to.deep.equal([{
      name: 'VEGETABLES',
      value: 'VEGETABLES',
      description: 'Foods that are vegetables.',
      isDeprecated: false,
      deprecationReason: null,
      astNode: undefined
    }, {
      name: 'FRUITS',
      value: 'FRUITS',
      description: 'Foods that are fruits.',
      isDeprecated: false,
      deprecationReason: null,
      astNode: undefined
    }, {
      name: 'OILS',
      value: 'OILS',
      description: 'Foods that are oils.',
      isDeprecated: false,
      deprecationReason: null,
      astNode: undefined
    }, {
      name: 'DAIRY',
      value: 'DAIRY',
      description: 'Foods that are dairy.',
      isDeprecated: false,
      deprecationReason: null,
      astNode: undefined
    }, {
      name: 'MEAT',
      value: 'MEAT',
      description: 'Foods that are meat.',
      isDeprecated: false,
      deprecationReason: null,
      astNode: undefined
    }]);
  });
  (0, _mocha.it)('builds a schema with an input object', function () {
    var addressType = new _.GraphQLInputObjectType({
      name: 'Address',
      description: 'An input address',
      fields: {
        street: {
          description: 'What street is this address?',
          type: (0, _.GraphQLNonNull)(_.GraphQLString)
        },
        city: {
          description: 'The city the address is within?',
          type: (0, _.GraphQLNonNull)(_.GraphQLString)
        },
        country: {
          description: 'The country (blank will assume USA).',
          type: _.GraphQLString,
          defaultValue: 'USA'
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'HasInputObjectFields',
        fields: {
          geocode: {
            description: 'Get a geocode from an address',
            type: _.GraphQLString,
            args: {
              address: {
                description: 'The address to lookup',
                type: addressType
              }
            }
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with field arguments with default values', function () {
    var geoType = new _.GraphQLInputObjectType({
      name: 'Geo',
      fields: {
        lat: {
          type: _.GraphQLFloat
        },
        lon: {
          type: _.GraphQLFloat
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'ArgFields',
        fields: {
          defaultInt: {
            type: _.GraphQLString,
            args: {
              intArg: {
                type: _.GraphQLInt,
                defaultValue: 10
              }
            }
          },
          defaultList: {
            type: _.GraphQLString,
            args: {
              listArg: {
                type: (0, _.GraphQLList)(_.GraphQLInt),
                defaultValue: [1, 2, 3]
              }
            }
          },
          defaultObject: {
            type: _.GraphQLString,
            args: {
              objArg: {
                type: geoType,
                defaultValue: {
                  lat: 37.485,
                  lon: -122.148
                }
              }
            }
          },
          defaultNull: {
            type: _.GraphQLString,
            args: {
              intArg: {
                type: _.GraphQLInt,
                defaultValue: null
              }
            }
          },
          noDefault: {
            type: _.GraphQLString,
            args: {
              intArg: {
                type: _.GraphQLInt
              }
            }
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with custom directives', function () {
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Simple',
        description: 'This is a simple type',
        fields: {
          string: {
            type: _.GraphQLString,
            description: 'This is a string field'
          }
        }
      }),
      directives: [new _directives.GraphQLDirective({
        name: 'customDirective',
        description: 'This is a custom directive',
        locations: ['FIELD']
      })]
    });
    testSchema(schema);
  });
  (0, _mocha.it)('builds a schema with legacy directives', function () {
    var oldIntrospection = {
      __schema: {
        // Minimum required schema.
        queryType: {
          name: 'Simple'
        },
        types: [{
          name: 'Simple',
          kind: 'OBJECT',
          fields: [{
            name: 'simple',
            args: [],
            type: {
              name: 'Simple'
            }
          }],
          interfaces: []
        }],
        // Test old directive introspection results.
        directives: [{
          name: 'Old1',
          args: [],
          onField: true
        }, {
          name: 'Old2',
          args: [],
          onFragment: true
        }, {
          name: 'Old3',
          args: [],
          onOperation: true
        }, {
          name: 'Old4',
          args: [],
          onField: true,
          onFragment: true
        }]
      }
    };
    var clientSchema = (0, _buildClientSchema.buildClientSchema)(oldIntrospection);
    var secondIntrospection = (0, _introspectionFromSchema.introspectionFromSchema)(clientSchema); // New introspection produces correct new format.

    (0, _chai.expect)(secondIntrospection).to.deep.nested.property('__schema.directives', [{
      name: 'Old1',
      description: null,
      args: [],
      locations: ['FIELD']
    }, {
      name: 'Old2',
      description: null,
      args: [],
      locations: ['FRAGMENT_DEFINITION', 'FRAGMENT_SPREAD', 'INLINE_FRAGMENT']
    }, {
      name: 'Old3',
      description: null,
      args: [],
      locations: ['QUERY', 'MUTATION', 'SUBSCRIPTION']
    }, {
      name: 'Old4',
      description: null,
      args: [],
      locations: ['FIELD', 'FRAGMENT_DEFINITION', 'FRAGMENT_SPREAD', 'INLINE_FRAGMENT']
    }]);
  });
  (0, _mocha.it)('builds a schema with legacy names', function () {
    var introspection = {
      __schema: {
        queryType: {
          name: 'Query'
        },
        types: [{
          name: 'Query',
          kind: 'OBJECT',
          fields: [{
            name: '__badName',
            args: [],
            type: {
              name: 'String'
            }
          }],
          interfaces: []
        }]
      }
    };
    var schema = (0, _buildClientSchema.buildClientSchema)(introspection, {
      allowedLegacyNames: ['__badName']
    });
    (0, _chai.expect)(schema.__allowedLegacyNames).to.deep.equal(['__badName']);
  });
  (0, _mocha.it)('builds a schema aware of deprecation', function () {
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Simple',
        description: 'This is a simple type',
        fields: {
          shinyString: {
            type: _.GraphQLString,
            description: 'This is a shiny string field'
          },
          deprecatedString: {
            type: _.GraphQLString,
            description: 'This is a deprecated string field',
            deprecationReason: 'Use shinyString'
          },
          color: {
            type: new _.GraphQLEnumType({
              name: 'Color',
              values: {
                RED: {
                  description: 'So rosy'
                },
                GREEN: {
                  description: 'So grassy'
                },
                BLUE: {
                  description: 'So calming'
                },
                MAUVE: {
                  description: 'So sickening',
                  deprecationReason: 'No longer in fashion'
                }
              }
            })
          }
        }
      })
    });
    testSchema(schema);
  });
  (0, _mocha.it)('can use client schema for limited execution', function () {
    var customScalar = new _.GraphQLScalarType({
      name: 'CustomScalar',
      serialize: function serialize() {
        return null;
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          foo: {
            type: _.GraphQLString,
            args: {
              custom1: {
                type: customScalar
              },
              custom2: {
                type: customScalar
              }
            }
          }
        }
      })
    });
    var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema);
    var clientSchema = (0, _buildClientSchema.buildClientSchema)(introspection);
    var result = (0, _.graphqlSync)(clientSchema, 'query Limited($v: CustomScalar) { foo(custom1: 123, custom2: $v) }', {
      foo: 'bar',
      unused: 'value'
    }, null, {
      v: 'baz'
    });
    (0, _chai.expect)(result.data).to.deep.equal({
      foo: 'bar'
    });
  });
  (0, _mocha.describe)('throws when given incomplete introspection', function () {
    (0, _mocha.it)('throws when given empty types', function () {
      var incompleteIntrospection = {
        __schema: {
          queryType: {
            name: 'QueryType'
          },
          types: []
        }
      };
      (0, _chai.expect)(function () {
        return (0, _buildClientSchema.buildClientSchema)(incompleteIntrospection);
      }).to.throw('Invalid or incomplete schema, unknown type: QueryType. Ensure ' + 'that a full introspection query is used in order to build a ' + 'client schema.');
    });
    (0, _mocha.it)('throws when missing kind', function () {
      var incompleteIntrospection = {
        __schema: {
          queryType: {
            name: 'QueryType'
          },
          types: [{
            name: 'QueryType'
          }]
        }
      };
      (0, _chai.expect)(function () {
        return (0, _buildClientSchema.buildClientSchema)(incompleteIntrospection);
      }).to.throw('Invalid or incomplete introspection result. Ensure that a full ' + 'introspection query is used in order to build a client schema');
    });
    (0, _mocha.it)('throws when missing interfaces', function () {
      var nullInterfaceIntrospection = {
        __schema: {
          queryType: {
            name: 'QueryType'
          },
          types: [{
            kind: 'OBJECT',
            name: 'QueryType',
            fields: [{
              name: 'aString',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false
            }]
          }]
        }
      };
      (0, _chai.expect)(function () {
        return (0, _buildClientSchema.buildClientSchema)(nullInterfaceIntrospection);
      }).to.throw('Introspection result missing interfaces: {"kind":"OBJECT",' + '"name":"QueryType","fields":[{"name":"aString","args":[],' + '"type":{"kind":"SCALAR","name":"String","ofType":null},' + '"isDeprecated":false}]}');
    });
  });
  (0, _mocha.describe)('very deep decorators are not supported', function () {
    (0, _mocha.it)('fails on very deep (> 7 levels) lists', function () {
      var schema = new _.GraphQLSchema({
        query: new _.GraphQLObjectType({
          name: 'Query',
          fields: {
            foo: {
              type: (0, _.GraphQLList)((0, _.GraphQLList)((0, _.GraphQLList)((0, _.GraphQLList)((0, _.GraphQLList)((0, _.GraphQLList)((0, _.GraphQLList)((0, _.GraphQLList)(_.GraphQLString))))))))
            }
          }
        })
      });
      var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema);
      (0, _chai.expect)(function () {
        return (0, _buildClientSchema.buildClientSchema)(introspection);
      }).to.throw('Decorated type deeper than introspection query.');
    });
    (0, _mocha.it)('fails on a very deep (> 7 levels) non-null', function () {
      var schema = new _.GraphQLSchema({
        query: new _.GraphQLObjectType({
          name: 'Query',
          fields: {
            foo: {
              type: (0, _.GraphQLList)((0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)(_.GraphQLString))))))))
            }
          }
        })
      });
      var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema);
      (0, _chai.expect)(function () {
        return (0, _buildClientSchema.buildClientSchema)(introspection);
      }).to.throw('Decorated type deeper than introspection query.');
    });
    (0, _mocha.it)('succeeds on deep (<= 7 levels) types', function () {
      var schema = new _.GraphQLSchema({
        query: new _.GraphQLObjectType({
          name: 'Query',
          fields: {
            foo: {
              // e.g., fully non-null 3D matrix
              type: (0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)(_.GraphQLString)))))))
            }
          }
        })
      });
      var introspection = (0, _introspectionFromSchema.introspectionFromSchema)(schema);
      (0, _buildClientSchema.buildClientSchema)(introspection);
    });
  });
});