"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _execute = require("../execute");

var _language = require("../../language");

var _type = require("../../type");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

(0, _mocha.describe)('Execute: Handles basic execution tasks', function () {
  (0, _mocha.it)('throws if no document is provided', function () {
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    (0, _chai.expect)(function () {
      return (0, _execute.execute)(schema, null);
    }).to.throw('Must provide document');
  });
  (0, _mocha.it)('throws if no schema is provided', function () {
    (0, _chai.expect)(function () {
      return (0, _execute.execute)({
        document: (0, _language.parse)('{ field }')
      });
    }).to.throw('Expected undefined to be a GraphQL schema.');
  });
  (0, _mocha.it)('accepts an object with named properties as arguments', function () {
    var doc = 'query Example { a }';
    var data = 'rootValue';
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString,
            resolve: function resolve(rootValue) {
              return rootValue;
            }
          }
        }
      })
    });
    var result = (0, _execute.execute)({
      schema: schema,
      document: (0, _language.parse)(doc),
      rootValue: data
    });
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        a: 'rootValue'
      }
    });
  });
  (0, _mocha.it)('executes arbitrary code',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var data, deepData, promiseData, doc, ast, expected, DataType, DeepDataType, schema;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promiseData = function _ref3() {
              return new Promise(function (resolve) {
                process.nextTick(function () {
                  resolve(data);
                });
              });
            };

            data = {
              a: function a() {
                return 'Apple';
              },
              b: function b() {
                return 'Banana';
              },
              c: function c() {
                return 'Cookie';
              },
              d: function d() {
                return 'Donut';
              },
              e: function e() {
                return 'Egg';
              },
              f: 'Fish',
              pic: function pic(size) {
                return 'Pic of size: ' + (size || 50);
              },
              deep: function deep() {
                return deepData;
              },
              promise: function promise() {
                return promiseData();
              }
            };
            deepData = {
              a: function a() {
                return 'Already Been Done';
              },
              b: function b() {
                return 'Boring';
              },
              c: function c() {
                return ['Contrived', undefined, 'Confusing'];
              },
              deeper: function deeper() {
                return [data, null, data];
              }
            };
            doc = "\n      query Example($size: Int) {\n        a,\n        b,\n        x: c\n        ...c\n        f\n        ...on DataType {\n          pic(size: $size)\n          promise {\n            a\n          }\n        }\n        deep {\n          a\n          b\n          c\n          deeper {\n            a\n            b\n          }\n        }\n      }\n\n      fragment c on DataType {\n        d\n        e\n      }\n    ";
            ast = (0, _language.parse)(doc);
            expected = {
              data: {
                a: 'Apple',
                b: 'Banana',
                x: 'Cookie',
                d: 'Donut',
                e: 'Egg',
                f: 'Fish',
                pic: 'Pic of size: 100',
                promise: {
                  a: 'Apple'
                },
                deep: {
                  a: 'Already Been Done',
                  b: 'Boring',
                  c: ['Contrived', null, 'Confusing'],
                  deeper: [{
                    a: 'Apple',
                    b: 'Banana'
                  }, null, {
                    a: 'Apple',
                    b: 'Banana'
                  }]
                }
              }
            };
            DataType = new _type.GraphQLObjectType({
              name: 'DataType',
              fields: function fields() {
                return {
                  a: {
                    type: _type.GraphQLString
                  },
                  b: {
                    type: _type.GraphQLString
                  },
                  c: {
                    type: _type.GraphQLString
                  },
                  d: {
                    type: _type.GraphQLString
                  },
                  e: {
                    type: _type.GraphQLString
                  },
                  f: {
                    type: _type.GraphQLString
                  },
                  pic: {
                    args: {
                      size: {
                        type: _type.GraphQLInt
                      }
                    },
                    type: _type.GraphQLString,
                    resolve: function resolve(obj, _ref2) {
                      var size = _ref2.size;
                      return obj.pic(size);
                    }
                  },
                  deep: {
                    type: DeepDataType
                  },
                  promise: {
                    type: DataType
                  }
                };
              }
            });
            DeepDataType = new _type.GraphQLObjectType({
              name: 'DeepDataType',
              fields: {
                a: {
                  type: _type.GraphQLString
                },
                b: {
                  type: _type.GraphQLString
                },
                c: {
                  type: (0, _type.GraphQLList)(_type.GraphQLString)
                },
                deeper: {
                  type: (0, _type.GraphQLList)(DataType)
                }
              }
            });
            schema = new _type.GraphQLSchema({
              query: DataType
            });
            _context.t0 = _chai.expect;
            _context.next = 12;
            return (0, _execute.execute)(schema, ast, data, null, {
              size: 100
            }, 'Example');

          case 12:
            _context.t1 = _context.sent;
            _context.t2 = expected;
            (0, _context.t0)(_context.t1).to.deep.equal(_context.t2);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  (0, _mocha.it)('merges parallel fragments', function () {
    var ast = (0, _language.parse)("\n      { a, ...FragOne, ...FragTwo }\n\n      fragment FragOne on Type {\n        b\n        deep { b, deeper: deep { b } }\n      }\n\n      fragment FragTwo on Type {\n        c\n        deep { c, deeper: deep { c } }\n      }\n    ");
    var Type = new _type.GraphQLObjectType({
      name: 'Type',
      fields: function fields() {
        return {
          a: {
            type: _type.GraphQLString,
            resolve: function resolve() {
              return 'Apple';
            }
          },
          b: {
            type: _type.GraphQLString,
            resolve: function resolve() {
              return 'Banana';
            }
          },
          c: {
            type: _type.GraphQLString,
            resolve: function resolve() {
              return 'Cherry';
            }
          },
          deep: {
            type: Type,
            resolve: function resolve() {
              return {};
            }
          }
        };
      }
    });
    var schema = new _type.GraphQLSchema({
      query: Type
    });
    (0, _chai.expect)((0, _execute.execute)(schema, ast)).to.deep.equal({
      data: {
        a: 'Apple',
        b: 'Banana',
        c: 'Cherry',
        deep: {
          b: 'Banana',
          c: 'Cherry',
          deeper: {
            b: 'Banana',
            c: 'Cherry'
          }
        }
      }
    });
  });
  (0, _mocha.it)('provides info about current execution state', function () {
    var ast = (0, _language.parse)('query ($var: String) { result: test }');
    var info;
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Test',
        fields: {
          test: {
            type: _type.GraphQLString,
            resolve: function resolve(val, args, ctx, _info) {
              info = _info;
            }
          }
        }
      })
    });
    var rootValue = {
      root: 'val'
    };
    (0, _execute.execute)(schema, ast, rootValue, null, {
      var: 123
    });
    (0, _chai.expect)(Object.keys(info)).to.deep.equal(['fieldName', 'fieldNodes', 'returnType', 'parentType', 'path', 'schema', 'fragments', 'rootValue', 'operation', 'variableValues']);
    (0, _chai.expect)(info.fieldName).to.equal('test');
    (0, _chai.expect)(info.fieldNodes).to.have.lengthOf(1);
    (0, _chai.expect)(info.fieldNodes[0]).to.equal(ast.definitions[0].selectionSet.selections[0]);
    (0, _chai.expect)(info.returnType).to.equal(_type.GraphQLString);
    (0, _chai.expect)(info.parentType).to.equal(schema.getQueryType());
    (0, _chai.expect)(info.path).to.deep.equal({
      prev: undefined,
      key: 'result'
    });
    (0, _chai.expect)(info.schema).to.equal(schema);
    (0, _chai.expect)(info.rootValue).to.equal(rootValue);
    (0, _chai.expect)(info.operation).to.equal(ast.definitions[0]);
    (0, _chai.expect)(info.variableValues).to.deep.equal({
      var: '123'
    });
  });
  (0, _mocha.it)('threads root value context correctly', function () {
    var doc = 'query Example { a }';
    var data = {
      contextThing: 'thing'
    };
    var resolvedRootValue;
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString,
            resolve: function resolve(rootValue) {
              resolvedRootValue = rootValue;
            }
          }
        }
      })
    });
    (0, _execute.execute)(schema, (0, _language.parse)(doc), data);
    (0, _chai.expect)(resolvedRootValue.contextThing).to.equal('thing');
  });
  (0, _mocha.it)('correctly threads arguments', function () {
    var doc = "\n      query Example {\n        b(numArg: 123, stringArg: \"foo\")\n      }\n    ";
    var resolvedArgs;
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          b: {
            args: {
              numArg: {
                type: _type.GraphQLInt
              },
              stringArg: {
                type: _type.GraphQLString
              }
            },
            type: _type.GraphQLString,
            resolve: function resolve(_, args) {
              resolvedArgs = args;
            }
          }
        }
      })
    });
    (0, _execute.execute)(schema, (0, _language.parse)(doc));
    (0, _chai.expect)(resolvedArgs.numArg).to.equal(123);
    (0, _chai.expect)(resolvedArgs.stringArg).to.equal('foo');
  });
  (0, _mocha.it)('nulls out error subtrees',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var doc, data, ast, schema, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            doc = "{\n      sync\n      syncError\n      syncRawError\n      syncReturnError\n      syncReturnErrorList\n      async\n      asyncReject\n      asyncRawReject\n      asyncEmptyReject\n      asyncError\n      asyncRawError\n      asyncReturnError\n      asyncReturnErrorWithExtensions\n    }";
            data = {
              sync: function sync() {
                return 'sync';
              },
              syncError: function syncError() {
                throw new Error('Error getting syncError');
              },
              syncRawError: function syncRawError() {
                // eslint-disable-next-line no-throw-literal
                throw 'Error getting syncRawError';
              },
              syncReturnError: function syncReturnError() {
                return new Error('Error getting syncReturnError');
              },
              syncReturnErrorList: function syncReturnErrorList() {
                return ['sync0', new Error('Error getting syncReturnErrorList1'), 'sync2', new Error('Error getting syncReturnErrorList3')];
              },
              async: function async() {
                return new Promise(function (resolve) {
                  return resolve('async');
                });
              },
              asyncReject: function asyncReject() {
                return new Promise(function (_, reject) {
                  return reject(new Error('Error getting asyncReject'));
                });
              },
              asyncRawReject: function asyncRawReject() {
                return Promise.reject('Error getting asyncRawReject');
              },
              asyncEmptyReject: function asyncEmptyReject() {
                return Promise.reject();
              },
              asyncError: function asyncError() {
                return new Promise(function () {
                  throw new Error('Error getting asyncError');
                });
              },
              asyncRawError: function asyncRawError() {
                return new Promise(function () {
                  /* eslint-disable */
                  throw 'Error getting asyncRawError';
                  /* eslint-enable */
                });
              },
              asyncReturnError: function asyncReturnError() {
                return Promise.resolve(new Error('Error getting asyncReturnError'));
              },
              asyncReturnErrorWithExtensions: function asyncReturnErrorWithExtensions() {
                var error = new Error('Error getting asyncReturnErrorWithExtensions');
                error.extensions = {
                  foo: 'bar'
                };
                return Promise.resolve(error);
              }
            };
            ast = (0, _language.parse)(doc);
            schema = new _type.GraphQLSchema({
              query: new _type.GraphQLObjectType({
                name: 'Type',
                fields: {
                  sync: {
                    type: _type.GraphQLString
                  },
                  syncError: {
                    type: _type.GraphQLString
                  },
                  syncRawError: {
                    type: _type.GraphQLString
                  },
                  syncReturnError: {
                    type: _type.GraphQLString
                  },
                  syncReturnErrorList: {
                    type: (0, _type.GraphQLList)(_type.GraphQLString)
                  },
                  async: {
                    type: _type.GraphQLString
                  },
                  asyncReject: {
                    type: _type.GraphQLString
                  },
                  asyncRejectWithExtensions: {
                    type: _type.GraphQLString
                  },
                  asyncRawReject: {
                    type: _type.GraphQLString
                  },
                  asyncEmptyReject: {
                    type: _type.GraphQLString
                  },
                  asyncError: {
                    type: _type.GraphQLString
                  },
                  asyncRawError: {
                    type: _type.GraphQLString
                  },
                  asyncReturnError: {
                    type: _type.GraphQLString
                  },
                  asyncReturnErrorWithExtensions: {
                    type: _type.GraphQLString
                  }
                }
              })
            });
            _context2.next = 6;
            return (0, _execute.execute)(schema, ast, data);

          case 6:
            result = _context2.sent;
            (0, _chai.expect)(result).to.deep.equal({
              data: {
                sync: 'sync',
                syncError: null,
                syncRawError: null,
                syncReturnError: null,
                syncReturnErrorList: ['sync0', null, 'sync2', null],
                async: 'async',
                asyncReject: null,
                asyncRawReject: null,
                asyncEmptyReject: null,
                asyncError: null,
                asyncRawError: null,
                asyncReturnError: null,
                asyncReturnErrorWithExtensions: null
              },
              errors: [{
                message: 'Error getting syncError',
                locations: [{
                  line: 3,
                  column: 7
                }],
                path: ['syncError']
              }, {
                message: 'Error getting syncRawError',
                locations: [{
                  line: 4,
                  column: 7
                }],
                path: ['syncRawError']
              }, {
                message: 'Error getting syncReturnError',
                locations: [{
                  line: 5,
                  column: 7
                }],
                path: ['syncReturnError']
              }, {
                message: 'Error getting syncReturnErrorList1',
                locations: [{
                  line: 6,
                  column: 7
                }],
                path: ['syncReturnErrorList', 1]
              }, {
                message: 'Error getting syncReturnErrorList3',
                locations: [{
                  line: 6,
                  column: 7
                }],
                path: ['syncReturnErrorList', 3]
              }, {
                message: 'Error getting asyncReject',
                locations: [{
                  line: 8,
                  column: 7
                }],
                path: ['asyncReject']
              }, {
                message: 'Error getting asyncRawReject',
                locations: [{
                  line: 9,
                  column: 7
                }],
                path: ['asyncRawReject']
              }, {
                message: '',
                locations: [{
                  line: 10,
                  column: 7
                }],
                path: ['asyncEmptyReject']
              }, {
                message: 'Error getting asyncError',
                locations: [{
                  line: 11,
                  column: 7
                }],
                path: ['asyncError']
              }, {
                message: 'Error getting asyncRawError',
                locations: [{
                  line: 12,
                  column: 7
                }],
                path: ['asyncRawError']
              }, {
                message: 'Error getting asyncReturnError',
                locations: [{
                  line: 13,
                  column: 7
                }],
                path: ['asyncReturnError']
              }, {
                message: 'Error getting asyncReturnErrorWithExtensions',
                locations: [{
                  line: 14,
                  column: 7
                }],
                path: ['asyncReturnErrorWithExtensions'],
                extensions: {
                  foo: 'bar'
                }
              }]
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  (0, _mocha.it)('nulls error subtree for promise rejection #1071',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var query, schema, ast, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = "\n      query {\n        foods {\n          name\n        }\n      }\n    ";
            schema = new _type.GraphQLSchema({
              query: new _type.GraphQLObjectType({
                name: 'Query',
                fields: {
                  foods: {
                    type: (0, _type.GraphQLList)(new _type.GraphQLObjectType({
                      name: 'Food',
                      fields: {
                        name: {
                          type: _type.GraphQLString
                        }
                      }
                    })),
                    resolve: function resolve() {
                      return Promise.reject(new Error('Dangit'));
                    }
                  }
                }
              })
            });
            ast = (0, _language.parse)(query);
            _context3.next = 5;
            return (0, _execute.execute)(schema, ast);

          case 5:
            result = _context3.sent;
            (0, _chai.expect)(result).to.deep.equal({
              data: {
                foods: null
              },
              errors: [{
                locations: [{
                  column: 9,
                  line: 3
                }],
                message: 'Dangit',
                path: ['foods']
              }]
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  (0, _mocha.it)('Full response path is included for non-nullable fields', function () {
    var A = new _type.GraphQLObjectType({
      name: 'A',
      fields: function fields() {
        return {
          nullableA: {
            type: A,
            resolve: function resolve() {
              return {};
            }
          },
          nonNullA: {
            type: (0, _type.GraphQLNonNull)(A),
            resolve: function resolve() {
              return {};
            }
          },
          throws: {
            type: (0, _type.GraphQLNonNull)(_type.GraphQLString),
            resolve: function resolve() {
              throw new Error('Catch me if you can');
            }
          }
        };
      }
    });
    var queryType = new _type.GraphQLObjectType({
      name: 'query',
      fields: function fields() {
        return {
          nullableA: {
            type: A,
            resolve: function resolve() {
              return {};
            }
          }
        };
      }
    });
    var schema = new _type.GraphQLSchema({
      query: queryType
    });
    var query = "\n      query {\n        nullableA {\n          aliasedA: nullableA {\n            nonNullA {\n              anotherA: nonNullA {\n                throws\n              }\n            }\n          }\n        }\n      }\n    ";
    var result = (0, _execute.execute)(schema, (0, _language.parse)(query));
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        nullableA: {
          aliasedA: null
        }
      },
      errors: [{
        message: 'Catch me if you can',
        locations: [{
          line: 7,
          column: 17
        }],
        path: ['nullableA', 'aliasedA', 'nonNullA', 'anotherA', 'throws']
      }]
    });
  });
  (0, _mocha.it)('uses the inline operation if no operation name is provided', function () {
    var doc = '{ a }';
    var data = {
      a: 'b'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var result = (0, _execute.execute)(schema, ast, data);
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  (0, _mocha.it)('uses the only operation if no operation name is provided', function () {
    var doc = 'query Example { a }';
    var data = {
      a: 'b'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var result = (0, _execute.execute)(schema, ast, data);
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  (0, _mocha.it)('uses the named operation if operation name is provided', function () {
    var doc = 'query Example { first: a } query OtherExample { second: a }';
    var data = {
      a: 'b'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var result = (0, _execute.execute)(schema, ast, data, null, null, 'OtherExample');
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        second: 'b'
      }
    });
  });
  (0, _mocha.it)('provides error if no operation is provided', function () {
    var doc = 'fragment Example on Type { a }';
    var data = {
      a: 'b'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var result = (0, _execute.execute)(schema, ast, data);
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Must provide an operation.'
      }]
    });
  });
  (0, _mocha.it)('errors if no op name is provided with multiple operations', function () {
    var doc = 'query Example { a } query OtherExample { a }';
    var data = {
      a: 'b'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var result = (0, _execute.execute)(schema, ast, data);
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Must provide operation name if query contains multiple operations.'
      }]
    });
  });
  (0, _mocha.it)('errors if unknown operation name is provided', function () {
    var doc = 'query Example { a } query OtherExample { a }';
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var result = (0, _execute.execute)({
      schema: schema,
      document: ast,
      operationName: 'UnknownExample'
    });
    (0, _chai.expect)(result).to.deep.equal({
      errors: [{
        message: 'Unknown operation named "UnknownExample".'
      }]
    });
  });
  (0, _mocha.it)('uses the query schema for queries', function () {
    var doc = 'query Q { a } mutation M { c } subscription S { a }';
    var data = {
      a: 'b',
      c: 'd'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      }),
      mutation: new _type.GraphQLObjectType({
        name: 'M',
        fields: {
          c: {
            type: _type.GraphQLString
          }
        }
      }),
      subscription: new _type.GraphQLObjectType({
        name: 'S',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var queryResult = (0, _execute.execute)(schema, ast, data, null, {}, 'Q');
    (0, _chai.expect)(queryResult).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  (0, _mocha.it)('uses the mutation schema for mutations', function () {
    var doc = 'query Q { a } mutation M { c }';
    var data = {
      a: 'b',
      c: 'd'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      }),
      mutation: new _type.GraphQLObjectType({
        name: 'M',
        fields: {
          c: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var mutationResult = (0, _execute.execute)(schema, ast, data, null, {}, 'M');
    (0, _chai.expect)(mutationResult).to.deep.equal({
      data: {
        c: 'd'
      }
    });
  });
  (0, _mocha.it)('uses the subscription schema for subscriptions', function () {
    var doc = 'query Q { a } subscription S { a }';
    var data = {
      a: 'b',
      c: 'd'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      }),
      subscription: new _type.GraphQLObjectType({
        name: 'S',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var subscriptionResult = (0, _execute.execute)(schema, ast, data, null, {}, 'S');
    (0, _chai.expect)(subscriptionResult).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  (0, _mocha.it)('correct field ordering despite execution order',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var doc, data, ast, schema, result;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            doc = "{\n      a,\n      b,\n      c,\n      d,\n      e\n    }";
            data = {
              a: function a() {
                return 'a';
              },
              b: function b() {
                return new Promise(function (resolve) {
                  return resolve('b');
                });
              },
              c: function c() {
                return 'c';
              },
              d: function d() {
                return new Promise(function (resolve) {
                  return resolve('d');
                });
              },
              e: function e() {
                return 'e';
              }
            };
            ast = (0, _language.parse)(doc);
            schema = new _type.GraphQLSchema({
              query: new _type.GraphQLObjectType({
                name: 'Type',
                fields: {
                  a: {
                    type: _type.GraphQLString
                  },
                  b: {
                    type: _type.GraphQLString
                  },
                  c: {
                    type: _type.GraphQLString
                  },
                  d: {
                    type: _type.GraphQLString
                  },
                  e: {
                    type: _type.GraphQLString
                  }
                }
              })
            });
            _context4.next = 6;
            return (0, _execute.execute)(schema, ast, data);

          case 6:
            result = _context4.sent;
            (0, _chai.expect)(result).to.deep.equal({
              data: {
                a: 'a',
                b: 'b',
                c: 'c',
                d: 'd',
                e: 'e'
              }
            });
            (0, _chai.expect)(Object.keys(result.data)).to.deep.equal(['a', 'b', 'c', 'd', 'e']);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  (0, _mocha.it)('Avoids recursion', function () {
    var doc = "\n      query Q {\n        a\n        ...Frag\n        ...Frag\n      }\n\n      fragment Frag on Type {\n        a,\n        ...Frag\n      }\n    ";
    var data = {
      a: 'b'
    };
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var queryResult = (0, _execute.execute)(schema, ast, data, null, {}, 'Q');
    (0, _chai.expect)(queryResult).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  (0, _mocha.it)('does not include illegal fields in output', function () {
    var doc = "mutation M {\n      thisIsIllegalDontIncludeMe\n    }";
    var ast = (0, _language.parse)(doc);
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: _type.GraphQLString
          }
        }
      }),
      mutation: new _type.GraphQLObjectType({
        name: 'M',
        fields: {
          c: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var mutationResult = (0, _execute.execute)(schema, ast);
    (0, _chai.expect)(mutationResult).to.deep.equal({
      data: {}
    });
  });
  (0, _mocha.it)('does not include arguments that were not set', function () {
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Type',
        fields: {
          field: {
            type: _type.GraphQLString,
            resolve: function resolve(data, args) {
              return args && JSON.stringify(args);
            },
            args: {
              a: {
                type: _type.GraphQLBoolean
              },
              b: {
                type: _type.GraphQLBoolean
              },
              c: {
                type: _type.GraphQLBoolean
              },
              d: {
                type: _type.GraphQLInt
              },
              e: {
                type: _type.GraphQLInt
              }
            }
          }
        }
      })
    });
    var query = (0, _language.parse)('{ field(a: true, c: false, e: 0) }');
    var result = (0, _execute.execute)(schema, query);
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        field: '{"a":true,"c":false,"e":0}'
      }
    });
  });
  (0, _mocha.it)('fails when an isTypeOf check is not met', function () {
    var Special = function Special(value) {
      this.value = value;
    };

    var NotSpecial = function NotSpecial(value) {
      this.value = value;
    };

    var SpecialType = new _type.GraphQLObjectType({
      name: 'SpecialType',
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Special;
      },
      fields: {
        value: {
          type: _type.GraphQLString
        }
      }
    });
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Query',
        fields: {
          specials: {
            type: (0, _type.GraphQLList)(SpecialType),
            resolve: function resolve(rootValue) {
              return rootValue.specials;
            }
          }
        }
      })
    });
    var query = (0, _language.parse)('{ specials { value } }');
    var value = {
      specials: [new Special('foo'), new NotSpecial('bar')]
    };
    var result = (0, _execute.execute)(schema, query, value);
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        specials: [{
          value: 'foo'
        }, null]
      },
      errors: [{
        message: 'Expected value of type "SpecialType" but got: [object Object].',
        locations: [{
          line: 1,
          column: 3
        }],
        path: ['specials', 1]
      }]
    });
  });
  (0, _mocha.it)('executes ignoring invalid non-executable definitions', function () {
    var query = (0, _language.parse)("\n      { foo }\n\n      type Query { bar: String }\n    ");
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Query',
        fields: {
          foo: {
            type: _type.GraphQLString
          }
        }
      })
    });
    var result = (0, _execute.execute)(schema, query);
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        foo: null
      }
    });
  });
  (0, _mocha.it)('uses a custom field resolver', function () {
    var document = (0, _language.parse)('{ foo }');
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'Query',
        fields: {
          foo: {
            type: _type.GraphQLString
          }
        }
      })
    }); // For the purposes of test, just return the name of the field!

    function customResolver(source, args, context, info) {
      return info.fieldName;
    }

    var result = (0, _execute.execute)({
      schema: schema,
      document: document,
      fieldResolver: customResolver
    });
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        foo: 'foo'
      }
    });
  });
});