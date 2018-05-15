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
import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLString, GraphQLNonNull } from '../../type';
describe('Execute: Handles basic execution tasks', function () {
  it('throws if no document is provided', function () {
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    expect(function () {
      return execute(schema, null);
    }).to.throw('Must provide document');
  });
  it('throws if no schema is provided', function () {
    expect(function () {
      return execute({
        document: parse('{ field }')
      });
    }).to.throw('Expected undefined to be a GraphQL schema.');
  });
  it('accepts an object with named properties as arguments', function () {
    var doc = 'query Example { a }';
    var data = 'rootValue';
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString,
            resolve: function resolve(rootValue) {
              return rootValue;
            }
          }
        }
      })
    });
    var result = execute({
      schema: schema,
      document: parse(doc),
      rootValue: data
    });
    expect(result).to.deep.equal({
      data: {
        a: 'rootValue'
      }
    });
  });
  it('executes arbitrary code',
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
            ast = parse(doc);
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
            DataType = new GraphQLObjectType({
              name: 'DataType',
              fields: function fields() {
                return {
                  a: {
                    type: GraphQLString
                  },
                  b: {
                    type: GraphQLString
                  },
                  c: {
                    type: GraphQLString
                  },
                  d: {
                    type: GraphQLString
                  },
                  e: {
                    type: GraphQLString
                  },
                  f: {
                    type: GraphQLString
                  },
                  pic: {
                    args: {
                      size: {
                        type: GraphQLInt
                      }
                    },
                    type: GraphQLString,
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
            DeepDataType = new GraphQLObjectType({
              name: 'DeepDataType',
              fields: {
                a: {
                  type: GraphQLString
                },
                b: {
                  type: GraphQLString
                },
                c: {
                  type: GraphQLList(GraphQLString)
                },
                deeper: {
                  type: GraphQLList(DataType)
                }
              }
            });
            schema = new GraphQLSchema({
              query: DataType
            });
            _context.t0 = expect;
            _context.next = 12;
            return execute(schema, ast, data, null, {
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
  it('merges parallel fragments', function () {
    var ast = parse("\n      { a, ...FragOne, ...FragTwo }\n\n      fragment FragOne on Type {\n        b\n        deep { b, deeper: deep { b } }\n      }\n\n      fragment FragTwo on Type {\n        c\n        deep { c, deeper: deep { c } }\n      }\n    ");
    var Type = new GraphQLObjectType({
      name: 'Type',
      fields: function fields() {
        return {
          a: {
            type: GraphQLString,
            resolve: function resolve() {
              return 'Apple';
            }
          },
          b: {
            type: GraphQLString,
            resolve: function resolve() {
              return 'Banana';
            }
          },
          c: {
            type: GraphQLString,
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
    var schema = new GraphQLSchema({
      query: Type
    });
    expect(execute(schema, ast)).to.deep.equal({
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
  it('provides info about current execution state', function () {
    var ast = parse('query ($var: String) { result: test }');
    var info;
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Test',
        fields: {
          test: {
            type: GraphQLString,
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
    execute(schema, ast, rootValue, null, {
      var: 123
    });
    expect(Object.keys(info)).to.deep.equal(['fieldName', 'fieldNodes', 'returnType', 'parentType', 'path', 'schema', 'fragments', 'rootValue', 'operation', 'variableValues']);
    expect(info.fieldName).to.equal('test');
    expect(info.fieldNodes).to.have.lengthOf(1);
    expect(info.fieldNodes[0]).to.equal(ast.definitions[0].selectionSet.selections[0]);
    expect(info.returnType).to.equal(GraphQLString);
    expect(info.parentType).to.equal(schema.getQueryType());
    expect(info.path).to.deep.equal({
      prev: undefined,
      key: 'result'
    });
    expect(info.schema).to.equal(schema);
    expect(info.rootValue).to.equal(rootValue);
    expect(info.operation).to.equal(ast.definitions[0]);
    expect(info.variableValues).to.deep.equal({
      var: '123'
    });
  });
  it('threads root value context correctly', function () {
    var doc = 'query Example { a }';
    var data = {
      contextThing: 'thing'
    };
    var resolvedRootValue;
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString,
            resolve: function resolve(rootValue) {
              resolvedRootValue = rootValue;
            }
          }
        }
      })
    });
    execute(schema, parse(doc), data);
    expect(resolvedRootValue.contextThing).to.equal('thing');
  });
  it('correctly threads arguments', function () {
    var doc = "\n      query Example {\n        b(numArg: 123, stringArg: \"foo\")\n      }\n    ";
    var resolvedArgs;
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          b: {
            args: {
              numArg: {
                type: GraphQLInt
              },
              stringArg: {
                type: GraphQLString
              }
            },
            type: GraphQLString,
            resolve: function resolve(_, args) {
              resolvedArgs = args;
            }
          }
        }
      })
    });
    execute(schema, parse(doc));
    expect(resolvedArgs.numArg).to.equal(123);
    expect(resolvedArgs.stringArg).to.equal('foo');
  });
  it('nulls out error subtrees',
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
            ast = parse(doc);
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                name: 'Type',
                fields: {
                  sync: {
                    type: GraphQLString
                  },
                  syncError: {
                    type: GraphQLString
                  },
                  syncRawError: {
                    type: GraphQLString
                  },
                  syncReturnError: {
                    type: GraphQLString
                  },
                  syncReturnErrorList: {
                    type: GraphQLList(GraphQLString)
                  },
                  async: {
                    type: GraphQLString
                  },
                  asyncReject: {
                    type: GraphQLString
                  },
                  asyncRejectWithExtensions: {
                    type: GraphQLString
                  },
                  asyncRawReject: {
                    type: GraphQLString
                  },
                  asyncEmptyReject: {
                    type: GraphQLString
                  },
                  asyncError: {
                    type: GraphQLString
                  },
                  asyncRawError: {
                    type: GraphQLString
                  },
                  asyncReturnError: {
                    type: GraphQLString
                  },
                  asyncReturnErrorWithExtensions: {
                    type: GraphQLString
                  }
                }
              })
            });
            _context2.next = 6;
            return execute(schema, ast, data);

          case 6:
            result = _context2.sent;
            expect(result).to.deep.equal({
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
  it('nulls error subtree for promise rejection #1071',
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
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                name: 'Query',
                fields: {
                  foods: {
                    type: GraphQLList(new GraphQLObjectType({
                      name: 'Food',
                      fields: {
                        name: {
                          type: GraphQLString
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
            ast = parse(query);
            _context3.next = 5;
            return execute(schema, ast);

          case 5:
            result = _context3.sent;
            expect(result).to.deep.equal({
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
  it('Full response path is included for non-nullable fields', function () {
    var A = new GraphQLObjectType({
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
            type: GraphQLNonNull(A),
            resolve: function resolve() {
              return {};
            }
          },
          throws: {
            type: GraphQLNonNull(GraphQLString),
            resolve: function resolve() {
              throw new Error('Catch me if you can');
            }
          }
        };
      }
    });
    var queryType = new GraphQLObjectType({
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
    var schema = new GraphQLSchema({
      query: queryType
    });
    var query = "\n      query {\n        nullableA {\n          aliasedA: nullableA {\n            nonNullA {\n              anotherA: nonNullA {\n                throws\n              }\n            }\n          }\n        }\n      }\n    ";
    var result = execute(schema, parse(query));
    expect(result).to.deep.equal({
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
  it('uses the inline operation if no operation name is provided', function () {
    var doc = '{ a }';
    var data = {
      a: 'b'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var result = execute(schema, ast, data);
    expect(result).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  it('uses the only operation if no operation name is provided', function () {
    var doc = 'query Example { a }';
    var data = {
      a: 'b'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var result = execute(schema, ast, data);
    expect(result).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  it('uses the named operation if operation name is provided', function () {
    var doc = 'query Example { first: a } query OtherExample { second: a }';
    var data = {
      a: 'b'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var result = execute(schema, ast, data, null, null, 'OtherExample');
    expect(result).to.deep.equal({
      data: {
        second: 'b'
      }
    });
  });
  it('provides error if no operation is provided', function () {
    var doc = 'fragment Example on Type { a }';
    var data = {
      a: 'b'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var result = execute(schema, ast, data);
    expect(result).to.deep.equal({
      errors: [{
        message: 'Must provide an operation.'
      }]
    });
  });
  it('errors if no op name is provided with multiple operations', function () {
    var doc = 'query Example { a } query OtherExample { a }';
    var data = {
      a: 'b'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var result = execute(schema, ast, data);
    expect(result).to.deep.equal({
      errors: [{
        message: 'Must provide operation name if query contains multiple operations.'
      }]
    });
  });
  it('errors if unknown operation name is provided', function () {
    var doc = 'query Example { a } query OtherExample { a }';
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var result = execute({
      schema: schema,
      document: ast,
      operationName: 'UnknownExample'
    });
    expect(result).to.deep.equal({
      errors: [{
        message: 'Unknown operation named "UnknownExample".'
      }]
    });
  });
  it('uses the query schema for queries', function () {
    var doc = 'query Q { a } mutation M { c } subscription S { a }';
    var data = {
      a: 'b',
      c: 'd'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      }),
      mutation: new GraphQLObjectType({
        name: 'M',
        fields: {
          c: {
            type: GraphQLString
          }
        }
      }),
      subscription: new GraphQLObjectType({
        name: 'S',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var queryResult = execute(schema, ast, data, null, {}, 'Q');
    expect(queryResult).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  it('uses the mutation schema for mutations', function () {
    var doc = 'query Q { a } mutation M { c }';
    var data = {
      a: 'b',
      c: 'd'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      }),
      mutation: new GraphQLObjectType({
        name: 'M',
        fields: {
          c: {
            type: GraphQLString
          }
        }
      })
    });
    var mutationResult = execute(schema, ast, data, null, {}, 'M');
    expect(mutationResult).to.deep.equal({
      data: {
        c: 'd'
      }
    });
  });
  it('uses the subscription schema for subscriptions', function () {
    var doc = 'query Q { a } subscription S { a }';
    var data = {
      a: 'b',
      c: 'd'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      }),
      subscription: new GraphQLObjectType({
        name: 'S',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var subscriptionResult = execute(schema, ast, data, null, {}, 'S');
    expect(subscriptionResult).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  it('correct field ordering despite execution order',
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
            ast = parse(doc);
            schema = new GraphQLSchema({
              query: new GraphQLObjectType({
                name: 'Type',
                fields: {
                  a: {
                    type: GraphQLString
                  },
                  b: {
                    type: GraphQLString
                  },
                  c: {
                    type: GraphQLString
                  },
                  d: {
                    type: GraphQLString
                  },
                  e: {
                    type: GraphQLString
                  }
                }
              })
            });
            _context4.next = 6;
            return execute(schema, ast, data);

          case 6:
            result = _context4.sent;
            expect(result).to.deep.equal({
              data: {
                a: 'a',
                b: 'b',
                c: 'c',
                d: 'd',
                e: 'e'
              }
            });
            expect(Object.keys(result.data)).to.deep.equal(['a', 'b', 'c', 'd', 'e']);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  it('Avoids recursion', function () {
    var doc = "\n      query Q {\n        a\n        ...Frag\n        ...Frag\n      }\n\n      fragment Frag on Type {\n        a,\n        ...Frag\n      }\n    ";
    var data = {
      a: 'b'
    };
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      })
    });
    var queryResult = execute(schema, ast, data, null, {}, 'Q');
    expect(queryResult).to.deep.equal({
      data: {
        a: 'b'
      }
    });
  });
  it('does not include illegal fields in output', function () {
    var doc = "mutation M {\n      thisIsIllegalDontIncludeMe\n    }";
    var ast = parse(doc);
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Q',
        fields: {
          a: {
            type: GraphQLString
          }
        }
      }),
      mutation: new GraphQLObjectType({
        name: 'M',
        fields: {
          c: {
            type: GraphQLString
          }
        }
      })
    });
    var mutationResult = execute(schema, ast);
    expect(mutationResult).to.deep.equal({
      data: {}
    });
  });
  it('does not include arguments that were not set', function () {
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Type',
        fields: {
          field: {
            type: GraphQLString,
            resolve: function resolve(data, args) {
              return args && JSON.stringify(args);
            },
            args: {
              a: {
                type: GraphQLBoolean
              },
              b: {
                type: GraphQLBoolean
              },
              c: {
                type: GraphQLBoolean
              },
              d: {
                type: GraphQLInt
              },
              e: {
                type: GraphQLInt
              }
            }
          }
        }
      })
    });
    var query = parse('{ field(a: true, c: false, e: 0) }');
    var result = execute(schema, query);
    expect(result).to.deep.equal({
      data: {
        field: '{"a":true,"c":false,"e":0}'
      }
    });
  });
  it('fails when an isTypeOf check is not met', function () {
    var Special = function Special(value) {
      this.value = value;
    };

    var NotSpecial = function NotSpecial(value) {
      this.value = value;
    };

    var SpecialType = new GraphQLObjectType({
      name: 'SpecialType',
      isTypeOf: function isTypeOf(obj) {
        return obj instanceof Special;
      },
      fields: {
        value: {
          type: GraphQLString
        }
      }
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          specials: {
            type: GraphQLList(SpecialType),
            resolve: function resolve(rootValue) {
              return rootValue.specials;
            }
          }
        }
      })
    });
    var query = parse('{ specials { value } }');
    var value = {
      specials: [new Special('foo'), new NotSpecial('bar')]
    };
    var result = execute(schema, query, value);
    expect(result).to.deep.equal({
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
  it('executes ignoring invalid non-executable definitions', function () {
    var query = parse("\n      { foo }\n\n      type Query { bar: String }\n    ");
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          foo: {
            type: GraphQLString
          }
        }
      })
    });
    var result = execute(schema, query);
    expect(result).to.deep.equal({
      data: {
        foo: null
      }
    });
  });
  it('uses a custom field resolver', function () {
    var document = parse('{ foo }');
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          foo: {
            type: GraphQLString
          }
        }
      })
    }); // For the purposes of test, just return the name of the field!

    function customResolver(source, args, context, info) {
      return info.fieldName;
    }

    var result = execute({
      schema: schema,
      document: document,
      fieldResolver: customResolver
    });
    expect(result).to.deep.equal({
      data: {
        foo: 'foo'
      }
    });
  });
});