var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      {\n        id\n        name\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      mutation {\n        id\n        name\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query ($foo: TestType) @testDirective {\n        id\n        name\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      mutation ($foo: TestType) @testDirective {\n        id\n        name\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          field(arg: \"\"\"    space-led value\"\"\")\n        }\n      "]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          field(arg: \"\"\"\n                first\n              line\n            indentation\n          \"\"\")\n        }\n      "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n        {\n          field(arg: \"\"\"    space-led value \"quoted string\"\n          \"\"\")\n        }\n      "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      fragment Foo($a: ComplexType, $b: Boolean = false) on TestType {\n        id\n      }\n    "]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      query queryName($foo: ComplexType, $site: Site = MOBILE) {\n        whoever123is: node(id: [123, 456]) {\n          id\n          ... on User @defer {\n            field2 {\n              id\n              alias: field1(first: 10, after: $foo) @include(if: $foo) {\n                id\n                ...frag\n              }\n            }\n          }\n          ... @skip(unless: $foo) {\n            id\n          }\n          ... {\n            id\n          }\n        }\n      }\n\n      mutation likeStory {\n        like(story: 123) @defer {\n          story {\n            id\n          }\n        }\n      }\n\n      subscription StoryLikeSubscription($input: StoryLikeSubscribeInput) {\n        storyLikeSubscribe(input: $input) {\n          story {\n            likers {\n              count\n            }\n            likeSentence {\n              text\n            }\n          }\n        }\n      }\n\n      fragment frag on Friend {\n        foo(size: $size, bar: $b, obj: {key: \"value\", block: \"\"\"\n          block string uses \"\"\"\n        \"\"\"})\n      }\n\n      {\n        unnamed(truthy: true, falsey: false, nullish: null)\n        query\n      }\n    "], ["\n      query queryName($foo: ComplexType, $site: Site = MOBILE) {\n        whoever123is: node(id: [123, 456]) {\n          id\n          ... on User @defer {\n            field2 {\n              id\n              alias: field1(first: 10, after: $foo) @include(if: $foo) {\n                id\n                ...frag\n              }\n            }\n          }\n          ... @skip(unless: $foo) {\n            id\n          }\n          ... {\n            id\n          }\n        }\n      }\n\n      mutation likeStory {\n        like(story: 123) @defer {\n          story {\n            id\n          }\n        }\n      }\n\n      subscription StoryLikeSubscription($input: StoryLikeSubscribeInput) {\n        storyLikeSubscribe(input: $input) {\n          story {\n            likers {\n              count\n            }\n            likeSentence {\n              text\n            }\n          }\n        }\n      }\n\n      fragment frag on Friend {\n        foo(size: $size, bar: $b, obj: {key: \"value\", block: \"\"\"\n          block string uses \\\"\"\"\n        \"\"\"})\n      }\n\n      {\n        unnamed(truthy: true, falsey: false, nullish: null)\n        query\n      }\n    "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parse } from '../parser';
import { readFileSync } from 'fs';
import { print } from '../printer';
import { join } from 'path';
import dedent from '../../jsutils/dedent';
describe('Printer: Query document', function () {
  var kitchenSink = readFileSync(join(__dirname, '/kitchen-sink.graphql'), {
    encoding: 'utf8'
  });
  it('does not alter ast', function () {
    var ast = parse(kitchenSink);
    var astBefore = JSON.stringify(ast);
    print(ast);
    expect(JSON.stringify(ast)).to.equal(astBefore);
  });
  it('prints minimal ast', function () {
    var ast = {
      kind: 'Field',
      name: {
        kind: 'Name',
        value: 'foo'
      }
    };
    expect(print(ast)).to.equal('foo');
  });
  it('produces helpful error messages', function () {
    var badAst1 = {
      random: 'Data'
    };
    expect(function () {
      return print(badAst1);
    }).to.throw('Invalid AST Node: {"random":"Data"}');
  });
  it('correctly prints non-query operations without name', function () {
    var queryAstShorthanded = parse('query { id, name }');
    expect(print(queryAstShorthanded)).to.equal(dedent(_templateObject));
    var mutationAst = parse('mutation { id, name }');
    expect(print(mutationAst)).to.equal(dedent(_templateObject2));
    var queryAstWithArtifacts = parse('query ($foo: TestType) @testDirective { id, name }');
    expect(print(queryAstWithArtifacts)).to.equal(dedent(_templateObject3));
    var mutationAstWithArtifacts = parse('mutation ($foo: TestType) @testDirective { id, name }');
    expect(print(mutationAstWithArtifacts)).to.equal(dedent(_templateObject4));
  });
  describe('block string', function () {
    it('correctly prints single-line with leading space', function () {
      var mutationAstWithArtifacts = parse('{ field(arg: """    space-led value""") }');
      expect(print(mutationAstWithArtifacts)).to.equal(dedent(_templateObject5));
    });
    it('correctly prints string with a first line indentation', function () {
      var mutationAstWithArtifacts = parse("\n        {\n          field(arg: \"\"\"\n                first\n              line\n            indentation\n          \"\"\")\n        }\n      ");
      expect(print(mutationAstWithArtifacts)).to.equal(dedent(_templateObject6));
    });
    it('correctly prints single-line with leading space and quotation', function () {
      var mutationAstWithArtifacts = parse("\n        {\n          field(arg: \"\"\"    space-led value \"quoted string\"\n          \"\"\")\n        }\n      ");
      expect(print(mutationAstWithArtifacts)).to.equal(dedent(_templateObject7));
    });
  });
  it('Experimental: correctly prints fragment defined variables', function () {
    var fragmentWithVariable = parse("\n        fragment Foo($a: ComplexType, $b: Boolean = false) on TestType {\n          id\n        }\n      ", {
      experimentalFragmentVariables: true
    });
    expect(print(fragmentWithVariable)).to.equal(dedent(_templateObject8));
  });
  it('prints kitchen sink', function () {
    var ast = parse(kitchenSink);
    var printed = print(ast);
    expect(printed).to.equal(dedent(String.raw(_templateObject9)));
  });
});