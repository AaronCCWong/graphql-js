"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _ = require("../../");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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

(0, _mocha.describe)('Execute: Handles execution of abstract types', function () {
  (0, _mocha.it)('isTypeOf used to resolve runtime type for Interface', function () {
    var PetType = new _.GraphQLInterfaceType({
      name: 'Pet',
      fields: {
        name: {
          type: _.GraphQLString
        }
      }
    });
    var DogType = new _.GraphQLObjectType({
      name: 'Dog',
      interfaces: [PetType],
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Dog;
      },
      fields: {
        name: {
          type: _.GraphQLString
        },
        woofs: {
          type: _.GraphQLBoolean
        }
      }
    });
    var CatType = new _.GraphQLObjectType({
      name: 'Cat',
      interfaces: [PetType],
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Cat;
      },
      fields: {
        name: {
          type: _.GraphQLString
        },
        meows: {
          type: _.GraphQLBoolean
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: (0, _.GraphQLList)(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false)];
            }
          }
        }
      }),
      types: [CatType, DogType]
    });
    var query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
    var result = (0, _.graphqlSync)(schema, query);
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('isTypeOf used to resolve runtime type for Union', function () {
    var DogType = new _.GraphQLObjectType({
      name: 'Dog',
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Dog;
      },
      fields: {
        name: {
          type: _.GraphQLString
        },
        woofs: {
          type: _.GraphQLBoolean
        }
      }
    });
    var CatType = new _.GraphQLObjectType({
      name: 'Cat',
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Cat;
      },
      fields: {
        name: {
          type: _.GraphQLString
        },
        meows: {
          type: _.GraphQLBoolean
        }
      }
    });
    var PetType = new _.GraphQLUnionType({
      name: 'Pet',
      types: [DogType, CatType]
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: (0, _.GraphQLList)(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false)];
            }
          }
        }
      })
    });
    var query = "{\n      pets {\n        ... on Dog {\n          name\n          woofs\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n    }";
    var result = (0, _.graphqlSync)(schema, query);
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('resolveType on Interface yields useful error', function () {
    var PetType = new _.GraphQLInterfaceType({
      name: 'Pet',
      resolveType: function resolveType(obj) {
        return obj instanceof Dog ? DogType : obj instanceof Cat ? CatType : obj instanceof Human ? HumanType : null;
      },
      fields: {
        name: {
          type: _.GraphQLString
        }
      }
    });
    var HumanType = new _.GraphQLObjectType({
      name: 'Human',
      fields: {
        name: {
          type: _.GraphQLString
        }
      }
    });
    var DogType = new _.GraphQLObjectType({
      name: 'Dog',
      interfaces: [PetType],
      fields: {
        name: {
          type: _.GraphQLString
        },
        woofs: {
          type: _.GraphQLBoolean
        }
      }
    });
    var CatType = new _.GraphQLObjectType({
      name: 'Cat',
      interfaces: [PetType],
      fields: {
        name: {
          type: _.GraphQLString
        },
        meows: {
          type: _.GraphQLBoolean
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: (0, _.GraphQLList)(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false), new Human('Jon')];
            }
          }
        }
      }),
      types: [CatType, DogType]
    });
    var query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
    var result = (0, _.graphqlSync)(schema, query);
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('resolveType on Union yields useful error', function () {
    var HumanType = new _.GraphQLObjectType({
      name: 'Human',
      fields: {
        name: {
          type: _.GraphQLString
        }
      }
    });
    var DogType = new _.GraphQLObjectType({
      name: 'Dog',
      fields: {
        name: {
          type: _.GraphQLString
        },
        woofs: {
          type: _.GraphQLBoolean
        }
      }
    });
    var CatType = new _.GraphQLObjectType({
      name: 'Cat',
      fields: {
        name: {
          type: _.GraphQLString
        },
        meows: {
          type: _.GraphQLBoolean
        }
      }
    });
    var PetType = new _.GraphQLUnionType({
      name: 'Pet',
      resolveType: function resolveType(obj) {
        return obj instanceof Dog ? DogType : obj instanceof Cat ? CatType : obj instanceof Human ? HumanType : null;
      },
      types: [DogType, CatType]
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: (0, _.GraphQLList)(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false), new Human('Jon')];
            }
          }
        }
      })
    });
    var query = "{\n      pets {\n        ... on Dog {\n          name\n          woofs\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n    }";
    var result = (0, _.graphqlSync)(schema, query);
    (0, _chai.expect)(result).to.deep.equal({
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
  (0, _mocha.it)('resolveType allows resolving with type name', function () {
    var PetType = new _.GraphQLInterfaceType({
      name: 'Pet',
      resolveType: function resolveType(obj) {
        return obj instanceof Dog ? 'Dog' : obj instanceof Cat ? 'Cat' : null;
      },
      fields: {
        name: {
          type: _.GraphQLString
        }
      }
    });
    var DogType = new _.GraphQLObjectType({
      name: 'Dog',
      interfaces: [PetType],
      fields: {
        name: {
          type: _.GraphQLString
        },
        woofs: {
          type: _.GraphQLBoolean
        }
      }
    });
    var CatType = new _.GraphQLObjectType({
      name: 'Cat',
      interfaces: [PetType],
      fields: {
        name: {
          type: _.GraphQLString
        },
        meows: {
          type: _.GraphQLBoolean
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          pets: {
            type: (0, _.GraphQLList)(PetType),
            resolve: function resolve() {
              return [new Dog('Odie', true), new Cat('Garfield', false)];
            }
          }
        }
      }),
      types: [CatType, DogType]
    });
    var query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
    var result = (0, _.graphqlSync)(schema, query);
    (0, _chai.expect)(result).to.deep.equal({
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