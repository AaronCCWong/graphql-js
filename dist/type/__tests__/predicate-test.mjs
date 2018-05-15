/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { GraphQLScalarType, GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLObjectType, GraphQLUnionType, GraphQLList, GraphQLNonNull, GraphQLString, isType, isScalarType, isObjectType, isInterfaceType, isUnionType, isEnumType, isInputObjectType, isListType, isNonNullType, isInputType, isOutputType, isLeafType, isCompositeType, isAbstractType, isWrappingType, isNullableType, isNamedType, assertType, assertScalarType, assertObjectType, assertInterfaceType, assertUnionType, assertEnumType, assertInputObjectType, assertListType, assertNonNullType, assertInputType, assertOutputType, assertLeafType, assertCompositeType, assertAbstractType, assertWrappingType, assertNullableType, assertNamedType, getNullableType, getNamedType } from '../';
var ObjectType = new GraphQLObjectType({
  name: 'Object'
});
var InterfaceType = new GraphQLInterfaceType({
  name: 'Interface'
});
var UnionType = new GraphQLUnionType({
  name: 'Union',
  types: [ObjectType]
});
var EnumType = new GraphQLEnumType({
  name: 'Enum',
  values: {
    foo: {}
  }
});
var InputObjectType = new GraphQLInputObjectType({
  name: 'InputObject'
});
var ScalarType = new GraphQLScalarType({
  name: 'Scalar',
  serialize: function serialize() {},
  parseValue: function parseValue() {},
  parseLiteral: function parseLiteral() {}
});
describe('Type predicates', function () {
  describe('isType', function () {
    it('returns true for unwrapped types', function () {
      expect(isType(GraphQLString)).to.equal(true);
      expect(function () {
        return assertType(GraphQLString);
      }).not.to.throw();
      expect(isType(ObjectType)).to.equal(true);
      expect(function () {
        return assertType(ObjectType);
      }).not.to.throw();
    });
    it('returns true for wrapped types', function () {
      expect(isType(GraphQLNonNull(GraphQLString))).to.equal(true);
      expect(function () {
        return assertType(GraphQLNonNull(GraphQLString));
      }).not.to.throw();
    });
    it('returns false for type classes (rather than instances)', function () {
      expect(isType(GraphQLObjectType)).to.equal(false);
      expect(function () {
        return assertType(GraphQLObjectType);
      }).to.throw();
    });
    it('returns false for random garbage', function () {
      expect(isType({
        what: 'is this'
      })).to.equal(false);
      expect(function () {
        return assertType({
          what: 'is this'
        });
      }).to.throw();
    });
  });
  describe('isScalarType', function () {
    it('returns true for spec defined scalar', function () {
      expect(isScalarType(GraphQLString)).to.equal(true);
      expect(function () {
        return assertScalarType(GraphQLString);
      }).not.to.throw();
    });
    it('returns true for custom scalar', function () {
      expect(isScalarType(ScalarType)).to.equal(true);
      expect(function () {
        return assertScalarType(ScalarType);
      }).not.to.throw();
    });
    it('returns false for wrapped scalar', function () {
      expect(isScalarType(GraphQLList(ScalarType))).to.equal(false);
      expect(function () {
        return assertScalarType(GraphQLList(ScalarType));
      }).to.throw();
    });
    it('returns false for non-scalar', function () {
      expect(isScalarType(EnumType)).to.equal(false);
      expect(function () {
        return assertScalarType(EnumType);
      }).to.throw();
    });
  });
  describe('isObjectType', function () {
    it('returns true for object type', function () {
      expect(isObjectType(ObjectType)).to.equal(true);
      expect(function () {
        return assertObjectType(ObjectType);
      }).not.to.throw();
    });
    it('returns false for wrapped object type', function () {
      expect(isObjectType(GraphQLList(ObjectType))).to.equal(false);
      expect(function () {
        return assertObjectType(GraphQLList(ObjectType));
      }).to.throw();
    });
    it('returns false for non-object type', function () {
      expect(isObjectType(InterfaceType)).to.equal(false);
      expect(function () {
        return assertObjectType(InterfaceType);
      }).to.throw();
    });
  });
  describe('isInterfaceType', function () {
    it('returns true for interface type', function () {
      expect(isInterfaceType(InterfaceType)).to.equal(true);
      expect(function () {
        return assertInterfaceType(InterfaceType);
      }).not.to.throw();
    });
    it('returns false for wrapped interface type', function () {
      expect(isInterfaceType(GraphQLList(InterfaceType))).to.equal(false);
      expect(function () {
        return assertInterfaceType(GraphQLList(InterfaceType));
      }).to.throw();
    });
    it('returns false for non-interface type', function () {
      expect(isInterfaceType(ObjectType)).to.equal(false);
      expect(function () {
        return assertInterfaceType(ObjectType);
      }).to.throw();
    });
  });
  describe('isUnionType', function () {
    it('returns true for union type', function () {
      expect(isUnionType(UnionType)).to.equal(true);
      expect(function () {
        return assertUnionType(UnionType);
      }).not.to.throw();
    });
    it('returns false for wrapped union type', function () {
      expect(isUnionType(GraphQLList(UnionType))).to.equal(false);
      expect(function () {
        return assertUnionType(GraphQLList(UnionType));
      }).to.throw();
    });
    it('returns false for non-union type', function () {
      expect(isUnionType(ObjectType)).to.equal(false);
      expect(function () {
        return assertUnionType(ObjectType);
      }).to.throw();
    });
  });
  describe('isEnumType', function () {
    it('returns true for enum type', function () {
      expect(isEnumType(EnumType)).to.equal(true);
      expect(function () {
        return assertEnumType(EnumType);
      }).not.to.throw();
    });
    it('returns false for wrapped enum type', function () {
      expect(isEnumType(GraphQLList(EnumType))).to.equal(false);
      expect(function () {
        return assertEnumType(GraphQLList(EnumType));
      }).to.throw();
    });
    it('returns false for non-enum type', function () {
      expect(isEnumType(ScalarType)).to.equal(false);
      expect(function () {
        return assertEnumType(ScalarType);
      }).to.throw();
    });
  });
  describe('isInputObjectType', function () {
    it('returns true for input object type', function () {
      expect(isInputObjectType(InputObjectType)).to.equal(true);
      expect(function () {
        return assertInputObjectType(InputObjectType);
      }).not.to.throw();
    });
    it('returns false for wrapped input object type', function () {
      expect(isInputObjectType(GraphQLList(InputObjectType))).to.equal(false);
      expect(function () {
        return assertInputObjectType(GraphQLList(InputObjectType));
      }).to.throw();
    });
    it('returns false for non-input-object type', function () {
      expect(isInputObjectType(ObjectType)).to.equal(false);
      expect(function () {
        return assertInputObjectType(ObjectType);
      }).to.throw();
    });
  });
  describe('isListType', function () {
    it('returns true for a list wrapped type', function () {
      expect(isListType(GraphQLList(ObjectType))).to.equal(true);
      expect(function () {
        return assertListType(GraphQLList(ObjectType));
      }).not.to.throw();
    });
    it('returns false for an unwrapped type', function () {
      expect(isListType(ObjectType)).to.equal(false);
      expect(function () {
        return assertListType(ObjectType);
      }).to.throw();
    });
    it('returns true for a non-list wrapped type', function () {
      expect(isListType(GraphQLNonNull(GraphQLList(ObjectType)))).to.equal(false);
      expect(function () {
        return assertListType(GraphQLNonNull(GraphQLList(ObjectType)));
      }).to.throw();
    });
  });
  describe('isNonNullType', function () {
    it('returns true for a non-null wrapped type', function () {
      expect(isNonNullType(GraphQLNonNull(ObjectType))).to.equal(true);
      expect(function () {
        return assertNonNullType(GraphQLNonNull(ObjectType));
      }).not.to.throw();
    });
    it('returns false for an unwrapped type', function () {
      expect(isNonNullType(ObjectType)).to.equal(false);
      expect(function () {
        return assertNonNullType(ObjectType);
      }).to.throw();
    });
    it('returns true for a not non-null wrapped type', function () {
      expect(isNonNullType(GraphQLList(GraphQLNonNull(ObjectType)))).to.equal(false);
      expect(function () {
        return assertNonNullType(GraphQLList(GraphQLNonNull(ObjectType)));
      }).to.throw();
    });
  });
  describe('isInputType', function () {
    it('returns true for an input type', function () {
      expect(isInputType(InputObjectType)).to.equal(true);
      expect(function () {
        return assertInputType(InputObjectType);
      }).not.to.throw();
    });
    it('returns true for a wrapped input type', function () {
      expect(isInputType(GraphQLList(InputObjectType))).to.equal(true);
      expect(function () {
        return assertInputType(GraphQLList(InputObjectType));
      }).not.to.throw();
      expect(isInputType(GraphQLNonNull(InputObjectType))).to.equal(true);
      expect(function () {
        return assertInputType(GraphQLNonNull(InputObjectType));
      }).not.to.throw();
    });
    it('returns false for an output type', function () {
      expect(isInputType(ObjectType)).to.equal(false);
      expect(function () {
        return assertInputType(ObjectType);
      }).to.throw();
    });
    it('returns false for a wrapped output type', function () {
      expect(isInputType(GraphQLList(ObjectType))).to.equal(false);
      expect(function () {
        return assertInputType(GraphQLList(ObjectType));
      }).to.throw();
      expect(isInputType(GraphQLNonNull(ObjectType))).to.equal(false);
      expect(function () {
        return assertInputType(GraphQLNonNull(ObjectType));
      }).to.throw();
    });
  });
  describe('isOutputType', function () {
    it('returns true for an output type', function () {
      expect(isOutputType(ObjectType)).to.equal(true);
      expect(function () {
        return assertOutputType(ObjectType);
      }).not.to.throw();
    });
    it('returns true for a wrapped output type', function () {
      expect(isOutputType(GraphQLList(ObjectType))).to.equal(true);
      expect(function () {
        return assertOutputType(GraphQLList(ObjectType));
      }).not.to.throw();
      expect(isOutputType(GraphQLNonNull(ObjectType))).to.equal(true);
      expect(function () {
        return assertOutputType(GraphQLNonNull(ObjectType));
      }).not.to.throw();
    });
    it('returns false for an input type', function () {
      expect(isOutputType(InputObjectType)).to.equal(false);
      expect(function () {
        return assertOutputType(InputObjectType);
      }).to.throw();
    });
    it('returns false for a wrapped input type', function () {
      expect(isOutputType(GraphQLList(InputObjectType))).to.equal(false);
      expect(function () {
        return assertOutputType(GraphQLList(InputObjectType));
      }).to.throw();
      expect(isOutputType(GraphQLNonNull(InputObjectType))).to.equal(false);
      expect(function () {
        return assertOutputType(GraphQLNonNull(InputObjectType));
      }).to.throw();
    });
  });
  describe('isLeafType', function () {
    it('returns true for scalar and enum types', function () {
      expect(isLeafType(ScalarType)).to.equal(true);
      expect(function () {
        return assertLeafType(ScalarType);
      }).not.to.throw();
      expect(isLeafType(EnumType)).to.equal(true);
      expect(function () {
        return assertLeafType(EnumType);
      }).not.to.throw();
    });
    it('returns false for wrapped leaf type', function () {
      expect(isLeafType(GraphQLList(ScalarType))).to.equal(false);
      expect(function () {
        return assertLeafType(GraphQLList(ScalarType));
      }).to.throw();
    });
    it('returns false for non-leaf type', function () {
      expect(isLeafType(ObjectType)).to.equal(false);
      expect(function () {
        return assertLeafType(ObjectType);
      }).to.throw();
    });
    it('returns false for wrapped non-leaf type', function () {
      expect(isLeafType(GraphQLList(ObjectType))).to.equal(false);
      expect(function () {
        return assertLeafType(GraphQLList(ObjectType));
      }).to.throw();
    });
  });
  describe('isCompositeType', function () {
    it('returns true for object, interface, and union types', function () {
      expect(isCompositeType(ObjectType)).to.equal(true);
      expect(function () {
        return assertCompositeType(ObjectType);
      }).not.to.throw();
      expect(isCompositeType(InterfaceType)).to.equal(true);
      expect(function () {
        return assertCompositeType(InterfaceType);
      }).not.to.throw();
      expect(isCompositeType(UnionType)).to.equal(true);
      expect(function () {
        return assertCompositeType(UnionType);
      }).not.to.throw();
    });
    it('returns false for wrapped composite type', function () {
      expect(isCompositeType(GraphQLList(ObjectType))).to.equal(false);
      expect(function () {
        return assertCompositeType(GraphQLList(ObjectType));
      }).to.throw();
    });
    it('returns false for non-composite type', function () {
      expect(isCompositeType(InputObjectType)).to.equal(false);
      expect(function () {
        return assertCompositeType(InputObjectType);
      }).to.throw();
    });
    it('returns false for wrapped non-composite type', function () {
      expect(isCompositeType(GraphQLList(InputObjectType))).to.equal(false);
      expect(function () {
        return assertCompositeType(GraphQLList(InputObjectType));
      }).to.throw();
    });
  });
  describe('isAbstractType', function () {
    it('returns true for interface and union types', function () {
      expect(isAbstractType(InterfaceType)).to.equal(true);
      expect(function () {
        return assertAbstractType(InterfaceType);
      }).not.to.throw();
      expect(isAbstractType(UnionType)).to.equal(true);
      expect(function () {
        return assertAbstractType(UnionType);
      }).not.to.throw();
    });
    it('returns false for wrapped abstract type', function () {
      expect(isAbstractType(GraphQLList(InterfaceType))).to.equal(false);
      expect(function () {
        return assertAbstractType(GraphQLList(InterfaceType));
      }).to.throw();
    });
    it('returns false for non-abstract type', function () {
      expect(isAbstractType(ObjectType)).to.equal(false);
      expect(function () {
        return assertAbstractType(ObjectType);
      }).to.throw();
    });
    it('returns false for wrapped non-abstract type', function () {
      expect(isAbstractType(GraphQLList(ObjectType))).to.equal(false);
      expect(function () {
        return assertAbstractType(GraphQLList(ObjectType));
      }).to.throw();
    });
  });
  describe('isWrappingType', function () {
    it('returns true for list and non-null types', function () {
      expect(isWrappingType(GraphQLList(ObjectType))).to.equal(true);
      expect(function () {
        return assertWrappingType(GraphQLList(ObjectType));
      }).not.to.throw();
      expect(isWrappingType(GraphQLNonNull(ObjectType))).to.equal(true);
      expect(function () {
        return assertWrappingType(GraphQLNonNull(ObjectType));
      }).not.to.throw();
    });
    it('returns false for unwrapped types', function () {
      expect(isWrappingType(ObjectType)).to.equal(false);
      expect(function () {
        return assertWrappingType(ObjectType);
      }).to.throw();
    });
  });
  describe('isNullableType', function () {
    it('returns true for unwrapped types', function () {
      expect(isNullableType(ObjectType)).to.equal(true);
      expect(function () {
        return assertNullableType(ObjectType);
      }).not.to.throw();
    });
    it('returns true for list of non-null types', function () {
      expect(isNullableType(GraphQLList(GraphQLNonNull(ObjectType)))).to.equal(true);
      expect(function () {
        return assertNullableType(GraphQLList(GraphQLNonNull(ObjectType)));
      }).not.to.throw();
    });
    it('returns false for non-null types', function () {
      expect(isNullableType(GraphQLNonNull(ObjectType))).to.equal(false);
      expect(function () {
        return assertNullableType(GraphQLNonNull(ObjectType));
      }).to.throw();
    });
  });
  describe('getNullableType', function () {
    it('returns undefined for no type', function () {
      expect(getNullableType()).to.equal(undefined);
      expect(getNullableType(null)).to.equal(undefined);
    });
    it('returns self for a nullable type', function () {
      expect(getNullableType(ObjectType)).to.equal(ObjectType);
      var listOfObj = GraphQLList(ObjectType);
      expect(getNullableType(listOfObj)).to.equal(listOfObj);
    });
    it('unwraps non-null type', function () {
      expect(getNullableType(GraphQLNonNull(ObjectType))).to.equal(ObjectType);
    });
  });
  describe('isNamedType', function () {
    it('returns true for unwrapped types', function () {
      expect(isNamedType(ObjectType)).to.equal(true);
      expect(function () {
        return assertNamedType(ObjectType);
      }).not.to.throw();
    });
    it('returns false for list and non-null types', function () {
      expect(isNamedType(GraphQLList(ObjectType))).to.equal(false);
      expect(function () {
        return assertNamedType(GraphQLList(ObjectType));
      }).to.throw();
      expect(isNamedType(GraphQLNonNull(ObjectType))).to.equal(false);
      expect(function () {
        return assertNamedType(GraphQLNonNull(ObjectType));
      }).to.throw();
    });
  });
  describe('getNamedType', function () {
    it('returns undefined for no type', function () {
      expect(getNamedType()).to.equal(undefined);
      expect(getNamedType(null)).to.equal(undefined);
    });
    it('returns self for a unwrapped type', function () {
      expect(getNamedType(ObjectType)).to.equal(ObjectType);
    });
    it('unwraps wrapper types', function () {
      expect(getNamedType(GraphQLNonNull(ObjectType))).to.equal(ObjectType);
      expect(getNamedType(GraphQLList(ObjectType))).to.equal(ObjectType);
    });
    it('unwraps deeply wrapper types', function () {
      expect(getNamedType(GraphQLNonNull(GraphQLList(GraphQLNonNull(ObjectType))))).to.equal(ObjectType);
    });
  });
});