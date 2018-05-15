function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StarWarsSchema } from './starWarsSchema.js';
import { graphql } from '../graphql';
describe('Star Wars Query Tests', function () {
  describe('Basic Queries', function () {
    it('Correctly identifies R2-D2 as the hero of the Star Wars Saga',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = "\n        query HeroNameQuery {\n          hero {\n            name\n          }\n        }\n      ";
              _context.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    name: 'R2-D2'
                  }
                }
              });

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    it('Accepts an object with named properties to graphql()',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = "\n        query HeroNameQuery {\n          hero {\n            name\n          }\n        }\n      ";
              _context2.next = 3;
              return graphql({
                schema: StarWarsSchema,
                source: query
              });

            case 3:
              result = _context2.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    name: 'R2-D2'
                  }
                }
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
    it('Allows us to query for the ID and friends of R2-D2',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              query = "\n        query HeroNameAndFriendsQuery {\n          hero {\n            id\n            name\n            friends {\n              name\n            }\n          }\n        }\n      ";
              _context3.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context3.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    id: '2001',
                    name: 'R2-D2',
                    friends: [{
                      name: 'Luke Skywalker'
                    }, {
                      name: 'Han Solo'
                    }, {
                      name: 'Leia Organa'
                    }]
                  }
                }
              });

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));
  });
  describe('Nested Queries', function () {
    it('Allows us to query for the friends of friends of R2-D2',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              query = "\n        query NestedQuery {\n          hero {\n            name\n            friends {\n              name\n              appearsIn\n              friends {\n                name\n              }\n            }\n          }\n        }\n      ";
              _context4.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context4.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    name: 'R2-D2',
                    friends: [{
                      name: 'Luke Skywalker',
                      appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
                      friends: [{
                        name: 'Han Solo'
                      }, {
                        name: 'Leia Organa'
                      }, {
                        name: 'C-3PO'
                      }, {
                        name: 'R2-D2'
                      }]
                    }, {
                      name: 'Han Solo',
                      appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
                      friends: [{
                        name: 'Luke Skywalker'
                      }, {
                        name: 'Leia Organa'
                      }, {
                        name: 'R2-D2'
                      }]
                    }, {
                      name: 'Leia Organa',
                      appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
                      friends: [{
                        name: 'Luke Skywalker'
                      }, {
                        name: 'Han Solo'
                      }, {
                        name: 'C-3PO'
                      }, {
                        name: 'R2-D2'
                      }]
                    }]
                  }
                }
              });

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
  });
  describe('Using IDs and query parameters to refetch objects', function () {
    it('Allows us to query for Luke Skywalker directly, using his ID',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              query = "\n        query FetchLukeQuery {\n          human(id: \"1000\") {\n            name\n          }\n        }\n      ";
              _context5.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context5.sent;
              expect(result).to.deep.equal({
                data: {
                  human: {
                    name: 'Luke Skywalker'
                  }
                }
              });

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('Allows us to create a generic query, then use it to fetch Luke Skywalker using his ID',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var query, params, result;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              query = "\n        query FetchSomeIDQuery($someId: String!) {\n          human(id: $someId) {\n            name\n          }\n        }\n      ";
              params = {
                someId: '1000'
              };
              _context6.next = 4;
              return graphql(StarWarsSchema, query, null, null, params);

            case 4:
              result = _context6.sent;
              expect(result).to.deep.equal({
                data: {
                  human: {
                    name: 'Luke Skywalker'
                  }
                }
              });

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
    it('Allows us to create a generic query, then use it to fetch Han Solo using his ID',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var query, params, result;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              query = "\n        query FetchSomeIDQuery($someId: String!) {\n          human(id: $someId) {\n            name\n          }\n        }\n      ";
              params = {
                someId: '1002'
              };
              _context7.next = 4;
              return graphql(StarWarsSchema, query, null, null, params);

            case 4:
              result = _context7.sent;
              expect(result).to.deep.equal({
                data: {
                  human: {
                    name: 'Han Solo'
                  }
                }
              });

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
    it('Allows us to create a generic query, then pass an invalid ID to get null back',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var query, params, result;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              query = "\n        query humanQuery($id: String!) {\n          human(id: $id) {\n            name\n          }\n        }\n      ";
              params = {
                id: 'not a valid id'
              };
              _context8.next = 4;
              return graphql(StarWarsSchema, query, null, null, params);

            case 4:
              result = _context8.sent;
              expect(result).to.deep.equal({
                data: {
                  human: null
                }
              });

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
  });
  describe('Using aliases to change the key in the response', function () {
    it('Allows us to query for Luke, changing his key with an alias',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              query = "\n        query FetchLukeAliased {\n          luke: human(id: \"1000\") {\n            name\n          }\n        }\n      ";
              _context9.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context9.sent;
              expect(result).to.deep.equal({
                data: {
                  luke: {
                    name: 'Luke Skywalker'
                  }
                }
              });

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
    it('Allows us to query for both Luke and Leia, using two root fields and an alias',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              query = "\n        query FetchLukeAndLeiaAliased {\n          luke: human(id: \"1000\") {\n            name\n          }\n          leia: human(id: \"1003\") {\n            name\n          }\n        }\n      ";
              _context10.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context10.sent;
              expect(result).to.deep.equal({
                data: {
                  luke: {
                    name: 'Luke Skywalker'
                  },
                  leia: {
                    name: 'Leia Organa'
                  }
                }
              });

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
  });
  describe('Uses fragments to express more complex queries', function () {
    it('Allows us to query using duplicated content',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              query = "\n        query DuplicateFields {\n          luke: human(id: \"1000\") {\n            name\n            homePlanet\n          }\n          leia: human(id: \"1003\") {\n            name\n            homePlanet\n          }\n        }\n      ";
              _context11.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context11.sent;
              expect(result).to.deep.equal({
                data: {
                  luke: {
                    name: 'Luke Skywalker',
                    homePlanet: 'Tatooine'
                  },
                  leia: {
                    name: 'Leia Organa',
                    homePlanet: 'Alderaan'
                  }
                }
              });

            case 5:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })));
    it('Allows us to use a fragment to avoid duplicating content',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              query = "\n        query UseFragment {\n          luke: human(id: \"1000\") {\n            ...HumanFragment\n          }\n          leia: human(id: \"1003\") {\n            ...HumanFragment\n          }\n        }\n\n        fragment HumanFragment on Human {\n          name\n          homePlanet\n        }\n      ";
              _context12.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context12.sent;
              expect(result).to.deep.equal({
                data: {
                  luke: {
                    name: 'Luke Skywalker',
                    homePlanet: 'Tatooine'
                  },
                  leia: {
                    name: 'Leia Organa',
                    homePlanet: 'Alderaan'
                  }
                }
              });

            case 5:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
  });
  describe('Using __typename to find the type of an object', function () {
    it('Allows us to verify that R2-D2 is a droid',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              query = "\n        query CheckTypeOfR2 {\n          hero {\n            __typename\n            name\n          }\n        }\n      ";
              _context13.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context13.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    __typename: 'Droid',
                    name: 'R2-D2'
                  }
                }
              });

            case 5:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
    it('Allows us to verify that Luke is a human',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              query = "\n        query CheckTypeOfLuke {\n          hero(episode: EMPIRE) {\n            __typename\n            name\n          }\n        }\n      ";
              _context14.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context14.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    __typename: 'Human',
                    name: 'Luke Skywalker'
                  }
                }
              });

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })));
  });
  describe('Reporting errors raised in resolvers', function () {
    it('Correctly reports error on accessing secretBackstory',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              query = "\n        query HeroNameQuery {\n          hero {\n            name\n            secretBackstory\n          }\n        }\n      ";
              _context15.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context15.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    name: 'R2-D2',
                    secretBackstory: null
                  }
                },
                errors: [{
                  message: 'secretBackstory is secret.',
                  locations: [{
                    line: 5,
                    column: 13
                  }],
                  path: ['hero', 'secretBackstory']
                }]
              });

            case 5:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
    it('Correctly reports error on accessing secretBackstory in a list',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              query = "\n        query HeroNameQuery {\n          hero {\n            name\n            friends {\n              name\n              secretBackstory\n            }\n          }\n        }\n      ";
              _context16.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context16.sent;
              expect(result).to.deep.equal({
                data: {
                  hero: {
                    name: 'R2-D2',
                    friends: [{
                      name: 'Luke Skywalker',
                      secretBackstory: null
                    }, {
                      name: 'Han Solo',
                      secretBackstory: null
                    }, {
                      name: 'Leia Organa',
                      secretBackstory: null
                    }]
                  }
                },
                errors: [{
                  message: 'secretBackstory is secret.',
                  locations: [{
                    line: 7,
                    column: 15
                  }],
                  path: ['hero', 'friends', 0, 'secretBackstory']
                }, {
                  message: 'secretBackstory is secret.',
                  locations: [{
                    line: 7,
                    column: 15
                  }],
                  path: ['hero', 'friends', 1, 'secretBackstory']
                }, {
                  message: 'secretBackstory is secret.',
                  locations: [{
                    line: 7,
                    column: 15
                  }],
                  path: ['hero', 'friends', 2, 'secretBackstory']
                }]
              });

            case 5:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('Correctly reports error on accessing through an alias',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var query, result;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              query = "\n        query HeroNameQuery {\n          mainHero: hero {\n            name\n            story: secretBackstory\n          }\n        }\n      ";
              _context17.next = 3;
              return graphql(StarWarsSchema, query);

            case 3:
              result = _context17.sent;
              expect(result).to.deep.equal({
                data: {
                  mainHero: {
                    name: 'R2-D2',
                    story: null
                  }
                },
                errors: [{
                  message: 'secretBackstory is secret.',
                  locations: [{
                    line: 5,
                    column: 13
                  }],
                  path: ['mainHero', 'story']
                }]
              });

            case 5:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
  });
});