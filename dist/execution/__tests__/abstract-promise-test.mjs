function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLList, GraphQLString, GraphQLBoolean } from '../../';

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

describe('Execute: Handles execution of abstract types with promises', function () {
  it('isTypeOf used to resolve runtime type for Interface',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var PetType, DogType, CatType, schema, query, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            PetType = new GraphQLInterfaceType({
              name: 'Pet',
              fields: {
                name: {
                  type: GraphQLString
                }
              }
            });
            DogType = new GraphQLObjectType({
              name: 'Dog',
              interfaces: [PetType],
              isTypeOf: function isTypeOf(obj) {
                return Promise.resolve(obj instanceof Dog);
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
            CatType = new GraphQLObjectType({
              name: 'Cat',
              interfaces: [PetType],
              isTypeOf: function isTypeOf(obj) {
                return Promise.resolve(obj instanceof Cat);
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
            schema = new GraphQLSchema({
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
            query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
            _context.next = 7;
            return graphql(schema, query);

          case 7:
            result = _context.sent;
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

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  it('isTypeOf can be rejected',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var PetType, DogType, CatType, schema, query, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            PetType = new GraphQLInterfaceType({
              name: 'Pet',
              fields: {
                name: {
                  type: GraphQLString
                }
              }
            });
            DogType = new GraphQLObjectType({
              name: 'Dog',
              interfaces: [PetType],
              isTypeOf: function isTypeOf() {
                return Promise.reject(new Error('We are testing this error'));
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
            CatType = new GraphQLObjectType({
              name: 'Cat',
              interfaces: [PetType],
              isTypeOf: function isTypeOf(obj) {
                return Promise.resolve(obj instanceof Cat);
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
            schema = new GraphQLSchema({
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
            query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
            _context2.next = 7;
            return graphql(schema, query);

          case 7:
            result = _context2.sent;
            expect(result).to.deep.equal({
              data: {
                pets: [null, null]
              },
              errors: [{
                message: 'We are testing this error',
                locations: [{
                  line: 2,
                  column: 7
                }],
                path: ['pets', 0]
              }, {
                message: 'We are testing this error',
                locations: [{
                  line: 2,
                  column: 7
                }],
                path: ['pets', 1]
              }]
            });

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  it('isTypeOf used to resolve runtime type for Union',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var DogType, CatType, PetType, schema, query, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            DogType = new GraphQLObjectType({
              name: 'Dog',
              isTypeOf: function isTypeOf(obj) {
                return Promise.resolve(obj instanceof Dog);
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
            CatType = new GraphQLObjectType({
              name: 'Cat',
              isTypeOf: function isTypeOf(obj) {
                return Promise.resolve(obj instanceof Cat);
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
            PetType = new GraphQLUnionType({
              name: 'Pet',
              types: [DogType, CatType]
            });
            schema = new GraphQLSchema({
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
            query = "{\n      pets {\n        ... on Dog {\n          name\n          woofs\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n    }";
            _context3.next = 7;
            return graphql(schema, query);

          case 7:
            result = _context3.sent;
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

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  it('resolveType on Interface yields useful error',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var PetType, HumanType, DogType, CatType, schema, query, result;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            PetType = new GraphQLInterfaceType({
              name: 'Pet',
              resolveType: function resolveType(obj) {
                return Promise.resolve(obj instanceof Dog ? DogType : obj instanceof Cat ? CatType : obj instanceof Human ? HumanType : null);
              },
              fields: {
                name: {
                  type: GraphQLString
                }
              }
            });
            HumanType = new GraphQLObjectType({
              name: 'Human',
              fields: {
                name: {
                  type: GraphQLString
                }
              }
            });
            DogType = new GraphQLObjectType({
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
            CatType = new GraphQLObjectType({
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
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                name: 'Query',
                fields: {
                  pets: {
                    type: GraphQLList(PetType),
                    resolve: function resolve() {
                      return Promise.resolve([new Dog('Odie', true), new Cat('Garfield', false), new Human('Jon')]);
                    }
                  }
                }
              }),
              types: [CatType, DogType]
            });
            query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
            _context4.next = 8;
            return graphql(schema, query);

          case 8:
            result = _context4.sent;
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

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  it('resolveType on Union yields useful error',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var HumanType, DogType, CatType, PetType, schema, query, result;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            HumanType = new GraphQLObjectType({
              name: 'Human',
              fields: {
                name: {
                  type: GraphQLString
                }
              }
            });
            DogType = new GraphQLObjectType({
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
            CatType = new GraphQLObjectType({
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
            PetType = new GraphQLUnionType({
              name: 'Pet',
              resolveType: function resolveType(obj) {
                return Promise.resolve(obj instanceof Dog ? DogType : obj instanceof Cat ? CatType : obj instanceof Human ? HumanType : null);
              },
              types: [DogType, CatType]
            });
            schema = new GraphQLSchema({
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
            query = "{\n      pets {\n        ... on Dog {\n          name\n          woofs\n        }\n        ... on Cat {\n          name\n          meows\n        }\n      }\n    }";
            _context5.next = 8;
            return graphql(schema, query);

          case 8:
            result = _context5.sent;
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

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));
  it('resolveType allows resolving with type name',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var PetType, DogType, CatType, schema, query, result;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            PetType = new GraphQLInterfaceType({
              name: 'Pet',
              resolveType: function resolveType(obj) {
                return Promise.resolve(obj instanceof Dog ? 'Dog' : obj instanceof Cat ? 'Cat' : null);
              },
              fields: {
                name: {
                  type: GraphQLString
                }
              }
            });
            DogType = new GraphQLObjectType({
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
            CatType = new GraphQLObjectType({
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
            schema = new GraphQLSchema({
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
            query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
            _context6.next = 7;
            return graphql(schema, query);

          case 7:
            result = _context6.sent;
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

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  })));
  it('resolveType can be caught',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var PetType, DogType, CatType, schema, query, result;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            PetType = new GraphQLInterfaceType({
              name: 'Pet',
              resolveType: function resolveType() {
                return Promise.reject('We are testing this error');
              },
              fields: {
                name: {
                  type: GraphQLString
                }
              }
            });
            DogType = new GraphQLObjectType({
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
            CatType = new GraphQLObjectType({
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
            schema = new GraphQLSchema({
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
            query = "{\n      pets {\n        name\n        ... on Dog {\n          woofs\n        }\n        ... on Cat {\n          meows\n        }\n      }\n    }";
            _context7.next = 7;
            return graphql(schema, query);

          case 7:
            result = _context7.sent;
            expect(result).to.deep.equal({
              data: {
                pets: [null, null]
              },
              errors: [{
                message: 'We are testing this error',
                locations: [{
                  line: 2,
                  column: 7
                }],
                path: ['pets', 0]
              }, {
                message: 'We are testing this error',
                locations: [{
                  line: 2,
                  column: 7
                }],
                path: ['pets', 1]
              }]
            });

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  })));
});