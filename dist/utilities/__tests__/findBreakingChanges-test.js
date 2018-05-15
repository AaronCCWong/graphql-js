"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _type = require("../../type");

var _findBreakingChanges = require("../findBreakingChanges");

var _directives = require("../../type/directives");

var _directiveLocation = require("../../language/directiveLocation");

/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('findBreakingChanges', function () {
  var queryType = new _type.GraphQLObjectType({
    name: 'Query',
    fields: {
      field1: {
        type: _type.GraphQLString
      }
    }
  });
  (0, _mocha.it)('should detect if a type was removed or not', function () {
    var type1 = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var type2 = new _type.GraphQLObjectType({
      name: 'Type2',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [type1, type2]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [type2]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findRemovedTypes)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.TYPE_REMOVED,
      description: 'Type1 was removed.'
    }]);
    (0, _chai.expect)((0, _findBreakingChanges.findRemovedTypes)(oldSchema, oldSchema)).to.eql([]);
  });
  (0, _mocha.it)('should detect if a type changed its type', function () {
    var objectType = new _type.GraphQLObjectType({
      name: 'ObjectType',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var interfaceType1 = new _type.GraphQLInterfaceType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var unionType1 = new _type.GraphQLUnionType({
      name: 'Type1',
      types: [objectType]
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [interfaceType1]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [unionType1]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findTypesThatChangedKind)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.TYPE_CHANGED_KIND,
      description: 'Type1 changed from an Interface type to a Union type.'
    }]);
  });
  (0, _mocha.it)('should detect if a field on a type was deleted or changed type', function () {
    var TypeA = new _type.GraphQLObjectType({
      name: 'TypeA',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    }); // logically equivalent to TypeA; findBreakingFieldChanges shouldn't
    // treat this as different than TypeA

    var TypeA2 = new _type.GraphQLObjectType({
      name: 'TypeA',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var TypeB = new _type.GraphQLObjectType({
      name: 'TypeB',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldType1 = new _type.GraphQLInterfaceType({
      name: 'Type1',
      fields: {
        field1: {
          type: TypeA
        },
        field2: {
          type: _type.GraphQLString
        },
        field3: {
          type: _type.GraphQLString
        },
        field4: {
          type: TypeA
        },
        field6: {
          type: _type.GraphQLString
        },
        field7: {
          type: (0, _type.GraphQLList)(_type.GraphQLString)
        },
        field8: {
          type: _type.GraphQLInt
        },
        field9: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
        },
        field10: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field11: {
          type: _type.GraphQLInt
        },
        field12: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field13: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))
        },
        field14: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field15: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field16: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
        },
        field17: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field18: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)((0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))))
        }
      }
    });
    var newType1 = new _type.GraphQLInterfaceType({
      name: 'Type1',
      fields: {
        field1: {
          type: TypeA2
        },
        field3: {
          type: _type.GraphQLBoolean
        },
        field4: {
          type: TypeB
        },
        field5: {
          type: _type.GraphQLString
        },
        field6: {
          type: (0, _type.GraphQLList)(_type.GraphQLString)
        },
        field7: {
          type: _type.GraphQLString
        },
        field8: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
        },
        field9: {
          type: _type.GraphQLInt
        },
        field10: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field11: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field12: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))
        },
        field13: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field14: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field15: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field16: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field17: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field18: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt)))
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType1]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType1]
    });
    var expectedFieldChanges = [{
      type: _findBreakingChanges.BreakingChangeType.FIELD_REMOVED,
      description: 'Type1.field2 was removed.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field3 changed type from String to Boolean.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field4 changed type from TypeA to TypeB.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field6 changed type from String to [String].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field7 changed type from [String] to String.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field9 changed type from Int! to Int.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field10 changed type from [Int]! to [Int].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field11 changed type from Int to [Int]!.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field13 changed type from [Int!] to [Int].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field14 changed type from [Int] to [[Int]].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field15 changed type from [[Int]] to [Int].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field16 changed type from Int! to [Int]!.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field18 changed type from [[Int!]!] to [[Int!]].'
    }];
    (0, _chai.expect)((0, _findBreakingChanges.findFieldsThatChangedTypeOnObjectOrInterfaceTypes)(oldSchema, newSchema)).to.eql(expectedFieldChanges);
  });
  (0, _mocha.it)('should detect if fields on input types changed kind or were removed', function () {
    var oldInputType = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        },
        field2: {
          type: _type.GraphQLBoolean
        },
        field3: {
          type: (0, _type.GraphQLList)(_type.GraphQLString)
        },
        field4: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
        },
        field5: {
          type: _type.GraphQLString
        },
        field6: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field7: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field8: {
          type: _type.GraphQLInt
        },
        field9: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field10: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))
        },
        field11: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field12: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field13: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
        },
        field14: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt)))
        },
        field15: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt)))
        }
      }
    });
    var newInputType = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLInt
        },
        field3: {
          type: _type.GraphQLString
        },
        field4: {
          type: _type.GraphQLString
        },
        field5: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
        },
        field6: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field7: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field8: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field9: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))
        },
        field10: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field11: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field12: {
          type: (0, _type.GraphQLList)(_type.GraphQLInt)
        },
        field13: {
          type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field14: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
        },
        field15: {
          type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)((0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))))
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldInputType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newInputType]
    });
    var expectedFieldChanges = [{
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field1 changed type from String to Int.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_REMOVED,
      description: 'InputType1.field2 was removed.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field3 changed type from [String] to ' + 'String.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field5 changed type from String to ' + 'String!.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field6 changed type from [Int] to ' + '[Int]!.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field8 changed type from Int to ' + '[Int]!.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field9 changed type from [Int] to ' + '[Int!].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field11 changed type from [Int] to ' + '[[Int]].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field12 changed type from [[Int]] to ' + '[Int].'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field13 changed type from Int! to ' + '[Int]!.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field15 changed type from [[Int]!] to ' + '[[Int!]!].'
    }];
    (0, _chai.expect)((0, _findBreakingChanges.findFieldsThatChangedTypeOnInputObjectTypes)(oldSchema, newSchema).breakingChanges).to.eql(expectedFieldChanges);
  });
  (0, _mocha.it)('should detect if a non-null field is added to an input type', function () {
    var oldInputType = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var newInputType = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        },
        requiredField: {
          type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
        },
        optionalField: {
          type: _type.GraphQLBoolean
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldInputType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newInputType]
    });
    var expectedFieldChanges = [{
      type: _findBreakingChanges.BreakingChangeType.NON_NULL_INPUT_FIELD_ADDED,
      description: 'A non-null field requiredField on input type ' + 'InputType1 was added.'
    }];
    (0, _chai.expect)((0, _findBreakingChanges.findFieldsThatChangedTypeOnInputObjectTypes)(oldSchema, newSchema).breakingChanges).to.eql(expectedFieldChanges);
  });
  (0, _mocha.it)('should detect if a type was removed from a union type', function () {
    var type1 = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    }); // logially equivalent to type1; findTypesRemovedFromUnions should not
    // treat this as different than type1

    var type1a = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var type2 = new _type.GraphQLObjectType({
      name: 'Type2',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var type3 = new _type.GraphQLObjectType({
      name: 'Type3',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldUnionType = new _type.GraphQLUnionType({
      name: 'UnionType1',
      types: [type1, type2]
    });
    var newUnionType = new _type.GraphQLUnionType({
      name: 'UnionType1',
      types: [type1a, type3]
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldUnionType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newUnionType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findTypesRemovedFromUnions)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.TYPE_REMOVED_FROM_UNION,
      description: 'Type2 was removed from union type UnionType1.'
    }]);
  });
  (0, _mocha.it)('should detect if a value was removed from an enum type', function () {
    var oldEnumType = new _type.GraphQLEnumType({
      name: 'EnumType1',
      values: {
        VALUE0: {
          value: 0
        },
        VALUE1: {
          value: 1
        },
        VALUE2: {
          value: 2
        }
      }
    });
    var newEnumType = new _type.GraphQLEnumType({
      name: 'EnumType1',
      values: {
        VALUE0: {
          value: 0
        },
        VALUE2: {
          value: 2
        },
        VALUE3: {
          value: 3
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldEnumType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newEnumType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findValuesRemovedFromEnums)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
      description: 'VALUE1 was removed from enum type EnumType1.'
    }]);
  });
  (0, _mocha.it)('should detect if a field argument was removed', function () {
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            name: {
              type: _type.GraphQLString
            }
          }
        }
      }
    });
    var inputType = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldInterfaceType = new _type.GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            arg1: {
              type: _type.GraphQLBoolean
            },
            objectArg: {
              type: inputType
            }
          }
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {}
        }
      }
    });
    var newInterfaceType = new _type.GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType, oldInterfaceType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType, newInterfaceType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findArgChanges)(oldSchema, newSchema).breakingChanges).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.ARG_REMOVED,
      description: 'Type1.field1 arg name was removed'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_REMOVED,
      description: 'Interface1.field1 arg arg1 was removed'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_REMOVED,
      description: 'Interface1.field1 arg objectArg was removed'
    }]);
  });
  (0, _mocha.it)('should detect if a field argument has changed type', function () {
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            arg1: {
              type: _type.GraphQLString
            },
            arg2: {
              type: _type.GraphQLString
            },
            arg3: {
              type: (0, _type.GraphQLList)(_type.GraphQLString)
            },
            arg4: {
              type: _type.GraphQLString
            },
            arg5: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
            },
            arg6: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
            },
            arg7: {
              type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
            },
            arg8: {
              type: _type.GraphQLInt
            },
            arg9: {
              type: (0, _type.GraphQLList)(_type.GraphQLInt)
            },
            arg10: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))
            },
            arg11: {
              type: (0, _type.GraphQLList)(_type.GraphQLInt)
            },
            arg12: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
            },
            arg13: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
            },
            arg14: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt)))
            },
            arg15: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt)))
            }
          }
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            arg1: {
              type: _type.GraphQLInt
            },
            arg2: {
              type: (0, _type.GraphQLList)(_type.GraphQLString)
            },
            arg3: {
              type: _type.GraphQLString
            },
            arg4: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
            },
            arg5: {
              type: _type.GraphQLInt
            },
            arg6: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
            },
            arg7: {
              type: (0, _type.GraphQLList)(_type.GraphQLInt)
            },
            arg8: {
              type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
            },
            arg9: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))
            },
            arg10: {
              type: (0, _type.GraphQLList)(_type.GraphQLInt)
            },
            arg11: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
            },
            arg12: {
              type: (0, _type.GraphQLList)(_type.GraphQLInt)
            },
            arg13: {
              type: (0, _type.GraphQLNonNull)((0, _type.GraphQLList)(_type.GraphQLInt))
            },
            arg14: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLList)(_type.GraphQLInt))
            },
            arg15: {
              type: (0, _type.GraphQLList)((0, _type.GraphQLNonNull)((0, _type.GraphQLList)((0, _type.GraphQLNonNull)(_type.GraphQLInt))))
            }
          }
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findArgChanges)(oldSchema, newSchema).breakingChanges).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg1 has changed type ' + 'from String to Int'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg2 has changed type from String ' + 'to [String]'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg3 has changed type from ' + '[String] to String'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg4 has changed type from String ' + 'to String!'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg5 has changed type from String! ' + 'to Int'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg6 has changed type from String! ' + 'to Int!'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg8 has changed type from Int to ' + '[Int]!'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg9 has changed type from [Int] to ' + '[Int!]'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg11 has changed type from [Int] to ' + '[[Int]]'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg12 has changed type from [[Int]] ' + 'to [Int]'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg13 has changed type from Int! to ' + '[Int]!'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg15 has changed type from [[Int]!] ' + 'to [[Int!]!]'
    }]);
  });
  (0, _mocha.it)('should detect if a non-null field argument was added', function () {
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            arg1: {
              type: _type.GraphQLString
            }
          }
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            arg1: {
              type: _type.GraphQLString
            },
            newRequiredArg: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
            },
            newOptionalArg: {
              type: _type.GraphQLInt
            }
          }
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findArgChanges)(oldSchema, newSchema).breakingChanges).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.NON_NULL_ARG_ADDED,
      description: 'A non-null arg newRequiredArg on Type1.field1 was ' + 'added'
    }]);
  });
  (0, _mocha.it)('should not flag args with the same type signature as breaking', function () {
    var inputType1a = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var inputType1b = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLInt,
          args: {
            arg1: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
            },
            arg2: {
              type: inputType1a
            }
          }
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLInt,
          args: {
            arg1: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLInt)
            },
            arg2: {
              type: inputType1b
            }
          }
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findArgChanges)(oldSchema, newSchema).breakingChanges).to.eql([]);
  });
  (0, _mocha.it)('should consider args that move away from NonNull as non-breaking', function () {
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            name: {
              type: (0, _type.GraphQLNonNull)(_type.GraphQLString)
            }
          }
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            name: {
              type: _type.GraphQLString
            }
          }
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findArgChanges)(oldSchema, newSchema).breakingChanges).to.eql([]);
  });
  (0, _mocha.it)('should detect interfaces removed from types', function () {
    var interface1 = new _type.GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      interfaces: [],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findInterfacesRemovedFromObjectTypes)(oldSchema, newSchema)).to.eql([{
      description: 'Type1 no longer implements interface Interface1.',
      type: _findBreakingChanges.BreakingChangeType.INTERFACE_REMOVED_FROM_OBJECT
    }]);
  });
  (0, _mocha.it)('should detect all breaking changes', function () {
    var typeThatGetsRemoved = new _type.GraphQLObjectType({
      name: 'TypeThatGetsRemoved',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var argThatChanges = new _type.GraphQLObjectType({
      name: 'ArgThatChanges',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            id: {
              type: _type.GraphQLInt
            }
          }
        }
      }
    });
    var argChanged = new _type.GraphQLObjectType({
      name: 'ArgThatChanges',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            id: {
              type: _type.GraphQLString
            }
          }
        }
      }
    });
    var typeThatChangesTypeOld = new _type.GraphQLObjectType({
      name: 'TypeThatChangesType',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeThatChangesTypeNew = new _type.GraphQLInterfaceType({
      name: 'TypeThatChangesType',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeThatHasBreakingFieldChangesOld = new _type.GraphQLInterfaceType({
      name: 'TypeThatHasBreakingFieldChanges',
      fields: {
        field1: {
          type: _type.GraphQLString
        },
        field2: {
          type: _type.GraphQLString
        }
      }
    });
    var typeThatHasBreakingFieldChangesNew = new _type.GraphQLInterfaceType({
      name: 'TypeThatHasBreakingFieldChanges',
      fields: {
        field2: {
          type: _type.GraphQLBoolean
        }
      }
    });
    var typeInUnion1 = new _type.GraphQLObjectType({
      name: 'TypeInUnion1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeInUnion2 = new _type.GraphQLObjectType({
      name: 'TypeInUnion2',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var unionTypeThatLosesATypeOld = new _type.GraphQLUnionType({
      name: 'UnionTypeThatLosesAType',
      types: [typeInUnion1, typeInUnion2]
    });
    var unionTypeThatLosesATypeNew = new _type.GraphQLUnionType({
      name: 'UnionTypeThatLosesAType',
      types: [typeInUnion1]
    });
    var enumTypeThatLosesAValueOld = new _type.GraphQLEnumType({
      name: 'EnumTypeThatLosesAValue',
      values: {
        VALUE0: {
          value: 0
        },
        VALUE1: {
          value: 1
        },
        VALUE2: {
          value: 2
        }
      }
    });
    var enumTypeThatLosesAValueNew = new _type.GraphQLEnumType({
      name: 'EnumTypeThatLosesAValue',
      values: {
        VALUE1: {
          value: 1
        },
        VALUE2: {
          value: 2
        }
      }
    });
    var interface1 = new _type.GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeThatLosesInterfaceOld = new _type.GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeThaLosesInterfaceNew = new _type.GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var directiveThatIsRemoved = _directives.GraphQLSkipDirective;
    var directiveThatRemovesArgOld = new _directives.GraphQLDirective({
      name: 'DirectiveThatRemovesArg',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION],
      args: {
        arg1: {
          name: 'arg1'
        }
      }
    });
    var directiveThatRemovesArgNew = new _directives.GraphQLDirective({
      name: 'DirectiveThatRemovesArg',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION]
    });
    var nonNullDirectiveAddedOld = new _directives.GraphQLDirective({
      name: 'NonNullDirectiveAdded',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION]
    });
    var nonNullDirectiveAddedNew = new _directives.GraphQLDirective({
      name: 'NonNullDirectiveAdded',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION],
      args: {
        arg1: {
          name: 'arg1',
          type: (0, _type.GraphQLNonNull)(_type.GraphQLBoolean)
        }
      }
    });
    var directiveRemovedLocationOld = new _directives.GraphQLDirective({
      name: 'Directive Name',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION, _directiveLocation.DirectiveLocation.QUERY]
    });
    var directiveRemovedLocationNew = new _directives.GraphQLDirective({
      name: 'Directive Name',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION]
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [typeThatGetsRemoved, typeThatChangesTypeOld, typeThatHasBreakingFieldChangesOld, unionTypeThatLosesATypeOld, enumTypeThatLosesAValueOld, argThatChanges, typeThatLosesInterfaceOld],
      directives: [directiveThatIsRemoved, directiveThatRemovesArgOld, nonNullDirectiveAddedOld, directiveRemovedLocationOld]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [typeThatChangesTypeNew, typeThatHasBreakingFieldChangesNew, unionTypeThatLosesATypeNew, enumTypeThatLosesAValueNew, argChanged, typeThaLosesInterfaceNew, interface1],
      directives: [directiveThatRemovesArgNew, nonNullDirectiveAddedNew, directiveRemovedLocationNew]
    });
    var expectedBreakingChanges = [{
      type: _findBreakingChanges.BreakingChangeType.TYPE_REMOVED,
      description: 'TypeThatGetsRemoved was removed.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.TYPE_REMOVED,
      description: 'TypeInUnion2 was removed.'
    }, {
      description: 'Int was removed.',
      type: _findBreakingChanges.BreakingChangeType.TYPE_REMOVED
    }, {
      type: _findBreakingChanges.BreakingChangeType.TYPE_CHANGED_KIND,
      description: 'TypeThatChangesType changed from an Object type to an ' + 'Interface type.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_REMOVED,
      description: 'TypeThatHasBreakingFieldChanges.field1 was removed.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'TypeThatHasBreakingFieldChanges.field2 changed type ' + 'from String to Boolean.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.TYPE_REMOVED_FROM_UNION,
      description: 'TypeInUnion2 was removed from union type ' + 'UnionTypeThatLosesAType.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
      description: 'VALUE0 was removed from enum type ' + 'EnumTypeThatLosesAValue.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.ARG_CHANGED_KIND,
      description: 'ArgThatChanges.field1 arg id has changed ' + 'type from Int to String'
    }, {
      type: _findBreakingChanges.BreakingChangeType.INTERFACE_REMOVED_FROM_OBJECT,
      description: 'TypeThatGainsInterface1 no longer implements ' + 'interface Interface1.'
    }, {
      type: _findBreakingChanges.BreakingChangeType.DIRECTIVE_REMOVED,
      description: 'skip was removed'
    }, {
      type: _findBreakingChanges.BreakingChangeType.DIRECTIVE_ARG_REMOVED,
      description: 'arg1 was removed from DirectiveThatRemovesArg'
    }, {
      type: _findBreakingChanges.BreakingChangeType.NON_NULL_DIRECTIVE_ARG_ADDED,
      description: 'A non-null arg arg1 on directive ' + 'NonNullDirectiveAdded was added'
    }, {
      type: _findBreakingChanges.BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
      description: 'QUERY was removed from Directive Name'
    }];
    (0, _chai.expect)((0, _findBreakingChanges.findBreakingChanges)(oldSchema, newSchema)).to.eql(expectedBreakingChanges);
  });
  (0, _mocha.it)('should detect if a directive was explicitly removed', function () {
    var oldSchema = new _type.GraphQLSchema({
      directives: [_directives.GraphQLSkipDirective, _directives.GraphQLIncludeDirective]
    });
    var newSchema = new _type.GraphQLSchema({
      directives: [_directives.GraphQLSkipDirective]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findRemovedDirectives)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.DIRECTIVE_REMOVED,
      description: "".concat(_directives.GraphQLIncludeDirective.name, " was removed")
    }]);
  });
  (0, _mocha.it)('should detect if a directive was implicitly removed', function () {
    var oldSchema = new _type.GraphQLSchema({});
    var newSchema = new _type.GraphQLSchema({
      directives: [_directives.GraphQLSkipDirective, _directives.GraphQLIncludeDirective]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findRemovedDirectives)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.DIRECTIVE_REMOVED,
      description: "".concat(_directives.GraphQLDeprecatedDirective.name, " was removed")
    }]);
  });
  (0, _mocha.it)('should detect if a directive argument was removed', function () {
    var oldSchema = new _type.GraphQLSchema({
      directives: [new _directives.GraphQLDirective({
        name: 'DirectiveWithArg',
        locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION],
        args: {
          arg1: {
            name: 'arg1'
          }
        }
      })]
    });
    var newSchema = new _type.GraphQLSchema({
      directives: [new _directives.GraphQLDirective({
        name: 'DirectiveWithArg',
        locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION]
      })]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findRemovedDirectiveArgs)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.DIRECTIVE_ARG_REMOVED,
      description: 'arg1 was removed from DirectiveWithArg'
    }]);
  });
  (0, _mocha.it)('should detect if a non-nullable directive argument was added', function () {
    var oldSchema = new _type.GraphQLSchema({
      directives: [new _directives.GraphQLDirective({
        name: 'DirectiveName',
        locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION]
      })]
    });
    var newSchema = new _type.GraphQLSchema({
      directives: [new _directives.GraphQLDirective({
        name: 'DirectiveName',
        locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION],
        args: {
          arg1: {
            name: 'arg1',
            type: (0, _type.GraphQLNonNull)(_type.GraphQLBoolean)
          }
        }
      })]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findAddedNonNullDirectiveArgs)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.NON_NULL_DIRECTIVE_ARG_ADDED,
      description: 'A non-null arg arg1 on directive DirectiveName was added'
    }]);
  });
  (0, _mocha.it)('should detect locations removed from a directive', function () {
    var d1 = new _directives.GraphQLDirective({
      name: 'Directive Name',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION, _directiveLocation.DirectiveLocation.QUERY]
    });
    var d2 = new _directives.GraphQLDirective({
      name: 'Directive Name',
      locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findRemovedLocationsForDirective)(d1, d2)).to.eql([_directiveLocation.DirectiveLocation.QUERY]);
  });
  (0, _mocha.it)('should detect locations removed directives within a schema', function () {
    var oldSchema = new _type.GraphQLSchema({
      directives: [new _directives.GraphQLDirective({
        name: 'Directive Name',
        locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION, _directiveLocation.DirectiveLocation.QUERY]
      })]
    });
    var newSchema = new _type.GraphQLSchema({
      directives: [new _directives.GraphQLDirective({
        name: 'Directive Name',
        locations: [_directiveLocation.DirectiveLocation.FIELD_DEFINITION]
      })]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findRemovedDirectiveLocations)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
      description: 'QUERY was removed from Directive Name'
    }]);
  });
});
(0, _mocha.describe)('findDangerousChanges', function () {
  var queryType = new _type.GraphQLObjectType({
    name: 'Query',
    fields: {
      field1: {
        type: _type.GraphQLString
      }
    }
  });
  (0, _mocha.describe)('findArgChanges', function () {
    (0, _mocha.it)("should detect if an argument's defaultValue has changed", function () {
      var oldType = new _type.GraphQLObjectType({
        name: 'Type1',
        fields: {
          field1: {
            type: _type.GraphQLString,
            args: {
              name: {
                type: _type.GraphQLString,
                defaultValue: 'test'
              }
            }
          }
        }
      });
      var newType = new _type.GraphQLObjectType({
        name: 'Type1',
        fields: {
          field1: {
            type: _type.GraphQLString,
            args: {
              name: {
                type: _type.GraphQLString,
                defaultValue: 'Test'
              }
            }
          }
        }
      });
      var oldSchema = new _type.GraphQLSchema({
        query: queryType,
        types: [oldType]
      });
      var newSchema = new _type.GraphQLSchema({
        query: queryType,
        types: [newType]
      });
      (0, _chai.expect)((0, _findBreakingChanges.findArgChanges)(oldSchema, newSchema).dangerousChanges).to.eql([{
        type: _findBreakingChanges.DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
        description: 'Type1.field1 arg name has changed defaultValue'
      }]);
    });
  });
  (0, _mocha.it)('should detect if a value was added to an enum type', function () {
    var oldEnumType = new _type.GraphQLEnumType({
      name: 'EnumType1',
      values: {
        VALUE0: {
          value: 0
        },
        VALUE1: {
          value: 1
        }
      }
    });
    var newEnumType = new _type.GraphQLEnumType({
      name: 'EnumType1',
      values: {
        VALUE0: {
          value: 0
        },
        VALUE1: {
          value: 1
        },
        VALUE2: {
          value: 2
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldEnumType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newEnumType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findValuesAddedToEnums)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.DangerousChangeType.VALUE_ADDED_TO_ENUM,
      description: 'VALUE2 was added to enum type EnumType1.'
    }]);
  });
  (0, _mocha.it)('should detect interfaces added to types', function () {
    var interface1 = new _type.GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      interfaces: [],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findInterfacesAddedToObjectTypes)(oldSchema, newSchema)).to.eql([{
      description: 'Interface1 added to interfaces implemented by Type1.',
      type: _findBreakingChanges.DangerousChangeType.INTERFACE_ADDED_TO_OBJECT
    }]);
  });
  (0, _mocha.it)('should detect if a type was added to a union type', function () {
    var type1 = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    }); // logially equivalent to type1; findTypesRemovedFromUnions should not
    // treat this as different than type1

    var type1a = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var type2 = new _type.GraphQLObjectType({
      name: 'Type2',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldUnionType = new _type.GraphQLUnionType({
      name: 'UnionType1',
      types: [type1]
    });
    var newUnionType = new _type.GraphQLUnionType({
      name: 'UnionType1',
      types: [type1a, type2]
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldUnionType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newUnionType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findTypesAddedToUnions)(oldSchema, newSchema)).to.eql([{
      type: _findBreakingChanges.DangerousChangeType.TYPE_ADDED_TO_UNION,
      description: 'Type2 was added to union type UnionType1.'
    }]);
  });
  (0, _mocha.it)('should detect if a nullable field was added to an input', function () {
    var oldInputType = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var newInputType = new _type.GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: _type.GraphQLString
        },
        field2: {
          type: _type.GraphQLInt
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldInputType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newInputType]
    });
    var expectedFieldChanges = [{
      type: _findBreakingChanges.DangerousChangeType.NULLABLE_INPUT_FIELD_ADDED,
      description: 'A nullable field field2 on input type ' + 'InputType1 was added.'
    }];
    (0, _chai.expect)((0, _findBreakingChanges.findFieldsThatChangedTypeOnInputObjectTypes)(oldSchema, newSchema).dangerousChanges).to.eql(expectedFieldChanges);
  });
  (0, _mocha.it)('should find all dangerous changes', function () {
    var enumThatGainsAValueOld = new _type.GraphQLEnumType({
      name: 'EnumType1',
      values: {
        VALUE0: {
          value: 0
        },
        VALUE1: {
          value: 1
        }
      }
    });
    var enumThatGainsAValueNew = new _type.GraphQLEnumType({
      name: 'EnumType1',
      values: {
        VALUE0: {
          value: 0
        },
        VALUE1: {
          value: 1
        },
        VALUE2: {
          value: 2
        }
      }
    });
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            name: {
              type: _type.GraphQLString,
              defaultValue: 'test'
            }
          }
        }
      }
    });
    var typeInUnion1 = new _type.GraphQLObjectType({
      name: 'TypeInUnion1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeInUnion2 = new _type.GraphQLObjectType({
      name: 'TypeInUnion2',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var unionTypeThatGainsATypeOld = new _type.GraphQLUnionType({
      name: 'UnionTypeThatGainsAType',
      types: [typeInUnion1]
    });
    var unionTypeThatGainsATypeNew = new _type.GraphQLUnionType({
      name: 'UnionTypeThatGainsAType',
      types: [typeInUnion1, typeInUnion2]
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            name: {
              type: _type.GraphQLString,
              defaultValue: 'Test'
            }
          }
        }
      }
    });
    var interface1 = new _type.GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeThatGainsInterfaceOld = new _type.GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var typeThaGainsInterfaceNew = new _type.GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: _type.GraphQLString
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType, enumThatGainsAValueOld, typeThatGainsInterfaceOld, unionTypeThatGainsATypeOld]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType, enumThatGainsAValueNew, typeThaGainsInterfaceNew, unionTypeThatGainsATypeNew]
    });
    var expectedDangerousChanges = [{
      description: 'Type1.field1 arg name has changed defaultValue',
      type: 'ARG_DEFAULT_VALUE_CHANGE'
    }, {
      description: 'VALUE2 was added to enum type EnumType1.',
      type: 'VALUE_ADDED_TO_ENUM'
    }, {
      description: 'Interface1 added to interfaces implemented ' + 'by TypeThatGainsInterface1.',
      type: _findBreakingChanges.DangerousChangeType.INTERFACE_ADDED_TO_OBJECT
    }, {
      type: _findBreakingChanges.DangerousChangeType.TYPE_ADDED_TO_UNION,
      description: 'TypeInUnion2 was added to union type ' + 'UnionTypeThatGainsAType.'
    }];
    (0, _chai.expect)((0, _findBreakingChanges.findDangerousChanges)(oldSchema, newSchema)).to.eql(expectedDangerousChanges);
  });
  (0, _mocha.it)('should detect if a nullable field argument was added', function () {
    var oldType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            arg1: {
              type: _type.GraphQLString
            }
          }
        }
      }
    });
    var newType = new _type.GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: _type.GraphQLString,
          args: {
            arg1: {
              type: _type.GraphQLString
            },
            arg2: {
              type: _type.GraphQLString
            }
          }
        }
      }
    });
    var oldSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new _type.GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    (0, _chai.expect)((0, _findBreakingChanges.findArgChanges)(oldSchema, newSchema).dangerousChanges).to.eql([{
      type: _findBreakingChanges.DangerousChangeType.NULLABLE_ARG_ADDED,
      description: 'A nullable arg arg2 on Type1.field1 was added'
    }]);
  });
});