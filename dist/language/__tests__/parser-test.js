"use strict";

var _util = require("util");

var _fs = require("fs");

var _path = require("path");

var _kinds = require("../kinds");

var _chai = require("chai");

var _mocha = require("mocha");

var _parser = require("../parser");

var _source = require("../source");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _toJSONDeep = _interopRequireDefault(require("./toJSONDeep"));

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Syntax Error: Expected Name, found <EOF>\n\n      GraphQL request (1:2)\n      1: {\n          ^\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Syntax Error: Expected {, found <EOF>\n\n      MyQuery.graphql (1:6)\n      1: query\n              ^\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        node(id: 4) {\n          id,\n          name\n        }\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query {\n        node {\n          id\n        }\n      }\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function expectSyntaxError(text, message, location) {
  (0, _chai.expect)(function () {
    return (0, _parser.parse)(text);
  }).to.throw(message).with.deep.property('locations', [location]);
}

(0, _mocha.describe)('Parser', function () {
  (0, _mocha.it)('asserts that a source to parse was provided', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)();
    }).to.throw('Must provide Source. Received: undefined');
  });
  (0, _mocha.it)('asserts that a source to parse was provided', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)({});
    }).to.throw('Must provide Source. Received: [object Object]');
  });
  (0, _mocha.it)('parse provides useful errors', function () {
    var caughtError;

    try {
      (0, _parser.parse)('{');
    } catch (error) {
      caughtError = error;
    }

    (0, _chai.expect)(caughtError).to.deep.contain({
      message: 'Syntax Error: Expected Name, found <EOF>',
      positions: [1],
      locations: [{
        line: 1,
        column: 2
      }]
    });
    (0, _chai.expect)(String(caughtError)).to.equal((0, _dedent.default)(_templateObject));
    expectSyntaxError("\n      { ...MissingOn }\n      fragment MissingOn Type", 'Expected "on", found Name "Type"', {
      line: 3,
      column: 26
    });
    expectSyntaxError('{ field: {} }', 'Expected Name, found {', {
      line: 1,
      column: 10
    });
    expectSyntaxError('notanoperation Foo { field }', 'Unexpected Name "notanoperation"', {
      line: 1,
      column: 1
    });
    expectSyntaxError('...', 'Unexpected ...', {
      line: 1,
      column: 1
    });
  });
  (0, _mocha.it)('parse provides useful error when using source', function () {
    var caughtError;

    try {
      (0, _parser.parse)(new _source.Source('query', 'MyQuery.graphql'));
    } catch (error) {
      caughtError = error;
    }

    (0, _chai.expect)(String(caughtError)).to.equal((0, _dedent.default)(_templateObject2));
  });
  (0, _mocha.it)('parses variable inline values', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)('{ field(complex: { a: { b: [ $var ] } }) }');
    }).to.not.throw();
  });
  (0, _mocha.it)('parses constant default values', function () {
    expectSyntaxError('query Foo($x: Complex = { a: { b: [ $var ] } }) { field }', 'Unexpected $', {
      line: 1,
      column: 37
    });
  });
  (0, _mocha.it)('does not accept fragments named "on"', function () {
    expectSyntaxError('fragment on on on { on }', 'Unexpected Name "on"', {
      line: 1,
      column: 10
    });
  });
  (0, _mocha.it)('does not accept fragments spread of "on"', function () {
    expectSyntaxError('{ ...on }', 'Expected Name, found }', {
      line: 1,
      column: 9
    });
  });
  (0, _mocha.it)('parses multi-byte characters', function () {
    // Note: \u0A0A could be naively interpretted as two line-feed chars.
    var ast = (0, _parser.parse)("\n      # This comment has a \u0A0A multi-byte character.\n      { field(arg: \"Has a \u0A0A multi-byte character.\") }\n    ");
    (0, _chai.expect)(ast).to.have.nested.property('definitions[0].selectionSet.selections[0].arguments[0].value.value', "Has a \u0A0A multi-byte character.");
  });
  var kitchenSink = (0, _fs.readFileSync)((0, _path.join)(__dirname, '/kitchen-sink.graphql'), {
    encoding: 'utf8'
  });
  (0, _mocha.it)('parses kitchen sink', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)(kitchenSink);
    }).to.not.throw();
  });
  (0, _mocha.it)('allows non-keywords anywhere a Name is allowed', function () {
    var nonKeywords = ['on', 'fragment', 'query', 'mutation', 'subscription', 'true', 'false'];
    nonKeywords.forEach(function (keyword) {
      // You can't define or reference a fragment named `on`.
      var fragmentName = keyword !== 'on' ? keyword : 'a';
      var document = "\n        query ".concat(keyword, " {\n          ... ").concat(fragmentName, "\n          ... on ").concat(keyword, " { field }\n        }\n        fragment ").concat(fragmentName, " on Type {\n          ").concat(keyword, "(").concat(keyword, ": $").concat(keyword, ")\n            @").concat(keyword, "(").concat(keyword, ": ").concat(keyword, ")\n        }\n      ");
      (0, _chai.expect)(function () {
        return (0, _parser.parse)(document);
      }).to.not.throw();
    });
  });
  (0, _mocha.it)('parses anonymous mutation operations', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)("\n      mutation {\n        mutationField\n      }\n    ");
    }).to.not.throw();
  });
  (0, _mocha.it)('parses anonymous subscription operations', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)("\n      subscription {\n        subscriptionField\n      }\n    ");
    }).to.not.throw();
  });
  (0, _mocha.it)('parses named mutation operations', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)("\n      mutation Foo {\n        mutationField\n      }\n    ");
    }).to.not.throw();
  });
  (0, _mocha.it)('parses named subscription operations', function () {
    (0, _chai.expect)(function () {
      return (0, _parser.parse)("\n      subscription Foo {\n        subscriptionField\n      }\n    ");
    }).to.not.throw();
  });
  (0, _mocha.it)('creates ast', function () {
    var result = (0, _parser.parse)((0, _dedent.default)(_templateObject3));
    (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
      kind: _kinds.Kind.DOCUMENT,
      loc: {
        start: 0,
        end: 41
      },
      definitions: [{
        kind: _kinds.Kind.OPERATION_DEFINITION,
        loc: {
          start: 0,
          end: 40
        },
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: {
          kind: _kinds.Kind.SELECTION_SET,
          loc: {
            start: 0,
            end: 40
          },
          selections: [{
            kind: _kinds.Kind.FIELD,
            loc: {
              start: 4,
              end: 38
            },
            alias: undefined,
            name: {
              kind: _kinds.Kind.NAME,
              loc: {
                start: 4,
                end: 8
              },
              value: 'node'
            },
            arguments: [{
              kind: _kinds.Kind.ARGUMENT,
              name: {
                kind: _kinds.Kind.NAME,
                loc: {
                  start: 9,
                  end: 11
                },
                value: 'id'
              },
              value: {
                kind: _kinds.Kind.INT,
                loc: {
                  start: 13,
                  end: 14
                },
                value: '4'
              },
              loc: {
                start: 9,
                end: 14
              }
            }],
            directives: [],
            selectionSet: {
              kind: _kinds.Kind.SELECTION_SET,
              loc: {
                start: 16,
                end: 38
              },
              selections: [{
                kind: _kinds.Kind.FIELD,
                loc: {
                  start: 22,
                  end: 24
                },
                alias: undefined,
                name: {
                  kind: _kinds.Kind.NAME,
                  loc: {
                    start: 22,
                    end: 24
                  },
                  value: 'id'
                },
                arguments: [],
                directives: [],
                selectionSet: undefined
              }, {
                kind: _kinds.Kind.FIELD,
                loc: {
                  start: 30,
                  end: 34
                },
                alias: undefined,
                name: {
                  kind: _kinds.Kind.NAME,
                  loc: {
                    start: 30,
                    end: 34
                  },
                  value: 'name'
                },
                arguments: [],
                directives: [],
                selectionSet: undefined
              }]
            }
          }]
        }
      }]
    });
  });
  (0, _mocha.it)('creates ast from nameless query without variables', function () {
    var result = (0, _parser.parse)((0, _dedent.default)(_templateObject4));
    (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
      kind: _kinds.Kind.DOCUMENT,
      loc: {
        start: 0,
        end: 30
      },
      definitions: [{
        kind: _kinds.Kind.OPERATION_DEFINITION,
        loc: {
          start: 0,
          end: 29
        },
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: {
          kind: _kinds.Kind.SELECTION_SET,
          loc: {
            start: 6,
            end: 29
          },
          selections: [{
            kind: _kinds.Kind.FIELD,
            loc: {
              start: 10,
              end: 27
            },
            alias: undefined,
            name: {
              kind: _kinds.Kind.NAME,
              loc: {
                start: 10,
                end: 14
              },
              value: 'node'
            },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: _kinds.Kind.SELECTION_SET,
              loc: {
                start: 15,
                end: 27
              },
              selections: [{
                kind: _kinds.Kind.FIELD,
                loc: {
                  start: 21,
                  end: 23
                },
                alias: undefined,
                name: {
                  kind: _kinds.Kind.NAME,
                  loc: {
                    start: 21,
                    end: 23
                  },
                  value: 'id'
                },
                arguments: [],
                directives: [],
                selectionSet: undefined
              }]
            }
          }]
        }
      }]
    });
  });
  (0, _mocha.it)('allows parsing without source location information', function () {
    var result = (0, _parser.parse)('{ id }', {
      noLocation: true
    });
    (0, _chai.expect)(result.loc).to.equal(undefined);
  });
  (0, _mocha.it)('Experimental: allows parsing fragment defined variables', function () {
    var document = 'fragment a($v: Boolean = false) on t { f(v: $v) }';
    (0, _chai.expect)(function () {
      return (0, _parser.parse)(document, {
        experimentalFragmentVariables: true
      });
    }).to.not.throw();
    (0, _chai.expect)(function () {
      return (0, _parser.parse)(document);
    }).to.throw('Syntax Error');
  });
  (0, _mocha.it)('contains location information that only stringifys start/end', function () {
    var result = (0, _parser.parse)('{ id }');
    (0, _chai.expect)(JSON.stringify(result.loc)).to.equal('{"start":0,"end":6}');
    (0, _chai.expect)((0, _util.inspect)(result.loc)).to.equal('{ start: 0, end: 6 }');
  });
  (0, _mocha.it)('contains references to source', function () {
    var source = new _source.Source('{ id }');
    var result = (0, _parser.parse)(source);
    (0, _chai.expect)(result.loc.source).to.equal(source);
  });
  (0, _mocha.it)('contains references to start and end tokens', function () {
    var result = (0, _parser.parse)('{ id }');
    (0, _chai.expect)(result.loc.startToken.kind).to.equal('<SOF>');
    (0, _chai.expect)(result.loc.endToken.kind).to.equal('<EOF>');
  });
  (0, _mocha.describe)('parseValue', function () {
    (0, _mocha.it)('parses null value', function () {
      var result = (0, _parser.parseValue)('null');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.NULL,
        loc: {
          start: 0,
          end: 4
        }
      });
    });
    (0, _mocha.it)('parses list values', function () {
      var result = (0, _parser.parseValue)('[123 "abc"]');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.LIST,
        loc: {
          start: 0,
          end: 11
        },
        values: [{
          kind: _kinds.Kind.INT,
          loc: {
            start: 1,
            end: 4
          },
          value: '123'
        }, {
          kind: _kinds.Kind.STRING,
          loc: {
            start: 5,
            end: 10
          },
          value: 'abc',
          block: false
        }]
      });
    });
    (0, _mocha.it)('parses block strings', function () {
      var result = (0, _parser.parseValue)('["""long""" "short"]');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.LIST,
        loc: {
          start: 0,
          end: 20
        },
        values: [{
          kind: _kinds.Kind.STRING,
          loc: {
            start: 1,
            end: 11
          },
          value: 'long',
          block: true
        }, {
          kind: _kinds.Kind.STRING,
          loc: {
            start: 12,
            end: 19
          },
          value: 'short',
          block: false
        }]
      });
    });
  });
  (0, _mocha.describe)('parseType', function () {
    (0, _mocha.it)('parses well known types', function () {
      var result = (0, _parser.parseType)('String');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.NAMED_TYPE,
        loc: {
          start: 0,
          end: 6
        },
        name: {
          kind: _kinds.Kind.NAME,
          loc: {
            start: 0,
            end: 6
          },
          value: 'String'
        }
      });
    });
    (0, _mocha.it)('parses custom types', function () {
      var result = (0, _parser.parseType)('MyType');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.NAMED_TYPE,
        loc: {
          start: 0,
          end: 6
        },
        name: {
          kind: _kinds.Kind.NAME,
          loc: {
            start: 0,
            end: 6
          },
          value: 'MyType'
        }
      });
    });
    (0, _mocha.it)('parses list types', function () {
      var result = (0, _parser.parseType)('[MyType]');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.LIST_TYPE,
        loc: {
          start: 0,
          end: 8
        },
        type: {
          kind: _kinds.Kind.NAMED_TYPE,
          loc: {
            start: 1,
            end: 7
          },
          name: {
            kind: _kinds.Kind.NAME,
            loc: {
              start: 1,
              end: 7
            },
            value: 'MyType'
          }
        }
      });
    });
    (0, _mocha.it)('parses non-null types', function () {
      var result = (0, _parser.parseType)('MyType!');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.NON_NULL_TYPE,
        loc: {
          start: 0,
          end: 7
        },
        type: {
          kind: _kinds.Kind.NAMED_TYPE,
          loc: {
            start: 0,
            end: 6
          },
          name: {
            kind: _kinds.Kind.NAME,
            loc: {
              start: 0,
              end: 6
            },
            value: 'MyType'
          }
        }
      });
    });
    (0, _mocha.it)('parses nested types', function () {
      var result = (0, _parser.parseType)('[MyType!]');
      (0, _chai.expect)((0, _toJSONDeep.default)(result)).to.deep.equal({
        kind: _kinds.Kind.LIST_TYPE,
        loc: {
          start: 0,
          end: 9
        },
        type: {
          kind: _kinds.Kind.NON_NULL_TYPE,
          loc: {
            start: 1,
            end: 8
          },
          type: {
            kind: _kinds.Kind.NAMED_TYPE,
            loc: {
              start: 1,
              end: 7
            },
            name: {
              kind: _kinds.Kind.NAME,
              loc: {
                start: 1,
                end: 7
              },
              value: 'MyType'
            }
          }
        }
      });
    });
  });
});