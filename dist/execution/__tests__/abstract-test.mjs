/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { graphqlSync, GraphQLSchema, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLList, GraphQLString, GraphQLBoolean } from '../../';

var Dog = function Dog(name, woofs) {
  this.name = name;
  this.woofs = woofs;
};

var Cat = function Cat(name, meows) {
  this.name = name;
  this.meows = meows;
};

var Human = function Human(name) {
  this.name = name;
};

describe('Execute: Handles execution of abstract types', function () {
  it('isTypeOf used to resolve runtime type for Interface', function () {
    var PetType = new GraphQLInterfaceType({
      name: 'Pet',
      fields: {
        name: {
          type: GraphQLString
        }
      }
    });
    var DogType = new GraphQLObjectType({
      name: 'Dog',
      interfaces: [PetType],
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Dog;
      },
      fields: {
        name: {
          type: GraphQLString
        },
        woofs: {
          type: GraphQLBoolean
        }
      }
    });
    var CatType = new GraphQLObjectType({
      name: 'Cat',
      interfaces: [PetType],
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Cat;
      },
      fields: {
        name: {
          type: GraphQLString
        },
        meows: {
          type: GraphQLBoolean
        }
      }
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: GraphQLList(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false)];
            }
          }
        }
      }),
      types: [CatType, DogType]
    });
    var query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
    var result = graphqlSync(schema, query);
    expect(result).to.deep.equal({
      data: {
        pets: [{
          name: 'Odie',
          woofs: true
        }, {
          name: 'Garfield',
          meows: false
        }]
      }
    });
  });
  it('isTypeOf used to resolve runtime type for Union', function () {
    var DogType = new GraphQLObjectType({
      name: 'Dog',
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Dog;
      },
      fields: {
        name: {
          type: GraphQLString
        },
        woofs: {
          type: GraphQLBoolean
        }
      }
    });
    var CatType = new GraphQLObjectType({
      name: 'Cat',
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Cat;
      },
      fields: {
        name: {
          type: GraphQLString
        },
        meows: {
          type: GraphQLBoolean
        }
      }
    });
    var PetType = new GraphQLUnionType({
      name: 'Pet',
      types: [DogType, CatType]
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: GraphQLList(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false)];
            }
          }
        }
      })
    });
    var query = "{\n      pets {\n        ... on Dog {\n          name\n          woofs\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n    }";
    var result = graphqlSync(schema, query);
    expect(result).to.deep.equal({
      data: {
        pets: [{
          name: 'Odie',
          woofs: true
        }, {
          name: 'Garfield',
          meows: false
        }]
      }
    });
  });
  it('resolveType on Interface yields useful error', function () {
    var PetType = new GraphQLInterfaceType({
      name: 'Pet',
      resolveType: function resolveType(obj) {
        return obj instanceof Dog ? DogType : obj instanceof Cat ? CatType : obj instanceof Human ? HumanType : null;
      },
      fields: {
        name: {
          type: GraphQLString
        }
      }
    });
    var HumanType = new GraphQLObjectType({
      name: 'Human',
      fields: {
        name: {
          type: GraphQLString
        }
      }
    });
    var DogType = new GraphQLObjectType({
      name: 'Dog',
      interfaces: [PetType],
      fields: {
        name: {
          type: GraphQLString
        },
        woofs: {
          type: GraphQLBoolean
        }
      }
    });
    var CatType = new GraphQLObjectType({
      name: 'Cat',
      interfaces: [PetType],
      fields: {
        name: {
          type: GraphQLString
        },
        meows: {
          type: GraphQLBoolean
        }
      }
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: GraphQLList(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false), new Human('Jon')];
            }
          }
        }
      }),
      types: [CatType, DogType]
    });
    var query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
    var result = graphqlSync(schema, query);
    expect(result).to.deep.equal({
      data: {
        pets: [{
          name: 'Odie',
          woofs: true
        }, {
          name: 'Garfield',
          meows: false
        }, null]
      },
      errors: [{
        message: 'Runtime Object type "Human" is not a possible type for "Pet".',
        locations: [{
          line: 2,
          column: 7
        }],
        path: ['pets', 2]
      }]
    });
  });
  it('resolveType on Union yields useful error', function () {
    var HumanType = new GraphQLObjectType({
      name: 'Human',
      fields: {
        name: {
          type: GraphQLString
        }
      }
    });
    var DogType = new GraphQLObjectType({
      name: 'Dog',
      fields: {
        name: {
          type: GraphQLString
        },
        woofs: {
          type: GraphQLBoolean
        }
      }
    });
    var CatType = new GraphQLObjectType({
      name: 'Cat',
      fields: {
        name: {
          type: GraphQLString
        },
        meows: {
          type: GraphQLBoolean
        }
      }
    });
    var PetType = new GraphQLUnionType({
      name: 'Pet',
      resolveType: function resolveType(obj) {
        return obj instanceof Dog ? DogType : obj instanceof Cat ? CatType : obj instanceof Human ? HumanType : null;
      },
      types: [DogType, CatType]
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: GraphQLList(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false), new Human('Jon')];
            }
          }
        }
      })
    });
    var query = "{\n      pets {\n        ... on Dog {\n          name\n          woofs\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n    }";
    var result = graphqlSync(schema, query);
    expect(result).to.deep.equal({
      data: {
        pets: [{
          name: 'Odie',
          woofs: true
        }, {
          name: 'Garfield',
          meows: false
        }, null]
      },
      errors: [{
        message: 'Runtime Object type "Human" is not a possible type for "Pet".',
        locations: [{
          line: 2,
          column: 7
        }],
        path: ['pets', 2]
      }]
    });
  });
  it('resolveType allows resolving with type name', function () {
    var PetType = new GraphQLInterfaceType({
      name: 'Pet',
      resolveType: function resolveType(obj) {
        return obj instanceof Dog ? 'Dog' : obj instanceof Cat ? 'Cat' : null;
      },
      fields: {
        name: {
          type: GraphQLString
        }
      }
    });
    var DogType = new GraphQLObjectType({
      name: 'Dog',
      interfaces: [PetType],
      fields: {
        name: {
          type: GraphQLString
        },
        woofs: {
          type: GraphQLBoolean
        }
      }
    });
    var CatType = new GraphQLObjectType({
      name: 'Cat',
      interfaces: [PetType],
      fields: {
        name: {
          type: GraphQLString
        },
        meows: {
          type: GraphQLBoolean
        }
      }
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: GraphQLList(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false)];
            }
          }
        }
      }),
      types: [CatType, DogType]
    });
    var query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
    var result = graphqlSync(schema, query);
    expect(result).to.deep.equal({
      data: {
        pets: [{
          name: 'Odie',
          woofs: true
        }, {
          name: 'Garfield',
          meows: false
        }]
      }
    });
  });
});