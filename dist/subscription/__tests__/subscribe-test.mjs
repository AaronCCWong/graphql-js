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
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import EventEmitter from 'events';
import eventEmitterAsyncIterator from './eventEmitterAsyncIterator';
import { subscribe } from '../subscribe';
import { parse } from '../../language';
import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLString } from '../../type';
var EmailType = new GraphQLObjectType({
  name: 'Email',
  fields: {
    from: {
      type: GraphQLString
    },
    subject: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    },
    unread: {
      type: GraphQLBoolean
    }
  }
});
var InboxType = new GraphQLObjectType({
  name: 'Inbox',
  fields: {
    total: {
      type: GraphQLInt,
      resolve: function resolve(inbox) {
        return inbox.emails.length;
      }
    },
    unread: {
      type: GraphQLInt,
      resolve: function resolve(inbox) {
        return inbox.emails.filter(function (email) {
          return email.unread;
        }).length;
      }
    },
    emails: {
      type: GraphQLList(EmailType)
    }
  }
});
var QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    inbox: {
      type: InboxType
    }
  }
});
var EmailEventType = new GraphQLObjectType({
  name: 'EmailEvent',
  fields: {
    email: {
      type: EmailType
    },
    inbox: {
      type: InboxType
    }
  }
});
var emailSchema = emailSchemaWithResolvers();

function emailSchemaWithResolvers(subscribeFn, resolveFn) {
  return new GraphQLSchema({
    query: QueryType,
    subscription: new GraphQLObjectType({
      name: 'Subscription',
      fields: {
        importantEmail: {
          type: EmailEventType,
          resolve: resolveFn,
          subscribe: subscribeFn,
          args: {
            priority: {
              type: GraphQLInt
            }
          }
        }
      }
    })
  });
}

function createSubscription(_x) {
  return _createSubscription.apply(this, arguments);
}

function _createSubscription() {
  _createSubscription = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee26(pubsub) {
    var schema,
        ast,
        vars,
        data,
        sendImportantEmail,
        defaultAst,
        _args26 = arguments;
    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            sendImportantEmail = function _ref34(newEmail) {
              data.inbox.emails.push(newEmail); // Returns true if the event was consumed by a subscriber.

              return pubsub.emit('importantEmail', {
                importantEmail: {
                  email: newEmail,
                  inbox: data.inbox
                }
              });
            };

            schema = _args26.length > 1 && _args26[1] !== undefined ? _args26[1] : emailSchema;
            ast = _args26.length > 2 ? _args26[2] : undefined;
            vars = _args26.length > 3 ? _args26[3] : undefined;
            data = {
              inbox: {
                emails: [{
                  from: 'joe@graphql.org',
                  subject: 'Hello',
                  message: 'Hello World',
                  unread: false
                }]
              },
              importantEmail: function importantEmail() {
                return eventEmitterAsyncIterator(pubsub, 'importantEmail');
              }
            };
            defaultAst = parse("\n    subscription ($priority: Int = 0) {\n      importantEmail(priority: $priority) {\n        email {\n          from\n          subject\n        }\n        inbox {\n          unread\n          total\n        }\n      }\n    }\n  "); // `subscribe` returns Promise<AsyncIterator | ExecutionResult>

            _context26.t0 = sendImportantEmail;
            _context26.next = 9;
            return subscribe(schema, ast || defaultAst, data, null, vars);

          case 9:
            _context26.t1 = _context26.sent;
            return _context26.abrupt("return", {
              sendImportantEmail: _context26.t0,
              subscription: _context26.t1
            });

          case 11:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, this);
  }));
  return _createSubscription.apply(this, arguments);
}

function expectPromiseToThrow(_x2, _x3) {
  return _expectPromiseToThrow.apply(this, arguments);
} // Check all error cases when initializing the subscription.


function _expectPromiseToThrow() {
  _expectPromiseToThrow = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee27(promise, message) {
    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.prev = 0;
            _context27.next = 3;
            return promise();

          case 3:
            expect.fail('promise should have thrown but did not');
            _context27.next = 9;
            break;

          case 6:
            _context27.prev = 6;
            _context27.t0 = _context27["catch"](0);
            expect(_context27.t0 && _context27.t0.message).to.equal(message);

          case 9:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27, this, [[0, 6]]);
  }));
  return _expectPromiseToThrow.apply(this, arguments);
}

describe('Subscription Initialization Phase', function () {
  it('accepts an object with named properties as arguments',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var document, emptyAsyncIterator, _emptyAsyncIterator, ai;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _emptyAsyncIterator = function _ref5() {
              _emptyAsyncIterator = _wrapAsyncGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));
              return _emptyAsyncIterator.apply(this, arguments);
            };

            emptyAsyncIterator = function _ref4() {
              return _emptyAsyncIterator.apply(this, arguments);
            };

            document = parse("\n      subscription {\n        importantEmail\n      }\n    ");
            _context2.next = 5;
            return subscribe({
              schema: emailSchema,
              document: document,
              rootValue: {
                importantEmail: emptyAsyncIterator
              }
            });

          case 5:
            ai = _context2.sent;
            ai.return();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  it('accepts multiple subscription fields defined in schema',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var pubsub, SubscriptionTypeMultiple, testSchema, _ref7, subscription, sendImportantEmail;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            pubsub = new EventEmitter();
            SubscriptionTypeMultiple = new GraphQLObjectType({
              name: 'Subscription',
              fields: {
                importantEmail: {
                  type: EmailEventType
                },
                nonImportantEmail: {
                  type: EmailEventType
                }
              }
            });
            testSchema = new GraphQLSchema({
              query: QueryType,
              subscription: SubscriptionTypeMultiple
            });
            _context3.next = 5;
            return createSubscription(pubsub, testSchema);

          case 5:
            _ref7 = _context3.sent;
            subscription = _ref7.subscription;
            sendImportantEmail = _ref7.sendImportantEmail;
            sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Alright',
              message: 'Tests are good',
              unread: true
            });
            _context3.next = 11;
            return subscription.next();

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  it('accepts type definition with sync subscribe function',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var pubsub, schema, ast, subscription;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            pubsub = new EventEmitter();
            schema = new GraphQLSchema({
              query: QueryType,
              subscription: new GraphQLObjectType({
                name: 'Subscription',
                fields: {
                  importantEmail: {
                    type: GraphQLString,
                    subscribe: function subscribe() {
                      return eventEmitterAsyncIterator(pubsub, 'importantEmail');
                    }
                  }
                }
              })
            });
            ast = parse("\n      subscription {\n        importantEmail\n      }\n    ");
            _context4.next = 5;
            return subscribe(schema, ast);

          case 5:
            subscription = _context4.sent;
            pubsub.emit('importantEmail', {
              importantEmail: {}
            });
            _context4.next = 9;
            return subscription.next();

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  it('accepts type definition with async subscribe function',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var pubsub, schema, ast, subscription;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            pubsub = new EventEmitter();
            schema = new GraphQLSchema({
              query: QueryType,
              subscription: new GraphQLObjectType({
                name: 'Subscription',
                fields: {
                  importantEmail: {
                    type: GraphQLString,
                    subscribe: function () {
                      var _subscribe = _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee5() {
                        return regeneratorRuntime.wrap(function _callee5$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                _context5.next = 2;
                                return new Promise(setImmediate);

                              case 2:
                                return _context5.abrupt("return", eventEmitterAsyncIterator(pubsub, 'importantEmail'));

                              case 3:
                              case "end":
                                return _context5.stop();
                            }
                          }
                        }, _callee5, this);
                      }));

                      return function subscribe() {
                        return _subscribe.apply(this, arguments);
                      };
                    }()
                  }
                }
              })
            });
            ast = parse("\n      subscription {\n        importantEmail\n      }\n    ");
            _context6.next = 5;
            return subscribe(schema, ast);

          case 5:
            subscription = _context6.sent;
            pubsub.emit('importantEmail', {
              importantEmail: {}
            });
            _context6.next = 9;
            return subscription.next();

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  })));
  it('should only resolve the first field of invalid multi-field',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var didResolveImportantEmail, didResolveNonImportantEmail, SubscriptionTypeMultiple, testSchema, ast, subscription;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            didResolveImportantEmail = false;
            didResolveNonImportantEmail = false;
            SubscriptionTypeMultiple = new GraphQLObjectType({
              name: 'Subscription',
              fields: {
                importantEmail: {
                  type: EmailEventType,
                  subscribe: function subscribe() {
                    didResolveImportantEmail = true;
                    return eventEmitterAsyncIterator(new EventEmitter(), 'event');
                  }
                },
                nonImportantEmail: {
                  type: EmailEventType,
                  subscribe: function subscribe() {
                    didResolveNonImportantEmail = true;
                    return eventEmitterAsyncIterator(new EventEmitter(), 'event');
                  }
                }
              }
            });
            testSchema = new GraphQLSchema({
              query: QueryType,
              subscription: SubscriptionTypeMultiple
            });
            ast = parse("\n      subscription {\n        importantEmail\n        nonImportantEmail\n      }\n    ");
            _context7.next = 7;
            return subscribe(testSchema, ast);

          case 7:
            subscription = _context7.sent;
            subscription.next(); // Ask for a result, but ignore it.

            expect(didResolveImportantEmail).to.equal(true);
            expect(didResolveNonImportantEmail).to.equal(false); // Close subscription

            subscription.return();

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  })));
  it('throws an error if schema is missing',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8() {
    var document;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            document = parse("\n      subscription {\n        importantEmail\n      }\n    ");
            _context8.next = 3;
            return expectPromiseToThrow(function () {
              return subscribe(null, document);
            }, 'Expected null to be a GraphQL schema.');

          case 3:
            _context8.next = 5;
            return expectPromiseToThrow(function () {
              return subscribe({
                document: document
              });
            }, 'Expected undefined to be a GraphQL schema.');

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  })));
  it('throws an error if document is missing',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return expectPromiseToThrow(function () {
              return subscribe(emailSchema, null);
            }, 'Must provide document');

          case 2:
            _context9.next = 4;
            return expectPromiseToThrow(function () {
              return subscribe({
                schema: emailSchema
              });
            }, 'Must provide document');

          case 4:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  })));
  it('resolves to an error for unknown subscription field',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10() {
    var ast, pubsub, _ref14, subscription;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            ast = parse("\n      subscription {\n        unknownField\n      }\n    ");
            pubsub = new EventEmitter();
            _context10.next = 4;
            return createSubscription(pubsub, emailSchema, ast);

          case 4:
            _ref14 = _context10.sent;
            subscription = _ref14.subscription;
            expect(subscription).to.deep.equal({
              errors: [{
                message: 'The subscription field "unknownField" is not defined.',
                locations: [{
                  line: 3,
                  column: 9
                }]
              }]
            });

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  })));
  it('throws an error if subscribe does not return an iterator',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11() {
    var invalidEmailSchema, pubsub;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            invalidEmailSchema = new GraphQLSchema({
              query: QueryType,
              subscription: new GraphQLObjectType({
                name: 'Subscription',
                fields: {
                  importantEmail: {
                    type: GraphQLString,
                    subscribe: function subscribe() {
                      return 'test';
                    }
                  }
                }
              })
            });
            pubsub = new EventEmitter();
            _context11.next = 4;
            return expectPromiseToThrow(function () {
              return createSubscription(pubsub, invalidEmailSchema);
            }, 'Subscription field must return Async Iterable. Received: test');

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  })));
  it('resolves to an error for subscription resolver errors',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15() {
    var subscriptionReturningErrorSchema, subscriptionThrowingErrorSchema, subscriptionResolvingErrorSchema, subscriptionRejectingErrorSchema, testReportsError, _testReportsError;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _testReportsError = function _ref20() {
              _testReportsError = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee14(schema) {
                var result;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return subscribe(schema, parse("\n          subscription {\n            importantEmail\n          }\n        "));

                      case 2:
                        result = _context14.sent;
                        expect(result).to.deep.equal({
                          errors: [{
                            message: 'test error',
                            locations: [{
                              line: 3,
                              column: 13
                            }],
                            path: ['importantEmail']
                          }]
                        });

                      case 4:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14, this);
              }));
              return _testReportsError.apply(this, arguments);
            };

            testReportsError = function _ref19(_x4) {
              return _testReportsError.apply(this, arguments);
            };

            // Returning an error
            subscriptionReturningErrorSchema = emailSchemaWithResolvers(function () {
              return new Error('test error');
            });
            _context15.next = 5;
            return testReportsError(subscriptionReturningErrorSchema);

          case 5:
            // Throwing an error
            subscriptionThrowingErrorSchema = emailSchemaWithResolvers(function () {
              throw new Error('test error');
            });
            _context15.next = 8;
            return testReportsError(subscriptionThrowingErrorSchema);

          case 8:
            // Resolving to an error
            subscriptionResolvingErrorSchema = emailSchemaWithResolvers(
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee12() {
              return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      return _context12.abrupt("return", new Error('test error'));

                    case 1:
                    case "end":
                      return _context12.stop();
                  }
                }
              }, _callee12, this);
            })));
            _context15.next = 11;
            return testReportsError(subscriptionResolvingErrorSchema);

          case 11:
            // Rejecting with an error
            subscriptionRejectingErrorSchema = emailSchemaWithResolvers(
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee13() {
              return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      throw new Error('test error');

                    case 1:
                    case "end":
                      return _context13.stop();
                  }
                }
              }, _callee13, this);
            })));
            _context15.next = 14;
            return testReportsError(subscriptionRejectingErrorSchema);

          case 14:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, this);
  })));
  it('resolves to an error if variables were wrong type',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16() {
    var ast, pubsub, data, result;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            // If we receive variables that cannot be coerced correctly, subscribe()
            // will resolve to an ExecutionResult that contains an informative error
            // description.
            ast = parse("\n      subscription ($priority: Int) {\n        importantEmail(priority: $priority) {\n          email {\n            from\n            subject\n          }\n          inbox {\n            unread\n            total\n          }\n        }\n      }\n    ");
            pubsub = new EventEmitter();
            data = {
              inbox: {
                emails: [{
                  from: 'joe@graphql.org',
                  subject: 'Hello',
                  message: 'Hello World',
                  unread: false
                }]
              },
              importantEmail: function importantEmail() {
                return eventEmitterAsyncIterator(pubsub, 'importantEmail');
              }
            };
            _context16.next = 5;
            return subscribe(emailSchema, ast, data, null, {
              priority: 'meow'
            });

          case 5:
            result = _context16.sent;
            expect(result).to.deep.equal({
              errors: [{
                message: 'Variable "$priority" got invalid value "meow"; Expected ' + 'type Int; Int cannot represent non 32-bit signed ' + 'integer value: meow',
                locations: [{
                  line: 2,
                  column: 21
                }]
              }]
            });
            expect(result.errors[0].originalError).not.to.equal(undefined);

          case 8:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, this);
  })));
}); // Once a subscription returns a valid AsyncIterator, it can still yield
// errors.

describe('Subscription Publish Phase', function () {
  it('produces a payload for multiple subscribe in same subscription',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17() {
    var pubsub, _ref23, sendImportantEmail, subscription, second, payload1, payload2, expectedPayload;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            pubsub = new EventEmitter();
            _context17.next = 3;
            return createSubscription(pubsub);

          case 3:
            _ref23 = _context17.sent;
            sendImportantEmail = _ref23.sendImportantEmail;
            subscription = _ref23.subscription;
            _context17.next = 8;
            return createSubscription(pubsub);

          case 8:
            second = _context17.sent;
            payload1 = subscription.next();
            payload2 = second.subscription.next();
            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Alright',
              message: 'Tests are good',
              unread: true
            })).to.equal(true);
            expectedPayload = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'yuzhi@graphql.org',
                      subject: 'Alright'
                    },
                    inbox: {
                      unread: 1,
                      total: 2
                    }
                  }
                }
              }
            };
            _context17.t0 = expect;
            _context17.next = 16;
            return payload1;

          case 16:
            _context17.t1 = _context17.sent;
            _context17.t2 = expectedPayload;
            (0, _context17.t0)(_context17.t1).to.deep.equal(_context17.t2);
            _context17.t3 = expect;
            _context17.next = 22;
            return payload2;

          case 22:
            _context17.t4 = _context17.sent;
            _context17.t5 = expectedPayload;
            (0, _context17.t3)(_context17.t4).to.deep.equal(_context17.t5);

          case 25:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, this);
  })));
  it('produces a payload per subscription event',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18() {
    var pubsub, _ref25, sendImportantEmail, subscription, payload;

    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            pubsub = new EventEmitter();
            _context18.next = 3;
            return createSubscription(pubsub);

          case 3:
            _ref25 = _context18.sent;
            sendImportantEmail = _ref25.sendImportantEmail;
            subscription = _ref25.subscription;
            // Wait for the next subscription payload.
            payload = subscription.next(); // A new email arrives!

            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Alright',
              message: 'Tests are good',
              unread: true
            })).to.equal(true); // The previously waited on payload now has a value.

            _context18.t0 = expect;
            _context18.next = 11;
            return payload;

          case 11:
            _context18.t1 = _context18.sent;
            _context18.t2 = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'yuzhi@graphql.org',
                      subject: 'Alright'
                    },
                    inbox: {
                      unread: 1,
                      total: 2
                    }
                  }
                }
              }
            };
            (0, _context18.t0)(_context18.t1).to.deep.equal(_context18.t2);
            // Another new email arrives, before subscription.next() is called.
            expect(sendImportantEmail({
              from: 'hyo@graphql.org',
              subject: 'Tools',
              message: 'I <3 making things',
              unread: true
            })).to.equal(true); // The next waited on payload will have a value.

            _context18.t3 = expect;
            _context18.next = 18;
            return subscription.next();

          case 18:
            _context18.t4 = _context18.sent;
            _context18.t5 = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'hyo@graphql.org',
                      subject: 'Tools'
                    },
                    inbox: {
                      unread: 2,
                      total: 3
                    }
                  }
                }
              }
            };
            (0, _context18.t3)(_context18.t4).to.deep.equal(_context18.t5);
            _context18.t6 = expect;
            _context18.next = 24;
            return subscription.return();

          case 24:
            _context18.t7 = _context18.sent;
            _context18.t8 = {
              done: true,
              value: undefined
            };
            (0, _context18.t6)(_context18.t7).to.deep.equal(_context18.t8);
            // Which may result in disconnecting upstream services as well.
            expect(sendImportantEmail({
              from: 'adam@graphql.org',
              subject: 'Important',
              message: 'Read me please',
              unread: true
            })).to.equal(false); // No more listeners.
            // Awaiting a subscription after closing it results in completed results.

            _context18.t9 = expect;
            _context18.next = 31;
            return subscription.next();

          case 31:
            _context18.t10 = _context18.sent;
            _context18.t11 = {
              done: true,
              value: undefined
            };
            (0, _context18.t9)(_context18.t10).to.deep.equal(_context18.t11);

          case 34:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, this);
  })));
  it('produces a payload when there are multiple events',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19() {
    var pubsub, _ref27, sendImportantEmail, subscription, payload;

    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            pubsub = new EventEmitter();
            _context19.next = 3;
            return createSubscription(pubsub);

          case 3:
            _ref27 = _context19.sent;
            sendImportantEmail = _ref27.sendImportantEmail;
            subscription = _ref27.subscription;
            payload = subscription.next(); // A new email arrives!

            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Alright',
              message: 'Tests are good',
              unread: true
            })).to.equal(true);
            _context19.t0 = expect;
            _context19.next = 11;
            return payload;

          case 11:
            _context19.t1 = _context19.sent;
            _context19.t2 = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'yuzhi@graphql.org',
                      subject: 'Alright'
                    },
                    inbox: {
                      unread: 1,
                      total: 2
                    }
                  }
                }
              }
            };
            (0, _context19.t0)(_context19.t1).to.deep.equal(_context19.t2);
            payload = subscription.next(); // A new email arrives!

            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Alright 2',
              message: 'Tests are good 2',
              unread: true
            })).to.equal(true);
            _context19.t3 = expect;
            _context19.next = 19;
            return payload;

          case 19:
            _context19.t4 = _context19.sent;
            _context19.t5 = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'yuzhi@graphql.org',
                      subject: 'Alright 2'
                    },
                    inbox: {
                      unread: 2,
                      total: 3
                    }
                  }
                }
              }
            };
            (0, _context19.t3)(_context19.t4).to.deep.equal(_context19.t5);

          case 22:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, this);
  })));
  it('should not trigger when subscription is already done',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20() {
    var pubsub, _ref29, sendImportantEmail, subscription, payload;

    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            pubsub = new EventEmitter();
            _context20.next = 3;
            return createSubscription(pubsub);

          case 3:
            _ref29 = _context20.sent;
            sendImportantEmail = _ref29.sendImportantEmail;
            subscription = _ref29.subscription;
            payload = subscription.next(); // A new email arrives!

            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Alright',
              message: 'Tests are good',
              unread: true
            })).to.equal(true);
            _context20.t0 = expect;
            _context20.next = 11;
            return payload;

          case 11:
            _context20.t1 = _context20.sent;
            _context20.t2 = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'yuzhi@graphql.org',
                      subject: 'Alright'
                    },
                    inbox: {
                      unread: 1,
                      total: 2
                    }
                  }
                }
              }
            };
            (0, _context20.t0)(_context20.t1).to.deep.equal(_context20.t2);
            payload = subscription.next();
            subscription.return(); // A new email arrives!

            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Alright 2',
              message: 'Tests are good 2',
              unread: true
            })).to.equal(false);
            _context20.t3 = expect;
            _context20.next = 20;
            return payload;

          case 20:
            _context20.t4 = _context20.sent;
            _context20.t5 = {
              done: true,
              value: undefined
            };
            (0, _context20.t3)(_context20.t4).to.deep.equal(_context20.t5);

          case 23:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, this);
  })));
  it('event order is correct for multiple publishes',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee21() {
    var pubsub, _ref31, sendImportantEmail, subscription, payload;

    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            pubsub = new EventEmitter();
            _context21.next = 3;
            return createSubscription(pubsub);

          case 3:
            _ref31 = _context21.sent;
            sendImportantEmail = _ref31.sendImportantEmail;
            subscription = _ref31.subscription;
            payload = subscription.next(); // A new email arrives!

            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Message',
              message: 'Tests are good',
              unread: true
            })).to.equal(true); // A new email arrives!

            expect(sendImportantEmail({
              from: 'yuzhi@graphql.org',
              subject: 'Message 2',
              message: 'Tests are good 2',
              unread: true
            })).to.equal(true);
            _context21.t0 = expect;
            _context21.next = 12;
            return payload;

          case 12:
            _context21.t1 = _context21.sent;
            _context21.t2 = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'yuzhi@graphql.org',
                      subject: 'Message'
                    },
                    inbox: {
                      unread: 2,
                      total: 3
                    }
                  }
                }
              }
            };
            (0, _context21.t0)(_context21.t1).to.deep.equal(_context21.t2);
            payload = subscription.next();
            _context21.t3 = expect;
            _context21.next = 19;
            return payload;

          case 19:
            _context21.t4 = _context21.sent;
            _context21.t5 = {
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      from: 'yuzhi@graphql.org',
                      subject: 'Message 2'
                    },
                    inbox: {
                      unread: 2,
                      total: 3
                    }
                  }
                }
              }
            };
            (0, _context21.t3)(_context21.t4).to.deep.equal(_context21.t5);

          case 22:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, this);
  })));
  it('should handle error during execution of source event',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee23() {
    var erroringEmailSchema, subscription, payload1, payload2, payload3;
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            erroringEmailSchema = emailSchemaWithResolvers(
            /*#__PURE__*/
            _wrapAsyncGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee22() {
              return regeneratorRuntime.wrap(function _callee22$(_context22) {
                while (1) {
                  switch (_context22.prev = _context22.next) {
                    case 0:
                      _context22.next = 2;
                      return {
                        email: {
                          subject: 'Hello'
                        }
                      };

                    case 2:
                      _context22.next = 4;
                      return {
                        email: {
                          subject: 'Goodbye'
                        }
                      };

                    case 4:
                      _context22.next = 6;
                      return {
                        email: {
                          subject: 'Bonjour'
                        }
                      };

                    case 6:
                    case "end":
                      return _context22.stop();
                  }
                }
              }, _callee22, this);
            })), function (event) {
              if (event.email.subject === 'Goodbye') {
                throw new Error('Never leave.');
              }

              return event;
            });
            _context23.next = 3;
            return subscribe(erroringEmailSchema, parse("\n        subscription {\n          importantEmail {\n            email {\n              subject\n            }\n          }\n        }\n      "));

          case 3:
            subscription = _context23.sent;
            _context23.next = 6;
            return subscription.next();

          case 6:
            payload1 = _context23.sent;
            expect(payload1).to.deep.equal({
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      subject: 'Hello'
                    }
                  }
                }
              }
            }); // An error in execution is presented as such.

            _context23.next = 10;
            return subscription.next();

          case 10:
            payload2 = _context23.sent;
            expect(payload2).to.deep.equal({
              done: false,
              value: {
                errors: [{
                  message: 'Never leave.',
                  locations: [{
                    line: 3,
                    column: 11
                  }],
                  path: ['importantEmail']
                }],
                data: {
                  importantEmail: null
                }
              }
            }); // However that does not close the response event stream. Subsequent
            // events are still executed.

            _context23.next = 14;
            return subscription.next();

          case 14:
            payload3 = _context23.sent;
            expect(payload3).to.deep.equal({
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      subject: 'Bonjour'
                    }
                  }
                }
              }
            });

          case 16:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, this);
  })));
  it('should pass through error thrown in source event stream',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee25() {
    var erroringEmailSchema, subscription, payload1, expectedError, payload2;
    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            erroringEmailSchema = emailSchemaWithResolvers(
            /*#__PURE__*/
            _wrapAsyncGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee24() {
              return regeneratorRuntime.wrap(function _callee24$(_context24) {
                while (1) {
                  switch (_context24.prev = _context24.next) {
                    case 0:
                      _context24.next = 2;
                      return {
                        email: {
                          subject: 'Hello'
                        }
                      };

                    case 2:
                      throw new Error('test error');

                    case 3:
                    case "end":
                      return _context24.stop();
                  }
                }
              }, _callee24, this);
            })), function (email) {
              return email;
            });
            _context25.next = 3;
            return subscribe(erroringEmailSchema, parse("\n        subscription {\n          importantEmail {\n            email {\n              subject\n            }\n          }\n        }\n      "));

          case 3:
            subscription = _context25.sent;
            _context25.next = 6;
            return subscription.next();

          case 6:
            payload1 = _context25.sent;
            expect(payload1).to.deep.equal({
              done: false,
              value: {
                data: {
                  importantEmail: {
                    email: {
                      subject: 'Hello'
                    }
                  }
                }
              }
            });
            _context25.prev = 8;
            _context25.next = 11;
            return subscription.next();

          case 11:
            _context25.next = 16;
            break;

          case 13:
            _context25.prev = 13;
            _context25.t0 = _context25["catch"](8);
            expectedError = _context25.t0;

          case 16:
            expect(expectedError).to.be.instanceof(Error);
            expect(expectedError.message).to.equal('test error');
            _context25.next = 20;
            return subscription.next();

          case 20:
            payload2 = _context25.sent;
            expect(payload2).to.deep.equal({
              done: true,
              value: undefined
            });

          case 22:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, this, [[8, 13]]);
  })));
});