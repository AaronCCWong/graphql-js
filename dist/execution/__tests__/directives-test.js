"use strict";

var _chai = require("chai");

var _execute = require("../execute");

var _mocha = require("mocha");

var _language = require("../../language");

var _type = require("../../type");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var schema = new _type.GraphQLSchema({
  query: new _type.GraphQLObjectType({
    name: 'TestType',
    fields: {
      a: {
        type: _type.GraphQLString
      },
      b: {
        type: _type.GraphQLString
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
  return (0, _execute.execute)(schema, (0, _language.parse)(doc), data);
}

(0, _mocha.describe)('Execute: handles directives', function () {
  (0, _mocha.describe)('works without directives', function () {
    (0, _mocha.it)('basic query works', function () {
      var result = executeTestQuery('{ a, b }');
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
  });
  (0, _mocha.describe)('works on scalars', function () {
    (0, _mocha.it)('if true includes scalar', function () {
      var result = executeTestQuery('{ a, b @include(if: true) }');
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('if false omits on scalar', function () {
      var result = executeTestQuery('{ a, b @include(if: false) }');
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    (0, _mocha.it)('unless false includes scalar', function () {
      var result = executeTestQuery('{ a, b @skip(if: false) }');
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('unless true omits scalar', function () {
      var result = executeTestQuery('{ a, b @skip(if: true) }');
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  (0, _mocha.describe)('works on fragment spreads', function () {
    (0, _mocha.it)('if false omits fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @include(if: false)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    (0, _mocha.it)('if true includes fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @include(if: true)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('unless false includes fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @skip(if: false)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('unless true omits fragment spread', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ...Frag @skip(if: true)\n        }\n        fragment Frag on TestType {\n          b\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  (0, _mocha.describe)('works on inline fragment', function () {
    (0, _mocha.it)('if false omits inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @include(if: false) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    (0, _mocha.it)('if true includes inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @include(if: true) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('unless false includes inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @skip(if: false) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('unless true includes inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... on TestType @skip(if: true) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  (0, _mocha.describe)('works on anonymous inline fragment', function () {
    (0, _mocha.it)('if false omits anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... @include(if: false) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    (0, _mocha.it)('if true includes anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... @include(if: true) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('unless false includes anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query Q {\n          a\n          ... @skip(if: false) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('unless true includes anonymous inline fragment', function () {
      var result = executeTestQuery("\n        query {\n          a\n          ... @skip(if: true) {\n            b\n          }\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
  (0, _mocha.describe)('works with skip and include directives', function () {
    (0, _mocha.it)('include and no skip', function () {
      var result = executeTestQuery("\n        {\n          a\n          b @include(if: true) @skip(if: false)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a',
          b: 'b'
        }
      });
    });
    (0, _mocha.it)('include and skip', function () {
      var result = executeTestQuery("\n        {\n          a\n          b @include(if: true) @skip(if: true)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
    (0, _mocha.it)('no include or skip', function () {
      var result = executeTestQuery("\n        {\n          a\n          b @include(if: false) @skip(if: false)\n        }\n      ");
      (0, _chai.expect)(result).to.deep.equal({
        data: {
          a: 'a'
        }
      });
    });
  });
});