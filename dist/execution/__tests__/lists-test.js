"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _execute = require("../execute");

var _language = require("../../language");

var _type = require("../../type");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

// resolved() is shorthand for Promise.resolve()
var resolved = Promise.resolve.bind(Promise); // rejected() is shorthand for Promise.reject()

var rejected = Promise.reject.bind(Promise);
/**
 * This function creates a test case passed to "it", there's a time delay
 * between when the test is created and when the test is run, so if testData
 * contains a rejection, testData should be a function that returns that
 * rejection so as not to trigger the "unhandled rejection" error watcher.
 */

function check(testType, testData, expected) {
  return (
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var data, dataType, schema, ast, response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              data = {
                test: testData
              };
              dataType = new _type.GraphQLObjectType({
                name: 'DataType',
                fields: function fields() {
                  return {
                    test: {
                      type: testType
                    },
                    nest: {
                      type: dataType,
                      resolve: function resolve() {
                        return data;
                      }
                    }
                  };
                }
              });
              schema = new _type.GraphQLSchema({
                query: dataType
              });
              ast = (0, _language.parse)('{ nest { test } }');
              _context.next = 6;
              return (0, _execute.execute)(schema, ast, data);

            case 6:
              response = _context.sent;
              (0, _chai.expect)(response).to.deep.equal(expected);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }))
  );
}

(0, _mocha.describe)('Execute: Accepts any iterable as list value', function () {
  var _marked =
  /*#__PURE__*/
  regeneratorRuntime.mark(yieldItems);

  (0, _mocha.it)('Accepts a Set as a List value', check((0, _type.GraphQLList)(_type.GraphQLString), new Set(['apple', 'banana', 'apple', 'coconut']), {
    data: {
      nest: {
        test: ['apple', 'banana', 'coconut']
      }
    }
  }));

  function yieldItems() {
    return regeneratorRuntime.wrap(function yieldItems$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return 'one';

          case 2:
            _context2.next = 4;
            return 2;

          case 4:
            _context2.next = 6;
            return true;

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _marked, this);
  }

  (0, _mocha.it)('Accepts an Generator function as a List value', check((0, _type.GraphQLList)(_type.GraphQLString), yieldItems(), {
    data: {
      nest: {
        test: ['one', '2', 'true']
      }
    }
  }));

  function getArgs() {
    return arguments;
  }

  (0, _mocha.it)('Accepts function arguments as a List value', check((0, _type.GraphQLList)(_type.GraphQLString), getArgs('one', 'two'), {
    data: {
      nest: {
        test: ['one', 'two']
      }
    }
  }));
  (0, _mocha.it)('Does not accept (Iterable) String-literal as a List value', check((0, _type.GraphQLList)(_type.GraphQLString), 'Singluar', {
    data: {
      nest: {
        test: null
      }
    },
    errors: [{
      message: 'Expected Iterable, but did not find one for field DataType.test.',
      locations: [{
        line: 1,
        column: 10
      }],
      path: ['nest', 'test']
    }]
  }));
});
(0, _mocha.describe)('Execute: Handles list nullability', function () {
  (0, _mocha.describe)('[T]', function () {
    var type = (0, _type.GraphQLList)(_type.GraphQLInt);
    (0, _mocha.describe)('Array<T>', function () {
      (0, _mocha.it)('Contains values', check(type, [1, 2], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [1, null, 2], {
        data: {
          nest: {
            test: [1, null, 2]
          }
        }
      }));
      (0, _mocha.it)('Returns null', check(type, null, {
        data: {
          nest: {
            test: null
          }
        }
      }));
    });
    (0, _mocha.describe)('Promise<Array<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, resolved([1, 2]), {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, resolved([1, null, 2]), {
        data: {
          nest: {
            test: [1, null, 2]
          }
        }
      }));
      (0, _mocha.it)('Returns null', check(type, resolved(null), {
        data: {
          nest: {
            test: null
          }
        }
      }));
      (0, _mocha.it)('Rejected', check(type, function () {
        return rejected(new Error('bad'));
      }, {
        data: {
          nest: {
            test: null
          }
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
    });
    (0, _mocha.describe)('Array<Promise<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, [resolved(1), resolved(2)], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [resolved(1), resolved(null), resolved(2)], {
        data: {
          nest: {
            test: [1, null, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains reject', check(type, function () {
        return [resolved(1), rejected(new Error('bad')), resolved(2)];
      }, {
        data: {
          nest: {
            test: [1, null, 2]
          }
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
    });
  });
  (0, _mocha.describe)('[T]!', function () {
    var type = (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt));
    (0, _mocha.describe)('Array<T>', function () {
      (0, _mocha.it)('Contains values', check(type, [1, 2], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [1, null, 2], {
        data: {
          nest: {
            test: [1, null, 2]
          }
        }
      }));
      (0, _mocha.it)('Returns null', check(type, null, {
        data: {
          nest: null
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
    });
    (0, _mocha.describe)('Promise<Array<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, resolved([1, 2]), {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, resolved([1, null, 2]), {
        data: {
          nest: {
            test: [1, null, 2]
          }
        }
      }));
      (0, _mocha.it)('Returns null', check(type, resolved(null), {
        data: {
          nest: null
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
      (0, _mocha.it)('Rejected', check(type, function () {
        return rejected(new Error('bad'));
      }, {
        data: {
          nest: null
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
    });
    (0, _mocha.describe)('Array<Promise<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, [resolved(1), resolved(2)], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [resolved(1), resolved(null), resolved(2)], {
        data: {
          nest: {
            test: [1, null, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains reject', check(type, function () {
        return [resolved(1), rejected(new Error('bad')), resolved(2)];
      }, {
        data: {
          nest: {
            test: [1, null, 2]
          }
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
    });
  });
  (0, _mocha.describe)('[T!]', function () {
    var type = (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt));
    (0, _mocha.describe)('Array<T>', function () {
      (0, _mocha.it)('Contains values', check(type, [1, 2], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [1, null, 2], {
        data: {
          nest: {
            test: null
          }
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
      (0, _mocha.it)('Returns null', check(type, null, {
        data: {
          nest: {
            test: null
          }
        }
      }));
    });
    (0, _mocha.describe)('Promise<Array<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, resolved([1, 2]), {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, resolved([1, null, 2]), {
        data: {
          nest: {
            test: null
          }
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
      (0, _mocha.it)('Returns null', check(type, resolved(null), {
        data: {
          nest: {
            test: null
          }
        }
      }));
      (0, _mocha.it)('Rejected', check(type, function () {
        return rejected(new Error('bad'));
      }, {
        data: {
          nest: {
            test: null
          }
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
    });
    (0, _mocha.describe)('Array<Promise<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, [resolved(1), resolved(2)], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [resolved(1), resolved(null), resolved(2)], {
        data: {
          nest: {
            test: null
          }
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
      (0, _mocha.it)('Contains reject', check(type, function () {
        return [resolved(1), rejected(new Error('bad')), resolved(2)];
      }, {
        data: {
          nest: {
            test: null
          }
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
    });
  });
  (0, _mocha.describe)('[T!]!', function () {
    var type = (0, _type.GraphQLNonNull)((0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt)));
    (0, _mocha.describe)('Array<T>', function () {
      (0, _mocha.it)('Contains values', check(type, [1, 2], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [1, null, 2], {
        data: {
          nest: null
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
      (0, _mocha.it)('Returns null', check(type, null, {
        data: {
          nest: null
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
    });
    (0, _mocha.describe)('Promise<Array<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, resolved([1, 2]), {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, resolved([1, null, 2]), {
        data: {
          nest: null
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
      (0, _mocha.it)('Returns null', check(type, resolved(null), {
        data: {
          nest: null
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
      (0, _mocha.it)('Rejected', check(type, function () {
        return rejected(new Error('bad'));
      }, {
        data: {
          nest: null
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test']
        }]
      }));
    });
    (0, _mocha.describe)('Array<Promise<T>>', function () {
      (0, _mocha.it)('Contains values', check(type, [resolved(1), resolved(2)], {
        data: {
          nest: {
            test: [1, 2]
          }
        }
      }));
      (0, _mocha.it)('Contains null', check(type, [resolved(1), resolved(null), resolved(2)], {
        data: {
          nest: null
        },
        errors: [{
          message: 'Cannot return null for non-nullable field DataType.test.',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
      (0, _mocha.it)('Contains reject', check(type, function () {
        return [resolved(1), rejected(new Error('bad')), resolved(2)];
      }, {
        data: {
          nest: null
        },
        errors: [{
          message: 'bad',
          locations: [{
            line: 1,
            column: 10
          }],
          path: ['nest', 'test', 1]
        }]
      }));
    });
  });
});