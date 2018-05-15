"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _execute = require("../execute");

var _language = require("../../language");

var _type = require("../../type");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NumberHolder = function NumberHolder(originalNumber) {
  _defineProperty(this, "theNumber", void 0);

  this.theNumber = originalNumber;
};

var Root =
/*#__PURE__*/
function () {
  function Root(originalNumber) {
    _defineProperty(this, "numberHolder", void 0);

    this.numberHolder = new NumberHolder(originalNumber);
  }

  var _proto = Root.prototype;

  _proto.immediatelyChangeTheNumber = function immediatelyChangeTheNumber(newNumber) {
    this.numberHolder.theNumber = newNumber;
    return this.numberHolder;
  };

  _proto.promiseToChangeTheNumber = function promiseToChangeTheNumber(newNumber) {
    var _this = this;

    return new Promise(function (resolve) {
      process.nextTick(function () {
        resolve(_this.immediatelyChangeTheNumber(newNumber));
      });
    });
  };

  _proto.failToChangeTheNumber = function failToChangeTheNumber() {
    throw new Error('Cannot change the number');
  };

  _proto.promiseAndFailToChangeTheNumber = function promiseAndFailToChangeTheNumber() {
    return new Promise(function (resolve, reject) {
      process.nextTick(function () {
        reject(new Error('Cannot change the number'));
      });
    });
  };

  return Root;
}();

var numberHolderType = new _type.GraphQLObjectType({
  fields: {
    theNumber: {
      type: _type.GraphQLInt
    }
  },
  name: 'NumberHolder'
});
var schema = new _type.GraphQLSchema({
  query: new _type.GraphQLObjectType({
    fields: {
      numberHolder: {
        type: numberHolderType
      }
    },
    name: 'Query'
  }),
  mutation: new _type.GraphQLObjectType({
    fields: {
      immediatelyChangeTheNumber: {
        type: numberHolderType,
        args: {
          newNumber: {
            type: _type.GraphQLInt
          }
        },
        resolve: function resolve(obj, _ref) {
          var newNumber = _ref.newNumber;
          return obj.immediatelyChangeTheNumber(newNumber);
        }
      },
      promiseToChangeTheNumber: {
        type: numberHolderType,
        args: {
          newNumber: {
            type: _type.GraphQLInt
          }
        },
        resolve: function resolve(obj, _ref2) {
          var newNumber = _ref2.newNumber;
          return obj.promiseToChangeTheNumber(newNumber);
        }
      },
      failToChangeTheNumber: {
        type: numberHolderType,
        args: {
          newNumber: {
            type: _type.GraphQLInt
          }
        },
        resolve: function resolve(obj, _ref3) {
          var newNumber = _ref3.newNumber;
          return obj.failToChangeTheNumber(newNumber);
        }
      },
      promiseAndFailToChangeTheNumber: {
        type: numberHolderType,
        args: {
          newNumber: {
            type: _type.GraphQLInt
          }
        },
        resolve: function resolve(obj, _ref4) {
          var newNumber = _ref4.newNumber;
          return obj.promiseAndFailToChangeTheNumber(newNumber);
        }
      }
    },
    name: 'Mutation'
  })
});
(0, _mocha.describe)('Execute: Handles mutation execution ordering', function () {
  (0, _mocha.it)('evaluates mutations serially',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var doc, mutationResult;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            doc = "mutation M {\n      first: immediatelyChangeTheNumber(newNumber: 1) {\n        theNumber\n      },\n      second: promiseToChangeTheNumber(newNumber: 2) {\n        theNumber\n      },\n      third: immediatelyChangeTheNumber(newNumber: 3) {\n        theNumber\n      }\n      fourth: promiseToChangeTheNumber(newNumber: 4) {\n        theNumber\n      },\n      fifth: immediatelyChangeTheNumber(newNumber: 5) {\n        theNumber\n      }\n    }";
            _context.next = 3;
            return (0, _execute.execute)(schema, (0, _language.parse)(doc), new Root(6));

          case 3:
            mutationResult = _context.sent;
            (0, _chai.expect)(mutationResult).to.deep.equal({
              data: {
                first: {
                  theNumber: 1
                },
                second: {
                  theNumber: 2
                },
                third: {
                  theNumber: 3
                },
                fourth: {
                  theNumber: 4
                },
                fifth: {
                  theNumber: 5
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
  (0, _mocha.it)('evaluates mutations correctly in the presense of a failed mutation',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var doc, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            doc = "mutation M {\n      first: immediatelyChangeTheNumber(newNumber: 1) {\n        theNumber\n      },\n      second: promiseToChangeTheNumber(newNumber: 2) {\n        theNumber\n      },\n      third: failToChangeTheNumber(newNumber: 3) {\n        theNumber\n      }\n      fourth: promiseToChangeTheNumber(newNumber: 4) {\n        theNumber\n      },\n      fifth: immediatelyChangeTheNumber(newNumber: 5) {\n        theNumber\n      }\n      sixth: promiseAndFailToChangeTheNumber(newNumber: 6) {\n        theNumber\n      }\n    }";
            _context2.next = 3;
            return (0, _execute.execute)(schema, (0, _language.parse)(doc), new Root(6));

          case 3:
            result = _context2.sent;
            (0, _chai.expect)(result).to.deep.equal({
              data: {
                first: {
                  theNumber: 1
                },
                second: {
                  theNumber: 2
                },
                third: null,
                fourth: {
                  theNumber: 4
                },
                fifth: {
                  theNumber: 5
                },
                sixth: null
              },
              errors: [{
                message: 'Cannot change the number',
                locations: [{
                  line: 8,
                  column: 7
                }],
                path: ['third']
              }, {
                message: 'Cannot change the number',
                locations: [{
                  line: 17,
                  column: 7
                }],
                path: ['sixth']
              }]
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
});