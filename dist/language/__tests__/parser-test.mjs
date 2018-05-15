var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Syntax Error: Expected Name, found <EOF>\n\n      GraphQL request (1:2)\n      1: {\n          ^\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Syntax Error: Expected {, found <EOF>\n\n      MyQuery.graphql (1:6)\n      1: query\n              ^\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        node(id: 4) {\n          id,\n          name\n        }\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query {\n        node {\n          id\n        }\n      }\n    "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { inspect } from 'util';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Kind } from '../kinds';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parse, parseValue, parseType } from '../parser';
import { Source } from '../source';
import dedent from '../../jsutils/dedent';
import toJSONDeep from './toJSONDeep';

function expectSyntaxError(text, message, location) {
  expect(function () {
    return parse(text);
  }).to.throw(message).with.deep.property('locations', [location]);
}

describe('Parser', function () {
  it('asserts that a source to parse was provided', function () {
    expect(function () {
      return parse();
    }).to.throw('Must provide Source. Received: undefined');
  });
  it('asserts that a source to parse was provided', function () {
    expect(function () {
      return parse({});
    }).to.throw('Must provide Source. Received: [object Object]');
  });
  it('parse provides useful errors', function () {
    var caughtError;

    try {
      parse('{');
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).to.deep.contain({
      message: 'Syntax Error: Expected Name, found <EOF>',
      positions: [1],
      locations: [{
        line: 1,
        column: 2
      }]
    });
    expect(String(caughtError)).to.equal(dedent(_templateObject));
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
  it('parse provides useful error when using source', function () {
    var caughtError;

    try {
      parse(new Source('query', 'MyQuery.graphql'));
    } catch (error) {
      caughtError = error;
    }

    expect(String(caughtError)).to.equal(dedent(_templateObject2));
  });
  it('parses variable inline values', function () {
    expect(function () {
      return parse('{ field(complex: { a: { b: [ $var ] } }) }');
    }).to.not.throw();
  });
  it('parses constant default values', function () {
    expectSyntaxError('query Foo($x: Complex = { a: { b: [ $var ] } }) { field }', 'Unexpected $', {
      line: 1,
      column: 37
    });
  });
  it('does not accept fragments named "on"', function () {
    expectSyntaxError('fragment on on on { on }', 'Unexpected Name "on"', {
      line: 1,
      column: 10
    });
  });
  it('does not accept fragments spread of "on"', function () {
    expectSyntaxError('{ ...on }', 'Expected Name, found }', {
      line: 1,
      column: 9
    });
  });
  it('parses multi-byte characters', function () {
    // Note: \u0A0A could be naively interpretted as two line-feed chars.
    var ast = parse("\n      # This comment has a \u0A0A multi-byte character.\n      { field(arg: \"Has a \u0A0A multi-byte character.\") }\n    ");
    expect(ast).to.have.nested.property('definitions[0].selectionSet.selections[0].arguments[0].value.value', "Has a \u0A0A multi-byte character.");
  });
  var kitchenSink = readFileSync(join(__dirname, '/kitchen-sink.graphql'), {
    encoding: 'utf8'
  });
  it('parses kitchen sink', function () {
    expect(function () {
      return parse(kitchenSink);
    }).to.not.throw();
  });
  it('allows non-keywords anywhere a Name is allowed', function () {
    var nonKeywords = ['on', 'fragment', 'query', 'mutation', 'subscription', 'true', 'false'];
    nonKeywords.forEach(function (keyword) {
      // You can't define or reference a fragment named `on`.
      var fragmentName = keyword !== 'on' ? keyword : 'a';
      var document = "\n        query ".concat(keyword, " {\n          ... ").concat(fragmentName, "\n          ... on ").concat(keyword, " { field }\n        }\n        fragment ").concat(fragmentName, " on Type {\n          ").concat(keyword, "(").concat(keyword, ": $").concat(keyword, ")\n            @").concat(keyword, "(").concat(keyword, ": ").concat(keyword, ")\n        }\n      ");
      expect(function () {
        return parse(document);
      }).to.not.throw();
    });
  });
  it('parses anonymous mutation operations', function () {
    expect(function () {
      return parse("\n      mutation {\n        mutationField\n      }\n    ");
    }).to.not.throw();
  });
  it('parses anonymous subscription operations', function () {
    expect(function () {
      return parse("\n      subscription {\n        subscriptionField\n      }\n    ");
    }).to.not.throw();
  });
  it('parses named mutation operations', function () {
    expect(function () {
      return parse("\n      mutation Foo {\n        mutationField\n      }\n    ");
    }).to.not.throw();
  });
  it('parses named subscription operations', function () {
    expect(function () {
      return parse("\n      subscription Foo {\n        subscriptionField\n      }\n    ");
    }).to.not.throw();
  });
  it('creates ast', function () {
    var result = parse(dedent(_templateObject3));
    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: {
        start: 0,
        end: 41
      },
      definitions: [{
        kind: Kind.OPERATION_DEFINITION,
        loc: {
          start: 0,
          end: 40
        },
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: {
          kind: Kind.SELECTION_SET,
          loc: {
            start: 0,
            end: 40
          },
          selections: [{
            kind: Kind.FIELD,
            loc: {
              start: 4,
              end: 38
            },
            alias: undefined,
            name: {
              kind: Kind.NAME,
              loc: {
                start: 4,
                end: 8
              },
              value: 'node'
            },
            arguments: [{
              kind: Kind.ARGUMENT,
              name: {
                kind: Kind.NAME,
                loc: {
                  start: 9,
                  end: 11
                },
                value: 'id'
              },
              value: {
                kind: Kind.INT,
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
              kind: Kind.SELECTION_SET,
              loc: {
                start: 16,
                end: 38
              },
              selections: [{
                kind: Kind.FIELD,
                loc: {
                  start: 22,
                  end: 24
                },
                alias: undefined,
                name: {
                  kind: Kind.NAME,
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
                kind: Kind.FIELD,
                loc: {
                  start: 30,
                  end: 34
                },
                alias: undefined,
                name: {
                  kind: Kind.NAME,
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
  it('creates ast from nameless query without variables', function () {
    var result = parse(dedent(_templateObject4));
    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: {
        start: 0,
        end: 30
      },
      definitions: [{
        kind: Kind.OPERATION_DEFINITION,
        loc: {
          start: 0,
          end: 29
        },
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: {
          kind: Kind.SELECTION_SET,
          loc: {
            start: 6,
            end: 29
          },
          selections: [{
            kind: Kind.FIELD,
            loc: {
              start: 10,
              end: 27
            },
            alias: undefined,
            name: {
              kind: Kind.NAME,
              loc: {
                start: 10,
                end: 14
              },
              value: 'node'
            },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: Kind.SELECTION_SET,
              loc: {
                start: 15,
                end: 27
              },
              selections: [{
                kind: Kind.FIELD,
                loc: {
                  start: 21,
                  end: 23
                },
                alias: undefined,
                name: {
                  kind: Kind.NAME,
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
  it('allows parsing without source location information', function () {
    var result = parse('{ id }', {
      noLocation: true
    });
    expect(result.loc).to.equal(undefined);
  });
  it('Experimental: allows parsing fragment defined variables', function () {
    var document = 'fragment a($v: Boolean = false) on t { f(v: $v) }';
    expect(function () {
      return parse(document, {
        experimentalFragmentVariables: true
      });
    }).to.not.throw();
    expect(function () {
      return parse(document);
    }).to.throw('Syntax Error');
  });
  it('contains location information that only stringifys start/end', function () {
    var result = parse('{ id }');
    expect(JSON.stringify(result.loc)).to.equal('{"start":0,"end":6}');
    expect(inspect(result.loc)).to.equal('{ start: 0, end: 6 }');
  });
  it('contains references to source', function () {
    var source = new Source('{ id }');
    var result = parse(source);
    expect(result.loc.source).to.equal(source);
  });
  it('contains references to start and end tokens', function () {
    var result = parse('{ id }');
    expect(result.loc.startToken.kind).to.equal('<SOF>');
    expect(result.loc.endToken.kind).to.equal('<EOF>');
  });
  describe('parseValue', function () {
    it('parses null value', function () {
      var result = parseValue('null');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.NULL,
        loc: {
          start: 0,
          end: 4
        }
      });
    });
    it('parses list values', function () {
      var result = parseValue('[123 "abc"]');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.LIST,
        loc: {
          start: 0,
          end: 11
        },
        values: [{
          kind: Kind.INT,
          loc: {
            start: 1,
            end: 4
          },
          value: '123'
        }, {
          kind: Kind.STRING,
          loc: {
            start: 5,
            end: 10
          },
          value: 'abc',
          block: false
        }]
      });
    });
    it('parses block strings', function () {
      var result = parseValue('["""long""" "short"]');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.LIST,
        loc: {
          start: 0,
          end: 20
        },
        values: [{
          kind: Kind.STRING,
          loc: {
            start: 1,
            end: 11
          },
          value: 'long',
          block: true
        }, {
          kind: Kind.STRING,
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
  describe('parseType', function () {
    it('parses well known types', function () {
      var result = parseType('String');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.NAMED_TYPE,
        loc: {
          start: 0,
          end: 6
        },
        name: {
          kind: Kind.NAME,
          loc: {
            start: 0,
            end: 6
          },
          value: 'String'
        }
      });
    });
    it('parses custom types', function () {
      var result = parseType('MyType');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.NAMED_TYPE,
        loc: {
          start: 0,
          end: 6
        },
        name: {
          kind: Kind.NAME,
          loc: {
            start: 0,
            end: 6
          },
          value: 'MyType'
        }
      });
    });
    it('parses list types', function () {
      var result = parseType('[MyType]');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.LIST_TYPE,
        loc: {
          start: 0,
          end: 8
        },
        type: {
          kind: Kind.NAMED_TYPE,
          loc: {
            start: 1,
            end: 7
          },
          name: {
            kind: Kind.NAME,
            loc: {
              start: 1,
              end: 7
            },
            value: 'MyType'
          }
        }
      });
    });
    it('parses non-null types', function () {
      var result = parseType('MyType!');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.NON_NULL_TYPE,
        loc: {
          start: 0,
          end: 7
        },
        type: {
          kind: Kind.NAMED_TYPE,
          loc: {
            start: 0,
            end: 6
          },
          name: {
            kind: Kind.NAME,
            loc: {
              start: 0,
              end: 6
            },
            value: 'MyType'
          }
        }
      });
    });
    it('parses nested types', function () {
      var result = parseType('[MyType!]');
      expect(toJSONDeep(result)).to.deep.equal({
        kind: Kind.LIST_TYPE,
        loc: {
          start: 0,
          end: 9
        },
        type: {
          kind: Kind.NON_NULL_TYPE,
          loc: {
            start: 1,
            end: 8
          },
          type: {
            kind: Kind.NAMED_TYPE,
            loc: {
              start: 1,
              end: 7
            },
            name: {
              kind: Kind.NAME,
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