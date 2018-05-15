function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

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
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from '../../type';
var syncError = new Error('sync');
var syncNonNullError = new Error('syncNonNull');
var promiseError = new Error('promise');
var promiseNonNullError = new Error('promiseNonNull');
var throwingData = {
  sync: function sync() {
    throw syncError;
  },
  syncNonNull: function syncNonNull() {
    throw syncNonNullError;
  },
  promise: function promise() {
    return new Promise(function () {
      throw promiseError;
    });
  },
  promiseNonNull: function promiseNonNull() {
    return new Promise(function () {
      throw promiseNonNullError;
    });
  },
  syncNest: function syncNest() {
    return throwingData;
  },
  syncNonNullNest: function syncNonNullNest() {
    return throwingData;
  },
  promiseNest: function promiseNest() {
    return new Promise(function (resolve) {
      resolve(throwingData);
    });
  },
  promiseNonNullNest: function promiseNonNullNest() {
    return new Promise(function (resolve) {
      resolve(throwingData);
    });
  }
};
var nullingData = {
  sync: function sync() {
    return null;
  },
  syncNonNull: function syncNonNull() {
    return null;
  },
  promise: function promise() {
    return new Promise(function (resolve) {
      resolve(null);
    });
  },
  promiseNonNull: function promiseNonNull() {
    return new Promise(function (resolve) {
      resolve(null);
    });
  },
  syncNest: function syncNest() {
    return nullingData;
  },
  syncNonNullNest: function syncNonNullNest() {
    return nullingData;
  },
  promiseNest: function promiseNest() {
    return new Promise(function (resolve) {
      resolve(nullingData);
    });
  },
  promiseNonNullNest: function promiseNonNullNest() {
    return new Promise(function (resolve) {
      resolve(nullingData);
    });
  }
};
var dataType = new GraphQLObjectType({
  name: 'DataType',
  fields: function fields() {
    return {
      sync: {
        type: GraphQLString
      },
      syncNonNull: {
        type: GraphQLNonNull(GraphQLString)
      },
      promise: {
        type: GraphQLString
      },
      promiseNonNull: {
        type: GraphQLNonNull(GraphQLString)
      },
      syncNest: {
        type: dataType
      },
      syncNonNullNest: {
        type: GraphQLNonNull(dataType)
      },
      promiseNest: {
        type: dataType
      },
      promiseNonNullNest: {
        type: GraphQLNonNull(dataType)
      }
    };
  }
});
var schema = new GraphQLSchema({
  query: dataType
});

function executeQuery(query, rootValue) {
  return execute(schema, parse(query), rootValue);
} // avoids also doing any nests


function patch(data) {
  return JSON.parse(JSON.stringify(data).replace(/\bsync\b/g, 'promise').replace(/\bsyncNonNull\b/g, 'promiseNonNull'));
}

function executeSyncAndAsync(_x, _x2) {
  return _executeSyncAndAsync.apply(this, arguments);
}

function _executeSyncAndAsync() {
  _executeSyncAndAsync = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(query, rootValue) {
    var syncResult, asyncResult;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return executeQuery(query, rootValue);

          case 2:
            syncResult = _context13.sent;
            _context13.next = 5;
            return executeQuery(patch(query), rootValue);

          case 5:
            asyncResult = _context13.sent;
            expect(asyncResult).to.deep.equal(patch(syncResult));
            return _context13.abrupt("return", syncResult);

          case 8:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));
  return _executeSyncAndAsync.apply(this, arguments);
}

describe('Execute: handles non-nullable types', function () {
  describe('nulls a nullable field', function () {
    var query = "\n      {\n        sync\n      }\n    ";
    it('that returns null',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return executeSyncAndAsync(query, nullingData);

            case 2:
              result = _context.sent;
              expect(result).to.deep.equal({
                data: {
                  sync: null
                }
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    it('that throws',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return executeSyncAndAsync(query, throwingData);

            case 2:
              result = _context2.sent;
              expect(result).to.deep.equal({
                data: {
                  sync: null
                },
                errors: [{
                  message: syncError.message,
                  path: ['sync'],
                  locations: [{
                    line: 3,
                    column: 9
                  }]
                }]
              });

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
  });
  describe('nulls a synchronously returned object that contains a non-nullable field', function () {
    var query = "\n      {\n        syncNest {\n          syncNonNull,\n        }\n      }\n    ";
    it('that returns null',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var result;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return executeSyncAndAsync(query, nullingData);

            case 2:
              result = _context3.sent;
              expect(result).to.deep.equal({
                data: {
                  syncNest: null
                },
                errors: [{
                  message: 'Cannot return null for non-nullable field DataType.syncNonNull.',
                  path: ['syncNest', 'syncNonNull'],
                  locations: [{
                    line: 4,
                    column: 11
                  }]
                }]
              });

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));
    it('that throws',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return executeSyncAndAsync(query, throwingData);

            case 2:
              result = _context4.sent;
              expect(result).to.deep.equal({
                data: {
                  syncNest: null
                },
                errors: [{
                  message: syncNonNullError.message,
                  path: ['syncNest', 'syncNonNull'],
                  locations: [{
                    line: 4,
                    column: 11
                  }]
                }]
              });

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
  });
  describe('nulls an object returned in a promise that contains a non-nullable field', function () {
    var query = "\n      {\n        promiseNest {\n          syncNonNull,\n        }\n      }\n    ";
    it('that returns null',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var result;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return executeSyncAndAsync(query, nullingData);

            case 2:
              result = _context5.sent;
              expect(result).to.deep.equal({
                data: {
                  promiseNest: null
                },
                errors: [{
                  message: 'Cannot return null for non-nullable field DataType.syncNonNull.',
                  path: ['promiseNest', 'syncNonNull'],
                  locations: [{
                    line: 4,
                    column: 11
                  }]
                }]
              });

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('that throws',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var result;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return executeSyncAndAsync(query, throwingData);

            case 2:
              result = _context6.sent;
              expect(result).to.deep.equal({
                data: {
                  promiseNest: null
                },
                errors: [{
                  message: syncNonNullError.message,
                  path: ['promiseNest', 'syncNonNull'],
                  locations: [{
                    line: 4,
                    column: 11
                  }]
                }]
              });

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
  });
  describe('nulls a complex tree of nullable fields, each', function () {
    var query = "\n      {\n        syncNest {\n          sync\n          promise\n          syncNest { sync promise }\n          promiseNest { sync promise }\n        }\n        promiseNest {\n          sync\n          promise\n          syncNest { sync promise }\n          promiseNest { sync promise }\n        }\n      }\n    ";
    var data = {
      syncNest: {
        sync: null,
        promise: null,
        syncNest: {
          sync: null,
          promise: null
        },
        promiseNest: {
          sync: null,
          promise: null
        }
      },
      promiseNest: {
        sync: null,
        promise: null,
        syncNest: {
          sync: null,
          promise: null
        },
        promiseNest: {
          sync: null,
          promise: null
        }
      }
    };
    it('that returns null',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var result;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return executeQuery(query, nullingData);

            case 2:
              result = _context7.sent;
              expect(result).to.deep.equal({
                data: data
              });

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
    it('that throws',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var result;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return executeQuery(query, throwingData);

            case 2:
              result = _context8.sent;
              expect(result).to.deep.equal({
                data: data,
                errors: [{
                  message: syncError.message,
                  path: ['syncNest', 'sync'],
                  locations: [{
                    line: 4,
                    column: 11
                  }]
                }, {
                  message: syncError.message,
                  path: ['syncNest', 'syncNest', 'sync'],
                  locations: [{
                    line: 6,
                    column: 22
                  }]
                }, {
                  message: syncError.message,
                  path: ['syncNest', 'promiseNest', 'sync'],
                  locations: [{
                    line: 7,
                    column: 25
                  }]
                }, {
                  message: syncError.message,
                  path: ['promiseNest', 'sync'],
                  locations: [{
                    line: 10,
                    column: 11
                  }]
                }, {
                  message: syncError.message,
                  path: ['promiseNest', 'syncNest', 'sync'],
                  locations: [{
                    line: 12,
                    column: 22
                  }]
                }, {
                  message: promiseError.message,
                  path: ['syncNest', 'promise'],
                  locations: [{
                    line: 5,
                    column: 11
                  }]
                }, {
                  message: promiseError.message,
                  path: ['syncNest', 'syncNest', 'promise'],
                  locations: [{
                    line: 6,
                    column: 27
                  }]
                }, {
                  message: syncError.message,
                  path: ['promiseNest', 'promiseNest', 'sync'],
                  locations: [{
                    line: 13,
                    column: 25
                  }]
                }, {
                  message: promiseError.message,
                  path: ['syncNest', 'promiseNest', 'promise'],
                  locations: [{
                    line: 7,
                    column: 30
                  }]
                }, {
                  message: promiseError.message,
                  path: ['promiseNest', 'promise'],
                  locations: [{
                    line: 11,
                    column: 11
                  }]
                }, {
                  message: promiseError.message,
                  path: ['promiseNest', 'syncNest', 'promise'],
                  locations: [{
                    line: 12,
                    column: 27
                  }]
                }, {
                  message: promiseError.message,
                  path: ['promiseNest', 'promiseNest', 'promise'],
                  locations: [{
                    line: 13,
                    column: 30
                  }]
                }]
              });

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
  });
  describe('nulls the first nullable object after a field in a long chain of non-null fields', function () {
    var query = "\n      {\n        syncNest {\n          syncNonNullNest {\n            promiseNonNullNest {\n              syncNonNullNest {\n                promiseNonNullNest {\n                  syncNonNull\n                }\n              }\n            }\n          }\n        }\n        promiseNest {\n          syncNonNullNest {\n            promiseNonNullNest {\n              syncNonNullNest {\n                promiseNonNullNest {\n                  syncNonNull\n                }\n              }\n            }\n          }\n        }\n        anotherNest: syncNest {\n          syncNonNullNest {\n            promiseNonNullNest {\n              syncNonNullNest {\n                promiseNonNullNest {\n                  promiseNonNull\n                }\n              }\n            }\n          }\n        }\n        anotherPromiseNest: promiseNest {\n          syncNonNullNest {\n            promiseNonNullNest {\n              syncNonNullNest {\n                promiseNonNullNest {\n                  promiseNonNull\n                }\n              }\n            }\n          }\n        }\n      }\n    ";
    var data = {
      syncNest: null,
      promiseNest: null,
      anotherNest: null,
      anotherPromiseNest: null
    };
    it('that returns null',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var result;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return executeQuery(query, nullingData);

            case 2:
              result = _context9.sent;
              expect(result).to.deep.equal({
                data: data,
                errors: [{
                  message: 'Cannot return null for non-nullable field DataType.syncNonNull.',
                  path: ['syncNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNull'],
                  locations: [{
                    line: 8,
                    column: 19
                  }]
                }, {
                  message: 'Cannot return null for non-nullable field DataType.syncNonNull.',
                  path: ['promiseNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNull'],
                  locations: [{
                    line: 19,
                    column: 19
                  }]
                }, {
                  message: 'Cannot return null for non-nullable field DataType.promiseNonNull.',
                  path: ['anotherNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'promiseNonNull'],
                  locations: [{
                    line: 30,
                    column: 19
                  }]
                }, {
                  message: 'Cannot return null for non-nullable field DataType.promiseNonNull.',
                  path: ['anotherPromiseNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'promiseNonNull'],
                  locations: [{
                    line: 41,
                    column: 19
                  }]
                }]
              });

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
    it('that throws',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var result;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return executeQuery(query, throwingData);

            case 2:
              result = _context10.sent;
              expect(result).to.deep.equal({
                data: data,
                errors: [{
                  message: syncNonNullError.message,
                  path: ['syncNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNull'],
                  locations: [{
                    line: 8,
                    column: 19
                  }]
                }, {
                  message: syncNonNullError.message,
                  path: ['promiseNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNull'],
                  locations: [{
                    line: 19,
                    column: 19
                  }]
                }, {
                  message: promiseNonNullError.message,
                  path: ['anotherNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'promiseNonNull'],
                  locations: [{
                    line: 30,
                    column: 19
                  }]
                }, {
                  message: promiseNonNullError.message,
                  path: ['anotherPromiseNest', 'syncNonNullNest', 'promiseNonNullNest', 'syncNonNullNest', 'promiseNonNullNest', 'promiseNonNull'],
                  locations: [{
                    line: 41,
                    column: 19
                  }]
                }]
              });

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
  });
  describe('nulls the top level if non-nullable field', function () {
    var query = "\n      {\n        syncNonNull\n      }\n    ";
    it('that returns null',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var result;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return executeSyncAndAsync(query, nullingData);

            case 2:
              result = _context11.sent;
              expect(result).to.deep.equal({
                data: null,
                errors: [{
                  message: 'Cannot return null for non-nullable field DataType.syncNonNull.',
                  path: ['syncNonNull'],
                  locations: [{
                    line: 3,
                    column: 9
                  }]
                }]
              });

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })));
    it('that throws',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var result;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return executeSyncAndAsync(query, throwingData);

            case 2:
              result = _context12.sent;
              expect(result).to.deep.equal({
                data: null,
                errors: [{
                  message: syncNonNullError.message,
                  path: ['syncNonNull'],
                  locations: [{
                    line: 3,
                    column: 9
                  }]
                }]
              });

            case 4:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
  });
  describe('Handles non-null argument', function () {
    var schemaWithNonNullArg = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          withNonNullArg: {
            type: GraphQLString,
            args: {
              cannotBeNull: {
                type: GraphQLNonNull(GraphQLString)
              }
            },
            resolve: function resolve(_, args) {
              if (typeof args.cannotBeNull === 'string') {
                return 'Passed: ' + args.cannotBeNull;
              }
            }
          }
        }
      })
    });
    it('succeeds when passed non-null literal value', function () {
      var result = execute({
        schema: schemaWithNonNullArg,
        document: parse("\n          query {\n            withNonNullArg (cannotBeNull: \"literal value\")\n          }\n        ")
      });
      expect(result).to.deep.equal({
        data: {
          withNonNullArg: 'Passed: literal value'
        }
      });
    });
    it('succeeds when passed non-null variable value', function () {
      var result = execute({
        schema: schemaWithNonNullArg,
        document: parse("\n          query ($testVar: String!) {\n            withNonNullArg (cannotBeNull: $testVar)\n          }\n        "),
        variableValues: {
          testVar: 'variable value'
        }
      });
      expect(result).to.deep.equal({
        data: {
          withNonNullArg: 'Passed: variable value'
        }
      });
    });
    it('succeeds when missing variable has default value', function () {
      var result = execute({
        schema: schemaWithNonNullArg,
        document: parse("\n          query ($testVar: String = \"default value\") {\n            withNonNullArg (cannotBeNull: $testVar)\n          }\n        "),
        variableValues: {// Intentionally missing variable
        }
      });
      expect(result).to.deep.equal({
        data: {
          withNonNullArg: 'Passed: default value'
        }
      });
    });
    it('field error when missing non-null arg', function () {
      // Note: validation should identify this issue first (missing args rule)
      // however execution should still protect against this.
      var result = execute({
        schema: schemaWithNonNullArg,
        document: parse("\n          query {\n            withNonNullArg\n          }\n        ")
      });
      expect(result).to.deep.equal({
        data: {
          withNonNullArg: null
        },
        errors: [{
          message: 'Argument "cannotBeNull" of required type "String!" was not provided.',
          locations: [{
            line: 3,
            column: 13
          }],
          path: ['withNonNullArg']
        }]
      });
    });
    it('field error when non-null arg provided null', function () {
      // Note: validation should identify this issue first (values of correct
      // type rule) however execution should still protect against this.
      var result = execute({
        schema: schemaWithNonNullArg,
        document: parse("\n          query {\n            withNonNullArg(cannotBeNull: null)\n          }\n        ")
      });
      expect(result).to.deep.equal({
        data: {
          withNonNullArg: null
        },
        errors: [{
          message: 'Argument "cannotBeNull" of non-null type "String!" must ' + 'not be null.',
          locations: [{
            line: 3,
            column: 42
          }],
          path: ['withNonNullArg']
        }]
      });
    });
    it('field error when non-null arg not provided variable value', function () {
      // Note: validation should identify this issue first (variables in allowed
      // position rule) however execution should still protect against this.
      var result = execute({
        schema: schemaWithNonNullArg,
        document: parse("\n          query ($testVar: String) {\n            withNonNullArg(cannotBeNull: $testVar)\n          }\n        "),
        variableValues: {// Intentionally missing variable
        }
      });
      expect(result).to.deep.equal({
        data: {
          withNonNullArg: null
        },
        errors: [{
          message: 'Argument "cannotBeNull" of required type "String!" was ' + 'provided the variable "$testVar" which was not provided a ' + 'runtime value.',
          locations: [{
            line: 3,
            column: 42
          }],
          path: ['withNonNullArg']
        }]
      });
    });
    it('field error when non-null arg provided variable with explicit null value', function () {
      var result = execute({
        schema: schemaWithNonNullArg,
        document: parse("\n          query ($testVar: String = \"default value\") {\n            withNonNullArg (cannotBeNull: $testVar)\n          }\n        "),
        variableValues: {
          testVar: null
        }
      });
      expect(result).to.deep.equal({
        data: {
          withNonNullArg: null
        },
        errors: [{
          message: 'Argument "cannotBeNull" of non-null type "String!" must not be null.',
          locations: [{
            line: 3,
            column: 43
          }],
          path: ['withNonNullArg']
        }]
      });
    });
  });
});