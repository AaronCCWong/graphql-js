/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GraphQLBoolean, GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLUnionType, GraphQLInt, GraphQLNonNull } from '../../type';
import { BreakingChangeType, DangerousChangeType, findBreakingChanges, findDangerousChanges, findFieldsThatChangedTypeOnObjectOrInterfaceTypes, findFieldsThatChangedTypeOnInputObjectTypes, findRemovedTypes, findTypesRemovedFromUnions, findTypesAddedToUnions, findTypesThatChangedKind, findValuesRemovedFromEnums, findValuesAddedToEnums, findArgChanges, findInterfacesRemovedFromObjectTypes, findInterfacesAddedToObjectTypes, findRemovedDirectives, findRemovedDirectiveArgs, findAddedNonNullDirectiveArgs, findRemovedLocationsForDirective, findRemovedDirectiveLocations } from '../findBreakingChanges';
import { GraphQLSkipDirective, GraphQLIncludeDirective, GraphQLDeprecatedDirective, GraphQLDirective } from '../../type/directives';
import { DirectiveLocation } from '../../language/directiveLocation';
describe('findBreakingChanges', function () {
  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      field1: {
        type: GraphQLString
      }
    }
  });
  it('should detect if a type was removed or not', function () {
    var type1 = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var type2 = new GraphQLObjectType({
      name: 'Type2',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [type1, type2]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [type2]
    });
    expect(findRemovedTypes(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.TYPE_REMOVED,
      description: 'Type1 was removed.'
    }]);
    expect(findRemovedTypes(oldSchema, oldSchema)).to.eql([]);
  });
  it('should detect if a type changed its type', function () {
    var objectType = new GraphQLObjectType({
      name: 'ObjectType',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var interfaceType1 = new GraphQLInterfaceType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var unionType1 = new GraphQLUnionType({
      name: 'Type1',
      types: [objectType]
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [interfaceType1]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [unionType1]
    });
    expect(findTypesThatChangedKind(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.TYPE_CHANGED_KIND,
      description: 'Type1 changed from an Interface type to a Union type.'
    }]);
  });
  it('should detect if a field on a type was deleted or changed type', function () {
    var TypeA = new GraphQLObjectType({
      name: 'TypeA',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    }); // logically equivalent to TypeA; findBreakingFieldChanges shouldn't
    // treat this as different than TypeA

    var TypeA2 = new GraphQLObjectType({
      name: 'TypeA',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var TypeB = new GraphQLObjectType({
      name: 'TypeB',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldType1 = new GraphQLInterfaceType({
      name: 'Type1',
      fields: {
        field1: {
          type: TypeA
        },
        field2: {
          type: GraphQLString
        },
        field3: {
          type: GraphQLString
        },
        field4: {
          type: TypeA
        },
        field6: {
          type: GraphQLString
        },
        field7: {
          type: GraphQLList(GraphQLString)
        },
        field8: {
          type: GraphQLInt
        },
        field9: {
          type: GraphQLNonNull(GraphQLInt)
        },
        field10: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field11: {
          type: GraphQLInt
        },
        field12: {
          type: GraphQLList(GraphQLInt)
        },
        field13: {
          type: GraphQLList(GraphQLNonNull(GraphQLInt))
        },
        field14: {
          type: GraphQLList(GraphQLInt)
        },
        field15: {
          type: GraphQLList(GraphQLList(GraphQLInt))
        },
        field16: {
          type: GraphQLNonNull(GraphQLInt)
        },
        field17: {
          type: GraphQLList(GraphQLInt)
        },
        field18: {
          type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))))
        }
      }
    });
    var newType1 = new GraphQLInterfaceType({
      name: 'Type1',
      fields: {
        field1: {
          type: TypeA2
        },
        field3: {
          type: GraphQLBoolean
        },
        field4: {
          type: TypeB
        },
        field5: {
          type: GraphQLString
        },
        field6: {
          type: GraphQLList(GraphQLString)
        },
        field7: {
          type: GraphQLString
        },
        field8: {
          type: GraphQLNonNull(GraphQLInt)
        },
        field9: {
          type: GraphQLInt
        },
        field10: {
          type: GraphQLList(GraphQLInt)
        },
        field11: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field12: {
          type: GraphQLList(GraphQLNonNull(GraphQLInt))
        },
        field13: {
          type: GraphQLList(GraphQLInt)
        },
        field14: {
          type: GraphQLList(GraphQLList(GraphQLInt))
        },
        field15: {
          type: GraphQLList(GraphQLInt)
        },
        field16: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field17: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field18: {
          type: GraphQLList(GraphQLList(GraphQLNonNull(GraphQLInt)))
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType1]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType1]
    });
    var expectedFieldChanges = [{
      type: BreakingChangeType.FIELD_REMOVED,
      description: 'Type1.field2 was removed.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field3 changed type from String to Boolean.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field4 changed type from TypeA to TypeB.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field6 changed type from String to [String].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field7 changed type from [String] to String.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field9 changed type from Int! to Int.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field10 changed type from [Int]! to [Int].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field11 changed type from Int to [Int]!.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field13 changed type from [Int!] to [Int].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field14 changed type from [Int] to [[Int]].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field15 changed type from [[Int]] to [Int].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field16 changed type from Int! to [Int]!.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'Type1.field18 changed type from [[Int!]!] to [[Int!]].'
    }];
    expect(findFieldsThatChangedTypeOnObjectOrInterfaceTypes(oldSchema, newSchema)).to.eql(expectedFieldChanges);
  });
  it('should detect if fields on input types changed kind or were removed', function () {
    var oldInputType = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        },
        field2: {
          type: GraphQLBoolean
        },
        field3: {
          type: GraphQLList(GraphQLString)
        },
        field4: {
          type: GraphQLNonNull(GraphQLString)
        },
        field5: {
          type: GraphQLString
        },
        field6: {
          type: GraphQLList(GraphQLInt)
        },
        field7: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field8: {
          type: GraphQLInt
        },
        field9: {
          type: GraphQLList(GraphQLInt)
        },
        field10: {
          type: GraphQLList(GraphQLNonNull(GraphQLInt))
        },
        field11: {
          type: GraphQLList(GraphQLInt)
        },
        field12: {
          type: GraphQLList(GraphQLList(GraphQLInt))
        },
        field13: {
          type: GraphQLNonNull(GraphQLInt)
        },
        field14: {
          type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLInt)))
        },
        field15: {
          type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLInt)))
        }
      }
    });
    var newInputType = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLInt
        },
        field3: {
          type: GraphQLString
        },
        field4: {
          type: GraphQLString
        },
        field5: {
          type: GraphQLNonNull(GraphQLString)
        },
        field6: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field7: {
          type: GraphQLList(GraphQLInt)
        },
        field8: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field9: {
          type: GraphQLList(GraphQLNonNull(GraphQLInt))
        },
        field10: {
          type: GraphQLList(GraphQLInt)
        },
        field11: {
          type: GraphQLList(GraphQLList(GraphQLInt))
        },
        field12: {
          type: GraphQLList(GraphQLInt)
        },
        field13: {
          type: GraphQLNonNull(GraphQLList(GraphQLInt))
        },
        field14: {
          type: GraphQLList(GraphQLList(GraphQLInt))
        },
        field15: {
          type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))))
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldInputType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newInputType]
    });
    var expectedFieldChanges = [{
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field1 changed type from String to Int.'
    }, {
      type: BreakingChangeType.FIELD_REMOVED,
      description: 'InputType1.field2 was removed.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field3 changed type from [String] to ' + 'String.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field5 changed type from String to ' + 'String!.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field6 changed type from [Int] to ' + '[Int]!.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field8 changed type from Int to ' + '[Int]!.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field9 changed type from [Int] to ' + '[Int!].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field11 changed type from [Int] to ' + '[[Int]].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field12 changed type from [[Int]] to ' + '[Int].'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field13 changed type from Int! to ' + '[Int]!.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'InputType1.field15 changed type from [[Int]!] to ' + '[[Int!]!].'
    }];
    expect(findFieldsThatChangedTypeOnInputObjectTypes(oldSchema, newSchema).breakingChanges).to.eql(expectedFieldChanges);
  });
  it('should detect if a non-null field is added to an input type', function () {
    var oldInputType = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var newInputType = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        },
        requiredField: {
          type: GraphQLNonNull(GraphQLInt)
        },
        optionalField: {
          type: GraphQLBoolean
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldInputType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newInputType]
    });
    var expectedFieldChanges = [{
      type: BreakingChangeType.NON_NULL_INPUT_FIELD_ADDED,
      description: 'A non-null field requiredField on input type ' + 'InputType1 was added.'
    }];
    expect(findFieldsThatChangedTypeOnInputObjectTypes(oldSchema, newSchema).breakingChanges).to.eql(expectedFieldChanges);
  });
  it('should detect if a type was removed from a union type', function () {
    var type1 = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    }); // logially equivalent to type1; findTypesRemovedFromUnions should not
    // treat this as different than type1

    var type1a = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var type2 = new GraphQLObjectType({
      name: 'Type2',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var type3 = new GraphQLObjectType({
      name: 'Type3',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldUnionType = new GraphQLUnionType({
      name: 'UnionType1',
      types: [type1, type2]
    });
    var newUnionType = new GraphQLUnionType({
      name: 'UnionType1',
      types: [type1a, type3]
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldUnionType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newUnionType]
    });
    expect(findTypesRemovedFromUnions(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.TYPE_REMOVED_FROM_UNION,
      description: 'Type2 was removed from union type UnionType1.'
    }]);
  });
  it('should detect if a value was removed from an enum type', function () {
    var oldEnumType = new GraphQLEnumType({
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
    var newEnumType = new GraphQLEnumType({
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
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldEnumType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newEnumType]
    });
    expect(findValuesRemovedFromEnums(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
      description: 'VALUE1 was removed from enum type EnumType1.'
    }]);
  });
  it('should detect if a field argument was removed', function () {
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            name: {
              type: GraphQLString
            }
          }
        }
      }
    });
    var inputType = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldInterfaceType = new GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            arg1: {
              type: GraphQLBoolean
            },
            objectArg: {
              type: inputType
            }
          }
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {}
        }
      }
    });
    var newInterfaceType = new GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType, oldInterfaceType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType, newInterfaceType]
    });
    expect(findArgChanges(oldSchema, newSchema).breakingChanges).to.eql([{
      type: BreakingChangeType.ARG_REMOVED,
      description: 'Type1.field1 arg name was removed'
    }, {
      type: BreakingChangeType.ARG_REMOVED,
      description: 'Interface1.field1 arg arg1 was removed'
    }, {
      type: BreakingChangeType.ARG_REMOVED,
      description: 'Interface1.field1 arg objectArg was removed'
    }]);
  });
  it('should detect if a field argument has changed type', function () {
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            arg1: {
              type: GraphQLString
            },
            arg2: {
              type: GraphQLString
            },
            arg3: {
              type: GraphQLList(GraphQLString)
            },
            arg4: {
              type: GraphQLString
            },
            arg5: {
              type: GraphQLNonNull(GraphQLString)
            },
            arg6: {
              type: GraphQLNonNull(GraphQLString)
            },
            arg7: {
              type: GraphQLNonNull(GraphQLList(GraphQLInt))
            },
            arg8: {
              type: GraphQLInt
            },
            arg9: {
              type: GraphQLList(GraphQLInt)
            },
            arg10: {
              type: GraphQLList(GraphQLNonNull(GraphQLInt))
            },
            arg11: {
              type: GraphQLList(GraphQLInt)
            },
            arg12: {
              type: GraphQLList(GraphQLList(GraphQLInt))
            },
            arg13: {
              type: GraphQLNonNull(GraphQLInt)
            },
            arg14: {
              type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLInt)))
            },
            arg15: {
              type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLInt)))
            }
          }
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            arg1: {
              type: GraphQLInt
            },
            arg2: {
              type: GraphQLList(GraphQLString)
            },
            arg3: {
              type: GraphQLString
            },
            arg4: {
              type: GraphQLNonNull(GraphQLString)
            },
            arg5: {
              type: GraphQLInt
            },
            arg6: {
              type: GraphQLNonNull(GraphQLInt)
            },
            arg7: {
              type: GraphQLList(GraphQLInt)
            },
            arg8: {
              type: GraphQLNonNull(GraphQLList(GraphQLInt))
            },
            arg9: {
              type: GraphQLList(GraphQLNonNull(GraphQLInt))
            },
            arg10: {
              type: GraphQLList(GraphQLInt)
            },
            arg11: {
              type: GraphQLList(GraphQLList(GraphQLInt))
            },
            arg12: {
              type: GraphQLList(GraphQLInt)
            },
            arg13: {
              type: GraphQLNonNull(GraphQLList(GraphQLInt))
            },
            arg14: {
              type: GraphQLList(GraphQLList(GraphQLInt))
            },
            arg15: {
              type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))))
            }
          }
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    expect(findArgChanges(oldSchema, newSchema).breakingChanges).to.eql([{
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg1 has changed type ' + 'from String to Int'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg2 has changed type from String ' + 'to [String]'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg3 has changed type from ' + '[String] to String'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg4 has changed type from String ' + 'to String!'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg5 has changed type from String! ' + 'to Int'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg6 has changed type from String! ' + 'to Int!'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg8 has changed type from Int to ' + '[Int]!'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg9 has changed type from [Int] to ' + '[Int!]'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg11 has changed type from [Int] to ' + '[[Int]]'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg12 has changed type from [[Int]] ' + 'to [Int]'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg13 has changed type from Int! to ' + '[Int]!'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'Type1.field1 arg arg15 has changed type from [[Int]!] ' + 'to [[Int!]!]'
    }]);
  });
  it('should detect if a non-null field argument was added', function () {
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            arg1: {
              type: GraphQLString
            }
          }
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            arg1: {
              type: GraphQLString
            },
            newRequiredArg: {
              type: GraphQLNonNull(GraphQLString)
            },
            newOptionalArg: {
              type: GraphQLInt
            }
          }
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    expect(findArgChanges(oldSchema, newSchema).breakingChanges).to.eql([{
      type: BreakingChangeType.NON_NULL_ARG_ADDED,
      description: 'A non-null arg newRequiredArg on Type1.field1 was ' + 'added'
    }]);
  });
  it('should not flag args with the same type signature as breaking', function () {
    var inputType1a = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var inputType1b = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLInt,
          args: {
            arg1: {
              type: GraphQLNonNull(GraphQLInt)
            },
            arg2: {
              type: inputType1a
            }
          }
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLInt,
          args: {
            arg1: {
              type: GraphQLNonNull(GraphQLInt)
            },
            arg2: {
              type: inputType1b
            }
          }
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    expect(findArgChanges(oldSchema, newSchema).breakingChanges).to.eql([]);
  });
  it('should consider args that move away from NonNull as non-breaking', function () {
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            name: {
              type: GraphQLNonNull(GraphQLString)
            }
          }
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            name: {
              type: GraphQLString
            }
          }
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    expect(findArgChanges(oldSchema, newSchema).breakingChanges).to.eql([]);
  });
  it('should detect interfaces removed from types', function () {
    var interface1 = new GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      interfaces: [],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    expect(findInterfacesRemovedFromObjectTypes(oldSchema, newSchema)).to.eql([{
      description: 'Type1 no longer implements interface Interface1.',
      type: BreakingChangeType.INTERFACE_REMOVED_FROM_OBJECT
    }]);
  });
  it('should detect all breaking changes', function () {
    var typeThatGetsRemoved = new GraphQLObjectType({
      name: 'TypeThatGetsRemoved',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var argThatChanges = new GraphQLObjectType({
      name: 'ArgThatChanges',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            id: {
              type: GraphQLInt
            }
          }
        }
      }
    });
    var argChanged = new GraphQLObjectType({
      name: 'ArgThatChanges',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            id: {
              type: GraphQLString
            }
          }
        }
      }
    });
    var typeThatChangesTypeOld = new GraphQLObjectType({
      name: 'TypeThatChangesType',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeThatChangesTypeNew = new GraphQLInterfaceType({
      name: 'TypeThatChangesType',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeThatHasBreakingFieldChangesOld = new GraphQLInterfaceType({
      name: 'TypeThatHasBreakingFieldChanges',
      fields: {
        field1: {
          type: GraphQLString
        },
        field2: {
          type: GraphQLString
        }
      }
    });
    var typeThatHasBreakingFieldChangesNew = new GraphQLInterfaceType({
      name: 'TypeThatHasBreakingFieldChanges',
      fields: {
        field2: {
          type: GraphQLBoolean
        }
      }
    });
    var typeInUnion1 = new GraphQLObjectType({
      name: 'TypeInUnion1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeInUnion2 = new GraphQLObjectType({
      name: 'TypeInUnion2',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var unionTypeThatLosesATypeOld = new GraphQLUnionType({
      name: 'UnionTypeThatLosesAType',
      types: [typeInUnion1, typeInUnion2]
    });
    var unionTypeThatLosesATypeNew = new GraphQLUnionType({
      name: 'UnionTypeThatLosesAType',
      types: [typeInUnion1]
    });
    var enumTypeThatLosesAValueOld = new GraphQLEnumType({
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
    var enumTypeThatLosesAValueNew = new GraphQLEnumType({
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
    var interface1 = new GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeThatLosesInterfaceOld = new GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeThaLosesInterfaceNew = new GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var directiveThatIsRemoved = GraphQLSkipDirective;
    var directiveThatRemovesArgOld = new GraphQLDirective({
      name: 'DirectiveThatRemovesArg',
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        arg1: {
          name: 'arg1'
        }
      }
    });
    var directiveThatRemovesArgNew = new GraphQLDirective({
      name: 'DirectiveThatRemovesArg',
      locations: [DirectiveLocation.FIELD_DEFINITION]
    });
    var nonNullDirectiveAddedOld = new GraphQLDirective({
      name: 'NonNullDirectiveAdded',
      locations: [DirectiveLocation.FIELD_DEFINITION]
    });
    var nonNullDirectiveAddedNew = new GraphQLDirective({
      name: 'NonNullDirectiveAdded',
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        arg1: {
          name: 'arg1',
          type: GraphQLNonNull(GraphQLBoolean)
        }
      }
    });
    var directiveRemovedLocationOld = new GraphQLDirective({
      name: 'Directive Name',
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.QUERY]
    });
    var directiveRemovedLocationNew = new GraphQLDirective({
      name: 'Directive Name',
      locations: [DirectiveLocation.FIELD_DEFINITION]
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [typeThatGetsRemoved, typeThatChangesTypeOld, typeThatHasBreakingFieldChangesOld, unionTypeThatLosesATypeOld, enumTypeThatLosesAValueOld, argThatChanges, typeThatLosesInterfaceOld],
      directives: [directiveThatIsRemoved, directiveThatRemovesArgOld, nonNullDirectiveAddedOld, directiveRemovedLocationOld]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [typeThatChangesTypeNew, typeThatHasBreakingFieldChangesNew, unionTypeThatLosesATypeNew, enumTypeThatLosesAValueNew, argChanged, typeThaLosesInterfaceNew, interface1],
      directives: [directiveThatRemovesArgNew, nonNullDirectiveAddedNew, directiveRemovedLocationNew]
    });
    var expectedBreakingChanges = [{
      type: BreakingChangeType.TYPE_REMOVED,
      description: 'TypeThatGetsRemoved was removed.'
    }, {
      type: BreakingChangeType.TYPE_REMOVED,
      description: 'TypeInUnion2 was removed.'
    }, {
      description: 'Int was removed.',
      type: BreakingChangeType.TYPE_REMOVED
    }, {
      type: BreakingChangeType.TYPE_CHANGED_KIND,
      description: 'TypeThatChangesType changed from an Object type to an ' + 'Interface type.'
    }, {
      type: BreakingChangeType.FIELD_REMOVED,
      description: 'TypeThatHasBreakingFieldChanges.field1 was removed.'
    }, {
      type: BreakingChangeType.FIELD_CHANGED_KIND,
      description: 'TypeThatHasBreakingFieldChanges.field2 changed type ' + 'from String to Boolean.'
    }, {
      type: BreakingChangeType.TYPE_REMOVED_FROM_UNION,
      description: 'TypeInUnion2 was removed from union type ' + 'UnionTypeThatLosesAType.'
    }, {
      type: BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
      description: 'VALUE0 was removed from enum type ' + 'EnumTypeThatLosesAValue.'
    }, {
      type: BreakingChangeType.ARG_CHANGED_KIND,
      description: 'ArgThatChanges.field1 arg id has changed ' + 'type from Int to String'
    }, {
      type: BreakingChangeType.INTERFACE_REMOVED_FROM_OBJECT,
      description: 'TypeThatGainsInterface1 no longer implements ' + 'interface Interface1.'
    }, {
      type: BreakingChangeType.DIRECTIVE_REMOVED,
      description: 'skip was removed'
    }, {
      type: BreakingChangeType.DIRECTIVE_ARG_REMOVED,
      description: 'arg1 was removed from DirectiveThatRemovesArg'
    }, {
      type: BreakingChangeType.NON_NULL_DIRECTIVE_ARG_ADDED,
      description: 'A non-null arg arg1 on directive ' + 'NonNullDirectiveAdded was added'
    }, {
      type: BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
      description: 'QUERY was removed from Directive Name'
    }];
    expect(findBreakingChanges(oldSchema, newSchema)).to.eql(expectedBreakingChanges);
  });
  it('should detect if a directive was explicitly removed', function () {
    var oldSchema = new GraphQLSchema({
      directives: [GraphQLSkipDirective, GraphQLIncludeDirective]
    });
    var newSchema = new GraphQLSchema({
      directives: [GraphQLSkipDirective]
    });
    expect(findRemovedDirectives(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.DIRECTIVE_REMOVED,
      description: "".concat(GraphQLIncludeDirective.name, " was removed")
    }]);
  });
  it('should detect if a directive was implicitly removed', function () {
    var oldSchema = new GraphQLSchema({});
    var newSchema = new GraphQLSchema({
      directives: [GraphQLSkipDirective, GraphQLIncludeDirective]
    });
    expect(findRemovedDirectives(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.DIRECTIVE_REMOVED,
      description: "".concat(GraphQLDeprecatedDirective.name, " was removed")
    }]);
  });
  it('should detect if a directive argument was removed', function () {
    var oldSchema = new GraphQLSchema({
      directives: [new GraphQLDirective({
        name: 'DirectiveWithArg',
        locations: [DirectiveLocation.FIELD_DEFINITION],
        args: {
          arg1: {
            name: 'arg1'
          }
        }
      })]
    });
    var newSchema = new GraphQLSchema({
      directives: [new GraphQLDirective({
        name: 'DirectiveWithArg',
        locations: [DirectiveLocation.FIELD_DEFINITION]
      })]
    });
    expect(findRemovedDirectiveArgs(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.DIRECTIVE_ARG_REMOVED,
      description: 'arg1 was removed from DirectiveWithArg'
    }]);
  });
  it('should detect if a non-nullable directive argument was added', function () {
    var oldSchema = new GraphQLSchema({
      directives: [new GraphQLDirective({
        name: 'DirectiveName',
        locations: [DirectiveLocation.FIELD_DEFINITION]
      })]
    });
    var newSchema = new GraphQLSchema({
      directives: [new GraphQLDirective({
        name: 'DirectiveName',
        locations: [DirectiveLocation.FIELD_DEFINITION],
        args: {
          arg1: {
            name: 'arg1',
            type: GraphQLNonNull(GraphQLBoolean)
          }
        }
      })]
    });
    expect(findAddedNonNullDirectiveArgs(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.NON_NULL_DIRECTIVE_ARG_ADDED,
      description: 'A non-null arg arg1 on directive DirectiveName was added'
    }]);
  });
  it('should detect locations removed from a directive', function () {
    var d1 = new GraphQLDirective({
      name: 'Directive Name',
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.QUERY]
    });
    var d2 = new GraphQLDirective({
      name: 'Directive Name',
      locations: [DirectiveLocation.FIELD_DEFINITION]
    });
    expect(findRemovedLocationsForDirective(d1, d2)).to.eql([DirectiveLocation.QUERY]);
  });
  it('should detect locations removed directives within a schema', function () {
    var oldSchema = new GraphQLSchema({
      directives: [new GraphQLDirective({
        name: 'Directive Name',
        locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.QUERY]
      })]
    });
    var newSchema = new GraphQLSchema({
      directives: [new GraphQLDirective({
        name: 'Directive Name',
        locations: [DirectiveLocation.FIELD_DEFINITION]
      })]
    });
    expect(findRemovedDirectiveLocations(oldSchema, newSchema)).to.eql([{
      type: BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
      description: 'QUERY was removed from Directive Name'
    }]);
  });
});
describe('findDangerousChanges', function () {
  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      field1: {
        type: GraphQLString
      }
    }
  });
  describe('findArgChanges', function () {
    it("should detect if an argument's defaultValue has changed", function () {
      var oldType = new GraphQLObjectType({
        name: 'Type1',
        fields: {
          field1: {
            type: GraphQLString,
            args: {
              name: {
                type: GraphQLString,
                defaultValue: 'test'
              }
            }
          }
        }
      });
      var newType = new GraphQLObjectType({
        name: 'Type1',
        fields: {
          field1: {
            type: GraphQLString,
            args: {
              name: {
                type: GraphQLString,
                defaultValue: 'Test'
              }
            }
          }
        }
      });
      var oldSchema = new GraphQLSchema({
        query: queryType,
        types: [oldType]
      });
      var newSchema = new GraphQLSchema({
        query: queryType,
        types: [newType]
      });
      expect(findArgChanges(oldSchema, newSchema).dangerousChanges).to.eql([{
        type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
        description: 'Type1.field1 arg name has changed defaultValue'
      }]);
    });
  });
  it('should detect if a value was added to an enum type', function () {
    var oldEnumType = new GraphQLEnumType({
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
    var newEnumType = new GraphQLEnumType({
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
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldEnumType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newEnumType]
    });
    expect(findValuesAddedToEnums(oldSchema, newSchema)).to.eql([{
      type: DangerousChangeType.VALUE_ADDED_TO_ENUM,
      description: 'VALUE2 was added to enum type EnumType1.'
    }]);
  });
  it('should detect interfaces added to types', function () {
    var interface1 = new GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      interfaces: [],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    expect(findInterfacesAddedToObjectTypes(oldSchema, newSchema)).to.eql([{
      description: 'Interface1 added to interfaces implemented by Type1.',
      type: DangerousChangeType.INTERFACE_ADDED_TO_OBJECT
    }]);
  });
  it('should detect if a type was added to a union type', function () {
    var type1 = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    }); // logially equivalent to type1; findTypesRemovedFromUnions should not
    // treat this as different than type1

    var type1a = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var type2 = new GraphQLObjectType({
      name: 'Type2',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldUnionType = new GraphQLUnionType({
      name: 'UnionType1',
      types: [type1]
    });
    var newUnionType = new GraphQLUnionType({
      name: 'UnionType1',
      types: [type1a, type2]
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldUnionType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newUnionType]
    });
    expect(findTypesAddedToUnions(oldSchema, newSchema)).to.eql([{
      type: DangerousChangeType.TYPE_ADDED_TO_UNION,
      description: 'Type2 was added to union type UnionType1.'
    }]);
  });
  it('should detect if a nullable field was added to an input', function () {
    var oldInputType = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var newInputType = new GraphQLInputObjectType({
      name: 'InputType1',
      fields: {
        field1: {
          type: GraphQLString
        },
        field2: {
          type: GraphQLInt
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldInputType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newInputType]
    });
    var expectedFieldChanges = [{
      type: DangerousChangeType.NULLABLE_INPUT_FIELD_ADDED,
      description: 'A nullable field field2 on input type ' + 'InputType1 was added.'
    }];
    expect(findFieldsThatChangedTypeOnInputObjectTypes(oldSchema, newSchema).dangerousChanges).to.eql(expectedFieldChanges);
  });
  it('should find all dangerous changes', function () {
    var enumThatGainsAValueOld = new GraphQLEnumType({
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
    var enumThatGainsAValueNew = new GraphQLEnumType({
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
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            name: {
              type: GraphQLString,
              defaultValue: 'test'
            }
          }
        }
      }
    });
    var typeInUnion1 = new GraphQLObjectType({
      name: 'TypeInUnion1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeInUnion2 = new GraphQLObjectType({
      name: 'TypeInUnion2',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var unionTypeThatGainsATypeOld = new GraphQLUnionType({
      name: 'UnionTypeThatGainsAType',
      types: [typeInUnion1]
    });
    var unionTypeThatGainsATypeNew = new GraphQLUnionType({
      name: 'UnionTypeThatGainsAType',
      types: [typeInUnion1, typeInUnion2]
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            name: {
              type: GraphQLString,
              defaultValue: 'Test'
            }
          }
        }
      }
    });
    var interface1 = new GraphQLInterfaceType({
      name: 'Interface1',
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeThatGainsInterfaceOld = new GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var typeThaGainsInterfaceNew = new GraphQLObjectType({
      name: 'TypeThatGainsInterface1',
      interfaces: [interface1],
      fields: {
        field1: {
          type: GraphQLString
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType, enumThatGainsAValueOld, typeThatGainsInterfaceOld, unionTypeThatGainsATypeOld]
    });
    var newSchema = new GraphQLSchema({
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
      type: DangerousChangeType.INTERFACE_ADDED_TO_OBJECT
    }, {
      type: DangerousChangeType.TYPE_ADDED_TO_UNION,
      description: 'TypeInUnion2 was added to union type ' + 'UnionTypeThatGainsAType.'
    }];
    expect(findDangerousChanges(oldSchema, newSchema)).to.eql(expectedDangerousChanges);
  });
  it('should detect if a nullable field argument was added', function () {
    var oldType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            arg1: {
              type: GraphQLString
            }
          }
        }
      }
    });
    var newType = new GraphQLObjectType({
      name: 'Type1',
      fields: {
        field1: {
          type: GraphQLString,
          args: {
            arg1: {
              type: GraphQLString
            },
            arg2: {
              type: GraphQLString
            }
          }
        }
      }
    });
    var oldSchema = new GraphQLSchema({
      query: queryType,
      types: [oldType]
    });
    var newSchema = new GraphQLSchema({
      query: queryType,
      types: [newType]
    });
    expect(findArgChanges(oldSchema, newSchema).dangerousChanges).to.eql([{
      type: DangerousChangeType.NULLABLE_ARG_ADDED,
      description: 'A nullable arg arg2 on Type1.field1 was added'
    }]);
  });
});