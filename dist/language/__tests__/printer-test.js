"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _parser = require("../parser");

var _fs = require("fs");

var _printer = require("../printer");

var _path = require("path");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        id\n        name\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      mutation {\n        id\n        name\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query ($foo: TestType) @testDirective {\n        id\n        name\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      mutation ($foo: TestType) @testDirective {\n        id\n        name\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          field(arg: \"\"\"    space-led value\"\"\")\n        }\n      "]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          field(arg: \"\"\"\n                first\n              line\n            indentation\n          \"\"\")\n        }\n      "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          field(arg: \"\"\"    space-led value \"quoted string\"\n          \"\"\")\n        }\n      "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      fragment Foo($a: ComplexType, $b: Boolean = false) on TestType {\n        id\n      }\n    "]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query queryName($foo: ComplexType, $site: Site = MOBILE) {\n        whoever123is: node(id: [123, 456]) {\n          id\n          ... on User @defer {\n            field2 {\n              id\n              alias: field1(first: 10, after: $foo) @include(if: $foo) {\n                id\n                ...frag\n              }\n            }\n          }\n          ... @skip(unless: $foo) {\n            id\n          }\n          ... {\n            id\n          }\n        }\n      }\n\n      mutation likeStory {\n        like(story: 123) @defer {\n          story {\n            id\n          }\n        }\n      }\n\n      subscription StoryLikeSubscription($input: StoryLikeSubscribeInput) {\n        storyLikeSubscribe(input: $input) {\n          story {\n            likers {\n              count\n            }\n            likeSentence {\n              text\n            }\n          }\n        }\n      }\n\n      fragment frag on Friend {\n        foo(size: $size, bar: $b, obj: {key: \"value\", block: \"\"\"\n          block string uses \"\"\"\n        \"\"\"})\n      }\n\n      {\n        unnamed(truthy: true, falsey: false, nullish: null)\n        query\n      }\n    "], ["\n      query queryName($foo: ComplexType, $site: Site = MOBILE) {\n        whoever123is: node(id: [123, 456]) {\n          id\n          ... on User @defer {\n            field2 {\n              id\n              alias: field1(first: 10, after: $foo) @include(if: $foo) {\n                id\n                ...frag\n              }\n            }\n          }\n          ... @skip(unless: $foo) {\n            id\n          }\n          ... {\n            id\n          }\n        }\n      }\n\n      mutation likeStory {\n        like(story: 123) @defer {\n          story {\n            id\n          }\n        }\n      }\n\n      subscription StoryLikeSubscription($input: StoryLikeSubscribeInput) {\n        storyLikeSubscribe(input: $input) {\n          story {\n            likers {\n              count\n            }\n            likeSentence {\n              text\n            }\n          }\n        }\n      }\n\n      fragment frag on Friend {\n        foo(size: $size, bar: $b, obj: {key: \"value\", block: \"\"\"\n          block string uses \\\"\"\"\n        \"\"\"})\n      }\n\n      {\n        unnamed(truthy: true, falsey: false, nullish: null)\n        query\n      }\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _mocha.describe)('Printer: Query document', function () {
  var kitchenSink = (0, _fs.readFileSync)((0, _path.join)(__dirname, '/kitchen-sink.graphql'), {
    encoding: 'utf8'
  });
  (0, _mocha.it)('does not alter ast', function () {
    var ast = (0, _parser.parse)(kitchenSink);
    var astBefore = JSON.stringify(ast);
    (0, _printer.print)(ast);
    (0, _chai.expect)(JSON.stringify(ast)).to.equal(astBefore);
  });
  (0, _mocha.it)('prints minimal ast', function () {
    var ast = {
      kind: 'Field',
      name: {
        kind: 'Name',
        value: 'foo'
      }
    };
    (0, _chai.expect)((0, _printer.print)(ast)).to.equal('foo');
  });
  (0, _mocha.it)('produces helpful error messages', function () {
    var badAst1 = {
      random: 'Data'
    };
    (0, _chai.expect)(function () {
      return (0, _printer.print)(badAst1);
    }).to.throw('Invalid AST Node: {"random":"Data"}');
  });
  (0, _mocha.it)('correctly prints non-query operations without name', function () {
    var queryAstShorthanded = (0, _parser.parse)('query { id, name }');
    (0, _chai.expect)((0, _printer.print)(queryAstShorthanded)).to.equal((0, _dedent.default)(_templateObject));
    var mutationAst = (0, _parser.parse)('mutation { id, name }');
    (0, _chai.expect)((0, _printer.print)(mutationAst)).to.equal((0, _dedent.default)(_templateObject2));
    var queryAstWithArtifacts = (0, _parser.parse)('query ($foo: TestType) @testDirective { id, name }');
    (0, _chai.expect)((0, _printer.print)(queryAstWithArtifacts)).to.equal((0, _dedent.default)(_templateObject3));
    var mutationAstWithArtifacts = (0, _parser.parse)('mutation ($foo: TestType) @testDirective { id, name }');
    (0, _chai.expect)((0, _printer.print)(mutationAstWithArtifacts)).to.equal((0, _dedent.default)(_templateObject4));
  });
  (0, _mocha.describe)('block string', function () {
    (0, _mocha.it)('correctly prints single-line with leading space', function () {
      var mutationAstWithArtifacts = (0, _parser.parse)('{ field(arg: """    space-led value""") }');
      (0, _chai.expect)((0, _printer.print)(mutationAstWithArtifacts)).to.equal((0, _dedent.default)(_templateObject5));
    });
    (0, _mocha.it)('correctly prints string with a first line indentation', function () {
      var mutationAstWithArtifacts = (0, _parser.parse)("\n        {\n          field(arg: \"\"\"\n                first\n              line\n            indentation\n          \"\"\")\n        }\n      ");
      (0, _chai.expect)((0, _printer.print)(mutationAstWithArtifacts)).to.equal((0, _dedent.default)(_templateObject6));
    });
    (0, _mocha.it)('correctly prints single-line with leading space and quotation', function () {
      var mutationAstWithArtifacts = (0, _parser.parse)("\n        {\n          field(arg: \"\"\"    space-led value \"quoted string\"\n          \"\"\")\n        }\n      ");
      (0, _chai.expect)((0, _printer.print)(mutationAstWithArtifacts)).to.equal((0, _dedent.default)(_templateObject7));
    });
  });
  (0, _mocha.it)('Experimental: correctly prints fragment defined variables', function () {
    var fragmentWithVariable = (0, _parser.parse)("\n        fragment Foo($a: ComplexType, $b: Boolean = false) on TestType {\n          id\n        }\n      ", {
      experimentalFragmentVariables: true
    });
    (0, _chai.expect)((0, _printer.print)(fragmentWithVariable)).to.equal((0, _dedent.default)(_templateObject8));
  });
  (0, _mocha.it)('prints kitchen sink', function () {
    var ast = (0, _parser.parse)(kitchenSink);
    var printed = (0, _printer.print)(ast);
    (0, _chai.expect)(printed).to.equal((0, _dedent.default)(String.raw(_templateObject9)));
  });
});