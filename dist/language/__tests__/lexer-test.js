"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _source = require("../source");

var _lexer = require("../lexer");

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      \n      \n          ?\n      \n      \n      "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Syntax Error: Cannot parse the unexpected character \"?\".\n\n      GraphQL request (3:5)\n      2: \n      3:     ?\n             ^\n      4: \n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Syntax Error: Cannot parse the unexpected character \"?\".\n\n      foo.js (13:6)\n      12: \n      13:      ?\n               ^\n      14: \n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      Syntax Error: Cannot parse the unexpected character \"?\".\n\n      foo.js (1:5)\n      1:     ?\n             ^\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function lexOne(str) {
  var lexer = (0, _lexer.createLexer)(new _source.Source(str));
  return lexer.advance();
}

function expectSyntaxError(text, message, location) {
  try {
    lexOne(text);

    _chai.expect.fail('Expected to throw syntax error');
  } catch (error) {
    (0, _chai.expect)(error.message).to.contain(message);
    (0, _chai.expect)(error.locations).to.deep.equal([location]);
  }
}

(0, _mocha.describe)('Lexer', function () {
  (0, _mocha.it)('disallows uncommon control characters', function () {
    expectSyntaxError("\x07", "Cannot contain the invalid character \"\\u0007\"", {
      line: 1,
      column: 1
    });
  });
  (0, _mocha.it)('accepts BOM header', function () {
    (0, _chai.expect)(lexOne("\uFEFF foo")).to.contain({
      kind: _lexer.TokenKind.NAME,
      start: 2,
      end: 5,
      value: 'foo'
    });
  });
  (0, _mocha.it)('records line and column', function () {
    (0, _chai.expect)(lexOne('\n \r\n \r  foo\n')).to.contain({
      kind: _lexer.TokenKind.NAME,
      start: 8,
      end: 11,
      line: 4,
      column: 3,
      value: 'foo'
    });
  });
  (0, _mocha.it)('can be JSON.stringified or util.inspected', function () {
    var token = lexOne('foo');
    (0, _chai.expect)(JSON.stringify(token)).to.equal('{"kind":"Name","value":"foo","line":1,"column":1}'); // NB: util.inspect used to suck

    if (parseFloat(process.version.slice(1)) > 0.1) {
      (0, _chai.expect)(require('util').inspect(token)).to.equal("{ kind: 'Name', value: 'foo', line: 1, column: 1 }");
    }
  });
  (0, _mocha.it)('skips whitespace and comments', function () {
    (0, _chai.expect)(lexOne("\n\n    foo\n\n\n")).to.contain({
      kind: _lexer.TokenKind.NAME,
      start: 6,
      end: 9,
      value: 'foo'
    });
    (0, _chai.expect)(lexOne("\n    #comment\n    foo#comment\n")).to.contain({
      kind: _lexer.TokenKind.NAME,
      start: 18,
      end: 21,
      value: 'foo'
    });
    (0, _chai.expect)(lexOne(',,,foo,,,')).to.contain({
      kind: _lexer.TokenKind.NAME,
      start: 3,
      end: 6,
      value: 'foo'
    });
  });
  (0, _mocha.it)('errors respect whitespace', function () {
    var caughtError;

    try {
      lexOne((0, _dedent.default)(_templateObject));
    } catch (error) {
      caughtError = error;
    }

    (0, _chai.expect)(String(caughtError)).to.equal((0, _dedent.default)(_templateObject2));
  });
  (0, _mocha.it)('updates line numbers in error for file context', function () {
    var caughtError;

    try {
      var str = '' + '\n' + '\n' + '     ?\n' + '\n';
      var source = new _source.Source(str, 'foo.js', {
        line: 11,
        column: 12
      });
      (0, _lexer.createLexer)(source).advance();
    } catch (error) {
      caughtError = error;
    }

    (0, _chai.expect)(String(caughtError)).to.equal((0, _dedent.default)(_templateObject3));
  });
  (0, _mocha.it)('updates column numbers in error for file context', function () {
    var caughtError;

    try {
      var source = new _source.Source('?', 'foo.js', {
        line: 1,
        column: 5
      });
      (0, _lexer.createLexer)(source).advance();
    } catch (error) {
      caughtError = error;
    }

    (0, _chai.expect)(String(caughtError)).to.equal((0, _dedent.default)(_templateObject4));
  });
  (0, _mocha.it)('lexes strings', function () {
    (0, _chai.expect)(lexOne('"simple"')).to.contain({
      kind: _lexer.TokenKind.STRING,
      start: 0,
      end: 8,
      value: 'simple'
    });
    (0, _chai.expect)(lexOne('" white space "')).to.contain({
      kind: _lexer.TokenKind.STRING,
      start: 0,
      end: 15,
      value: ' white space '
    });
    (0, _chai.expect)(lexOne('"quote \\""')).to.contain({
      kind: _lexer.TokenKind.STRING,
      start: 0,
      end: 10,
      value: 'quote "'
    });
    (0, _chai.expect)(lexOne('"escaped \\n\\r\\b\\t\\f"')).to.contain({
      kind: _lexer.TokenKind.STRING,
      start: 0,
      end: 20,
      value: 'escaped \n\r\b\t\f'
    });
    (0, _chai.expect)(lexOne('"slashes \\\\ \\/"')).to.contain({
      kind: _lexer.TokenKind.STRING,
      start: 0,
      end: 15,
      value: 'slashes \\ /'
    });
    (0, _chai.expect)(lexOne("\"unicode \\u1234\\u5678\\u90AB\\uCDEF\"")).to.contain({
      kind: _lexer.TokenKind.STRING,
      start: 0,
      end: 34,
      value: "unicode \u1234\u5678\u90AB\uCDEF"
    });
  });
  (0, _mocha.it)('lex reports useful string errors', function () {
    expectSyntaxError('"', 'Unterminated string.', {
      line: 1,
      column: 2
    });
    expectSyntaxError('"no end quote', 'Unterminated string.', {
      line: 1,
      column: 14
    });
    expectSyntaxError("'single quotes'", "Unexpected single quote character ('), " + 'did you mean to use a double quote (")?', {
      line: 1,
      column: 1
    });
    expectSyntaxError("\"contains unescaped \x07 control char\"", "Invalid character within String: \"\\u0007\".", {
      line: 1,
      column: 21
    });
    expectSyntaxError("\"null-byte is not \0 end of file\"", "Invalid character within String: \"\\u0000\".", {
      line: 1,
      column: 19
    });
    expectSyntaxError('"multi\nline"', 'Unterminated string', {
      line: 1,
      column: 7
    });
    expectSyntaxError('"multi\rline"', 'Unterminated string', {
      line: 1,
      column: 7
    });
    expectSyntaxError('"bad \\z esc"', 'Invalid character escape sequence: \\z.', {
      line: 1,
      column: 7
    });
    expectSyntaxError('"bad \\x esc"', 'Invalid character escape sequence: \\x.', {
      line: 1,
      column: 7
    });
    expectSyntaxError("\"bad \\u1 esc\"", "Invalid character escape sequence: \\u1 es.", {
      line: 1,
      column: 7
    });
    expectSyntaxError("\"bad \\u0XX1 esc\"", "Invalid character escape sequence: \\u0XX1.", {
      line: 1,
      column: 7
    });
    expectSyntaxError("\"bad \\uXXXX esc\"", "Invalid character escape sequence: \\uXXXX.", {
      line: 1,
      column: 7
    });
    expectSyntaxError("\"bad \\uFXXX esc\"", "Invalid character escape sequence: \\uFXXX.", {
      line: 1,
      column: 7
    });
    expectSyntaxError("\"bad \\uXXXF esc\"", "Invalid character escape sequence: \\uXXXF.", {
      line: 1,
      column: 7
    });
  });
  (0, _mocha.it)('lexes block strings', function () {
    (0, _chai.expect)(lexOne('"""simple"""')).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 12,
      value: 'simple'
    });
    (0, _chai.expect)(lexOne('""" white space """')).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 19,
      value: ' white space '
    });
    (0, _chai.expect)(lexOne('"""contains " quote"""')).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 22,
      value: 'contains " quote'
    });
    (0, _chai.expect)(lexOne('"""contains \\""" triplequote"""')).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 31,
      value: 'contains """ triplequote'
    });
    (0, _chai.expect)(lexOne('"""multi\nline"""')).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 16,
      value: 'multi\nline'
    });
    (0, _chai.expect)(lexOne('"""multi\rline\r\nnormalized"""')).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 28,
      value: 'multi\nline\nnormalized'
    });
    (0, _chai.expect)(lexOne("\"\"\"unescaped \\n\\r\\b\\t\\f\\u1234\"\"\"")).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 32,
      value: "unescaped \\n\\r\\b\\t\\f\\u1234"
    });
    (0, _chai.expect)(lexOne('"""slashes \\\\ \\/"""')).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 19,
      value: 'slashes \\\\ \\/'
    });
    (0, _chai.expect)(lexOne("\"\"\"\n\n        spans\n          multiple\n            lines\n\n        \"\"\"")).to.contain({
      kind: _lexer.TokenKind.BLOCK_STRING,
      start: 0,
      end: 68,
      value: 'spans\n  multiple\n    lines'
    });
  });
  (0, _mocha.it)('lex reports useful block string errors', function () {
    expectSyntaxError('"""', 'Unterminated string.', {
      line: 1,
      column: 4
    });
    expectSyntaxError('"""no end quote', 'Unterminated string.', {
      line: 1,
      column: 16
    });
    expectSyntaxError("\"\"\"contains unescaped \x07 control char\"\"\"", "Invalid character within String: \"\\u0007\".", {
      line: 1,
      column: 23
    });
    expectSyntaxError("\"\"\"null-byte is not \0 end of file\"\"\"", "Invalid character within String: \"\\u0000\".", {
      line: 1,
      column: 21
    });
  });
  (0, _mocha.it)('lexes numbers', function () {
    (0, _chai.expect)(lexOne('4')).to.contain({
      kind: _lexer.TokenKind.INT,
      start: 0,
      end: 1,
      value: '4'
    });
    (0, _chai.expect)(lexOne('4.123')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 5,
      value: '4.123'
    });
    (0, _chai.expect)(lexOne('-4')).to.contain({
      kind: _lexer.TokenKind.INT,
      start: 0,
      end: 2,
      value: '-4'
    });
    (0, _chai.expect)(lexOne('9')).to.contain({
      kind: _lexer.TokenKind.INT,
      start: 0,
      end: 1,
      value: '9'
    });
    (0, _chai.expect)(lexOne('0')).to.contain({
      kind: _lexer.TokenKind.INT,
      start: 0,
      end: 1,
      value: '0'
    });
    (0, _chai.expect)(lexOne('-4.123')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 6,
      value: '-4.123'
    });
    (0, _chai.expect)(lexOne('0.123')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 5,
      value: '0.123'
    });
    (0, _chai.expect)(lexOne('123e4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 5,
      value: '123e4'
    });
    (0, _chai.expect)(lexOne('123E4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 5,
      value: '123E4'
    });
    (0, _chai.expect)(lexOne('123e-4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 6,
      value: '123e-4'
    });
    (0, _chai.expect)(lexOne('123e+4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 6,
      value: '123e+4'
    });
    (0, _chai.expect)(lexOne('-1.123e4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 8,
      value: '-1.123e4'
    });
    (0, _chai.expect)(lexOne('-1.123E4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 8,
      value: '-1.123E4'
    });
    (0, _chai.expect)(lexOne('-1.123e-4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 9,
      value: '-1.123e-4'
    });
    (0, _chai.expect)(lexOne('-1.123e+4')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 9,
      value: '-1.123e+4'
    });
    (0, _chai.expect)(lexOne('-1.123e4567')).to.contain({
      kind: _lexer.TokenKind.FLOAT,
      start: 0,
      end: 11,
      value: '-1.123e4567'
    });
  });
  (0, _mocha.it)('lex reports useful number errors', function () {
    expectSyntaxError('00', 'Invalid number, unexpected digit after 0: "0".', {
      line: 1,
      column: 2
    });
    expectSyntaxError('+1', 'Cannot parse the unexpected character "+".', {
      line: 1,
      column: 1
    });
    expectSyntaxError('1.', 'Invalid number, expected digit but got: <EOF>.', {
      line: 1,
      column: 3
    });
    expectSyntaxError('1.e1', 'Invalid number, expected digit but got: "e".', {
      line: 1,
      column: 3
    });
    expectSyntaxError('.123', 'Cannot parse the unexpected character ".".', {
      line: 1,
      column: 1
    });
    expectSyntaxError('1.A', 'Invalid number, expected digit but got: "A".', {
      line: 1,
      column: 3
    });
    expectSyntaxError('-A', 'Invalid number, expected digit but got: "A".', {
      line: 1,
      column: 2
    });
    expectSyntaxError('1.0e', 'Invalid number, expected digit but got: <EOF>.', {
      line: 1,
      column: 5
    });
    expectSyntaxError('1.0eA', 'Invalid number, expected digit but got: "A".', {
      line: 1,
      column: 5
    });
  });
  (0, _mocha.it)('lexes punctuation', function () {
    (0, _chai.expect)(lexOne('!')).to.contain({
      kind: _lexer.TokenKind.BANG,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('$')).to.contain({
      kind: _lexer.TokenKind.DOLLAR,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('(')).to.contain({
      kind: _lexer.TokenKind.PAREN_L,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne(')')).to.contain({
      kind: _lexer.TokenKind.PAREN_R,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('...')).to.contain({
      kind: _lexer.TokenKind.SPREAD,
      start: 0,
      end: 3,
      value: undefined
    });
    (0, _chai.expect)(lexOne(':')).to.contain({
      kind: _lexer.TokenKind.COLON,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('=')).to.contain({
      kind: _lexer.TokenKind.EQUALS,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('@')).to.contain({
      kind: _lexer.TokenKind.AT,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('[')).to.contain({
      kind: _lexer.TokenKind.BRACKET_L,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne(']')).to.contain({
      kind: _lexer.TokenKind.BRACKET_R,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('{')).to.contain({
      kind: _lexer.TokenKind.BRACE_L,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('|')).to.contain({
      kind: _lexer.TokenKind.PIPE,
      start: 0,
      end: 1,
      value: undefined
    });
    (0, _chai.expect)(lexOne('}')).to.contain({
      kind: _lexer.TokenKind.BRACE_R,
      start: 0,
      end: 1,
      value: undefined
    });
  });
  (0, _mocha.it)('lex reports useful unknown character error', function () {
    expectSyntaxError('..', 'Cannot parse the unexpected character ".".', {
      line: 1,
      column: 1
    });
    expectSyntaxError('?', 'Cannot parse the unexpected character "?".', {
      line: 1,
      column: 1
    });
    expectSyntaxError("\u203B", "Cannot parse the unexpected character \"\\u203B\".", {
      line: 1,
      column: 1
    });
    expectSyntaxError("\u200B", "Cannot parse the unexpected character \"\\u200B\".", {
      line: 1,
      column: 1
    });
  });
  (0, _mocha.it)('lex reports useful information for dashes in names', function () {
    var q = 'a-b';
    var lexer = (0, _lexer.createLexer)(new _source.Source(q));
    var firstToken = lexer.advance();
    (0, _chai.expect)(firstToken).to.contain({
      kind: _lexer.TokenKind.NAME,
      start: 0,
      end: 1,
      value: 'a'
    });
    var caughtError;

    try {
      lexer.advance();
    } catch (error) {
      caughtError = error;
    }

    (0, _chai.expect)(caughtError.message).to.equal('Syntax Error: Invalid number, expected digit but got: "b".');
    (0, _chai.expect)(caughtError.locations).to.deep.equal([{
      line: 1,
      column: 3
    }]);
  });
  (0, _mocha.it)('produces double linked list of tokens, including comments', function () {
    var lexer = (0, _lexer.createLexer)(new _source.Source("{\n      #comment\n      field\n    }"));
    var startToken = lexer.token;
    var endToken;

    do {
      endToken = lexer.advance(); // Lexer advances over ignored comment tokens to make writing parsers
      // easier, but will include them in the linked list result.

      (0, _chai.expect)(endToken.kind).not.to.equal('Comment');
    } while (endToken.kind !== '<EOF>');

    (0, _chai.expect)(startToken.prev).to.equal(null);
    (0, _chai.expect)(endToken.next).to.equal(null);
    var tokens = [];

    for (var tok = startToken; tok; tok = tok.next) {
      if (tokens.length) {
        // Tokens are double-linked, prev should point to last seen token.
        (0, _chai.expect)(tok.prev).to.equal(tokens[tokens.length - 1]);
      }

      tokens.push(tok);
    }

    (0, _chai.expect)(tokens.map(function (tok) {
      return tok.kind;
    })).to.deep.equal(['<SOF>', '{', 'Comment', 'Name', '}', '<EOF>']);
  });
});