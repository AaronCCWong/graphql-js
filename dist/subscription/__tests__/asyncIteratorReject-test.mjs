function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import asyncIteratorReject from '../asyncIteratorReject';
describe('asyncIteratorReject', function () {
  it('creates a failing async iterator',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var error, iter, caughtError;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            error = new Error('Oh no, Mr. Bill!');
            iter = asyncIteratorReject(error);
            _context.prev = 2;
            _context.next = 5;
            return iter.next();

          case 5:
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](2);
            caughtError = _context.t0;

          case 10:
            expect(caughtError).to.equal(error);
            _context.t1 = expect;
            _context.next = 14;
            return iter.next();

          case 14:
            _context.t2 = _context.sent;
            _context.t3 = {
              done: true,
              value: undefined
            };
            (0, _context.t1)(_context.t2).to.deep.equal(_context.t3);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 7]]);
  })));
  it('can be closed before failing',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var error, iter;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            error = new Error('Oh no, Mr. Bill!');
            iter = asyncIteratorReject(error); // Close iterator

            _context2.t0 = expect;
            _context2.next = 5;
            return iter.return();

          case 5:
            _context2.t1 = _context2.sent;
            _context2.t2 = {
              done: true,
              value: undefined
            };
            (0, _context2.t0)(_context2.t1).to.deep.equal(_context2.t2);
            _context2.t3 = expect;
            _context2.next = 11;
            return iter.next();

          case 11:
            _context2.t4 = _context2.sent;
            _context2.t5 = {
              done: true,
              value: undefined
            };
            (0, _context2.t3)(_context2.t4).to.deep.equal(_context2.t5);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
});