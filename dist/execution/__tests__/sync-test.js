"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _graphql = require("../../graphql");

var _execute = require("../execute");

var _language = require("../../language");

var _validate = require("../../validation/validate");

var _type = require("../../type");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

(0, _mocha.describe)('Execute: synchronously when possible', function () {
  var schema = new _type.GraphQLSchema({
    query: new _type.GraphQLObjectType({
      name: 'Query',
      fields: {
        syncField: {
          type: _type.GraphQLString,
          resolve: function resolve(rootValue) {
            return rootValue;
          }
        },
        asyncField: {
          type: _type.GraphQLString,
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
    mutation: new _type.GraphQLObjectType({
      name: 'Mutation',
      fields: {
        syncMutationField: {
          type: _type.GraphQLString,
          resolve: function resolve(rootValue) {
            return rootValue;
          }
        }
      }
    })
  });
  (0, _mocha.it)('does not return a Promise for initial errors', function () {
    var doc = 'fragment Example on Query { syncField }';
    var result = (0, _execute.execute)({
      schema: schema,
      document: (0, _language.parse)(doc),
      rootValue: 'rootValue'
    });
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Must provide an operation.'
      }]
    });
  });
  (0, _mocha.it)('does not return a Promise if fields are all synchronous', function () {
    var doc = 'query Example { syncField }';
    var result = (0, _execute.execute)({
      schema: schema,
      document: (0, _language.parse)(doc),
      rootValue: 'rootValue'
    });
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        syncField: 'rootValue'
      }
    });
  });
  (0, _mocha.it)('does not return a Promise if mutation fields are all synchronous', function () {
    var doc = 'mutation Example { syncMutationField }';
    var result = (0, _execute.execute)({
      schema: schema,
      document: (0, _language.parse)(doc),
      rootValue: 'rootValue'
    });
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        syncMutationField: 'rootValue'
      }
    });
  });
  (0, _mocha.it)('returns a Promise if any field is asynchronous',
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
            result = (0, _execute.execute)({
              schema: schema,
              document: (0, _language.parse)(doc),
              rootValue: 'rootValue'
            });
            (0, _chai.expect)(result).to.be.instanceOf(Promise);
            _context2.t0 = _chai.expect;
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
  (0, _mocha.describe)('graphqlSync', function () {
    (0, _mocha.it)('does not return a Promise for syntax errors', function () {
      var doc = 'fragment Example on Query { { { syncField }';
      var result = (0, _graphql.graphqlSync)({
        schema: schema,
        source: doc
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: [{
          message: 'Syntax Error: Expected Name, found {',
          locations: [{
            line: 1,
            column: 29
          }]
        }]
      });
    });
    (0, _mocha.it)('does not return a Promise for validation errors', function () {
      var doc = 'fragment Example on Query { unknownField }';
      var validationErrors = (0, _validate.validate)(schema, (0, _language.parse)(doc));
      var result = (0, _graphql.graphqlSync)({
        schema: schema,
        source: doc
      });
      (0, _chai.expect)(result).to.deep.equal({
        errors: validationErrors
      });
    });
    (0, _mocha.it)('does not return a Promise for sync execution', function () {
      var doc = 'query Example { syncField }';
      var result = (0, _graphql.graphqlSync)({
        schema: schema,
        source: doc,
        rootValue: 'rootValue'
      });
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          syncField: 'rootValue'
        }
      });
    });
    (0, _mocha.it)('throws if encountering async execution', function () {
      var doc = 'query Example { syncField, asyncField }';
      (0, _chai.expect)(function () {
        (0, _graphql.graphqlSync)({
          schema: schema,
          source: doc,
          rootValue: 'rootValue'
        });
      }).to.throw('GraphQL execution failed to complete synchronously.');
    });
  });
});