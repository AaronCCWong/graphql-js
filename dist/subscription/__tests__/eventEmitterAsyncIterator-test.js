"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _events = _interopRequireDefault(require("events"));

var _eventEmitterAsyncIterator = _interopRequireDefault(require("./eventEmitterAsyncIterator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

(0, _mocha.describe)('eventEmitterAsyncIterator', function () {
  (0, _mocha.it)('subscribe async-iterator mock',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var emitter, iterator, i3, i4, i5;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Create an AsyncIterator from an EventEmitter
            emitter = new _events.default();
            iterator = (0, _eventEmitterAsyncIterator.default)(emitter, 'publish'); // Queue up publishes

            (0, _chai.expect)(emitter.emit('publish', 'Apple')).to.equal(true);
            (0, _chai.expect)(emitter.emit('publish', 'Banana')).to.equal(true); // Read payloads

            _context.t0 = _chai.expect;
            _context.next = 7;
            return iterator.next();

          case 7:
            _context.t1 = _context.sent;
            _context.t2 = {
              done: false,
              value: 'Apple'
            };
            (0, _context.t0)(_context.t1).to.deep.equal(_context.t2);
            _context.t3 = _chai.expect;
            _context.next = 13;
            return iterator.next();

          case 13:
            _context.t4 = _context.sent;
            _context.t5 = {
              done: false,
              value: 'Banana'
            };
            (0, _context.t3)(_context.t4).to.deep.equal(_context.t5);
            // Read ahead
            i3 = iterator.next().then(function (x) {
              return x;
            });
            i4 = iterator.next().then(function (x) {
              return x;
            }); // Publish

            (0, _chai.expect)(emitter.emit('publish', 'Coconut')).to.equal(true);
            (0, _chai.expect)(emitter.emit('publish', 'Durian')).to.equal(true); // Await out of order to get correct results

            _context.t6 = _chai.expect;
            _context.next = 23;
            return i4;

          case 23:
            _context.t7 = _context.sent;
            _context.t8 = {
              done: false,
              value: 'Durian'
            };
            (0, _context.t6)(_context.t7).to.deep.equal(_context.t8);
            _context.t9 = _chai.expect;
            _context.next = 29;
            return i3;

          case 29:
            _context.t10 = _context.sent;
            _context.t11 = {
              done: false,
              value: 'Coconut'
            };
            (0, _context.t9)(_context.t10).to.deep.equal(_context.t11);
            // Read ahead
            i5 = iterator.next().then(function (x) {
              return x;
            }); // Terminate emitter

            _context.next = 35;
            return iterator.return();

          case 35:
            // Publish is not caught after terminate
            (0, _chai.expect)(emitter.emit('publish', 'Fig')).to.equal(false); // Find that cancelled read-ahead got a "done" result

            _context.t12 = _chai.expect;
            _context.next = 39;
            return i5;

          case 39:
            _context.t13 = _context.sent;
            _context.t14 = {
              done: true,
              value: undefined
            };
            (0, _context.t12)(_context.t13).to.deep.equal(_context.t14);
            _context.t15 = _chai.expect;
            _context.next = 45;
            return iterator.next();

          case 45:
            _context.t16 = _context.sent;
            _context.t17 = {
              done: true,
              value: undefined
            };
            (0, _context.t15)(_context.t16).to.deep.equal(_context.t17);

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
});