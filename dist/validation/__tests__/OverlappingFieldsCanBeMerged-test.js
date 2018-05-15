"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _harness = require("./harness");

var _OverlappingFieldsCanBeMerged = require("../rules/OverlappingFieldsCanBeMerged");

var _type = require("../../type");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Validate: Overlapping fields can be merged', function () {
  (0, _mocha.it)('unique fields', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment uniqueFields on Dog {\n        name\n        nickname\n      }\n    ");
  });
  (0, _mocha.it)('identical fields', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment mergeIdenticalFields on Dog {\n        name\n        name\n      }\n    ");
  });
  (0, _mocha.it)('identical fields with identical args', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment mergeIdenticalFieldsWithIdenticalArgs on Dog {\n        doesKnowCommand(dogCommand: SIT)\n        doesKnowCommand(dogCommand: SIT)\n      }\n    ");
  });
  (0, _mocha.it)('identical fields with identical directives', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment mergeSameFieldsWithSameDirectives on Dog {\n        name @include(if: true)\n        name @include(if: true)\n      }\n    ");
  });
  (0, _mocha.it)('different args with different aliases', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment differentArgsWithDifferentAliases on Dog {\n        knowsSit: doesKnowCommand(dogCommand: SIT)\n        knowsDown: doesKnowCommand(dogCommand: DOWN)\n      }\n    ");
  });
  (0, _mocha.it)('different directives with different aliases', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment differentDirectivesWithDifferentAliases on Dog {\n        nameIfTrue: name @include(if: true)\n        nameIfFalse: name @include(if: false)\n      }\n    ");
  });
  (0, _mocha.it)('different skip/include directives accepted', function () {
    // Note: Differing skip/include directives don't create an ambiguous return
    // value and are acceptable in conditions where differing runtime values
    // may have the same desired effect of including or skipping a field.
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment differentDirectivesWithDifferentAliases on Dog {\n        name @include(if: true)\n        name @include(if: false)\n      }\n    ");
  });
  (0, _mocha.it)('Same aliases with different field targets', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment sameAliasesWithDifferentFieldTargets on Dog {\n        fido: name\n        fido: nickname\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('fido', 'name and nickname are different fields'),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('Same aliases allowed on non-overlapping fields', function () {
    // This is valid since no object can be both a "Dog" and a "Cat", thus
    // these fields can never overlap.
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment sameAliasesWithDifferentFieldTargets on Pet {\n        ... on Dog {\n          name\n        }\n        ... on Cat {\n          name: nickname\n        }\n      }\n    ");
  });
  (0, _mocha.it)('Alias masking direct field access', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment aliasMaskingDirectFieldAccess on Dog {\n        name: nickname\n        name\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('name', 'nickname and name are different fields'),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('different args, second adds an argument', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment conflictingArgs on Dog {\n        doesKnowCommand\n        doesKnowCommand(dogCommand: HEEL)\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('doesKnowCommand', 'they have differing arguments'),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('different args, second missing an argument', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment conflictingArgs on Dog {\n        doesKnowCommand(dogCommand: SIT)\n        doesKnowCommand\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('doesKnowCommand', 'they have differing arguments'),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('conflicting args', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment conflictingArgs on Dog {\n        doesKnowCommand(dogCommand: SIT)\n        doesKnowCommand(dogCommand: HEEL)\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('doesKnowCommand', 'they have differing arguments'),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('allows different args where no conflict is possible', function () {
    // This is valid since no object can be both a "Dog" and a "Cat", thus
    // these fields can never overlap.
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment conflictingArgs on Pet {\n        ... on Dog {\n          name(surname: true)\n        }\n        ... on Cat {\n          name\n        }\n      }\n    ");
  });
  (0, _mocha.it)('encounters conflict in fragments', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        ...A\n        ...B\n      }\n      fragment A on Type {\n        x: a\n      }\n      fragment B on Type {\n        x: b\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('x', 'a and b are different fields'),
      locations: [{
        line: 7,
        column: 9
      }, {
        line: 10,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('reports each conflict once', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        f1 {\n          ...A\n          ...B\n        }\n        f2 {\n          ...B\n          ...A\n        }\n        f3 {\n          ...A\n          ...B\n          x: c\n        }\n      }\n      fragment A on Type {\n        x: a\n      }\n      fragment B on Type {\n        x: b\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('x', 'a and b are different fields'),
      locations: [{
        line: 18,
        column: 9
      }, {
        line: 21,
        column: 9
      }]
    }, {
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('x', 'c and a are different fields'),
      locations: [{
        line: 14,
        column: 11
      }, {
        line: 18,
        column: 9
      }]
    }, {
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('x', 'c and b are different fields'),
      locations: [{
        line: 14,
        column: 11
      }, {
        line: 21,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('deep conflict', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        field {\n          x: a\n        },\n        field {\n          x: b\n        }\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('field', [['x', 'a and b are different fields']]),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 11
      }, {
        line: 6,
        column: 9
      }, {
        line: 7,
        column: 11
      }]
    }]);
  });
  (0, _mocha.it)('deep conflict with multiple issues', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        field {\n          x: a\n          y: c\n        },\n        field {\n          x: b\n          y: d\n        }\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('field', [['x', 'a and b are different fields'], ['y', 'c and d are different fields']]),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 11
      }, {
        line: 5,
        column: 11
      }, {
        line: 7,
        column: 9
      }, {
        line: 8,
        column: 11
      }, {
        line: 9,
        column: 11
      }]
    }]);
  });
  (0, _mocha.it)('very deep conflict', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        field {\n          deepField {\n            x: a\n          }\n        },\n        field {\n          deepField {\n            x: b\n          }\n        }\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('field', [['deepField', [['x', 'a and b are different fields']]]]),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 4,
        column: 11
      }, {
        line: 5,
        column: 13
      }, {
        line: 8,
        column: 9
      }, {
        line: 9,
        column: 11
      }, {
        line: 10,
        column: 13
      }]
    }]);
  });
  (0, _mocha.it)('reports deep conflict to nearest common ancestor', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        field {\n          deepField {\n            x: a\n          }\n          deepField {\n            x: b\n          }\n        },\n        field {\n          deepField {\n            y\n          }\n        }\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('deepField', [['x', 'a and b are different fields']]),
      locations: [{
        line: 4,
        column: 11
      }, {
        line: 5,
        column: 13
      }, {
        line: 7,
        column: 11
      }, {
        line: 8,
        column: 13
      }]
    }]);
  });
  (0, _mocha.it)('reports deep conflict to nearest common ancestor in fragments', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        field {\n          ...F\n        }\n        field {\n          ...F\n        }\n      }\n      fragment F on T {\n        deepField {\n          deeperField {\n            x: a\n          }\n          deeperField {\n            x: b\n          }\n        },\n        deepField {\n          deeperField {\n            y\n          }\n        }\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('deeperField', [['x', 'a and b are different fields']]),
      locations: [{
        line: 12,
        column: 11
      }, {
        line: 13,
        column: 13
      }, {
        line: 15,
        column: 11
      }, {
        line: 16,
        column: 13
      }]
    }]);
  });
  (0, _mocha.it)('reports deep conflict in nested fragments', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        field {\n          ...F\n        }\n        field {\n          ...I\n        }\n      }\n      fragment F on T {\n        x: a\n        ...G\n      }\n      fragment G on T {\n        y: c\n      }\n      fragment I on T {\n        y: d\n        ...J\n      }\n      fragment J on T {\n        x: b\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('field', [['x', 'a and b are different fields'], ['y', 'c and d are different fields']]),
      locations: [{
        line: 3,
        column: 9
      }, {
        line: 11,
        column: 9
      }, {
        line: 15,
        column: 9
      }, {
        line: 6,
        column: 9
      }, {
        line: 22,
        column: 9
      }, {
        line: 18,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('ignores unknown fragments', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n    {\n      field\n      ...Unknown\n      ...Known\n    }\n\n    fragment Known on T {\n      field\n      ...OtherUnknown\n    }\n    ");
  });
  (0, _mocha.describe)('return types must be unambiguous', function () {
    var SomeBox = new _type.GraphQLInterfaceType({
      name: 'SomeBox',
      fields: function fields() {
        return {
          deepBox: {
            type: SomeBox
          },
          unrelatedField: {
            type: _type.GraphQLString
          }
        };
      }
    });
    var StringBox = new _type.GraphQLObjectType({
      name: 'StringBox',
      interfaces: [SomeBox],
      fields: function fields() {
        return {
          scalar: {
            type: _type.GraphQLString
          },
          deepBox: {
            type: StringBox
          },
          unrelatedField: {
            type: _type.GraphQLString
          },
          listStringBox: {
            type: (0, _type.GraphQLList)(StringBox)
          },
          stringBox: {
            type: StringBox
          },
          intBox: {
            type: IntBox
          }
        };
      }
    });
    var IntBox = new _type.GraphQLObjectType({
      name: 'IntBox',
      interfaces: [SomeBox],
      fields: function fields() {
        return {
          scalar: {
            type: _type.GraphQLInt
          },
          deepBox: {
            type: IntBox
          },
          unrelatedField: {
            type: _type.GraphQLString
          },
          listStringBox: {
            type: (0, _type.GraphQLList)(StringBox)
          },
          stringBox: {
            type: StringBox
          },
          intBox: {
            type: IntBox
          }
        };
      }
    });
    var NonNullStringBox1 = new _type.GraphQLInterfaceType({
      name: 'NonNullStringBox1',
      fields: {
        scalar: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
        }
      }
    });
    var NonNullStringBox1Impl = new _type.GraphQLObjectType({
      name: 'NonNullStringBox1Impl',
      interfaces: [SomeBox, NonNullStringBox1],
      fields: {
        scalar: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
        },
        unrelatedField: {
          type: _type.GraphQLString
        },
        deepBox: {
          type: SomeBox
        }
      }
    });
    var NonNullStringBox2 = new _type.GraphQLInterfaceType({
      name: 'NonNullStringBox2',
      fields: {
        scalar: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
        }
      }
    });
    var NonNullStringBox2Impl = new _type.GraphQLObjectType({
      name: 'NonNullStringBox2Impl',
      interfaces: [SomeBox, NonNullStringBox2],
      fields: {
        scalar: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
        },
        unrelatedField: {
          type: _type.GraphQLString
        },
        deepBox: {
          type: SomeBox
        }
      }
    });
    var Connection = new _type.GraphQLObjectType({
      name: 'Connection',
      fields: {
        edges: {
          type: (0, _type.GraphQLList)(new _type.GraphQLObjectType({
            name: 'Edge',
            fields: {
              node: {
                type: new _type.GraphQLObjectType({
                  name: 'Node',
                  fields: {
                    id: {
                      type: _type.GraphQLID
                    },
                    name: {
                      type: _type.GraphQLString
                    }
                  }
                })
              }
            }
          }))
        }
      }
    });
    var schema = new _type.GraphQLSchema({
      query: new _type.GraphQLObjectType({
        name: 'QueryRoot',
        fields: function fields() {
          return {
            someBox: {
              type: SomeBox
            },
            connection: {
              type: Connection
            }
          };
        }
      }),
      types: [IntBox, StringBox, NonNullStringBox1Impl, NonNullStringBox2Impl]
    });
    (0, _mocha.it)('conflicting return types which potentially overlap', function () {
      // This is invalid since an object could potentially be both the Object
      // type IntBox and the interface type NonNullStringBox1. While that
      // condition does not exist in the current schema, the schema could
      // expand in the future to allow this. Thus it is invalid.
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ...on IntBox {\n              scalar\n            }\n            ...on NonNullStringBox1 {\n              scalar\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('scalar', 'they return conflicting types Int and String!'),
        locations: [{
          line: 5,
          column: 15
        }, {
          line: 8,
          column: 15
        }]
      }]);
    });
    (0, _mocha.it)('compatible return shapes on different return types', function () {
      // In this case `deepBox` returns `SomeBox` in the first usage, and
      // `StringBox` in the second usage. These return types are not the same!
      // however this is valid because the return *shapes* are compatible.
      (0, _harness.expectPassesRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      {\n        someBox {\n          ... on SomeBox {\n            deepBox {\n              unrelatedField\n            }\n          }\n          ... on StringBox {\n            deepBox {\n              unrelatedField\n            }\n          }\n        }\n      }\n      ");
    });
    (0, _mocha.it)('disallows differing return types despite no overlap', function () {
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on IntBox {\n              scalar\n            }\n            ... on StringBox {\n              scalar\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('scalar', 'they return conflicting types Int and String'),
        locations: [{
          line: 5,
          column: 15
        }, {
          line: 8,
          column: 15
        }]
      }]);
    });
    (0, _mocha.it)('reports correctly when a non-exclusive follows an exclusive', function () {
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on IntBox {\n              deepBox {\n                ...X\n              }\n            }\n          }\n          someBox {\n            ... on StringBox {\n              deepBox {\n                ...Y\n              }\n            }\n          }\n          memoed: someBox {\n            ... on IntBox {\n              deepBox {\n                ...X\n              }\n            }\n          }\n          memoed: someBox {\n            ... on StringBox {\n              deepBox {\n                ...Y\n              }\n            }\n          }\n          other: someBox {\n            ...X\n          }\n          other: someBox {\n            ...Y\n          }\n        }\n        fragment X on SomeBox {\n          scalar\n        }\n        fragment Y on SomeBox {\n          scalar: unrelatedField\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('other', [['scalar', 'scalar and unrelatedField are different fields']]),
        locations: [{
          line: 31,
          column: 11
        }, {
          line: 39,
          column: 11
        }, {
          line: 34,
          column: 11
        }, {
          line: 42,
          column: 11
        }]
      }]);
    });
    (0, _mocha.it)('disallows differing return type nullability despite no overlap', function () {
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on NonNullStringBox1 {\n              scalar\n            }\n            ... on StringBox {\n              scalar\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('scalar', 'they return conflicting types String! and String'),
        locations: [{
          line: 5,
          column: 15
        }, {
          line: 8,
          column: 15
        }]
      }]);
    });
    (0, _mocha.it)('disallows differing return type list despite no overlap', function () {
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on IntBox {\n              box: listStringBox {\n                scalar\n              }\n            }\n            ... on StringBox {\n              box: stringBox {\n                scalar\n              }\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('box', 'they return conflicting types [StringBox] and StringBox'),
        locations: [{
          line: 5,
          column: 15
        }, {
          line: 10,
          column: 15
        }]
      }]);
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on IntBox {\n              box: stringBox {\n                scalar\n              }\n            }\n            ... on StringBox {\n              box: listStringBox {\n                scalar\n              }\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('box', 'they return conflicting types StringBox and [StringBox]'),
        locations: [{
          line: 5,
          column: 15
        }, {
          line: 10,
          column: 15
        }]
      }]);
    });
    (0, _mocha.it)('disallows differing subfields', function () {
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on IntBox {\n              box: stringBox {\n                val: scalar\n                val: unrelatedField\n              }\n            }\n            ... on StringBox {\n              box: stringBox {\n                val: scalar\n              }\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('val', 'scalar and unrelatedField are different fields'),
        locations: [{
          line: 6,
          column: 17
        }, {
          line: 7,
          column: 17
        }]
      }]);
    });
    (0, _mocha.it)('disallows differing deep return types despite no overlap', function () {
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on IntBox {\n              box: stringBox {\n                scalar\n              }\n            }\n            ... on StringBox {\n              box: intBox {\n                scalar\n              }\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('box', [['scalar', 'they return conflicting types String and Int']]),
        locations: [{
          line: 5,
          column: 15
        }, {
          line: 6,
          column: 17
        }, {
          line: 10,
          column: 15
        }, {
          line: 11,
          column: 17
        }]
      }]);
    });
    (0, _mocha.it)('allows non-conflicting overlaping types', function () {
      (0, _harness.expectPassesRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ... on IntBox {\n              scalar: unrelatedField\n            }\n            ... on StringBox {\n              scalar\n            }\n          }\n        }\n      ");
    });
    (0, _mocha.it)('same wrapped scalar return types', function () {
      (0, _harness.expectPassesRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ...on NonNullStringBox1 {\n              scalar\n            }\n            ...on NonNullStringBox2 {\n              scalar\n            }\n          }\n        }\n      ");
    });
    (0, _mocha.it)('allows inline typeless fragments', function () {
      (0, _harness.expectPassesRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          a\n          ... {\n            a\n          }\n        }\n      ");
    });
    (0, _mocha.it)('compares deep types including list', function () {
      (0, _harness.expectFailsRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          connection {\n            ...edgeID\n            edges {\n              node {\n                id: name\n              }\n            }\n          }\n        }\n\n        fragment edgeID on Connection {\n          edges {\n            node {\n              id\n            }\n          }\n        }\n      ", [{
        message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('edges', [['node', [['id', 'name and id are different fields']]]]),
        locations: [{
          line: 5,
          column: 13
        }, {
          line: 6,
          column: 15
        }, {
          line: 7,
          column: 17
        }, {
          line: 14,
          column: 11
        }, {
          line: 15,
          column: 13
        }, {
          line: 16,
          column: 15
        }]
      }]);
    });
    (0, _mocha.it)('ignores unknown types', function () {
      (0, _harness.expectPassesRuleWithSchema)(schema, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n        {\n          someBox {\n            ...on UnknownType {\n              scalar\n            }\n            ...on NonNullStringBox2 {\n              scalar\n            }\n          }\n        }\n      ");
    });
    (0, _mocha.it)('error message contains hint for alias conflict', function () {
      // The error template should end with a hint for the user to try using
      // different aliases.
      var error = (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('x', 'a and b are different fields');
      (0, _chai.expect)(error).to.equal('Fields "x" conflict because a and b are different fields. Use ' + 'different aliases on the fields to fetch both if this was intentional.');
    });
    (0, _mocha.it)('works for field names that are JS keywords', function () {
      var FooType = new _type.GraphQLObjectType({
        name: 'Foo',
        fields: {
          constructor: {
            type: _type.GraphQLString
          }
        }
      });
      var schemaWithKeywords = new _type.GraphQLSchema({
        query: new _type.GraphQLObjectType({
          name: 'Query',
          fields: function fields() {
            return {
              foo: {
                type: FooType
              }
            };
          }
        })
      });
      (0, _harness.expectPassesRuleWithSchema)(schemaWithKeywords, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "{\n          foo {\n            constructor\n          }\n        }");
    });
  });
  (0, _mocha.it)('does not infinite loop on recursive fragment', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment fragA on Human { name, relatives { name, ...fragA } }\n    ");
  });
  (0, _mocha.it)('does not infinite loop on immediately recursive fragment', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment fragA on Human { name, ...fragA }\n    ");
  });
  (0, _mocha.it)('does not infinite loop on transitively recursive fragment', function () {
    (0, _harness.expectPassesRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment fragA on Human { name, ...fragB }\n      fragment fragB on Human { name, ...fragC }\n      fragment fragC on Human { name, ...fragA }\n    ");
  });
  (0, _mocha.it)('finds invalid case even with immediately recursive fragment', function () {
    (0, _harness.expectFailsRule)(_OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, "\n      fragment sameAliasesWithDifferentFieldTargets on Dog {\n        ...sameAliasesWithDifferentFieldTargets\n        fido: name\n        fido: nickname\n      }\n    ", [{
      message: (0, _OverlappingFieldsCanBeMerged.fieldsConflictMessage)('fido', 'name and nickname are different fields'),
      locations: [{
        line: 4,
        column: 9
      }, {
        line: 5,
        column: 9
      }]
    }]);
  });
});