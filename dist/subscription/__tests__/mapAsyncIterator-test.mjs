function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume("next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

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
import mapAsyncIterator from '../mapAsyncIterator';
describe('mapAsyncIterator', function () {
  it('maps over async values',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var source, _source, doubles;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _source = function _ref3() {
              _source = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return 1;

                      case 2:
                        _context.next = 4;
                        return 2;

                      case 4:
                        _context.next = 6;
                        return 3;

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));
              return _source.apply(this, arguments);
            };

            source = function _ref2() {
              return _source.apply(this, arguments);
            };

            doubles = mapAsyncIterator(source(), function (x) {
              return x + x;
            });
            _context2.t0 = expect;
            _context2.next = 6;
            return doubles.next();

          case 6:
            _context2.t1 = _context2.sent;
            _context2.t2 = {
              value: 2,
              done: false
            };
            (0, _context2.t0)(_context2.t1).to.deep.equal(_context2.t2);
            _context2.t3 = expect;
            _context2.next = 12;
            return doubles.next();

          case 12:
            _context2.t4 = _context2.sent;
            _context2.t5 = {
              value: 4,
              done: false
            };
            (0, _context2.t3)(_context2.t4).to.deep.equal(_context2.t5);
            _context2.t6 = expect;
            _context2.next = 18;
            return doubles.next();

          case 18:
            _context2.t7 = _context2.sent;
            _context2.t8 = {
              value: 6,
              done: false
            };
            (0, _context2.t6)(_context2.t7).to.deep.equal(_context2.t8);
            _context2.t9 = expect;
            _context2.next = 24;
            return doubles.next();

          case 24:
            _context2.t10 = _context2.sent;
            _context2.t11 = {
              value: undefined,
              done: true
            };
            (0, _context2.t9)(_context2.t10).to.deep.equal(_context2.t11);

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  it('maps over async values with async function',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var source, _source2, doubles;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _source2 = function _ref7() {
              _source2 = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return 1;

                      case 2:
                        _context3.next = 4;
                        return 2;

                      case 4:
                        _context3.next = 6;
                        return 3;

                      case 6:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              }));
              return _source2.apply(this, arguments);
            };

            source = function _ref6() {
              return _source2.apply(this, arguments);
            };

            // Flow test: this is *not* AsyncIterator<Promise<number>>
            doubles = mapAsyncIterator(source(),
            /*#__PURE__*/
            function () {
              var _ref5 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4(x) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return x;

                      case 2:
                        _context4.t0 = _context4.sent;
                        _context4.t1 = x;
                        return _context4.abrupt("return", _context4.t0 + _context4.t1);

                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              }));

              return function (_x) {
                return _ref5.apply(this, arguments);
              };
            }());
            _context5.t0 = expect;
            _context5.next = 6;
            return doubles.next();

          case 6:
            _context5.t1 = _context5.sent;
            _context5.t2 = {
              value: 2,
              done: false
            };
            (0, _context5.t0)(_context5.t1).to.deep.equal(_context5.t2);
            _context5.t3 = expect;
            _context5.next = 12;
            return doubles.next();

          case 12:
            _context5.t4 = _context5.sent;
            _context5.t5 = {
              value: 4,
              done: false
            };
            (0, _context5.t3)(_context5.t4).to.deep.equal(_context5.t5);
            _context5.t6 = expect;
            _context5.next = 18;
            return doubles.next();

          case 18:
            _context5.t7 = _context5.sent;
            _context5.t8 = {
              value: 6,
              done: false
            };
            (0, _context5.t6)(_context5.t7).to.deep.equal(_context5.t8);
            _context5.t9 = expect;
            _context5.next = 24;
            return doubles.next();

          case 24:
            _context5.t10 = _context5.sent;
            _context5.t11 = {
              value: undefined,
              done: true
            };
            (0, _context5.t9)(_context5.t10).to.deep.equal(_context5.t11);

          case 27:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));
  it('allows returning early from async values',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var source, _source3, doubles;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _source3 = function _ref10() {
              _source3 = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return 1;

                      case 2:
                        _context6.next = 4;
                        return 2;

                      case 4:
                        _context6.next = 6;
                        return 3;

                      case 6:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, this);
              }));
              return _source3.apply(this, arguments);
            };

            source = function _ref9() {
              return _source3.apply(this, arguments);
            };

            doubles = mapAsyncIterator(source(), function (x) {
              return x + x;
            });
            _context7.t0 = expect;
            _context7.next = 6;
            return doubles.next();

          case 6:
            _context7.t1 = _context7.sent;
            _context7.t2 = {
              value: 2,
              done: false
            };
            (0, _context7.t0)(_context7.t1).to.deep.equal(_context7.t2);
            _context7.t3 = expect;
            _context7.next = 12;
            return doubles.next();

          case 12:
            _context7.t4 = _context7.sent;
            _context7.t5 = {
              value: 4,
              done: false
            };
            (0, _context7.t3)(_context7.t4).to.deep.equal(_context7.t5);
            _context7.t6 = expect;
            _context7.next = 18;
            return doubles.return();

          case 18:
            _context7.t7 = _context7.sent;
            _context7.t8 = {
              value: undefined,
              done: true
            };
            (0, _context7.t6)(_context7.t7).to.deep.equal(_context7.t8);
            _context7.t9 = expect;
            _context7.next = 24;
            return doubles.next();

          case 24:
            _context7.t10 = _context7.sent;
            _context7.t11 = {
              value: undefined,
              done: true
            };
            (0, _context7.t9)(_context7.t10).to.deep.equal(_context7.t11);
            _context7.t12 = expect;
            _context7.next = 30;
            return doubles.next();

          case 30:
            _context7.t13 = _context7.sent;
            _context7.t14 = {
              value: undefined,
              done: true
            };
            (0, _context7.t12)(_context7.t13).to.deep.equal(_context7.t14);

          case 33:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  })));
  it('passes through early return from async values',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var source, _source4, doubles;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _source4 = function _ref13() {
              _source4 = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.prev = 0;
                        _context8.next = 3;
                        return 1;

                      case 3:
                        _context8.next = 5;
                        return 2;

                      case 5:
                        _context8.next = 7;
                        return 3;

                      case 7:
                        _context8.prev = 7;
                        _context8.next = 10;
                        return 'done';

                      case 10:
                        _context8.next = 12;
                        return 'last';

                      case 12:
                        return _context8.finish(7);

                      case 13:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, this, [[0,, 7, 13]]);
              }));
              return _source4.apply(this, arguments);
            };

            source = function _ref12() {
              return _source4.apply(this, arguments);
            };

            doubles = mapAsyncIterator(source(), function (x) {
              return x + x;
            });
            _context9.t0 = expect;
            _context9.next = 6;
            return doubles.next();

          case 6:
            _context9.t1 = _context9.sent;
            _context9.t2 = {
              value: 2,
              done: false
            };
            (0, _context9.t0)(_context9.t1).to.deep.equal(_context9.t2);
            _context9.t3 = expect;
            _context9.next = 12;
            return doubles.next();

          case 12:
            _context9.t4 = _context9.sent;
            _context9.t5 = {
              value: 4,
              done: false
            };
            (0, _context9.t3)(_context9.t4).to.deep.equal(_context9.t5);
            _context9.t6 = expect;
            _context9.next = 18;
            return doubles.return();

          case 18:
            _context9.t7 = _context9.sent;
            _context9.t8 = {
              value: 'donedone',
              done: false
            };
            (0, _context9.t6)(_context9.t7).to.deep.equal(_context9.t8);
            _context9.t9 = expect;
            _context9.next = 24;
            return doubles.next();

          case 24:
            _context9.t10 = _context9.sent;
            _context9.t11 = {
              value: 'lastlast',
              done: false
            };
            (0, _context9.t9)(_context9.t10).to.deep.equal(_context9.t11);
            _context9.t12 = expect;
            _context9.next = 30;
            return doubles.next();

          case 30:
            _context9.t13 = _context9.sent;
            _context9.t14 = {
              value: undefined,
              done: true
            };
            (0, _context9.t12)(_context9.t13).to.deep.equal(_context9.t14);

          case 33:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  })));
  it('allows throwing errors through async generators',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11() {
    var source, _source5, doubles, caughtError;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _source5 = function _ref16() {
              _source5 = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee10() {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return 1;

                      case 2:
                        _context10.next = 4;
                        return 2;

                      case 4:
                        _context10.next = 6;
                        return 3;

                      case 6:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10, this);
              }));
              return _source5.apply(this, arguments);
            };

            source = function _ref15() {
              return _source5.apply(this, arguments);
            };

            doubles = mapAsyncIterator(source(), function (x) {
              return x + x;
            });
            _context11.t0 = expect;
            _context11.next = 6;
            return doubles.next();

          case 6:
            _context11.t1 = _context11.sent;
            _context11.t2 = {
              value: 2,
              done: false
            };
            (0, _context11.t0)(_context11.t1).to.deep.equal(_context11.t2);
            _context11.t3 = expect;
            _context11.next = 12;
            return doubles.next();

          case 12:
            _context11.t4 = _context11.sent;
            _context11.t5 = {
              value: 4,
              done: false
            };
            (0, _context11.t3)(_context11.t4).to.deep.equal(_context11.t5);
            _context11.prev = 15;
            _context11.next = 18;
            return doubles.throw('ouch');

          case 18:
            _context11.next = 23;
            break;

          case 20:
            _context11.prev = 20;
            _context11.t6 = _context11["catch"](15);
            caughtError = _context11.t6;

          case 23:
            expect(caughtError).to.equal('ouch');
            _context11.t7 = expect;
            _context11.next = 27;
            return doubles.next();

          case 27:
            _context11.t8 = _context11.sent;
            _context11.t9 = {
              value: undefined,
              done: true
            };
            (0, _context11.t7)(_context11.t8).to.deep.equal(_context11.t9);
            _context11.t10 = expect;
            _context11.next = 33;
            return doubles.next();

          case 33:
            _context11.t11 = _context11.sent;
            _context11.t12 = {
              value: undefined,
              done: true
            };
            (0, _context11.t10)(_context11.t11).to.deep.equal(_context11.t12);

          case 36:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this, [[15, 20]]);
  })));
  it('passes through caught errors through async generators',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13() {
    var source, _source6, doubles;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _source6 = function _ref19() {
              _source6 = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee12() {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.prev = 0;
                        _context12.next = 3;
                        return 1;

                      case 3:
                        _context12.next = 5;
                        return 2;

                      case 5:
                        _context12.next = 7;
                        return 3;

                      case 7:
                        _context12.next = 13;
                        break;

                      case 9:
                        _context12.prev = 9;
                        _context12.t0 = _context12["catch"](0);
                        _context12.next = 13;
                        return _context12.t0;

                      case 13:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12, this, [[0, 9]]);
              }));
              return _source6.apply(this, arguments);
            };

            source = function _ref18() {
              return _source6.apply(this, arguments);
            };

            doubles = mapAsyncIterator(source(), function (x) {
              return x + x;
            });
            _context13.t0 = expect;
            _context13.next = 6;
            return doubles.next();

          case 6:
            _context13.t1 = _context13.sent;
            _context13.t2 = {
              value: 2,
              done: false
            };
            (0, _context13.t0)(_context13.t1).to.deep.equal(_context13.t2);
            _context13.t3 = expect;
            _context13.next = 12;
            return doubles.next();

          case 12:
            _context13.t4 = _context13.sent;
            _context13.t5 = {
              value: 4,
              done: false
            };
            (0, _context13.t3)(_context13.t4).to.deep.equal(_context13.t5);
            _context13.t6 = expect;
            _context13.next = 18;
            return doubles.throw('ouch');

          case 18:
            _context13.t7 = _context13.sent;
            _context13.t8 = {
              value: 'ouchouch',
              done: false
            };
            (0, _context13.t6)(_context13.t7).to.deep.equal(_context13.t8);
            _context13.t9 = expect;
            _context13.next = 24;
            return doubles.next();

          case 24:
            _context13.t10 = _context13.sent;
            _context13.t11 = {
              value: undefined,
              done: true
            };
            (0, _context13.t9)(_context13.t10).to.deep.equal(_context13.t11);
            _context13.t12 = expect;
            _context13.next = 30;
            return doubles.next();

          case 30:
            _context13.t13 = _context13.sent;
            _context13.t14 = {
              value: undefined,
              done: true
            };
            (0, _context13.t12)(_context13.t13).to.deep.equal(_context13.t14);

          case 33:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this);
  })));
  it('does not normally map over thrown errors',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15() {
    var source, _source7, doubles, caughtError;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _source7 = function _ref22() {
              _source7 = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee14() {
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return 'Hello';

                      case 2:
                        throw new Error('Goodbye');

                      case 3:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14, this);
              }));
              return _source7.apply(this, arguments);
            };

            source = function _ref21() {
              return _source7.apply(this, arguments);
            };

            doubles = mapAsyncIterator(source(), function (x) {
              return x + x;
            });
            _context15.t0 = expect;
            _context15.next = 6;
            return doubles.next();

          case 6:
            _context15.t1 = _context15.sent;
            _context15.t2 = {
              value: 'HelloHello',
              done: false
            };
            (0, _context15.t0)(_context15.t1).to.deep.equal(_context15.t2);
            _context15.prev = 9;
            _context15.next = 12;
            return doubles.next();

          case 12:
            _context15.next = 17;
            break;

          case 14:
            _context15.prev = 14;
            _context15.t3 = _context15["catch"](9);
            caughtError = _context15.t3;

          case 17:
            expect(caughtError && caughtError.message).to.equal('Goodbye');

          case 18:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, this, [[9, 14]]);
  })));
  it('maps over thrown errors if second callback provided',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17() {
    var source, _source8, doubles, result;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _source8 = function _ref25() {
              _source8 = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee16() {
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return 'Hello';

                      case 2:
                        throw new Error('Goodbye');

                      case 3:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16, this);
              }));
              return _source8.apply(this, arguments);
            };

            source = function _ref24() {
              return _source8.apply(this, arguments);
            };

            doubles = mapAsyncIterator(source(), function (x) {
              return x + x;
            }, function (error) {
              return error;
            });
            _context17.t0 = expect;
            _context17.next = 6;
            return doubles.next();

          case 6:
            _context17.t1 = _context17.sent;
            _context17.t2 = {
              value: 'HelloHello',
              done: false
            };
            (0, _context17.t0)(_context17.t1).to.deep.equal(_context17.t2);
            _context17.next = 11;
            return doubles.next();

          case 11:
            result = _context17.sent;
            expect(result.value).to.be.instanceof(Error);
            expect(result.value && result.value.message).to.equal('Goodbye');
            expect(result.done).to.equal(false);
            _context17.t3 = expect;
            _context17.next = 18;
            return doubles.next();

          case 18:
            _context17.t4 = _context17.sent;
            _context17.t5 = {
              value: undefined,
              done: true
            };
            (0, _context17.t3)(_context17.t4).to.deep.equal(_context17.t5);

          case 21:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, this);
  })));

  function testClosesSourceWithMapper(_x2) {
    return _testClosesSourceWithMapper.apply(this, arguments);
  }

  function _testClosesSourceWithMapper() {
    _testClosesSourceWithMapper = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee25(mapper) {
      var didVisitFinally, source, _source9, throwOver1, expectedError;

      return regeneratorRuntime.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _source9 = function _ref33() {
                _source9 = _wrapAsyncGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee24() {
                  return regeneratorRuntime.wrap(function _callee24$(_context24) {
                    while (1) {
                      switch (_context24.prev = _context24.next) {
                        case 0:
                          _context24.prev = 0;
                          _context24.next = 3;
                          return 1;

                        case 3:
                          _context24.next = 5;
                          return 2;

                        case 5:
                          _context24.next = 7;
                          return 3;

                        case 7:
                          _context24.prev = 7;
                          didVisitFinally = true;
                          _context24.next = 11;
                          return 1000;

                        case 11:
                          return _context24.finish(7);

                        case 12:
                        case "end":
                          return _context24.stop();
                      }
                    }
                  }, _callee24, this, [[0,, 7, 12]]);
                }));
                return _source9.apply(this, arguments);
              };

              source = function _ref32() {
                return _source9.apply(this, arguments);
              };

              didVisitFinally = false;
              throwOver1 = mapAsyncIterator(source(), mapper);
              _context25.t0 = expect;
              _context25.next = 7;
              return throwOver1.next();

            case 7:
              _context25.t1 = _context25.sent;
              _context25.t2 = {
                value: 1,
                done: false
              };
              (0, _context25.t0)(_context25.t1).to.deep.equal(_context25.t2);
              _context25.prev = 10;
              _context25.next = 13;
              return throwOver1.next();

            case 13:
              _context25.next = 18;
              break;

            case 15:
              _context25.prev = 15;
              _context25.t3 = _context25["catch"](10);
              expectedError = _context25.t3;

            case 18:
              expect(expectedError).to.be.an('error');

              if (expectedError) {
                expect(expectedError.message).to.equal('Cannot count to 2');
              }

              _context25.t4 = expect;
              _context25.next = 23;
              return throwOver1.next();

            case 23:
              _context25.t5 = _context25.sent;
              _context25.t6 = {
                value: undefined,
                done: true
              };
              (0, _context25.t4)(_context25.t5).to.deep.equal(_context25.t6);
              expect(didVisitFinally).to.equal(true);

            case 27:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25, this, [[10, 15]]);
    }));
    return _testClosesSourceWithMapper.apply(this, arguments);
  }

  it('closes source if mapper throws an error',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18() {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return testClosesSourceWithMapper(function (x) {
              if (x > 1) {
                throw new Error('Cannot count to ' + x);
              }

              return x;
            });

          case 2:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, this);
  })));
  it('closes source if mapper rejects',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20() {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return testClosesSourceWithMapper(
            /*#__PURE__*/
            function () {
              var _ref28 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee19(x) {
                return regeneratorRuntime.wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        if (!(x > 1)) {
                          _context19.next = 2;
                          break;
                        }

                        throw new Error('Cannot count to ' + x);

                      case 2:
                        return _context19.abrupt("return", x);

                      case 3:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19, this);
              }));

              return function (_x3) {
                return _ref28.apply(this, arguments);
              };
            }());

          case 2:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, this);
  })));

  function testClosesSourceWithRejectMapper(_x4) {
    return _testClosesSourceWithRejectMapper.apply(this, arguments);
  }

  function _testClosesSourceWithRejectMapper() {
    _testClosesSourceWithRejectMapper = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee27(mapper) {
      var source, _source10, throwOver1, expectedError;

      return regeneratorRuntime.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _source10 = function _ref35() {
                _source10 = _wrapAsyncGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee26() {
                  return regeneratorRuntime.wrap(function _callee26$(_context26) {
                    while (1) {
                      switch (_context26.prev = _context26.next) {
                        case 0:
                          _context26.next = 2;
                          return 1;

                        case 2:
                          throw new Error(2);

                        case 3:
                        case "end":
                          return _context26.stop();
                      }
                    }
                  }, _callee26, this);
                }));
                return _source10.apply(this, arguments);
              };

              source = function _ref34() {
                return _source10.apply(this, arguments);
              };

              throwOver1 = mapAsyncIterator(source(), function (x) {
                return x;
              }, mapper);
              _context27.t0 = expect;
              _context27.next = 6;
              return throwOver1.next();

            case 6:
              _context27.t1 = _context27.sent;
              _context27.t2 = {
                value: 1,
                done: false
              };
              (0, _context27.t0)(_context27.t1).to.deep.equal(_context27.t2);
              _context27.prev = 9;
              _context27.next = 12;
              return throwOver1.next();

            case 12:
              _context27.next = 17;
              break;

            case 14:
              _context27.prev = 14;
              _context27.t3 = _context27["catch"](9);
              expectedError = _context27.t3;

            case 17:
              expect(expectedError).to.be.an('error');

              if (expectedError) {
                expect(expectedError.message).to.equal('Cannot count to 2');
              }

              _context27.t4 = expect;
              _context27.next = 22;
              return throwOver1.next();

            case 22:
              _context27.t5 = _context27.sent;
              _context27.t6 = {
                value: undefined,
                done: true
              };
              (0, _context27.t4)(_context27.t5).to.deep.equal(_context27.t6);

            case 25:
            case "end":
              return _context27.stop();
          }
        }
      }, _callee27, this, [[9, 14]]);
    }));
    return _testClosesSourceWithRejectMapper.apply(this, arguments);
  }

  it('closes source if mapper throws an error',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21() {
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return testClosesSourceWithRejectMapper(function (error) {
              throw new Error('Cannot count to ' + error.message);
            });

          case 2:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, this);
  })));
  it('closes source if mapper rejects',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23() {
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return testClosesSourceWithRejectMapper(
            /*#__PURE__*/
            function () {
              var _ref31 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee22(error) {
                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        throw new Error('Cannot count to ' + error.message);

                      case 1:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22, this);
              }));

              return function (_x5) {
                return _ref31.apply(this, arguments);
              };
            }());

          case 2:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, this);
  })));
});