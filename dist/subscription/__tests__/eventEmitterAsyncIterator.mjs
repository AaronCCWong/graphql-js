function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 */
import { $$asyncIterator } from 'iterall';
/**
 * Create an AsyncIterator from an EventEmitter. Useful for mocking a
 * PubSub system for tests.
 */

export default function eventEmitterAsyncIterator(eventEmitter, eventName) {
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
  }, $$asyncIterator, function () {
    return this;
  });
}