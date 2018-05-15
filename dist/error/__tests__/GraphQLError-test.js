"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _ = require("../../");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('GraphQLError', function () {
  (0, _mocha.it)('is a class and is a subclass of Error', function () {
    (0, _chai.expect)(new _.GraphQLError()).to.be.instanceof(Error);
    (0, _chai.expect)(new _.GraphQLError()).to.be.instanceof(_.GraphQLError);
  });
  (0, _mocha.it)('has a name, message, and stack trace', function () {
    var e = new _.GraphQLError('msg');
    (0, _chai.expect)(e.name).to.equal('GraphQLError');
    (0, _chai.expect)(e.stack).to.be.a('string');
    (0, _chai.expect)(e.message).to.equal('msg');
  });
  (0, _mocha.it)('uses the stack of an original error', function () {
    var original = new Error('original');
    var e = new _.GraphQLError('msg', undefined, undefined, undefined, undefined, original);
    (0, _chai.expect)(e.name).to.equal('GraphQLError');
    (0, _chai.expect)(e.stack).to.equal(original.stack);
    (0, _chai.expect)(e.message).to.equal('msg');
    (0, _chai.expect)(e.originalError).to.equal(original);
  });
  (0, _mocha.it)('creates new stack if original error has no stack', function () {
    var original = {
      message: 'original'
    };
    var e = new _.GraphQLError('msg', null, null, null, null, original);
    (0, _chai.expect)(e.name).to.equal('GraphQLError');
    (0, _chai.expect)(e.stack).to.be.a('string');
    (0, _chai.expect)(e.message).to.equal('msg');
    (0, _chai.expect)(e.originalError).to.equal(original);
  });
  (0, _mocha.it)('converts nodes to positions and locations', function () {
    var source = new _.Source("{\n      field\n    }");
    var ast = (0, _.parse)(source);
    var fieldNode = ast.definitions[0].selectionSet.selections[0];
    var e = new _.GraphQLError('msg', [fieldNode]);
    (0, _chai.expect)(e.nodes).to.deep.equal([fieldNode]);
    (0, _chai.expect)(e.source).to.equal(source);
    (0, _chai.expect)(e.positions).to.deep.equal([8]);
    (0, _chai.expect)(e.locations).to.deep.equal([{
      line: 2,
      column: 7
    }]);
  });
  (0, _mocha.it)('converts single node to positions and locations', function () {
    var source = new _.Source("{\n      field\n    }");
    var ast = (0, _.parse)(source);
    var fieldNode = ast.definitions[0].selectionSet.selections[0];
    var e = new _.GraphQLError('msg', fieldNode); // Non-array value.

    (0, _chai.expect)(e.nodes).to.deep.equal([fieldNode]);
    (0, _chai.expect)(e.source).to.equal(source);
    (0, _chai.expect)(e.positions).to.deep.equal([8]);
    (0, _chai.expect)(e.locations).to.deep.equal([{
      line: 2,
      column: 7
    }]);
  });
  (0, _mocha.it)('converts node with loc.start === 0 to positions and locations', function () {
    var source = new _.Source("{\n      field\n    }");
    var ast = (0, _.parse)(source);
    var operationNode = ast.definitions[0];
    var e = new _.GraphQLError('msg', [operationNode]);
    (0, _chai.expect)(e.nodes).to.deep.equal([operationNode]);
    (0, _chai.expect)(e.source).to.equal(source);
    (0, _chai.expect)(e.positions).to.deep.equal([0]);
    (0, _chai.expect)(e.locations).to.deep.equal([{
      line: 1,
      column: 1
    }]);
  });
  (0, _mocha.it)('converts source and positions to locations', function () {
    var source = new _.Source("{\n      field\n    }");
    var e = new _.GraphQLError('msg', null, source, [10]);
    (0, _chai.expect)(e.nodes).to.equal(undefined);
    (0, _chai.expect)(e.source).to.equal(source);
    (0, _chai.expect)(e.positions).to.deep.equal([10]);
    (0, _chai.expect)(e.locations).to.deep.equal([{
      line: 2,
      column: 9
    }]);
  });
  (0, _mocha.it)('serializes to include message', function () {
    var e = new _.GraphQLError('msg');
    (0, _chai.expect)(JSON.stringify(e)).to.equal('{"message":"msg"}');
  });
  (0, _mocha.it)('serializes to include message and locations', function () {
    var node = (0, _.parse)('{ field }').definitions[0].selectionSet.selections[0];
    var e = new _.GraphQLError('msg', [node]);
    (0, _chai.expect)(JSON.stringify(e)).to.equal('{"message":"msg","locations":[{"line":1,"column":3}]}');
  });
  (0, _mocha.it)('serializes to include path', function () {
    var e = new _.GraphQLError('msg', null, null, null, ['path', 3, 'to', 'field']);
    (0, _chai.expect)(e.path).to.deep.equal(['path', 3, 'to', 'field']);
    (0, _chai.expect)(JSON.stringify(e)).to.equal('{"message":"msg","path":["path",3,"to","field"]}');
  });
  (0, _mocha.it)('default error formatter includes path', function () {
    var e = new _.GraphQLError('msg', null, null, null, ['path', 3, 'to', 'field']);
    (0, _chai.expect)((0, _.formatError)(e)).to.deep.equal({
      message: 'msg',
      locations: undefined,
      path: ['path', 3, 'to', 'field']
    });
  });
  (0, _mocha.it)('default error formatter includes extension fields', function () {
    var e = new _.GraphQLError('msg', null, null, null, null, null, {
      foo: 'bar'
    });
    (0, _chai.expect)((0, _.formatError)(e)).to.deep.equal({
      message: 'msg',
      locations: undefined,
      path: undefined,
      extensions: {
        foo: 'bar'
      }
    });
  });
});