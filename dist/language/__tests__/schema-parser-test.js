"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _parser = require("../parser");

var _toJSONDeep = _interopRequireDefault(require("./toJSONDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function expectSyntaxError(text, message, location) {
  (0, _chai.expect)(function () {
    return (0, _parser.parse)(text);
  }).to.throw(message).with.deep.property('locations', [location]);
}

function typeNode(name, loc) {
  return {
    kind: 'NamedType',
    name: nameNode(name, loc),
    loc: loc
  };
}

function nameNode(name, loc) {
  return {
    kind: 'Name',
    value: name,
    loc: loc
  };
}

function fieldNode(name, type, loc) {
  return fieldNodeWithArgs(name, type, [], loc);
}

function fieldNodeWithArgs(name, type, args, loc) {
  return {
    kind: 'FieldDefinition',
    description: undefined,
    name: name,
    arguments: args,
    type: type,
    directives: [],
    loc: loc
  };
}

function enumValueNode(name, loc) {
  return {
    kind: 'EnumValueDefinition',
    name: nameNode(name, loc),
    description: undefined,
    directives: [],
    loc: loc
  };
}

function inputValueNode(name, type, defaultValue, loc) {
  return {
    kind: 'InputValueDefinition',
    name: name,
    description: undefined,
    type: type,
    defaultValue: defaultValue,
    directives: [],
    loc: loc
  };
}

(0, _mocha.describe)('Schema Parser', function () {
  (0, _mocha.it)('Simple type', function () {
    var doc = (0, _parser.parse)("\ntype Hello {\n  world: String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        interfaces: [],
        directives: [],
        fields: [fieldNode(nameNode('world', {
          start: 16,
          end: 21
        }), typeNode('String', {
          start: 23,
          end: 29
        }), {
          start: 16,
          end: 29
        })],
        loc: {
          start: 1,
          end: 31
        }
      }],
      loc: {
        start: 0,
        end: 31
      }
    });
  });
  (0, _mocha.it)('parses type with description string', function () {
    var doc = (0, _parser.parse)("\n\"Description\"\ntype Hello {\n  world: String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.nested.deep.property('definitions[0].description', {
      kind: 'StringValue',
      value: 'Description',
      block: false,
      loc: {
        start: 1,
        end: 14
      }
    });
  });
  (0, _mocha.it)('parses type with description multi-line string', function () {
    var doc = (0, _parser.parse)("\n\"\"\"\nDescription\n\"\"\"\n# Even with comments between them\ntype Hello {\n  world: String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.nested.deep.property('definitions[0].description', {
      kind: 'StringValue',
      value: 'Description',
      block: true,
      loc: {
        start: 1,
        end: 20
      }
    });
  });
  (0, _mocha.it)('Simple extension', function () {
    var doc = (0, _parser.parse)("\nextend type Hello {\n  world: String\n}\n");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeExtension',
        name: nameNode('Hello', {
          start: 13,
          end: 18
        }),
        interfaces: [],
        directives: [],
        fields: [fieldNode(nameNode('world', {
          start: 23,
          end: 28
        }), typeNode('String', {
          start: 30,
          end: 36
        }), {
          start: 23,
          end: 36
        })],
        loc: {
          start: 1,
          end: 38
        }
      }],
      loc: {
        start: 0,
        end: 39
      }
    });
  });
  (0, _mocha.it)('Extension without fields', function () {
    var doc = (0, _parser.parse)('extend type Hello implements Greeting');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeExtension',
        name: nameNode('Hello', {
          start: 12,
          end: 17
        }),
        interfaces: [typeNode('Greeting', {
          start: 29,
          end: 37
        })],
        directives: [],
        fields: [],
        loc: {
          start: 0,
          end: 37
        }
      }],
      loc: {
        start: 0,
        end: 37
      }
    });
  });
  (0, _mocha.it)('Extension without fields followed by extension', function () {
    var doc = (0, _parser.parse)("\n      extend type Hello implements Greeting\n\n      extend type Hello implements SecondGreeting\n    ");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeExtension',
        name: nameNode('Hello', {
          start: 19,
          end: 24
        }),
        interfaces: [typeNode('Greeting', {
          start: 36,
          end: 44
        })],
        directives: [],
        fields: [],
        loc: {
          start: 7,
          end: 44
        }
      }, {
        kind: 'ObjectTypeExtension',
        name: nameNode('Hello', {
          start: 64,
          end: 69
        }),
        interfaces: [typeNode('SecondGreeting', {
          start: 81,
          end: 95
        })],
        directives: [],
        fields: [],
        loc: {
          start: 52,
          end: 95
        }
      }],
      loc: {
        start: 0,
        end: 100
      }
    });
  });
  (0, _mocha.it)('Extension without anything throws', function () {
    expectSyntaxError('extend type Hello', 'Unexpected <EOF>', {
      line: 1,
      column: 18
    });
  });
  (0, _mocha.it)('Extension do not include descriptions', function () {
    expectSyntaxError("\n      \"Description\"\n      extend type Hello {\n        world: String\n      }", 'Unexpected Name "extend"', {
      line: 3,
      column: 7
    });
    expectSyntaxError("\n      extend \"Description\" type Hello {\n        world: String\n      }", 'Unexpected String "Description"', {
      line: 2,
      column: 14
    });
  });
  (0, _mocha.it)('Schema extension', function () {
    var body = "\n      extend schema {\n        mutation: Mutation\n      }";
    var doc = (0, _parser.parse)(body);
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'SchemaExtension',
        directives: [],
        operationTypes: [{
          kind: 'OperationTypeDefinition',
          operation: 'mutation',
          type: typeNode('Mutation', {
            start: 41,
            end: 49
          }),
          loc: {
            start: 31,
            end: 49
          }
        }],
        loc: {
          start: 7,
          end: 57
        }
      }],
      loc: {
        start: 0,
        end: 57
      }
    });
  });
  (0, _mocha.it)('Schema extension with only directives', function () {
    var body = 'extend schema @directive';
    var doc = (0, _parser.parse)(body);
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'SchemaExtension',
        directives: [{
          kind: 'Directive',
          name: nameNode('directive', {
            start: 15,
            end: 24
          }),
          arguments: [],
          loc: {
            start: 14,
            end: 24
          }
        }],
        operationTypes: [],
        loc: {
          start: 0,
          end: 24
        }
      }],
      loc: {
        start: 0,
        end: 24
      }
    });
  });
  (0, _mocha.it)('Schema extension without anything throws', function () {
    expectSyntaxError('extend schema', 'Unexpected <EOF>', {
      line: 1,
      column: 14
    });
  });
  (0, _mocha.it)('Simple non-null type', function () {
    var doc = (0, _parser.parse)("\ntype Hello {\n  world: String!\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        interfaces: [],
        directives: [],
        fields: [fieldNode(nameNode('world', {
          start: 16,
          end: 21
        }), {
          kind: 'NonNullType',
          type: typeNode('String', {
            start: 23,
            end: 29
          }),
          loc: {
            start: 23,
            end: 30
          }
        }, {
          start: 16,
          end: 30
        })],
        loc: {
          start: 1,
          end: 32
        }
      }],
      loc: {
        start: 0,
        end: 32
      }
    });
  });
  (0, _mocha.it)('Simple type inheriting interface', function () {
    var doc = (0, _parser.parse)('type Hello implements World { field: String }');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 5,
          end: 10
        }),
        description: undefined,
        interfaces: [typeNode('World', {
          start: 22,
          end: 27
        })],
        directives: [],
        fields: [fieldNode(nameNode('field', {
          start: 30,
          end: 35
        }), typeNode('String', {
          start: 37,
          end: 43
        }), {
          start: 30,
          end: 43
        })],
        loc: {
          start: 0,
          end: 45
        }
      }],
      loc: {
        start: 0,
        end: 45
      }
    });
  });
  (0, _mocha.it)('Simple type inheriting multiple interfaces', function () {
    var doc = (0, _parser.parse)('type Hello implements Wo & rld { field: String }');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 5,
          end: 10
        }),
        description: undefined,
        interfaces: [typeNode('Wo', {
          start: 22,
          end: 24
        }), typeNode('rld', {
          start: 27,
          end: 30
        })],
        directives: [],
        fields: [fieldNode(nameNode('field', {
          start: 33,
          end: 38
        }), typeNode('String', {
          start: 40,
          end: 46
        }), {
          start: 33,
          end: 46
        })],
        loc: {
          start: 0,
          end: 48
        }
      }],
      loc: {
        start: 0,
        end: 48
      }
    });
  });
  (0, _mocha.it)('Simple type inheriting multiple interfaces with leading ampersand', function () {
    var doc = (0, _parser.parse)('type Hello implements & Wo & rld { field: String }');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 5,
          end: 10
        }),
        description: undefined,
        interfaces: [typeNode('Wo', {
          start: 24,
          end: 26
        }), typeNode('rld', {
          start: 29,
          end: 32
        })],
        directives: [],
        fields: [fieldNode(nameNode('field', {
          start: 35,
          end: 40
        }), typeNode('String', {
          start: 42,
          end: 48
        }), {
          start: 35,
          end: 48
        })],
        loc: {
          start: 0,
          end: 50
        }
      }],
      loc: {
        start: 0,
        end: 50
      }
    });
  });
  (0, _mocha.it)('Single value enum', function () {
    var doc = (0, _parser.parse)('enum Hello { WORLD }');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'EnumTypeDefinition',
        name: nameNode('Hello', {
          start: 5,
          end: 10
        }),
        description: undefined,
        directives: [],
        values: [enumValueNode('WORLD', {
          start: 13,
          end: 18
        })],
        loc: {
          start: 0,
          end: 20
        }
      }],
      loc: {
        start: 0,
        end: 20
      }
    });
  });
  (0, _mocha.it)('Double value enum', function () {
    var doc = (0, _parser.parse)('enum Hello { WO, RLD }');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'EnumTypeDefinition',
        name: nameNode('Hello', {
          start: 5,
          end: 10
        }),
        description: undefined,
        directives: [],
        values: [enumValueNode('WO', {
          start: 13,
          end: 15
        }), enumValueNode('RLD', {
          start: 17,
          end: 20
        })],
        loc: {
          start: 0,
          end: 22
        }
      }],
      loc: {
        start: 0,
        end: 22
      }
    });
  });
  (0, _mocha.it)('Simple interface', function () {
    var doc = (0, _parser.parse)("\ninterface Hello {\n  world: String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'InterfaceTypeDefinition',
        name: nameNode('Hello', {
          start: 11,
          end: 16
        }),
        description: undefined,
        directives: [],
        fields: [fieldNode(nameNode('world', {
          start: 21,
          end: 26
        }), typeNode('String', {
          start: 28,
          end: 34
        }), {
          start: 21,
          end: 34
        })],
        loc: {
          start: 1,
          end: 36
        }
      }],
      loc: {
        start: 0,
        end: 36
      }
    });
  });
  (0, _mocha.it)('Simple field with arg', function () {
    var doc = (0, _parser.parse)("\ntype Hello {\n  world(flag: Boolean): String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        interfaces: [],
        directives: [],
        fields: [fieldNodeWithArgs(nameNode('world', {
          start: 16,
          end: 21
        }), typeNode('String', {
          start: 38,
          end: 44
        }), [inputValueNode(nameNode('flag', {
          start: 22,
          end: 26
        }), typeNode('Boolean', {
          start: 28,
          end: 35
        }), undefined, {
          start: 22,
          end: 35
        })], {
          start: 16,
          end: 44
        })],
        loc: {
          start: 1,
          end: 46
        }
      }],
      loc: {
        start: 0,
        end: 46
      }
    });
  });
  (0, _mocha.it)('Simple field with arg with default value', function () {
    var doc = (0, _parser.parse)("\ntype Hello {\n  world(flag: Boolean = true): String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        interfaces: [],
        directives: [],
        fields: [fieldNodeWithArgs(nameNode('world', {
          start: 16,
          end: 21
        }), typeNode('String', {
          start: 45,
          end: 51
        }), [inputValueNode(nameNode('flag', {
          start: 22,
          end: 26
        }), typeNode('Boolean', {
          start: 28,
          end: 35
        }), {
          kind: 'BooleanValue',
          value: true,
          loc: {
            start: 38,
            end: 42
          }
        }, {
          start: 22,
          end: 42
        })], {
          start: 16,
          end: 51
        })],
        loc: {
          start: 1,
          end: 53
        }
      }],
      loc: {
        start: 0,
        end: 53
      }
    });
  });
  (0, _mocha.it)('Simple field with list arg', function () {
    var doc = (0, _parser.parse)("\ntype Hello {\n  world(things: [String]): String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        interfaces: [],
        directives: [],
        fields: [fieldNodeWithArgs(nameNode('world', {
          start: 16,
          end: 21
        }), typeNode('String', {
          start: 41,
          end: 47
        }), [inputValueNode(nameNode('things', {
          start: 22,
          end: 28
        }), {
          kind: 'ListType',
          type: typeNode('String', {
            start: 31,
            end: 37
          }),
          loc: {
            start: 30,
            end: 38
          }
        }, undefined, {
          start: 22,
          end: 38
        })], {
          start: 16,
          end: 47
        })],
        loc: {
          start: 1,
          end: 49
        }
      }],
      loc: {
        start: 0,
        end: 49
      }
    });
  });
  (0, _mocha.it)('Simple field with two args', function () {
    var doc = (0, _parser.parse)("\ntype Hello {\n  world(argOne: Boolean, argTwo: Int): String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        interfaces: [],
        directives: [],
        fields: [fieldNodeWithArgs(nameNode('world', {
          start: 16,
          end: 21
        }), typeNode('String', {
          start: 53,
          end: 59
        }), [inputValueNode(nameNode('argOne', {
          start: 22,
          end: 28
        }), typeNode('Boolean', {
          start: 30,
          end: 37
        }), undefined, {
          start: 22,
          end: 37
        }), inputValueNode(nameNode('argTwo', {
          start: 39,
          end: 45
        }), typeNode('Int', {
          start: 47,
          end: 50
        }), undefined, {
          start: 39,
          end: 50
        })], {
          start: 16,
          end: 59
        })],
        loc: {
          start: 1,
          end: 61
        }
      }],
      loc: {
        start: 0,
        end: 61
      }
    });
  });
  (0, _mocha.it)('Simple union', function () {
    var doc = (0, _parser.parse)('union Hello = World');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'UnionTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        directives: [],
        types: [typeNode('World', {
          start: 14,
          end: 19
        })],
        loc: {
          start: 0,
          end: 19
        }
      }],
      loc: {
        start: 0,
        end: 19
      }
    });
  });
  (0, _mocha.it)('Union with two types', function () {
    var doc = (0, _parser.parse)('union Hello = Wo | Rld');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'UnionTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        directives: [],
        types: [typeNode('Wo', {
          start: 14,
          end: 16
        }), typeNode('Rld', {
          start: 19,
          end: 22
        })],
        loc: {
          start: 0,
          end: 22
        }
      }],
      loc: {
        start: 0,
        end: 22
      }
    });
  });
  (0, _mocha.it)('Union with two types and leading pipe', function () {
    var doc = (0, _parser.parse)('union Hello = | Wo | Rld');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'UnionTypeDefinition',
        name: nameNode('Hello', {
          start: 6,
          end: 11
        }),
        description: undefined,
        directives: [],
        types: [typeNode('Wo', {
          start: 16,
          end: 18
        }), typeNode('Rld', {
          start: 21,
          end: 24
        })],
        loc: {
          start: 0,
          end: 24
        }
      }],
      loc: {
        start: 0,
        end: 24
      }
    });
  });
  (0, _mocha.it)('Union fails with no types', function () {
    expectSyntaxError('union Hello = |', 'Expected Name, found <EOF>', {
      line: 1,
      column: 16
    });
  });
  (0, _mocha.it)('Union fails with leading douple pipe', function () {
    expectSyntaxError('union Hello = || Wo | Rld', 'Expected Name, found |', {
      line: 1,
      column: 16
    });
  });
  (0, _mocha.it)('Union fails with double pipe', function () {
    expectSyntaxError('union Hello = Wo || Rld', 'Expected Name, found |', {
      line: 1,
      column: 19
    });
  });
  (0, _mocha.it)('Union fails with trailing pipe', function () {
    expectSyntaxError('union Hello = | Wo | Rld |', 'Expected Name, found <EOF>', {
      line: 1,
      column: 27
    });
  });
  (0, _mocha.it)('Scalar', function () {
    var doc = (0, _parser.parse)('scalar Hello');
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'ScalarTypeDefinition',
        name: nameNode('Hello', {
          start: 7,
          end: 12
        }),
        description: undefined,
        directives: [],
        loc: {
          start: 0,
          end: 12
        }
      }],
      loc: {
        start: 0,
        end: 12
      }
    });
  });
  (0, _mocha.it)('Simple input object', function () {
    var doc = (0, _parser.parse)("\ninput Hello {\n  world: String\n}");
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.deep.equal({
      kind: 'Document',
      definitions: [{
        kind: 'InputObjectTypeDefinition',
        name: nameNode('Hello', {
          start: 7,
          end: 12
        }),
        description: undefined,
        directives: [],
        fields: [inputValueNode(nameNode('world', {
          start: 17,
          end: 22
        }), typeNode('String', {
          start: 24,
          end: 30
        }), undefined, {
          start: 17,
          end: 30
        })],
        loc: {
          start: 1,
          end: 32
        }
      }],
      loc: {
        start: 0,
        end: 32
      }
    });
  });
  (0, _mocha.it)('Simple input object with args should fail', function () {
    expectSyntaxError("\n      input Hello {\n        world(foo: Int): String\n      }", 'Expected :, found (', {
      line: 3,
      column: 14
    });
  });
  (0, _mocha.it)('Directive with incorrect locations', function () {
    expectSyntaxError("\n      directive @foo on FIELD | INCORRECT_LOCATION", 'Unexpected Name "INCORRECT_LOCATION"', {
      line: 2,
      column: 33
    });
  });
  (0, _mocha.it)('Option: allowLegacySDLEmptyFields supports type with empty fields', function () {
    var body = 'type Hello { }';
    (0, _chai.expect)(function () {
      return (0, _parser.parse)(body);
    }).to.throw('Syntax Error: Expected Name, found }');
    var doc = (0, _parser.parse)(body, {
      allowLegacySDLEmptyFields: true
    });
    (0, _chai.expect)(doc).to.have.deep.nested.property('definitions[0].fields', []);
  });
  (0, _mocha.it)('Option: allowLegacySDLImplementsInterfaces', function () {
    var body = 'type Hello implements Wo rld { field: String }';
    (0, _chai.expect)(function () {
      return (0, _parser.parse)(body);
    }).to.throw('Syntax Error: Unexpected Name "rld"');
    var doc = (0, _parser.parse)(body, {
      allowLegacySDLImplementsInterfaces: true
    });
    (0, _chai.expect)((0, _toJSONDeep.default)(doc)).to.have.deep.nested.property('definitions[0].interfaces', [typeNode('Wo', {
      start: 22,
      end: 24
    }), typeNode('rld', {
      start: 25,
      end: 28
    })]);
  });
});