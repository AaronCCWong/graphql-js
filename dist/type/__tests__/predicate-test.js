"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _ = require("../");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ObjectType = new _.GraphQLObjectType({
  name: 'Object'
});
var InterfaceType = new _.GraphQLInterfaceType({
  name: 'Interface'
});
var UnionType = new _.GraphQLUnionType({
  name: 'Union',
  types: [ObjectType]
});
var EnumType = new _.GraphQLEnumType({
  name: 'Enum',
  values: {
    foo: {}
  }
});
var InputObjectType = new _.GraphQLInputObjectType({
  name: 'InputObject'
});
var ScalarType = new _.GraphQLScalarType({
  name: 'Scalar',
  serialize: function serialize() {},
  parseValue: function parseValue() {},
  parseLiteral: function parseLiteral() {}
});
(0, _mocha.describe)('Type predicates', function () {
  (0, _mocha.describe)('isType', function () {
    (0, _mocha.it)('returns true for unwrapped types', function () {
      (0, _chai.expect)((0, _.isType)(_.GraphQLString)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertType)(_.GraphQLString);
      }).not.to.throw();
      (0, _chai.expect)((0, _.isType)(ObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertType)(ObjectType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns true for wrapped types', function () {
      (0, _chai.expect)((0, _.isType)((0, _.GraphQLNonNull)(_.GraphQLString))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertType)((0, _.GraphQLNonNull)(_.GraphQLString));
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for type classes (rather than instances)', function () {
      (0, _chai.expect)((0, _.isType)(_.GraphQLObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertType)(_.GraphQLObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns false for random garbage', function () {
      (0, _chai.expect)((0, _.isType)({
        what: 'is this'
      })).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertType)({
          what: 'is this'
        });
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isScalarType', function () {
    (0, _mocha.it)('returns true for spec defined scalar', function () {
      (0, _chai.expect)((0, _.isScalarType)(_.GraphQLString)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertScalarType)(_.GraphQLString);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns true for custom scalar', function () {
      (0, _chai.expect)((0, _.isScalarType)(ScalarType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertScalarType)(ScalarType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped scalar', function () {
      (0, _chai.expect)((0, _.isScalarType)((0, _.GraphQLList)(ScalarType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertScalarType)((0, _.GraphQLList)(ScalarType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-scalar', function () {
      (0, _chai.expect)((0, _.isScalarType)(EnumType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertScalarType)(EnumType);
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isObjectType', function () {
    (0, _mocha.it)('returns true for object type', function () {
      (0, _chai.expect)((0, _.isObjectType)(ObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertObjectType)(ObjectType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped object type', function () {
      (0, _chai.expect)((0, _.isObjectType)((0, _.GraphQLList)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertObjectType)((0, _.GraphQLList)(ObjectType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-object type', function () {
      (0, _chai.expect)((0, _.isObjectType)(InterfaceType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertObjectType)(InterfaceType);
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isInterfaceType', function () {
    (0, _mocha.it)('returns true for interface type', function () {
      (0, _chai.expect)((0, _.isInterfaceType)(InterfaceType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertInterfaceType)(InterfaceType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped interface type', function () {
      (0, _chai.expect)((0, _.isInterfaceType)((0, _.GraphQLList)(InterfaceType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertInterfaceType)((0, _.GraphQLList)(InterfaceType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-interface type', function () {
      (0, _chai.expect)((0, _.isInterfaceType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertInterfaceType)(ObjectType);
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isUnionType', function () {
    (0, _mocha.it)('returns true for union type', function () {
      (0, _chai.expect)((0, _.isUnionType)(UnionType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertUnionType)(UnionType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped union type', function () {
      (0, _chai.expect)((0, _.isUnionType)((0, _.GraphQLList)(UnionType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertUnionType)((0, _.GraphQLList)(UnionType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-union type', function () {
      (0, _chai.expect)((0, _.isUnionType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertUnionType)(ObjectType);
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isEnumType', function () {
    (0, _mocha.it)('returns true for enum type', function () {
      (0, _chai.expect)((0, _.isEnumType)(EnumType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertEnumType)(EnumType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped enum type', function () {
      (0, _chai.expect)((0, _.isEnumType)((0, _.GraphQLList)(EnumType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertEnumType)((0, _.GraphQLList)(EnumType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-enum type', function () {
      (0, _chai.expect)((0, _.isEnumType)(ScalarType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertEnumType)(ScalarType);
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isInputObjectType', function () {
    (0, _mocha.it)('returns true for input object type', function () {
      (0, _chai.expect)((0, _.isInputObjectType)(InputObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertInputObjectType)(InputObjectType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped input object type', function () {
      (0, _chai.expect)((0, _.isInputObjectType)((0, _.GraphQLList)(InputObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertInputObjectType)((0, _.GraphQLList)(InputObjectType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-input-object type', function () {
      (0, _chai.expect)((0, _.isInputObjectType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertInputObjectType)(ObjectType);
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isListType', function () {
    (0, _mocha.it)('returns true for a list wrapped type', function () {
      (0, _chai.expect)((0, _.isListType)((0, _.GraphQLList)(ObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertListType)((0, _.GraphQLList)(ObjectType));
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for an unwrapped type', function () {
      (0, _chai.expect)((0, _.isListType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertListType)(ObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns true for a non-list wrapped type', function () {
      (0, _chai.expect)((0, _.isListType)((0, _.GraphQLNonNull)((0, _.GraphQLList)(ObjectType)))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertListType)((0, _.GraphQLNonNull)((0, _.GraphQLList)(ObjectType)));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isNonNullType', function () {
    (0, _mocha.it)('returns true for a non-null wrapped type', function () {
      (0, _chai.expect)((0, _.isNonNullType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertNonNullType)((0, _.GraphQLNonNull)(ObjectType));
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for an unwrapped type', function () {
      (0, _chai.expect)((0, _.isNonNullType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertNonNullType)(ObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns true for a not non-null wrapped type', function () {
      (0, _chai.expect)((0, _.isNonNullType)((0, _.GraphQLList)((0, _.GraphQLNonNull)(ObjectType)))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertNonNullType)((0, _.GraphQLList)((0, _.GraphQLNonNull)(ObjectType)));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isInputType', function () {
    (0, _mocha.it)('returns true for an input type', function () {
      (0, _chai.expect)((0, _.isInputType)(InputObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertInputType)(InputObjectType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns true for a wrapped input type', function () {
      (0, _chai.expect)((0, _.isInputType)((0, _.GraphQLList)(InputObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertInputType)((0, _.GraphQLList)(InputObjectType));
      }).not.to.throw();
      (0, _chai.expect)((0, _.isInputType)((0, _.GraphQLNonNull)(InputObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertInputType)((0, _.GraphQLNonNull)(InputObjectType));
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for an output type', function () {
      (0, _chai.expect)((0, _.isInputType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertInputType)(ObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns false for a wrapped output type', function () {
      (0, _chai.expect)((0, _.isInputType)((0, _.GraphQLList)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertInputType)((0, _.GraphQLList)(ObjectType));
      }).to.throw();
      (0, _chai.expect)((0, _.isInputType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertInputType)((0, _.GraphQLNonNull)(ObjectType));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isOutputType', function () {
    (0, _mocha.it)('returns true for an output type', function () {
      (0, _chai.expect)((0, _.isOutputType)(ObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertOutputType)(ObjectType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns true for a wrapped output type', function () {
      (0, _chai.expect)((0, _.isOutputType)((0, _.GraphQLList)(ObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertOutputType)((0, _.GraphQLList)(ObjectType));
      }).not.to.throw();
      (0, _chai.expect)((0, _.isOutputType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertOutputType)((0, _.GraphQLNonNull)(ObjectType));
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for an input type', function () {
      (0, _chai.expect)((0, _.isOutputType)(InputObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertOutputType)(InputObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns false for a wrapped input type', function () {
      (0, _chai.expect)((0, _.isOutputType)((0, _.GraphQLList)(InputObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertOutputType)((0, _.GraphQLList)(InputObjectType));
      }).to.throw();
      (0, _chai.expect)((0, _.isOutputType)((0, _.GraphQLNonNull)(InputObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertOutputType)((0, _.GraphQLNonNull)(InputObjectType));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isLeafType', function () {
    (0, _mocha.it)('returns true for scalar and enum types', function () {
      (0, _chai.expect)((0, _.isLeafType)(ScalarType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertLeafType)(ScalarType);
      }).not.to.throw();
      (0, _chai.expect)((0, _.isLeafType)(EnumType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertLeafType)(EnumType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped leaf type', function () {
      (0, _chai.expect)((0, _.isLeafType)((0, _.GraphQLList)(ScalarType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertLeafType)((0, _.GraphQLList)(ScalarType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-leaf type', function () {
      (0, _chai.expect)((0, _.isLeafType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertLeafType)(ObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns false for wrapped non-leaf type', function () {
      (0, _chai.expect)((0, _.isLeafType)((0, _.GraphQLList)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertLeafType)((0, _.GraphQLList)(ObjectType));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isCompositeType', function () {
    (0, _mocha.it)('returns true for object, interface, and union types', function () {
      (0, _chai.expect)((0, _.isCompositeType)(ObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertCompositeType)(ObjectType);
      }).not.to.throw();
      (0, _chai.expect)((0, _.isCompositeType)(InterfaceType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertCompositeType)(InterfaceType);
      }).not.to.throw();
      (0, _chai.expect)((0, _.isCompositeType)(UnionType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertCompositeType)(UnionType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped composite type', function () {
      (0, _chai.expect)((0, _.isCompositeType)((0, _.GraphQLList)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertCompositeType)((0, _.GraphQLList)(ObjectType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-composite type', function () {
      (0, _chai.expect)((0, _.isCompositeType)(InputObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertCompositeType)(InputObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns false for wrapped non-composite type', function () {
      (0, _chai.expect)((0, _.isCompositeType)((0, _.GraphQLList)(InputObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertCompositeType)((0, _.GraphQLList)(InputObjectType));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isAbstractType', function () {
    (0, _mocha.it)('returns true for interface and union types', function () {
      (0, _chai.expect)((0, _.isAbstractType)(InterfaceType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertAbstractType)(InterfaceType);
      }).not.to.throw();
      (0, _chai.expect)((0, _.isAbstractType)(UnionType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertAbstractType)(UnionType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for wrapped abstract type', function () {
      (0, _chai.expect)((0, _.isAbstractType)((0, _.GraphQLList)(InterfaceType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertAbstractType)((0, _.GraphQLList)(InterfaceType));
      }).to.throw();
    });
    (0, _mocha.it)('returns false for non-abstract type', function () {
      (0, _chai.expect)((0, _.isAbstractType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertAbstractType)(ObjectType);
      }).to.throw();
    });
    (0, _mocha.it)('returns false for wrapped non-abstract type', function () {
      (0, _chai.expect)((0, _.isAbstractType)((0, _.GraphQLList)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertAbstractType)((0, _.GraphQLList)(ObjectType));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isWrappingType', function () {
    (0, _mocha.it)('returns true for list and non-null types', function () {
      (0, _chai.expect)((0, _.isWrappingType)((0, _.GraphQLList)(ObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertWrappingType)((0, _.GraphQLList)(ObjectType));
      }).not.to.throw();
      (0, _chai.expect)((0, _.isWrappingType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertWrappingType)((0, _.GraphQLNonNull)(ObjectType));
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for unwrapped types', function () {
      (0, _chai.expect)((0, _.isWrappingType)(ObjectType)).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertWrappingType)(ObjectType);
      }).to.throw();
    });
  });
  (0, _mocha.describe)('isNullableType', function () {
    (0, _mocha.it)('returns true for unwrapped types', function () {
      (0, _chai.expect)((0, _.isNullableType)(ObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertNullableType)(ObjectType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns true for list of non-null types', function () {
      (0, _chai.expect)((0, _.isNullableType)((0, _.GraphQLList)((0, _.GraphQLNonNull)(ObjectType)))).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertNullableType)((0, _.GraphQLList)((0, _.GraphQLNonNull)(ObjectType)));
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for non-null types', function () {
      (0, _chai.expect)((0, _.isNullableType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertNullableType)((0, _.GraphQLNonNull)(ObjectType));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('getNullableType', function () {
    (0, _mocha.it)('returns undefined for no type', function () {
      (0, _chai.expect)((0, _.getNullableType)()).to.equal(undefined);
      (0, _chai.expect)((0, _.getNullableType)(null)).to.equal(undefined);
    });
    (0, _mocha.it)('returns self for a nullable type', function () {
      (0, _chai.expect)((0, _.getNullableType)(ObjectType)).to.equal(ObjectType);
      var listOfObj = (0, _.GraphQLList)(ObjectType);
      (0, _chai.expect)((0, _.getNullableType)(listOfObj)).to.equal(listOfObj);
    });
    (0, _mocha.it)('unwraps non-null type', function () {
      (0, _chai.expect)((0, _.getNullableType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(ObjectType);
    });
  });
  (0, _mocha.describe)('isNamedType', function () {
    (0, _mocha.it)('returns true for unwrapped types', function () {
      (0, _chai.expect)((0, _.isNamedType)(ObjectType)).to.equal(true);
      (0, _chai.expect)(function () {
        return (0, _.assertNamedType)(ObjectType);
      }).not.to.throw();
    });
    (0, _mocha.it)('returns false for list and non-null types', function () {
      (0, _chai.expect)((0, _.isNamedType)((0, _.GraphQLList)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertNamedType)((0, _.GraphQLList)(ObjectType));
      }).to.throw();
      (0, _chai.expect)((0, _.isNamedType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(false);
      (0, _chai.expect)(function () {
        return (0, _.assertNamedType)((0, _.GraphQLNonNull)(ObjectType));
      }).to.throw();
    });
  });
  (0, _mocha.describe)('getNamedType', function () {
    (0, _mocha.it)('returns undefined for no type', function () {
      (0, _chai.expect)((0, _.getNamedType)()).to.equal(undefined);
      (0, _chai.expect)((0, _.getNamedType)(null)).to.equal(undefined);
    });
    (0, _mocha.it)('returns self for a unwrapped type', function () {
      (0, _chai.expect)((0, _.getNamedType)(ObjectType)).to.equal(ObjectType);
    });
    (0, _mocha.it)('unwraps wrapper types', function () {
      (0, _chai.expect)((0, _.getNamedType)((0, _.GraphQLNonNull)(ObjectType))).to.equal(ObjectType);
      (0, _chai.expect)((0, _.getNamedType)((0, _.GraphQLList)(ObjectType))).to.equal(ObjectType);
    });
    (0, _mocha.it)('unwraps deeply wrapper types', function () {
      (0, _chai.expect)((0, _.getNamedType)((0, _.GraphQLNonNull)((0, _.GraphQLList)((0, _.GraphQLNonNull)(ObjectType))))).to.equal(ObjectType);
    });
  });
});