"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eventEmitterAsyncIterator;

var _iterall = require("iterall");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Create an AsyncIterator from an EventEmitter. Useful for mocking a
 * PubSub system for tests.
 */
function eventEmitterAsyncIterator(eventEmitter, eventName) {
  var pullQueue = [];
  var pushQueue = [];
  var listening = true;
  eventEmitter.addListener(eventName, pushValue);

  function pushValue(event) {
    if (pullQueue.length !== 0) {
      pullQueue.shift()({
        value: event,
        done: false
      });
    } else {
      pushQueue.push(event);
    }
  }

  function pullValue() {
    return new Promise(function (resolve) {
      if (pushQueue.length !== 0) {
        resolve({
          value: pushQueue.shift(),
          done: false
        });
      } else {
        pullQueue.push(resolve);
      }
    });
  }

  function emptyQueue() {
    if (listening) {
      listening = false;
      eventEmitter.removeListener(eventName, pushValue);
      pullQueue.forEach(function (resolve) {
        return resolve({
          value: undefined,
          done: true
        });
      });
      pullQueue.length = 0;
      pushQueue.length = 0;
    }
  }
  /* TODO: Flow doesn't support symbols as keys:
     https://github.com/facebook/flow/issues/3258 */


  return _defineProperty({
    next: function next() {
      return listening ? pullValue() : this.return();
    },
    return: function _return() {
      emptyQueue();
      return Promise.resolve({
        value: undefined,
        done: true
      });
    },
    throw: function _throw(error) {
      emptyQueue();
      return Promise.reject(error);
    }
  }, _iterall.$$asyncIterator, function () {
    return this;
  });
}