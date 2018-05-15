"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _parser = require("../parser");

var _printer = require("../printer");

var _fs = require("fs");

var _visitor = require("../visitor");

var _path = require("path");

var _TypeInfo = require("../../utilities/TypeInfo");

var _harness = require("../../validation/__tests__/harness");

var _type = require("../../type");

var _kinds = require("../kinds");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function getNodeByPath(ast, path) {
  var result = ast;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;
      (0, _chai.expect)(result).to.have.property(key);
      result = result[key];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
}

function checkVisitorFnArgs(ast, args, isEdited) {
  var node = args[0],
      key = args[1],
      parent = args[2],
      path = args[3],
      ancestors = args[4];
  (0, _chai.expect)(node).to.be.an.instanceof(Object);
  (0, _chai.expect)(node.kind).to.be.oneOf(Object.values(_kinds.Kind));
  var isRoot = key === undefined;

  if (isRoot) {
    if (!isEdited) {
      (0, _chai.expect)(node).to.equal(ast);
    }

    (0, _chai.expect)(parent).to.equal(undefined);
    (0, _chai.expect)(path).to.deep.equal([]);
    (0, _chai.expect)(ancestors).to.deep.equal([]);
    return;
  }

  (0, _chai.expect)(_typeof(key)).to.be.oneOf(['number', 'string']);
  (0, _chai.expect)(parent).to.have.property(key);
  (0, _chai.expect)(path).to.be.an.instanceof(Array);
  (0, _chai.expect)(path[path.length - 1]).to.equal(key);
  (0, _chai.expect)(ancestors).to.be.an.instanceof(Array);
  (0, _chai.expect)(ancestors.length).to.equal(path.length - 1);

  if (!isEdited) {
    (0, _chai.expect)(parent[key]).to.equal(node);
    (0, _chai.expect)(getNodeByPath(ast, path)).to.be.equal(node);

    for (var i = 0; i < ancestors.length; ++i) {
      var ancestorPath = path.slice(0, i);
      (0, _chai.expect)(ancestors[i]).to.equal(getNodeByPath(ast, ancestorPath));
    }
  }
}

(0, _mocha.describe)('Visitor', function () {
  (0, _mocha.it)('validates path argument', function () {
    var visited = [];
    var ast = (0, _parser.parse)('{ a }', {
      noLocation: true
    });
    (0, _visitor.visit)(ast, {
      enter: function enter(node, key, parent, path) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['enter', path.slice()]);
      },
      leave: function leave(node, key, parent, path) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['leave', path.slice()]);
      }
    });
    (0, _chai.expect)(visited).to.deep.equal([['enter', []], ['enter', ['definitions', 0]], ['enter', ['definitions', 0, 'selectionSet']], ['enter', ['definitions', 0, 'selectionSet', 'selections', 0]], ['enter', ['definitions', 0, 'selectionSet', 'selections', 0, 'name']], ['leave', ['definitions', 0, 'selectionSet', 'selections', 0, 'name']], ['leave', ['definitions', 0, 'selectionSet', 'selections', 0]], ['leave', ['definitions', 0, 'selectionSet']], ['leave', ['definitions', 0]], ['leave', []]]);
  });
  (0, _mocha.it)('allows editing a node both on enter and on leave', function () {
    var ast = (0, _parser.parse)('{ a, b, c { a, b, c } }', {
      noLocation: true
    });
    var selectionSet;
    var editedAst = (0, _visitor.visit)(ast, {
      OperationDefinition: {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          selectionSet = node.selectionSet;
          return _objectSpread({}, node, {
            selectionSet: {
              kind: 'SelectionSet',
              selections: []
            },
            didEnter: true
          });
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments,
          /* isEdited */
          true);
          return _objectSpread({}, node, {
            selectionSet: selectionSet,
            didLeave: true
          });
        }
      }
    });
    (0, _chai.expect)(editedAst).to.deep.equal(_objectSpread({}, ast, {
      definitions: [_objectSpread({}, ast.definitions[0], {
        didEnter: true,
        didLeave: true
      })]
    }));
  });
  (0, _mocha.it)('allows editing the root node on enter and on leave', function () {
    var ast = (0, _parser.parse)('{ a, b, c { a, b, c } }', {
      noLocation: true
    });
    var definitions = ast.definitions;
    var editedAst = (0, _visitor.visit)(ast, {
      Document: {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          return _objectSpread({}, node, {
            definitions: [],
            didEnter: true
          });
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments,
          /* isEdited */
          true);
          return _objectSpread({}, node, {
            definitions: definitions,
            didLeave: true
          });
        }
      }
    });
    (0, _chai.expect)(editedAst).to.deep.equal(_objectSpread({}, ast, {
      didEnter: true,
      didLeave: true
    }));
  });
  (0, _mocha.it)('allows for editing on enter', function () {
    var ast = (0, _parser.parse)('{ a, b, c { a, b, c } }', {
      noLocation: true
    });
    var editedAst = (0, _visitor.visit)(ast, {
      enter: function enter(node) {
        checkVisitorFnArgs(ast, arguments);

        if (node.kind === 'Field' && node.name.value === 'b') {
          return null;
        }
      }
    });
    (0, _chai.expect)(ast).to.deep.equal((0, _parser.parse)('{ a, b, c { a, b, c } }', {
      noLocation: true
    }));
    (0, _chai.expect)(editedAst).to.deep.equal((0, _parser.parse)('{ a,    c { a,    c } }', {
      noLocation: true
    }));
  });
  (0, _mocha.it)('allows for editing on leave', function () {
    var ast = (0, _parser.parse)('{ a, b, c { a, b, c } }', {
      noLocation: true
    });
    var editedAst = (0, _visitor.visit)(ast, {
      leave: function leave(node) {
        checkVisitorFnArgs(ast, arguments,
        /* isEdited */
        true);

        if (node.kind === 'Field' && node.name.value === 'b') {
          return null;
        }
      }
    });
    (0, _chai.expect)(ast).to.deep.equal((0, _parser.parse)('{ a, b, c { a, b, c } }', {
      noLocation: true
    }));
    (0, _chai.expect)(editedAst).to.deep.equal((0, _parser.parse)('{ a,    c { a,    c } }', {
      noLocation: true
    }));
  });
  (0, _mocha.it)('visits edited node', function () {
    var addedField = {
      kind: 'Field',
      name: {
        kind: 'Name',
        value: '__typename'
      }
    };
    var didVisitAddedField;
    var ast = (0, _parser.parse)('{ a { x } }', {
      noLocation: true
    });
    (0, _visitor.visit)(ast, {
      enter: function enter(node) {
        checkVisitorFnArgs(ast, arguments,
        /* isEdited */
        true);

        if (node.kind === 'Field' && node.name.value === 'a') {
          return {
            kind: 'Field',
            selectionSet: [addedField].concat(node.selectionSet)
          };
        }

        if (node === addedField) {
          didVisitAddedField = true;
        }
      }
    });
    (0, _chai.expect)(didVisitAddedField).to.equal(true);
  });
  (0, _mocha.it)('allows skipping a sub-tree', function () {
    var visited = [];
    var ast = (0, _parser.parse)('{ a, b { x }, c }', {
      noLocation: true
    });
    (0, _visitor.visit)(ast, {
      enter: function enter(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['enter', node.kind, node.value]);

        if (node.kind === 'Field' && node.name.value === 'b') {
          return false;
        }
      },
      leave: function leave(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['leave', node.kind, node.value]);
      }
    });
    (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'c'], ['leave', 'Name', 'c'], ['leave', 'Field', undefined], ['leave', 'SelectionSet', undefined], ['leave', 'OperationDefinition', undefined], ['leave', 'Document', undefined]]);
  });
  (0, _mocha.it)('allows early exit while visiting', function () {
    var visited = [];
    var ast = (0, _parser.parse)('{ a, b { x }, c }', {
      noLocation: true
    });
    (0, _visitor.visit)(ast, {
      enter: function enter(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['enter', node.kind, node.value]);

        if (node.kind === 'Name' && node.value === 'x') {
          return _visitor.BREAK;
        }
      },
      leave: function leave(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['leave', node.kind, node.value]);
      }
    });
    (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'b'], ['leave', 'Name', 'b'], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'x']]);
  });
  (0, _mocha.it)('allows early exit while leaving', function () {
    var visited = [];
    var ast = (0, _parser.parse)('{ a, b { x }, c }', {
      noLocation: true
    });
    (0, _visitor.visit)(ast, {
      enter: function enter(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['enter', node.kind, node.value]);
      },
      leave: function leave(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['leave', node.kind, node.value]);

        if (node.kind === 'Name' && node.value === 'x') {
          return _visitor.BREAK;
        }
      }
    });
    (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'b'], ['leave', 'Name', 'b'], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'x'], ['leave', 'Name', 'x']]);
  });
  (0, _mocha.it)('allows a named functions visitor API', function () {
    var visited = [];
    var ast = (0, _parser.parse)('{ a, b { x }, c }', {
      noLocation: true
    });
    (0, _visitor.visit)(ast, {
      Name: function Name(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['enter', node.kind, node.value]);
      },
      SelectionSet: {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['enter', node.kind, node.value]);
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['leave', node.kind, node.value]);
        }
      }
    });
    (0, _chai.expect)(visited).to.deep.equal([['enter', 'SelectionSet', undefined], ['enter', 'Name', 'a'], ['enter', 'Name', 'b'], ['enter', 'SelectionSet', undefined], ['enter', 'Name', 'x'], ['leave', 'SelectionSet', undefined], ['enter', 'Name', 'c'], ['leave', 'SelectionSet', undefined]]);
  });
  (0, _mocha.it)('Experimental: visits variables defined in fragments', function () {
    var ast = (0, _parser.parse)('fragment a($v: Boolean = false) on t { f }', {
      noLocation: true,
      experimentalFragmentVariables: true
    });
    var visited = [];
    (0, _visitor.visit)(ast, {
      enter: function enter(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['enter', node.kind, node.value]);
      },
      leave: function leave(node) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['leave', node.kind, node.value]);
      }
    });
    (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'FragmentDefinition', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['enter', 'VariableDefinition', undefined], ['enter', 'Variable', undefined], ['enter', 'Name', 'v'], ['leave', 'Name', 'v'], ['leave', 'Variable', undefined], ['enter', 'NamedType', undefined], ['enter', 'Name', 'Boolean'], ['leave', 'Name', 'Boolean'], ['leave', 'NamedType', undefined], ['enter', 'BooleanValue', false], ['leave', 'BooleanValue', false], ['leave', 'VariableDefinition', undefined], ['enter', 'NamedType', undefined], ['enter', 'Name', 't'], ['leave', 'Name', 't'], ['leave', 'NamedType', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'f'], ['leave', 'Name', 'f'], ['leave', 'Field', undefined], ['leave', 'SelectionSet', undefined], ['leave', 'FragmentDefinition', undefined], ['leave', 'Document', undefined]]);
  });
  var kitchenSink = (0, _fs.readFileSync)((0, _path.join)(__dirname, '/kitchen-sink.graphql'), {
    encoding: 'utf8'
  });
  (0, _mocha.it)('visits kitchen sink', function () {
    var ast = (0, _parser.parse)(kitchenSink);
    var visited = [];
    (0, _visitor.visit)(ast, {
      enter: function enter(node, key, parent) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['enter', node.kind, key, parent && parent.kind]);
      },
      leave: function leave(node, key, parent) {
        checkVisitorFnArgs(ast, arguments);
        visited.push(['leave', node.kind, key, parent && parent.kind]);
      }
    });
    (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined, undefined], ['enter', 'OperationDefinition', 0, undefined], ['enter', 'Name', 'name', 'OperationDefinition'], ['leave', 'Name', 'name', 'OperationDefinition'], ['enter', 'VariableDefinition', 0, undefined], ['enter', 'Variable', 'variable', 'VariableDefinition'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'variable', 'VariableDefinition'], ['enter', 'NamedType', 'type', 'VariableDefinition'], ['enter', 'Name', 'name', 'NamedType'], ['leave', 'Name', 'name', 'NamedType'], ['leave', 'NamedType', 'type', 'VariableDefinition'], ['leave', 'VariableDefinition', 0, undefined], ['enter', 'VariableDefinition', 1, undefined], ['enter', 'Variable', 'variable', 'VariableDefinition'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'variable', 'VariableDefinition'], ['enter', 'NamedType', 'type', 'VariableDefinition'], ['enter', 'Name', 'name', 'NamedType'], ['leave', 'Name', 'name', 'NamedType'], ['leave', 'NamedType', 'type', 'VariableDefinition'], ['enter', 'EnumValue', 'defaultValue', 'VariableDefinition'], ['leave', 'EnumValue', 'defaultValue', 'VariableDefinition'], ['leave', 'VariableDefinition', 1, undefined], ['enter', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'alias', 'Field'], ['leave', 'Name', 'alias', 'Field'], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'ListValue', 'value', 'Argument'], ['enter', 'IntValue', 0, undefined], ['leave', 'IntValue', 0, undefined], ['enter', 'IntValue', 1, undefined], ['leave', 'IntValue', 1, undefined], ['leave', 'ListValue', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['enter', 'InlineFragment', 1, undefined], ['enter', 'NamedType', 'typeCondition', 'InlineFragment'], ['enter', 'Name', 'name', 'NamedType'], ['leave', 'Name', 'name', 'NamedType'], ['leave', 'NamedType', 'typeCondition', 'InlineFragment'], ['enter', 'Directive', 0, undefined], ['enter', 'Name', 'name', 'Directive'], ['leave', 'Name', 'name', 'Directive'], ['leave', 'Directive', 0, undefined], ['enter', 'SelectionSet', 'selectionSet', 'InlineFragment'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['enter', 'Field', 1, undefined], ['enter', 'Name', 'alias', 'Field'], ['leave', 'Name', 'alias', 'Field'], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'IntValue', 'value', 'Argument'], ['leave', 'IntValue', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['enter', 'Argument', 1, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'Variable', 'value', 'Argument'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'value', 'Argument'], ['leave', 'Argument', 1, undefined], ['enter', 'Directive', 0, undefined], ['enter', 'Name', 'name', 'Directive'], ['leave', 'Name', 'name', 'Directive'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'Variable', 'value', 'Argument'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['leave', 'Directive', 0, undefined], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['enter', 'FragmentSpread', 1, undefined], ['enter', 'Name', 'name', 'FragmentSpread'], ['leave', 'Name', 'name', 'FragmentSpread'], ['leave', 'FragmentSpread', 1, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 1, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'InlineFragment'], ['leave', 'InlineFragment', 1, undefined], ['enter', 'InlineFragment', 2, undefined], ['enter', 'Directive', 0, undefined], ['enter', 'Name', 'name', 'Directive'], ['leave', 'Name', 'name', 'Directive'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'Variable', 'value', 'Argument'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['leave', 'Directive', 0, undefined], ['enter', 'SelectionSet', 'selectionSet', 'InlineFragment'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'InlineFragment'], ['leave', 'InlineFragment', 2, undefined], ['enter', 'InlineFragment', 3, undefined], ['enter', 'SelectionSet', 'selectionSet', 'InlineFragment'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'InlineFragment'], ['leave', 'InlineFragment', 3, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['leave', 'OperationDefinition', 0, undefined], ['enter', 'OperationDefinition', 1, undefined], ['enter', 'Name', 'name', 'OperationDefinition'], ['leave', 'Name', 'name', 'OperationDefinition'], ['enter', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'IntValue', 'value', 'Argument'], ['leave', 'IntValue', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['enter', 'Directive', 0, undefined], ['enter', 'Name', 'name', 'Directive'], ['leave', 'Name', 'name', 'Directive'], ['leave', 'Directive', 0, undefined], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['leave', 'OperationDefinition', 1, undefined], ['enter', 'OperationDefinition', 2, undefined], ['enter', 'Name', 'name', 'OperationDefinition'], ['leave', 'Name', 'name', 'OperationDefinition'], ['enter', 'VariableDefinition', 0, undefined], ['enter', 'Variable', 'variable', 'VariableDefinition'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'variable', 'VariableDefinition'], ['enter', 'NamedType', 'type', 'VariableDefinition'], ['enter', 'Name', 'name', 'NamedType'], ['leave', 'Name', 'name', 'NamedType'], ['leave', 'NamedType', 'type', 'VariableDefinition'], ['leave', 'VariableDefinition', 0, undefined], ['enter', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'Variable', 'value', 'Argument'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 0, undefined], ['enter', 'Field', 1, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'SelectionSet', 'selectionSet', 'Field'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 1, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'Field'], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['leave', 'OperationDefinition', 2, undefined], ['enter', 'FragmentDefinition', 3, undefined], ['enter', 'Name', 'name', 'FragmentDefinition'], ['leave', 'Name', 'name', 'FragmentDefinition'], ['enter', 'NamedType', 'typeCondition', 'FragmentDefinition'], ['enter', 'Name', 'name', 'NamedType'], ['leave', 'Name', 'name', 'NamedType'], ['leave', 'NamedType', 'typeCondition', 'FragmentDefinition'], ['enter', 'SelectionSet', 'selectionSet', 'FragmentDefinition'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'Variable', 'value', 'Argument'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['enter', 'Argument', 1, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'Variable', 'value', 'Argument'], ['enter', 'Name', 'name', 'Variable'], ['leave', 'Name', 'name', 'Variable'], ['leave', 'Variable', 'value', 'Argument'], ['leave', 'Argument', 1, undefined], ['enter', 'Argument', 2, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'ObjectValue', 'value', 'Argument'], ['enter', 'ObjectField', 0, undefined], ['enter', 'Name', 'name', 'ObjectField'], ['leave', 'Name', 'name', 'ObjectField'], ['enter', 'StringValue', 'value', 'ObjectField'], ['leave', 'StringValue', 'value', 'ObjectField'], ['leave', 'ObjectField', 0, undefined], ['enter', 'ObjectField', 1, undefined], ['enter', 'Name', 'name', 'ObjectField'], ['leave', 'Name', 'name', 'ObjectField'], ['enter', 'StringValue', 'value', 'ObjectField'], ['leave', 'StringValue', 'value', 'ObjectField'], ['leave', 'ObjectField', 1, undefined], ['leave', 'ObjectValue', 'value', 'Argument'], ['leave', 'Argument', 2, undefined], ['leave', 'Field', 0, undefined], ['leave', 'SelectionSet', 'selectionSet', 'FragmentDefinition'], ['leave', 'FragmentDefinition', 3, undefined], ['enter', 'OperationDefinition', 4, undefined], ['enter', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['enter', 'Field', 0, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['enter', 'Argument', 0, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'BooleanValue', 'value', 'Argument'], ['leave', 'BooleanValue', 'value', 'Argument'], ['leave', 'Argument', 0, undefined], ['enter', 'Argument', 1, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'BooleanValue', 'value', 'Argument'], ['leave', 'BooleanValue', 'value', 'Argument'], ['leave', 'Argument', 1, undefined], ['enter', 'Argument', 2, undefined], ['enter', 'Name', 'name', 'Argument'], ['leave', 'Name', 'name', 'Argument'], ['enter', 'NullValue', 'value', 'Argument'], ['leave', 'NullValue', 'value', 'Argument'], ['leave', 'Argument', 2, undefined], ['leave', 'Field', 0, undefined], ['enter', 'Field', 1, undefined], ['enter', 'Name', 'name', 'Field'], ['leave', 'Name', 'name', 'Field'], ['leave', 'Field', 1, undefined], ['leave', 'SelectionSet', 'selectionSet', 'OperationDefinition'], ['leave', 'OperationDefinition', 4, undefined], ['leave', 'Document', undefined, undefined]]);
  });
  (0, _mocha.describe)('visitInParallel', function () {
    // Note: nearly identical to the above test of the same test but
    // using visitInParallel.
    (0, _mocha.it)('allows skipping a sub-tree', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a, b { x }, c }');
      (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['enter', node.kind, node.value]);

          if (node.kind === 'Field' && node.name.value === 'b') {
            return false;
          }
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['leave', node.kind, node.value]);
        }
      }]));
      (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'c'], ['leave', 'Name', 'c'], ['leave', 'Field', undefined], ['leave', 'SelectionSet', undefined], ['leave', 'OperationDefinition', undefined], ['leave', 'Document', undefined]]);
    });
    (0, _mocha.it)('allows skipping different sub-trees', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a { x }, b { y} }');
      (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['no-a', 'enter', node.kind, node.value]);

          if (node.kind === 'Field' && node.name.value === 'a') {
            return false;
          }
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['no-a', 'leave', node.kind, node.value]);
        }
      }, {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['no-b', 'enter', node.kind, node.value]);

          if (node.kind === 'Field' && node.name.value === 'b') {
            return false;
          }
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['no-b', 'leave', node.kind, node.value]);
        }
      }]));
      (0, _chai.expect)(visited).to.deep.equal([['no-a', 'enter', 'Document', undefined], ['no-b', 'enter', 'Document', undefined], ['no-a', 'enter', 'OperationDefinition', undefined], ['no-b', 'enter', 'OperationDefinition', undefined], ['no-a', 'enter', 'SelectionSet', undefined], ['no-b', 'enter', 'SelectionSet', undefined], ['no-a', 'enter', 'Field', undefined], ['no-b', 'enter', 'Field', undefined], ['no-b', 'enter', 'Name', 'a'], ['no-b', 'leave', 'Name', 'a'], ['no-b', 'enter', 'SelectionSet', undefined], ['no-b', 'enter', 'Field', undefined], ['no-b', 'enter', 'Name', 'x'], ['no-b', 'leave', 'Name', 'x'], ['no-b', 'leave', 'Field', undefined], ['no-b', 'leave', 'SelectionSet', undefined], ['no-b', 'leave', 'Field', undefined], ['no-a', 'enter', 'Field', undefined], ['no-b', 'enter', 'Field', undefined], ['no-a', 'enter', 'Name', 'b'], ['no-a', 'leave', 'Name', 'b'], ['no-a', 'enter', 'SelectionSet', undefined], ['no-a', 'enter', 'Field', undefined], ['no-a', 'enter', 'Name', 'y'], ['no-a', 'leave', 'Name', 'y'], ['no-a', 'leave', 'Field', undefined], ['no-a', 'leave', 'SelectionSet', undefined], ['no-a', 'leave', 'Field', undefined], ['no-a', 'leave', 'SelectionSet', undefined], ['no-b', 'leave', 'SelectionSet', undefined], ['no-a', 'leave', 'OperationDefinition', undefined], ['no-b', 'leave', 'OperationDefinition', undefined], ['no-a', 'leave', 'Document', undefined], ['no-b', 'leave', 'Document', undefined]]);
    }); // Note: nearly identical to the above test of the same test but
    // using visitInParallel.

    (0, _mocha.it)('allows early exit while visiting', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a, b { x }, c }');
      (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['enter', node.kind, node.value]);

          if (node.kind === 'Name' && node.value === 'x') {
            return _visitor.BREAK;
          }
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['leave', node.kind, node.value]);
        }
      }]));
      (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'b'], ['leave', 'Name', 'b'], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'x']]);
    });
    (0, _mocha.it)('allows early exit from different points', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a { y }, b { x } }');
      (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-a', 'enter', node.kind, node.value]);

          if (node.kind === 'Name' && node.value === 'a') {
            return _visitor.BREAK;
          }
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-a', 'leave', node.kind, node.value]);
        }
      }, {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-b', 'enter', node.kind, node.value]);

          if (node.kind === 'Name' && node.value === 'b') {
            return _visitor.BREAK;
          }
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-b', 'leave', node.kind, node.value]);
        }
      }]));
      (0, _chai.expect)(visited).to.deep.equal([['break-a', 'enter', 'Document', undefined], ['break-b', 'enter', 'Document', undefined], ['break-a', 'enter', 'OperationDefinition', undefined], ['break-b', 'enter', 'OperationDefinition', undefined], ['break-a', 'enter', 'SelectionSet', undefined], ['break-b', 'enter', 'SelectionSet', undefined], ['break-a', 'enter', 'Field', undefined], ['break-b', 'enter', 'Field', undefined], ['break-a', 'enter', 'Name', 'a'], ['break-b', 'enter', 'Name', 'a'], ['break-b', 'leave', 'Name', 'a'], ['break-b', 'enter', 'SelectionSet', undefined], ['break-b', 'enter', 'Field', undefined], ['break-b', 'enter', 'Name', 'y'], ['break-b', 'leave', 'Name', 'y'], ['break-b', 'leave', 'Field', undefined], ['break-b', 'leave', 'SelectionSet', undefined], ['break-b', 'leave', 'Field', undefined], ['break-b', 'enter', 'Field', undefined], ['break-b', 'enter', 'Name', 'b']]);
    }); // Note: nearly identical to the above test of the same test but
    // using visitInParallel.

    (0, _mocha.it)('allows early exit while leaving', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a, b { x }, c }');
      (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['enter', node.kind, node.value]);
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['leave', node.kind, node.value]);

          if (node.kind === 'Name' && node.value === 'x') {
            return _visitor.BREAK;
          }
        }
      }]));
      (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'b'], ['leave', 'Name', 'b'], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'x'], ['leave', 'Name', 'x']]);
    });
    (0, _mocha.it)('allows early exit from leaving different points', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a { y }, b { x } }');
      (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-a', 'enter', node.kind, node.value]);
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-a', 'leave', node.kind, node.value]);

          if (node.kind === 'Field' && node.name.value === 'a') {
            return _visitor.BREAK;
          }
        }
      }, {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-b', 'enter', node.kind, node.value]);
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['break-b', 'leave', node.kind, node.value]);

          if (node.kind === 'Field' && node.name.value === 'b') {
            return _visitor.BREAK;
          }
        }
      }]));
      (0, _chai.expect)(visited).to.deep.equal([['break-a', 'enter', 'Document', undefined], ['break-b', 'enter', 'Document', undefined], ['break-a', 'enter', 'OperationDefinition', undefined], ['break-b', 'enter', 'OperationDefinition', undefined], ['break-a', 'enter', 'SelectionSet', undefined], ['break-b', 'enter', 'SelectionSet', undefined], ['break-a', 'enter', 'Field', undefined], ['break-b', 'enter', 'Field', undefined], ['break-a', 'enter', 'Name', 'a'], ['break-b', 'enter', 'Name', 'a'], ['break-a', 'leave', 'Name', 'a'], ['break-b', 'leave', 'Name', 'a'], ['break-a', 'enter', 'SelectionSet', undefined], ['break-b', 'enter', 'SelectionSet', undefined], ['break-a', 'enter', 'Field', undefined], ['break-b', 'enter', 'Field', undefined], ['break-a', 'enter', 'Name', 'y'], ['break-b', 'enter', 'Name', 'y'], ['break-a', 'leave', 'Name', 'y'], ['break-b', 'leave', 'Name', 'y'], ['break-a', 'leave', 'Field', undefined], ['break-b', 'leave', 'Field', undefined], ['break-a', 'leave', 'SelectionSet', undefined], ['break-b', 'leave', 'SelectionSet', undefined], ['break-a', 'leave', 'Field', undefined], ['break-b', 'leave', 'Field', undefined], ['break-b', 'enter', 'Field', undefined], ['break-b', 'enter', 'Name', 'b'], ['break-b', 'leave', 'Name', 'b'], ['break-b', 'enter', 'SelectionSet', undefined], ['break-b', 'enter', 'Field', undefined], ['break-b', 'enter', 'Name', 'x'], ['break-b', 'leave', 'Name', 'x'], ['break-b', 'leave', 'Field', undefined], ['break-b', 'leave', 'SelectionSet', undefined], ['break-b', 'leave', 'Field', undefined]]);
    });
    (0, _mocha.it)('allows for editing on enter', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a, b, c { a, b, c } }', {
        noLocation: true
      });
      var editedAst = (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);

          if (node.kind === 'Field' && node.name.value === 'b') {
            return null;
          }
        }
      }, {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['enter', node.kind, node.value]);
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments,
          /* isEdited */
          true);
          visited.push(['leave', node.kind, node.value]);
        }
      }]));
      (0, _chai.expect)(ast).to.deep.equal((0, _parser.parse)('{ a, b, c { a, b, c } }', {
        noLocation: true
      }));
      (0, _chai.expect)(editedAst).to.deep.equal((0, _parser.parse)('{ a,    c { a,    c } }', {
        noLocation: true
      }));
      (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'c'], ['leave', 'Name', 'c'], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'c'], ['leave', 'Name', 'c'], ['leave', 'Field', undefined], ['leave', 'SelectionSet', undefined], ['leave', 'Field', undefined], ['leave', 'SelectionSet', undefined], ['leave', 'OperationDefinition', undefined], ['leave', 'Document', undefined]]);
    });
    (0, _mocha.it)('allows for editing on leave', function () {
      var visited = [];
      var ast = (0, _parser.parse)('{ a, b, c { a, b, c } }', {
        noLocation: true
      });
      var editedAst = (0, _visitor.visit)(ast, (0, _visitor.visitInParallel)([{
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments,
          /* isEdited */
          true);

          if (node.kind === 'Field' && node.name.value === 'b') {
            return null;
          }
        }
      }, {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          visited.push(['enter', node.kind, node.value]);
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments,
          /* isEdited */
          true);
          visited.push(['leave', node.kind, node.value]);
        }
      }]));
      (0, _chai.expect)(ast).to.deep.equal((0, _parser.parse)('{ a, b, c { a, b, c } }', {
        noLocation: true
      }));
      (0, _chai.expect)(editedAst).to.deep.equal((0, _parser.parse)('{ a,    c { a,    c } }', {
        noLocation: true
      }));
      (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', undefined], ['enter', 'OperationDefinition', undefined], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'b'], ['leave', 'Name', 'b'], ['enter', 'Field', undefined], ['enter', 'Name', 'c'], ['leave', 'Name', 'c'], ['enter', 'SelectionSet', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'a'], ['leave', 'Name', 'a'], ['leave', 'Field', undefined], ['enter', 'Field', undefined], ['enter', 'Name', 'b'], ['leave', 'Name', 'b'], ['enter', 'Field', undefined], ['enter', 'Name', 'c'], ['leave', 'Name', 'c'], ['leave', 'Field', undefined], ['leave', 'SelectionSet', undefined], ['leave', 'Field', undefined], ['leave', 'SelectionSet', undefined], ['leave', 'OperationDefinition', undefined], ['leave', 'Document', undefined]]);
    });
  });
  (0, _mocha.describe)('visitWithTypeInfo', function () {
    (0, _mocha.it)('maintains type info during visit', function () {
      var visited = [];
      var typeInfo = new _TypeInfo.TypeInfo(_harness.testSchema);
      var ast = (0, _parser.parse)('{ human(id: 4) { name, pets { ... { name } }, unknown } }');
      (0, _visitor.visit)(ast, (0, _visitor.visitWithTypeInfo)(typeInfo, {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments);
          var parentType = typeInfo.getParentType();
          var type = typeInfo.getType();
          var inputType = typeInfo.getInputType();
          visited.push(['enter', node.kind, node.kind === 'Name' ? node.value : null, parentType ? String(parentType) : null, type ? String(type) : null, inputType ? String(inputType) : null]);
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments);
          var parentType = typeInfo.getParentType();
          var type = typeInfo.getType();
          var inputType = typeInfo.getInputType();
          visited.push(['leave', node.kind, node.kind === 'Name' ? node.value : null, parentType ? String(parentType) : null, type ? String(type) : null, inputType ? String(inputType) : null]);
        }
      }));
      (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', null, null, null, null], ['enter', 'OperationDefinition', null, null, 'QueryRoot', null], ['enter', 'SelectionSet', null, 'QueryRoot', 'QueryRoot', null], ['enter', 'Field', null, 'QueryRoot', 'Human', null], ['enter', 'Name', 'human', 'QueryRoot', 'Human', null], ['leave', 'Name', 'human', 'QueryRoot', 'Human', null], ['enter', 'Argument', null, 'QueryRoot', 'Human', 'ID'], ['enter', 'Name', 'id', 'QueryRoot', 'Human', 'ID'], ['leave', 'Name', 'id', 'QueryRoot', 'Human', 'ID'], ['enter', 'IntValue', null, 'QueryRoot', 'Human', 'ID'], ['leave', 'IntValue', null, 'QueryRoot', 'Human', 'ID'], ['leave', 'Argument', null, 'QueryRoot', 'Human', 'ID'], ['enter', 'SelectionSet', null, 'Human', 'Human', null], ['enter', 'Field', null, 'Human', 'String', null], ['enter', 'Name', 'name', 'Human', 'String', null], ['leave', 'Name', 'name', 'Human', 'String', null], ['leave', 'Field', null, 'Human', 'String', null], ['enter', 'Field', null, 'Human', '[Pet]', null], ['enter', 'Name', 'pets', 'Human', '[Pet]', null], ['leave', 'Name', 'pets', 'Human', '[Pet]', null], ['enter', 'SelectionSet', null, 'Pet', '[Pet]', null], ['enter', 'InlineFragment', null, 'Pet', 'Pet', null], ['enter', 'SelectionSet', null, 'Pet', 'Pet', null], ['enter', 'Field', null, 'Pet', 'String', null], ['enter', 'Name', 'name', 'Pet', 'String', null], ['leave', 'Name', 'name', 'Pet', 'String', null], ['leave', 'Field', null, 'Pet', 'String', null], ['leave', 'SelectionSet', null, 'Pet', 'Pet', null], ['leave', 'InlineFragment', null, 'Pet', 'Pet', null], ['leave', 'SelectionSet', null, 'Pet', '[Pet]', null], ['leave', 'Field', null, 'Human', '[Pet]', null], ['enter', 'Field', null, 'Human', null, null], ['enter', 'Name', 'unknown', 'Human', null, null], ['leave', 'Name', 'unknown', 'Human', null, null], ['leave', 'Field', null, 'Human', null, null], ['leave', 'SelectionSet', null, 'Human', 'Human', null], ['leave', 'Field', null, 'QueryRoot', 'Human', null], ['leave', 'SelectionSet', null, 'QueryRoot', 'QueryRoot', null], ['leave', 'OperationDefinition', null, null, 'QueryRoot', null], ['leave', 'Document', null, null, null, null]]);
    });
    (0, _mocha.it)('maintains type info during edit', function () {
      var visited = [];
      var typeInfo = new _TypeInfo.TypeInfo(_harness.testSchema);
      var ast = (0, _parser.parse)('{ human(id: 4) { name, pets }, alien }');
      var editedAst = (0, _visitor.visit)(ast, (0, _visitor.visitWithTypeInfo)(typeInfo, {
        enter: function enter(node) {
          checkVisitorFnArgs(ast, arguments,
          /* isEdited */
          true);
          var parentType = typeInfo.getParentType();
          var type = typeInfo.getType();
          var inputType = typeInfo.getInputType();
          visited.push(['enter', node.kind, node.kind === 'Name' ? node.value : null, parentType ? String(parentType) : null, type ? String(type) : null, inputType ? String(inputType) : null]); // Make a query valid by adding missing selection sets.

          if (node.kind === 'Field' && !node.selectionSet && (0, _type.isCompositeType)((0, _type.getNamedType)(type))) {
            return {
              kind: 'Field',
              alias: node.alias,
              name: node.name,
              arguments: node.arguments,
              directives: node.directives,
              selectionSet: {
                kind: 'SelectionSet',
                selections: [{
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: '__typename'
                  }
                }]
              }
            };
          }
        },
        leave: function leave(node) {
          checkVisitorFnArgs(ast, arguments,
          /* isEdited */
          true);
          var parentType = typeInfo.getParentType();
          var type = typeInfo.getType();
          var inputType = typeInfo.getInputType();
          visited.push(['leave', node.kind, node.kind === 'Name' ? node.value : null, parentType ? String(parentType) : null, type ? String(type) : null, inputType ? String(inputType) : null]);
        }
      }));
      (0, _chai.expect)((0, _printer.print)(ast)).to.deep.equal((0, _printer.print)((0, _parser.parse)('{ human(id: 4) { name, pets }, alien }')));
      (0, _chai.expect)((0, _printer.print)(editedAst)).to.deep.equal((0, _printer.print)((0, _parser.parse)('{ human(id: 4) { name, pets { __typename } }, alien { __typename } }')));
      (0, _chai.expect)(visited).to.deep.equal([['enter', 'Document', null, null, null, null], ['enter', 'OperationDefinition', null, null, 'QueryRoot', null], ['enter', 'SelectionSet', null, 'QueryRoot', 'QueryRoot', null], ['enter', 'Field', null, 'QueryRoot', 'Human', null], ['enter', 'Name', 'human', 'QueryRoot', 'Human', null], ['leave', 'Name', 'human', 'QueryRoot', 'Human', null], ['enter', 'Argument', null, 'QueryRoot', 'Human', 'ID'], ['enter', 'Name', 'id', 'QueryRoot', 'Human', 'ID'], ['leave', 'Name', 'id', 'QueryRoot', 'Human', 'ID'], ['enter', 'IntValue', null, 'QueryRoot', 'Human', 'ID'], ['leave', 'IntValue', null, 'QueryRoot', 'Human', 'ID'], ['leave', 'Argument', null, 'QueryRoot', 'Human', 'ID'], ['enter', 'SelectionSet', null, 'Human', 'Human', null], ['enter', 'Field', null, 'Human', 'String', null], ['enter', 'Name', 'name', 'Human', 'String', null], ['leave', 'Name', 'name', 'Human', 'String', null], ['leave', 'Field', null, 'Human', 'String', null], ['enter', 'Field', null, 'Human', '[Pet]', null], ['enter', 'Name', 'pets', 'Human', '[Pet]', null], ['leave', 'Name', 'pets', 'Human', '[Pet]', null], ['enter', 'SelectionSet', null, 'Pet', '[Pet]', null], ['enter', 'Field', null, 'Pet', 'String!', null], ['enter', 'Name', '__typename', 'Pet', 'String!', null], ['leave', 'Name', '__typename', 'Pet', 'String!', null], ['leave', 'Field', null, 'Pet', 'String!', null], ['leave', 'SelectionSet', null, 'Pet', '[Pet]', null], ['leave', 'Field', null, 'Human', '[Pet]', null], ['leave', 'SelectionSet', null, 'Human', 'Human', null], ['leave', 'Field', null, 'QueryRoot', 'Human', null], ['enter', 'Field', null, 'QueryRoot', 'Alien', null], ['enter', 'Name', 'alien', 'QueryRoot', 'Alien', null], ['leave', 'Name', 'alien', 'QueryRoot', 'Alien', null], ['enter', 'SelectionSet', null, 'Alien', 'Alien', null], ['enter', 'Field', null, 'Alien', 'String!', null], ['enter', 'Name', '__typename', 'Alien', 'String!', null], ['leave', 'Name', '__typename', 'Alien', 'String!', null], ['leave', 'Field', null, 'Alien', 'String!', null], ['leave', 'SelectionSet', null, 'Alien', 'Alien', null], ['leave', 'Field', null, 'QueryRoot', 'Alien', null], ['leave', 'SelectionSet', null, 'QueryRoot', 'QueryRoot', null], ['leave', 'OperationDefinition', null, null, 'QueryRoot', null], ['leave', 'Document', null, null, null, null]]);
    });
  });
});