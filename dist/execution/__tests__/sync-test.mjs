function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { graphqlSync } from '../../graphql';
import { execute } from '../execute';
import { parse } from '../../language';
import { validate } from '../../validation/validate';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from '../../type';
describe('Execute: synchronously when possible', function () {
  var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        syncField: {
          type: GraphQLString,
          resolve: function resolve(rootValue) {
            return rootValue;
          }
        },
        asyncField: {
          type: GraphQLString,
          resolve: function () {
            var _resolve = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee(rootValue) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return rootValue;

                    case 2:
                      return _context.abrupt("return", _context.sent);

                    case 3:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            return function resolve(_x) {
              return _resolve.apply(this, arguments);
            };
          }()
        }
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        syncMutationField: {
          type: GraphQLString,
          resolve: function resolve(rootValue) {
            return rootValue;
          }
        }
      }
    })
  });
  it('does not return a Promise for initial errors', function () {
    var doc = 'fragment Example on Query { syncField }';
    var result = execute({
      schema: schema,
      document: parse(doc),
      rootValue: 'rootValue'
    });
    expect(result).to.deep.equal({
      errors: [{
        message: 'Must provide an operation.'
      }]
    });
  });
  it('does not return a Promise if fields are all synchronous', function () {
    var doc = 'query Example { syncField }';
    var result = execute({
      schema: schema,
      document: parse(doc),
      rootValue: 'rootValue'
    });
    expect(result).to.deep.equal({
      data: {
        syncField: 'rootValue'
      }
    });
  });
  it('does not return a Promise if mutation fields are all synchronous', function () {
    var doc = 'mutation Example { syncMutationField }';
    var result = execute({
      schema: schema,
      document: parse(doc),
      rootValue: 'rootValue'
    });
    expect(result).to.deep.equal({
      data: {
        syncMutationField: 'rootValue'
      }
    });
  });
  it('returns a Promise if any field is asynchronous',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var doc, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            doc = 'query Example { syncField, asyncField }';
            result = execute({
              schema: schema,
              document: parse(doc),
              rootValue: 'rootValue'
            });
            expect(result).to.be.instanceOf(Promise);
            _context2.t0 = expect;
            _context2.next = 6;
            return result;

          case 6:
            _context2.t1 = _context2.sent;
            _context2.t2 = {
              data: {
                syncField: 'rootValue',
                asyncField: 'rootValue'
              }
            };
            (0, _context2.t0)(_context2.t1).to.deep.equal(_context2.t2);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  describe('graphqlSync', function () {
    it('does not return a Promise for syntax errors', function () {
      var doc = 'fragment Example on Query { { { syncField }';
      var result = graphqlSync({
        schema: schema,
        source: doc
      });
      expect(result).to.deep.equal({
        errors: [{
          message: 'Syntax Error: Expected Name, found {',
          locations: [{
            line: 1,
            column: 29
          }]
        }]
      });
    });
    it('does not return a Promise for validation errors', function () {
      var doc = 'fragment Example on Query { unknownField }';
      var validationErrors = validate(schema, parse(doc));
      var result = graphqlSync({
        schema: schema,
        source: doc
      });
      expect(result).to.deep.equal({
        errors: validationErrors
      });
    });
    it('does not return a Promise for sync execution', function () {
      var doc = 'query Example { syncField }';
      var result = graphqlSync({
        schema: schema,
        source: doc,
        rootValue: 'rootValue'
      });
      expect(result).to.deep.equal({
        data: {
          syncField: 'rootValue'
        }
      });
    });
    it('throws if encountering async execution', function () {
      var doc = 'query Example { syncField, asyncField }';
      expect(function () {
        graphqlSync({
          schema: schema,
          source: doc,
          rootValue: 'rootValue'
        });
      }).to.throw('GraphQL execution failed to complete synchronously.');
    });
  });
});