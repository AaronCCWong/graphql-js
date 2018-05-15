"use strict";

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
var Dog = function Dog(name, barks) {
  this.name = name;
  this.barks = barks;
};

var Cat = function Cat(name, meows) {
  this.name = name;
  this.meows = meows;
};

var Person = function Person(name, pets, friends) {
  this.name = name;
  this.pets = pets;
  this.friends = friends;
};

var NamedType = new _type.GraphQLInterfaceType({
  name: 'Named',
  fields: {
    name: {
      type: _type.GraphQLString
    }
  }
});
var DogType = new _type.GraphQLObjectType({
  name: 'Dog',
  interfaces: [NamedType],
  fields: {
    name: {
      type: _type.GraphQLString
    },
    barks: {
      type: _type.GraphQLBoolean
    }
  },
  isTypeOf: function isTypeOf(value) {
    return value instanceof Dog;
  }
});
var CatType = new _type.GraphQLObjectType({
  name: 'Cat',
  interfaces: [NamedType],
  fields: {
    name: {
      type: _type.GraphQLString
    },
    meows: {
      type: _type.GraphQLBoolean
    }
  },
  isTypeOf: function isTypeOf(value) {
    return value instanceof Cat;
  }
});
var PetType = new _type.GraphQLUnionType({
  name: 'Pet',
  types: [DogType, CatType],
  resolveType: function resolveType(value) {
    if (value instanceof Dog) {
      return DogType;
    }

    if (value instanceof Cat) {
      return CatType;
    }
  }
});
var PersonType = new _type.GraphQLObjectType({
  name: 'Person',
  interfaces: [NamedType],
  fields: {
    name: {
      type: _type.GraphQLString
    },
    pets: {
      type: (0, _type.GraphQLList)(PetType)
    },
    friends: {
      type: (0, _type.GraphQLList)(NamedType)
    }
  },
  isTypeOf: function isTypeOf(value) {
    return value instanceof Person;
  }
});
var schema = new _type.GraphQLSchema({
  query: PersonType,
  types: [PetType]
});
var garfield = new Cat('Garfield', false);
var odie = new Dog('Odie', true);
var liz = new Person('Liz');
var john = new Person('John', [garfield, odie], [liz, odie]);
(0, _mocha.describe)('Execute: Union and intersection types', function () {
  (0, _mocha.it)('can introspect on union and intersection types', function () {
    var ast = (0, _language.parse)("\n      {\n        Named: __type(name: \"Named\") {\n          kind\n          name\n          fields { name }\n          interfaces { name }\n          possibleTypes { name }\n          enumValues { name }\n          inputFields { name }\n        }\n        Pet: __type(name: \"Pet\") {\n          kind\n          name\n          fields { name }\n          interfaces { name }\n          possibleTypes { name }\n          enumValues { name }\n          inputFields { name }\n        }\n      }\n    ");
    (0, _chai.expect)((0, _execute.execute)(schema, ast)).to.deep.equal({
      data: {
        Named: {
          kind: 'INTERFACE',
          name: 'Named',
          fields: [{
            name: 'name'
          }],
          interfaces: null,
          possibleTypes: [{
            name: 'Person'
          }, {
            name: 'Dog'
          }, {
            name: 'Cat'
          }],
          enumValues: null,
          inputFields: null
        },
        Pet: {
          kind: 'UNION',
          name: 'Pet',
          fields: null,
          interfaces: null,
          possibleTypes: [{
            name: 'Dog'
          }, {
            name: 'Cat'
          }],
          enumValues: null,
          inputFields: null
        }
      }
    });
  });
  (0, _mocha.it)('executes using union types', function () {
    // NOTE: This is an *invalid* query, but it should be an *executable* query.
    var ast = (0, _language.parse)("\n      {\n        __typename\n        name\n        pets {\n          __typename\n          name\n          barks\n          meows\n        }\n      }\n    ");
    (0, _chai.expect)((0, _execute.execute)(schema, ast, john)).to.deep.equal({
      data: {
        __typename: 'Person',
        name: 'John',
        pets: [{
          __typename: 'Cat',
          name: 'Garfield',
          meows: false
        }, {
          __typename: 'Dog',
          name: 'Odie',
          barks: true
        }]
      }
    });
  });
  (0, _mocha.it)('executes union types with inline fragments', function () {
    // This is the valid version of the query in the above test.
    var ast = (0, _language.parse)("\n      {\n        __typename\n        name\n        pets {\n          __typename\n          ... on Dog {\n            name\n            barks\n          }\n          ... on Cat {\n            name\n            meows\n          }\n        }\n      }\n    ");
    (0, _chai.expect)((0, _execute.execute)(schema, ast, john)).to.deep.equal({
      data: {
        __typename: 'Person',
        name: 'John',
        pets: [{
          __typename: 'Cat',
          name: 'Garfield',
          meows: false
        }, {
          __typename: 'Dog',
          name: 'Odie',
          barks: true
        }]
      }
    });
  });
  (0, _mocha.it)('executes using interface types', function () {
    // NOTE: This is an *invalid* query, but it should be an *executable* query.
    var ast = (0, _language.parse)("\n      {\n        __typename\n        name\n        friends {\n          __typename\n          name\n          barks\n          meows\n        }\n      }\n    ");
    (0, _chai.expect)((0, _execute.execute)(schema, ast, john)).to.deep.equal({
      data: {
        __typename: 'Person',
        name: 'John',
        friends: [{
          __typename: 'Person',
          name: 'Liz'
        }, {
          __typename: 'Dog',
          name: 'Odie',
          barks: true
        }]
      }
    });
  });
  (0, _mocha.it)('executes union types with inline fragments', function () {
    // This is the valid version of the query in the above test.
    var ast = (0, _language.parse)("\n      {\n        __typename\n        name\n        friends {\n          __typename\n          name\n          ... on Dog {\n            barks\n          }\n          ... on Cat {\n            meows\n          }\n        }\n      }\n    ");
    (0, _chai.expect)((0, _execute.execute)(schema, ast, john)).to.deep.equal({
      data: {
        __typename: 'Person',
        name: 'John',
        friends: [{
          __typename: 'Person',
          name: 'Liz'
        }, {
          __typename: 'Dog',
          name: 'Odie',
          barks: true
        }]
      }
    });
  });
  (0, _mocha.it)('allows fragment conditions to be abstract types', function () {
    var ast = (0, _language.parse)("\n      {\n        __typename\n        name\n        pets { ...PetFields }\n        friends { ...FriendFields }\n      }\n\n      fragment PetFields on Pet {\n        __typename\n        ... on Dog {\n          name\n          barks\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n\n      fragment FriendFields on Named {\n        __typename\n        name\n        ... on Dog {\n          barks\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    ");
    (0, _chai.expect)((0, _execute.execute)(schema, ast, john)).to.deep.equal({
      data: {
        __typename: 'Person',
        name: 'John',
        pets: [{
          __typename: 'Cat',
          name: 'Garfield',
          meows: false
        }, {
          __typename: 'Dog',
          name: 'Odie',
          barks: true
        }],
        friends: [{
          __typename: 'Person',
          name: 'Liz'
        }, {
          __typename: 'Dog',
          name: 'Odie',
          barks: true
        }]
      }
    });
  });
  (0, _mocha.it)('gets execution info in resolver', function () {
    var encounteredContext;
    var encounteredSchema;
    var encounteredRootValue;
    var NamedType2 = new _type.GraphQLInterfaceType({
      name: 'Named',
      fields: {
        name: {
          type: _type.GraphQLString
        }
      },
      resolveType: function resolveType(obj, context, _ref) {
        var _schema = _ref.schema,
            rootValue = _ref.rootValue;
        encounteredContext = context;
        encounteredSchema = _schema;
        encounteredRootValue = rootValue;
        return PersonType2;
      }
    });
    var PersonType2 = new _type.GraphQLObjectType({
      name: 'Person',
      interfaces: [NamedType2],
      fields: {
        name: {
          type: _type.GraphQLString
        },
        friends: {
          type: (0, _type.GraphQLList)(NamedType2)
        }
      }
    });
    var schema2 = new _type.GraphQLSchema({
      query: PersonType2
    });
    var john2 = new Person('John', [], [liz]);
    var context = {
      authToken: '123abc'
    };
    var ast = (0, _language.parse)('{ name, friends { name } }');
    (0, _chai.expect)((0, _execute.execute)(schema2, ast, john2, context)).to.deep.equal({
      data: {
        name: 'John',
        friends: [{
          name: 'Liz'
        }]
      }
    });
    (0, _chai.expect)(encounteredContext).to.equal(context);
    (0, _chai.expect)(encounteredSchema).to.equal(schema2);
    (0, _chai.expect)(encounteredRootValue).to.equal(john2);
  });
});