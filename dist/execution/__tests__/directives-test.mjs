/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { execute } from '../execute';
import { describe, it } from 'mocha';
import { parse } from '../../language';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from '../../type';
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'TestType',
    fields: {
      a: {
        type: GraphQLString
      },
      b: {
        type: GraphQLString
      }
    }
  })
});
var data = {
  a: function a() {
    return 'a';
  },
  b: function b() {
    return 'b';
  }
};

function executeTestQuery(doc) {
  return execute(schema, parse(doc), data);
}

describe('Execute: handles directives', function () {
  describe('works without directives', function () {
    it('basic query works', function () {
      var result = executeTestQuery('{ a, b }');
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
  });
  describe('works on scalars', function () {
    it('if true includes scalar', function () {
      var result = executeTestQuery('{ a, b @include(if: true) }');
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('if false omits on scalar', function () {
      var result = executeTestQuery('{ a, b @include(if: false) }');
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    it('unless false includes scalar', function () {
      var result = executeTestQuery('{ a, b @skip(if: false) }');
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('unless true omits scalar', function () {
      var result = executeTestQuery('{ a, b @skip(if: true) }');
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  describe('works on fragment spreads', function () {
    it('if false omits fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @include(if: false)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    it('if true includes fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @include(if: true)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('unless false includes fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @skip(if: false)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('unless true omits fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @skip(if: true)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  describe('works on inline fragment', function () {
    it('if false omits inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @include(if: false) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    it('if true includes inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @include(if: true) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('unless false includes inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @skip(if: false) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('unless true includes inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @skip(if: true) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  describe('works on anonymous inline fragment', function () {
    it('if false omits anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... @include(if: false) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    it('if true includes anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... @include(if: true) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('unless false includes anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query Q {\n          a\n          ... @skip(if: false) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('unless true includes anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... @skip(if: true) {\n            b\n          }\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  describe('works with skip and include directives', function () {
    it('include and no skip', function () {
      var result = executeTestQuery("\n        {\n          a\n          b @include(if: true) @skip(if: false)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    it('include and skip', function () {
      var result = executeTestQuery("\n        {\n          a\n          b @include(if: true) @skip(if: true)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    it('no include or skip', function () {
      var result = executeTestQuery("\n        {\n          a\n          b @include(if: false) @skip(if: false)\n        }\n      ");
      expect(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
});