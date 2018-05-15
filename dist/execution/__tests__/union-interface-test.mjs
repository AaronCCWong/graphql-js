/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { execute } from '../execute';
import { parse } from '../../language';
import { GraphQLSchema, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLList, GraphQLString, GraphQLBoolean } from '../../type';

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

var NamedType = new GraphQLInterfaceType({
  name: 'Named',
  fields: {
    name: {
      type: GraphQLString
    }
  }
});
var DogType = new GraphQLObjectType({
  name: 'Dog',
  interfaces: [NamedType],
  fields: {
    name: {
      type: GraphQLString
    },
    barks: {
      type: GraphQLBoolean
    }
  },
  isTypeOf: function isTypeOf(value) {
    return value instanceof Dog;
  }
});
var CatType = new GraphQLObjectType({
  name: 'Cat',
  interfaces: [NamedType],
  fields: {
    name: {
      type: GraphQLString
    },
    meows: {
      type: GraphQLBoolean
    }
  },
  isTypeOf: function isTypeOf(value) {
    return value instanceof Cat;
  }
});
var PetType = new GraphQLUnionType({
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
var PersonType = new GraphQLObjectType({
  name: 'Person',
  interfaces: [NamedType],
  fields: {
    name: {
      type: GraphQLString
    },
    pets: {
      type: GraphQLList(PetType)
    },
    friends: {
      type: GraphQLList(NamedType)
    }
  },
  isTypeOf: function isTypeOf(value) {
    return value instanceof Person;
  }
});
var schema = new GraphQLSchema({
  query: PersonType,
  types: [PetType]
});
var garfield = new Cat('Garfield', false);
var odie = new Dog('Odie', true);
var liz = new Person('Liz');
var john = new Person('John', [garfield, odie], [liz, odie]);
describe('Execute: Union and intersection types', function () {
  it('can introspect on union and intersection types', function () {
    var ast = parse("\n      {\n        Named: __type(name: \"Named\") {\n          kind\n          name\n          fields { name }\n          interfaces { name }\n          possibleTypes { name }\n          enumValues { name }\n          inputFields { name }\n        }\n        Pet: __type(name: \"Pet\") {\n          kind\n          name\n          fields { name }\n          interfaces { name }\n          possibleTypes { name }\n          enumValues { name }\n          inputFields { name }\n        }\n      }\n    ");
    expect(execute(schema, ast)).to.deep.equal({
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
  it('executes using union types', function () {
    // NOTE: This is an *invalid* query, but it should be an *executable* query.
    var ast = parse("\n      {\n        __typename\n        name\n        pets {\n          __typename\n          name\n          barks\n          meows\n        }\n      }\n    ");
    expect(execute(schema, ast, john)).to.deep.equal({
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
  it('executes union types with inline fragments', function () {
    // This is the valid version of the query in the above test.
    var ast = parse("\n      {\n        __typename\n        name\n        pets {\n          __typename\n          ... on Dog {\n            name\n            barks\n          }\n          ... on Cat {\n            name\n            meows\n          }\n        }\n      }\n    ");
    expect(execute(schema, ast, john)).to.deep.equal({
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
  it('executes using interface types', function () {
    // NOTE: This is an *invalid* query, but it should be an *executable* query.
    var ast = parse("\n      {\n        __typename\n        name\n        friends {\n          __typename\n          name\n          barks\n          meows\n        }\n      }\n    ");
    expect(execute(schema, ast, john)).to.deep.equal({
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
  it('executes union types with inline fragments', function () {
    // This is the valid version of the query in the above test.
    var ast = parse("\n      {\n        __typename\n        name\n        friends {\n          __typename\n          name\n          ... on Dog {\n            barks\n          }\n          ... on Cat {\n            meows\n          }\n        }\n      }\n    ");
    expect(execute(schema, ast, john)).to.deep.equal({
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
  it('allows fragment conditions to be abstract types', function () {
    var ast = parse("\n      {\n        __typename\n        name\n        pets { ...PetFields }\n        friends { ...FriendFields }\n      }\n\n      fragment PetFields on Pet {\n        __typename\n        ... on Dog {\n          name\n          barks\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n\n      fragment FriendFields on Named {\n        __typename\n        name\n        ... on Dog {\n          barks\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    ");
    expect(execute(schema, ast, john)).to.deep.equal({
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
  it('gets execution info in resolver', function () {
    var encounteredContext;
    var encounteredSchema;
    var encounteredRootValue;
    var NamedType2 = new GraphQLInterfaceType({
      name: 'Named',
      fields: {
        name: {
          type: GraphQLString
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
    var PersonType2 = new GraphQLObjectType({
      name: 'Person',
      interfaces: [NamedType2],
      fields: {
        name: {
          type: GraphQLString
        },
        friends: {
          type: GraphQLList(NamedType2)
        }
      }
    });
    var schema2 = new GraphQLSchema({
      query: PersonType2
    });
    var john2 = new Person('John', [], [liz]);
    var context = {
      authToken: '123abc'
    };
    var ast = parse('{ name, friends { name } }');
    expect(execute(schema2, ast, john2, context)).to.deep.equal({
      data: {
        name: 'John',
        friends: [{
          name: 'Liz'
        }]
      }
    });
    expect(encounteredContext).to.equal(context);
    expect(encounteredSchema).to.equal(schema2);
    expect(encounteredRootValue).to.equal(john2);
  });
});