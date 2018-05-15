"use strict";

var _ = require("../");

var _mocha = require("mocha");

var _chai = require("chai");

var _definition = require("../definition");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var BlogImage = new _.GraphQLObjectType({
  name: 'Image',
  fields: {
    url: {
      type: _.GraphQLString
    },
    width: {
      type: _.GraphQLInt
    },
    height: {
      type: _.GraphQLInt
    }
  }
});
var BlogAuthor = new _.GraphQLObjectType({
  name: 'Author',
  fields: function fields() {
    return {
      id: {
        type: _.GraphQLString
      },
      name: {
        type: _.GraphQLString
      },
      pic: {
        args: {
          width: {
            type: _.GraphQLInt
          },
          height: {
            type: _.GraphQLInt
          }
        },
        type: BlogImage
      },
      recentArticle: {
        type: BlogArticle
      }
    };
  }
});
var BlogArticle = new _.GraphQLObjectType({
  name: 'Article',
  fields: {
    id: {
      type: _.GraphQLString
    },
    isPublished: {
      type: _.GraphQLBoolean
    },
    author: {
      type: BlogAuthor
    },
    title: {
      type: _.GraphQLString
    },
    body: {
      type: _.GraphQLString
    }
  }
});
var BlogQuery = new _.GraphQLObjectType({
  name: 'Query',
  fields: {
    article: {
      args: {
        id: {
          type: _.GraphQLString
        }
      },
      type: BlogArticle
    },
    feed: {
      type: (0, _.GraphQLList)(BlogArticle)
    }
  }
});
var BlogMutation = new _.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    writeArticle: {
      type: BlogArticle
    }
  }
});
var BlogSubscription = new _.GraphQLObjectType({
  name: 'Subscription',
  fields: {
    articleSubscribe: {
      args: {
        id: {
          type: _.GraphQLString
        }
      },
      type: BlogArticle
    }
  }
});
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

function schemaWithFieldType(type) {
  return new _.GraphQLSchema({
    query: new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        field: {
          type: type
        }
      }
    }),
    types: [type]
  });
}

(0, _mocha.describe)('Type System: Example', function () {
  (0, _mocha.it)('defines a query only schema', function () {
    var BlogSchema = new _.GraphQLSchema({
      query: BlogQuery
    });
    (0, _chai.expect)(BlogSchema.getQueryType()).to.equal(BlogQuery);
    var articleField = BlogQuery.getFields()['article'];
    (0, _chai.expect)(articleField && articleField.type).to.equal(BlogArticle);
    (0, _chai.expect)(articleField && articleField.type.name).to.equal('Article');
    (0, _chai.expect)(articleField && articleField.name).to.equal('article');
    var articleFieldType = articleField ? articleField.type : null;
    var titleField = (0, _definition.isObjectType)(articleFieldType) && articleFieldType.getFields()['title'];
    (0, _chai.expect)(titleField && titleField.name).to.equal('title');
    (0, _chai.expect)(titleField && titleField.type).to.equal(_.GraphQLString);
    (0, _chai.expect)(titleField && titleField.type.name).to.equal('String');
    var authorField = (0, _definition.isObjectType)(articleFieldType) && articleFieldType.getFields()['author'];
    var authorFieldType = authorField ? authorField.type : null;
    var recentArticleField = (0, _definition.isObjectType)(authorFieldType) && authorFieldType.getFields()['recentArticle'];
    (0, _chai.expect)(recentArticleField && recentArticleField.type).to.equal(BlogArticle);
    var feedField = BlogQuery.getFields()['feed'];
    (0, _chai.expect)(feedField && feedField.type.ofType).to.equal(BlogArticle);
    (0, _chai.expect)(feedField && feedField.name).to.equal('feed');
  });
  (0, _mocha.it)('defines a mutation schema', function () {
    var BlogSchema = new _.GraphQLSchema({
      query: BlogQuery,
      mutation: BlogMutation
    });
    (0, _chai.expect)(BlogSchema.getMutationType()).to.equal(BlogMutation);
    var writeMutation = BlogMutation.getFields()['writeArticle'];
    (0, _chai.expect)(writeMutation && writeMutation.type).to.equal(BlogArticle);
    (0, _chai.expect)(writeMutation && writeMutation.type.name).to.equal('Article');
    (0, _chai.expect)(writeMutation && writeMutation.name).to.equal('writeArticle');
  });
  (0, _mocha.it)('defines a subscription schema', function () {
    var BlogSchema = new _.GraphQLSchema({
      query: BlogQuery,
      subscription: BlogSubscription
    });
    (0, _chai.expect)(BlogSchema.getSubscriptionType()).to.equal(BlogSubscription);
    var sub = BlogSubscription.getFields()['articleSubscribe'];
    (0, _chai.expect)(sub && sub.type).to.equal(BlogArticle);
    (0, _chai.expect)(sub && sub.type.name).to.equal('Article');
    (0, _chai.expect)(sub && sub.name).to.equal('articleSubscribe');
  });
  (0, _mocha.it)('defines an enum type with deprecated value', function () {
    var EnumTypeWithDeprecatedValue = new _.GraphQLEnumType({
      name: 'EnumWithDeprecatedValue',
      values: {
        foo: {
          deprecationReason: 'Just because'
        }
      }
    });
    (0, _chai.expect)(EnumTypeWithDeprecatedValue.getValues()[0]).to.deep.equal({
      name: 'foo',
      description: undefined,
      isDeprecated: true,
      deprecationReason: 'Just because',
      value: 'foo',
      astNode: undefined
    });
  });
  (0, _mocha.it)('defines an enum type with a value of `null` and `undefined`', function () {
    var EnumTypeWithNullishValue = new _.GraphQLEnumType({
      name: 'EnumWithNullishValue',
      values: {
        NULL: {
          value: null
        },
        UNDEFINED: {
          value: undefined
        }
      }
    });
    (0, _chai.expect)(EnumTypeWithNullishValue.getValues()).to.deep.equal([{
      name: 'NULL',
      description: undefined,
      isDeprecated: false,
      deprecationReason: undefined,
      value: null,
      astNode: undefined
    }, {
      name: 'UNDEFINED',
      description: undefined,
      isDeprecated: false,
      deprecationReason: undefined,
      value: undefined,
      astNode: undefined
    }]);
  });
  (0, _mocha.it)('defines an object type with deprecated field', function () {
    var TypeWithDeprecatedField = new _.GraphQLObjectType({
      name: 'foo',
      fields: {
        bar: {
          type: _.GraphQLString,
          deprecationReason: 'A terrible reason'
        }
      }
    });
    (0, _chai.expect)(TypeWithDeprecatedField.getFields().bar).to.deep.equal({
      type: _.GraphQLString,
      deprecationReason: 'A terrible reason',
      isDeprecated: true,
      name: 'bar',
      args: []
    });
  });
  (0, _mocha.it)('includes nested input objects in the map', function () {
    var NestedInputObject = new _.GraphQLInputObjectType({
      name: 'NestedInputObject',
      fields: {
        value: {
          type: _.GraphQLString
        }
      }
    });
    var SomeInputObject = new _.GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        nested: {
          type: NestedInputObject
        }
      }
    });
    var SomeMutation = new _.GraphQLObjectType({
      name: 'SomeMutation',
      fields: {
        mutateSomething: {
          type: BlogArticle,
          args: {
            input: {
              type: SomeInputObject
            }
          }
        }
      }
    });
    var SomeSubscription = new _.GraphQLObjectType({
      name: 'SomeSubscription',
      fields: {
        subscribeToSomething: {
          type: BlogArticle,
          args: {
            input: {
              type: SomeInputObject
            }
          }
        }
      }
    });
    var schema = new _.GraphQLSchema({
      query: BlogQuery,
      mutation: SomeMutation,
      subscription: SomeSubscription
    });
    (0, _chai.expect)(schema.getTypeMap().NestedInputObject).to.equal(NestedInputObject);
  });
  (0, _mocha.it)('includes interface possible types in the type map', function () {
    var SomeInterface = new _.GraphQLInterfaceType({
      name: 'SomeInterface',
      fields: {
        f: {
          type: _.GraphQLInt
        }
      }
    });
    var SomeSubtype = new _.GraphQLObjectType({
      name: 'SomeSubtype',
      fields: {
        f: {
          type: _.GraphQLInt
        }
      },
      interfaces: [SomeInterface]
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          iface: {
            type: SomeInterface
          }
        }
      }),
      types: [SomeSubtype]
    });
    (0, _chai.expect)(schema.getTypeMap().SomeSubtype).to.equal(SomeSubtype);
  });
  (0, _mocha.it)("includes interfaces' thunk subtypes in the type map", function () {
    var SomeInterface = new _.GraphQLInterfaceType({
      name: 'SomeInterface',
      fields: {
        f: {
          type: _.GraphQLInt
        }
      }
    });
    var SomeSubtype = new _.GraphQLObjectType({
      name: 'SomeSubtype',
      fields: {
        f: {
          type: _.GraphQLInt
        }
      },
      interfaces: function interfaces() {
        return [SomeInterface];
      }
    });
    var schema = new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          iface: {
            type: SomeInterface
          }
        }
      }),
      types: [SomeSubtype]
    });
    (0, _chai.expect)(schema.getTypeMap().SomeSubtype).to.equal(SomeSubtype);
  });
  (0, _mocha.it)('stringifies simple types', function () {
    (0, _chai.expect)(String(_.GraphQLInt)).to.equal('Int');
    (0, _chai.expect)(String(BlogArticle)).to.equal('Article');
    (0, _chai.expect)(String(InterfaceType)).to.equal('Interface');
    (0, _chai.expect)(String(UnionType)).to.equal('Union');
    (0, _chai.expect)(String(EnumType)).to.equal('Enum');
    (0, _chai.expect)(String(InputObjectType)).to.equal('InputObject');
    (0, _chai.expect)(String((0, _.GraphQLNonNull)(_.GraphQLInt))).to.equal('Int!');
    (0, _chai.expect)(String((0, _.GraphQLList)(_.GraphQLInt))).to.equal('[Int]');
    (0, _chai.expect)(String((0, _.GraphQLNonNull)((0, _.GraphQLList)(_.GraphQLInt)))).to.equal('[Int]!');
    (0, _chai.expect)(String((0, _.GraphQLList)((0, _.GraphQLNonNull)(_.GraphQLInt)))).to.equal('[Int!]');
    (0, _chai.expect)(String((0, _.GraphQLList)((0, _.GraphQLList)(_.GraphQLInt)))).to.equal('[[Int]]');
  });
  (0, _mocha.it)('identifies input types', function () {
    var expected = [[_.GraphQLInt, true], [ObjectType, false], [InterfaceType, false], [UnionType, false], [EnumType, true], [InputObjectType, true]];
    expected.forEach(function (_ref) {
      var type = _ref[0],
          answer = _ref[1];
      (0, _chai.expect)((0, _definition.isInputType)(type)).to.equal(answer);
      (0, _chai.expect)((0, _definition.isInputType)((0, _.GraphQLList)(type))).to.equal(answer);
      (0, _chai.expect)((0, _definition.isInputType)((0, _.GraphQLNonNull)(type))).to.equal(answer);
    });
  });
  (0, _mocha.it)('identifies output types', function () {
    var expected = [[_.GraphQLInt, true], [ObjectType, true], [InterfaceType, true], [UnionType, true], [EnumType, true], [InputObjectType, false]];
    expected.forEach(function (_ref2) {
      var type = _ref2[0],
          answer = _ref2[1];
      (0, _chai.expect)((0, _definition.isOutputType)(type)).to.equal(answer);
      (0, _chai.expect)((0, _definition.isOutputType)((0, _.GraphQLList)(type))).to.equal(answer);
      (0, _chai.expect)((0, _definition.isOutputType)((0, _.GraphQLNonNull)(type))).to.equal(answer);
    });
  });
  (0, _mocha.it)('prohibits nesting NonNull inside NonNull', function () {
    (0, _chai.expect)(function () {
      return (0, _.GraphQLNonNull)((0, _.GraphQLNonNull)(_.GraphQLInt));
    }).to.throw('Expected Int! to be a GraphQL nullable type.');
  });
  (0, _mocha.it)('allows a thunk for Union member types', function () {
    var union = new _.GraphQLUnionType({
      name: 'ThunkUnion',
      types: function types() {
        return [ObjectType];
      }
    });
    var types = union.getTypes();
    (0, _chai.expect)(types.length).to.equal(1);
    (0, _chai.expect)(types[0]).to.equal(ObjectType);
  });
  (0, _mocha.it)('does not mutate passed field definitions', function () {
    var fields = {
      field1: {
        type: _.GraphQLString
      },
      field2: {
        type: _.GraphQLString,
        args: {
          id: {
            type: _.GraphQLString
          }
        }
      }
    };
    var testObject1 = new _.GraphQLObjectType({
      name: 'Test1',
      fields: fields
    });
    var testObject2 = new _.GraphQLObjectType({
      name: 'Test2',
      fields: fields
    });
    (0, _chai.expect)(testObject1.getFields()).to.deep.equal(testObject2.getFields());
    (0, _chai.expect)(fields).to.deep.equal({
      field1: {
        type: _.GraphQLString
      },
      field2: {
        type: _.GraphQLString,
        args: {
          id: {
            type: _.GraphQLString
          }
        }
      }
    });
    var testInputObject1 = new _.GraphQLInputObjectType({
      name: 'Test1',
      fields: fields
    });
    var testInputObject2 = new _.GraphQLInputObjectType({
      name: 'Test2',
      fields: fields
    });
    (0, _chai.expect)(testInputObject1.getFields()).to.deep.equal(testInputObject2.getFields());
    (0, _chai.expect)(fields).to.deep.equal({
      field1: {
        type: _.GraphQLString
      },
      field2: {
        type: _.GraphQLString,
        args: {
          id: {
            type: _.GraphQLString
          }
        }
      }
    });
  });
});
(0, _mocha.describe)('Field config must be object', function () {
  (0, _mocha.it)('accepts an Object type with a field function', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: function fields() {
        return {
          f: {
            type: _.GraphQLString
          }
        };
      }
    });
    (0, _chai.expect)(objType.getFields().f.type).to.equal(_.GraphQLString);
  });
  (0, _mocha.it)('rejects an Object type field with undefined config', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        f: undefined
      }
    });
    (0, _chai.expect)(function () {
      return objType.getFields();
    }).to.throw('SomeObject.f field config must be an object');
  });
  (0, _mocha.it)('rejects an Object type with incorrectly typed fields', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: [{
        field: _.GraphQLString
      }]
    });
    (0, _chai.expect)(function () {
      return objType.getFields();
    }).to.throw('SomeObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
  (0, _mocha.it)('rejects an Object type with a field function that returns incorrect type', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: function fields() {
        return [{
          field: _.GraphQLString
        }];
      }
    });
    (0, _chai.expect)(function () {
      return objType.getFields();
    }).to.throw('SomeObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
});
(0, _mocha.describe)('Field arg config must be object', function () {
  (0, _mocha.it)('accepts an Object type with field args', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        goodField: {
          type: _.GraphQLString,
          args: {
            goodArg: {
              type: _.GraphQLString
            }
          }
        }
      }
    });
    (0, _chai.expect)(function () {
      return objType.getFields();
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects an Object type with incorrectly typed field args', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        badField: {
          type: _.GraphQLString,
          args: [{
            badArg: _.GraphQLString
          }]
        }
      }
    });
    (0, _chai.expect)(function () {
      return objType.getFields();
    }).to.throw('SomeObject.badField args must be an object with argument names as keys.');
  });
  (0, _mocha.it)('does not allow isDeprecated without deprecationReason on field', function () {
    (0, _chai.expect)(function () {
      var OldObject = new _.GraphQLObjectType({
        name: 'OldObject',
        fields: {
          field: {
            type: _.GraphQLString,
            isDeprecated: true
          }
        }
      });
      return schemaWithFieldType(OldObject);
    }).to.throw('OldObject.field should provide "deprecationReason" instead ' + 'of "isDeprecated".');
  });
});
(0, _mocha.describe)('Object interfaces must be array', function () {
  (0, _mocha.it)('accepts an Object type with array interfaces', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      interfaces: [InterfaceType],
      fields: {
        f: {
          type: _.GraphQLString
        }
      }
    });
    (0, _chai.expect)(objType.getInterfaces()[0]).to.equal(InterfaceType);
  });
  (0, _mocha.it)('accepts an Object type with interfaces as a function returning an array', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      interfaces: function interfaces() {
        return [InterfaceType];
      },
      fields: {
        f: {
          type: _.GraphQLString
        }
      }
    });
    (0, _chai.expect)(objType.getInterfaces()[0]).to.equal(InterfaceType);
  });
  (0, _mocha.it)('rejects an Object type with incorrectly typed interfaces', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      interfaces: {},
      fields: {
        f: {
          type: _.GraphQLString
        }
      }
    });
    (0, _chai.expect)(function () {
      return objType.getInterfaces();
    }).to.throw('SomeObject interfaces must be an Array or a function which returns an Array.');
  });
  (0, _mocha.it)('rejects an Object type with interfaces as a function returning an incorrect type', function () {
    var objType = new _.GraphQLObjectType({
      name: 'SomeObject',
      interfaces: function interfaces() {
        return {};
      },
      fields: {
        f: {
          type: _.GraphQLString
        }
      }
    });
    (0, _chai.expect)(function () {
      return objType.getInterfaces();
    }).to.throw('SomeObject interfaces must be an Array or a function which returns an Array.');
  });
});
(0, _mocha.describe)('Type System: Object fields must have valid resolve values', function () {
  function schemaWithObjectWithFieldResolver(resolveValue) {
    var BadResolverType = new _.GraphQLObjectType({
      name: 'BadResolver',
      fields: {
        badField: {
          type: _.GraphQLString,
          resolve: resolveValue
        }
      }
    });
    return new _.GraphQLSchema({
      query: new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          f: {
            type: BadResolverType
          }
        }
      })
    });
  }

  (0, _mocha.it)('accepts a lambda as an Object field resolver', function () {
    (0, _chai.expect)(function () {
      return schemaWithObjectWithFieldResolver(function () {
        return {};
      });
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects an empty Object field resolver', function () {
    (0, _chai.expect)(function () {
      return schemaWithObjectWithFieldResolver({});
    }).to.throw('BadResolver.badField field resolver must be a function if provided, ' + 'but got: [object Object].');
  });
  (0, _mocha.it)('rejects a constant scalar value resolver', function () {
    (0, _chai.expect)(function () {
      return schemaWithObjectWithFieldResolver(0);
    }).to.throw('BadResolver.badField field resolver must be a function if provided, ' + 'but got: 0.');
  });
});
(0, _mocha.describe)('Type System: Interface types must be resolvable', function () {
  (0, _mocha.it)('accepts an Interface type defining resolveType', function () {
    (0, _chai.expect)(function () {
      var AnotherInterfaceType = new _.GraphQLInterfaceType({
        name: 'AnotherInterface',
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      schemaWithFieldType(new _.GraphQLObjectType({
        name: 'SomeObject',
        interfaces: [AnotherInterfaceType],
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('accepts an Interface with implementing type defining isTypeOf', function () {
    (0, _chai.expect)(function () {
      var InterfaceTypeWithoutResolveType = new _.GraphQLInterfaceType({
        name: 'InterfaceTypeWithoutResolveType',
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      schemaWithFieldType(new _.GraphQLObjectType({
        name: 'SomeObject',
        interfaces: [InterfaceTypeWithoutResolveType],
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('accepts an Interface type defining resolveType with implementing type defining isTypeOf', function () {
    (0, _chai.expect)(function () {
      var AnotherInterfaceType = new _.GraphQLInterfaceType({
        name: 'AnotherInterface',
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      schemaWithFieldType(new _.GraphQLObjectType({
        name: 'SomeObject',
        interfaces: [AnotherInterfaceType],
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects an Interface type with an incorrect type for resolveType', function () {
    (0, _chai.expect)(function () {
      return new _.GraphQLInterfaceType({
        name: 'AnotherInterface',
        resolveType: {},
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
    }).to.throw('AnotherInterface must provide "resolveType" as a function.');
  });
});
(0, _mocha.describe)('Type System: Union types must be resolvable', function () {
  var ObjectWithIsTypeOf = new _.GraphQLObjectType({
    name: 'ObjectWithIsTypeOf',
    fields: {
      f: {
        type: _.GraphQLString
      }
    }
  });
  (0, _mocha.it)('accepts a Union type defining resolveType', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectType]
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('accepts a Union of Object types defining isTypeOf', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectWithIsTypeOf]
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('accepts a Union type defining resolveType of Object types defining isTypeOf', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectWithIsTypeOf]
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects an Interface type with an incorrect type for resolveType', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion',
        resolveType: {},
        types: [ObjectWithIsTypeOf]
      }));
    }).to.throw('SomeUnion must provide "resolveType" as a function.');
  });
});
(0, _mocha.describe)('Type System: Scalar types must be serializable', function () {
  (0, _mocha.it)('accepts a Scalar type defining serialize', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLScalarType({
        name: 'SomeScalar',
        serialize: function serialize() {
          return null;
        }
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects a Scalar type not defining serialize', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLScalarType({
        name: 'SomeScalar'
      }));
    }).to.throw('SomeScalar must provide "serialize" function. If this custom Scalar ' + 'is also used as an input type, ensure "parseValue" and "parseLiteral" ' + 'functions are also provided.');
  });
  (0, _mocha.it)('rejects a Scalar type defining serialize with an incorrect type', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLScalarType({
        name: 'SomeScalar',
        serialize: {}
      }));
    }).to.throw('SomeScalar must provide "serialize" function. If this custom Scalar ' + 'is also used as an input type, ensure "parseValue" and "parseLiteral" ' + 'functions are also provided.');
  });
  (0, _mocha.it)('accepts a Scalar type defining parseValue and parseLiteral', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLScalarType({
        name: 'SomeScalar',
        serialize: function serialize() {
          return null;
        },
        parseValue: function parseValue() {
          return null;
        },
        parseLiteral: function parseLiteral() {
          return null;
        }
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects a Scalar type defining parseValue but not parseLiteral', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLScalarType({
        name: 'SomeScalar',
        serialize: function serialize() {
          return null;
        },
        parseValue: function parseValue() {
          return null;
        }
      }));
    }).to.throw('SomeScalar must provide both "parseValue" and "parseLiteral" functions.');
  });
  (0, _mocha.it)('rejects a Scalar type defining parseLiteral but not parseValue', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLScalarType({
        name: 'SomeScalar',
        serialize: function serialize() {
          return null;
        },
        parseLiteral: function parseLiteral() {
          return null;
        }
      }));
    }).to.throw('SomeScalar must provide both "parseValue" and "parseLiteral" functions.');
  });
  (0, _mocha.it)('rejects a Scalar type defining parseValue and parseLiteral with an incorrect type', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLScalarType({
        name: 'SomeScalar',
        serialize: function serialize() {
          return null;
        },
        parseValue: {},
        parseLiteral: {}
      }));
    }).to.throw('SomeScalar must provide both "parseValue" and "parseLiteral" functions.');
  });
});
(0, _mocha.describe)('Type System: Object types must be assertable', function () {
  (0, _mocha.it)('accepts an Object type with an isTypeOf function', function () {
    (0, _chai.expect)(function () {
      schemaWithFieldType(new _.GraphQLObjectType({
        name: 'AnotherObject',
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects an Object type with an incorrect type for isTypeOf', function () {
    (0, _chai.expect)(function () {
      schemaWithFieldType(new _.GraphQLObjectType({
        name: 'AnotherObject',
        isTypeOf: {},
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      }));
    }).to.throw('AnotherObject must provide "isTypeOf" as a function.');
  });
});
(0, _mocha.describe)('Type System: Union types must be array', function () {
  (0, _mocha.it)('accepts a Union type with array types', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectType]
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('accepts a Union type with function returning an array of types', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion',
        types: function types() {
          return [ObjectType];
        }
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects a Union type without types', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion'
      }));
    }).not.to.throw();
  });
  (0, _mocha.it)('rejects a Union type with incorrectly typed types', function () {
    (0, _chai.expect)(function () {
      return schemaWithFieldType(new _.GraphQLUnionType({
        name: 'SomeUnion',
        types: {
          ObjectType: ObjectType
        }
      }));
    }).to.throw('Must provide Array of types or a function which returns such an array ' + 'for Union SomeUnion.');
  });
});
(0, _mocha.describe)('Type System: Input Objects must have fields', function () {
  (0, _mocha.it)('accepts an Input Object type with fields', function () {
    var inputObjType = new _.GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        f: {
          type: _.GraphQLString
        }
      }
    });
    (0, _chai.expect)(inputObjType.getFields().f.type).to.equal(_.GraphQLString);
  });
  (0, _mocha.it)('accepts an Input Object type with a field function', function () {
    var inputObjType = new _.GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: function fields() {
        return {
          f: {
            type: _.GraphQLString
          }
        };
      }
    });
    (0, _chai.expect)(inputObjType.getFields().f.type).to.equal(_.GraphQLString);
  });
  (0, _mocha.it)('rejects an Input Object type with incorrect fields', function () {
    var inputObjType = new _.GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: []
    });
    (0, _chai.expect)(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
  (0, _mocha.it)('rejects an Input Object type with fields function that returns incorrect type', function () {
    var inputObjType = new _.GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: function fields() {
        return [];
      }
    });
    (0, _chai.expect)(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
});
(0, _mocha.describe)('Type System: Input Object fields must not have resolvers', function () {
  (0, _mocha.it)('rejects an Input Object type with resolvers', function () {
    var inputObjType = new _.GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        f: {
          type: _.GraphQLString,
          resolve: function resolve() {
            return 0;
          }
        }
      }
    });
    (0, _chai.expect)(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject.f field type has a resolve property, ' + 'but Input Types cannot define resolvers.');
  });
  (0, _mocha.it)('rejects an Input Object type with resolver constant', function () {
    var inputObjType = new _.GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        f: {
          type: _.GraphQLString,
          resolve: {}
        }
      }
    });
    (0, _chai.expect)(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject.f field type has a resolve property, ' + 'but Input Types cannot define resolvers.');
  });
});
(0, _mocha.describe)('Type System: Enum types must be well defined', function () {
  (0, _mocha.it)('accepts a well defined Enum type with empty value definition', function () {
    var enumType = new _.GraphQLEnumType({
      name: 'SomeEnum',
      values: {
        FOO: {},
        BAR: {}
      }
    });
    (0, _chai.expect)(enumType.getValue('FOO').value).to.equal('FOO');
    (0, _chai.expect)(enumType.getValue('BAR').value).to.equal('BAR');
  });
  (0, _mocha.it)('accepts a well defined Enum type with internal value definition', function () {
    var enumType = new _.GraphQLEnumType({
      name: 'SomeEnum',
      values: {
        FOO: {
          value: 10
        },
        BAR: {
          value: 20
        }
      }
    });
    (0, _chai.expect)(enumType.getValue('FOO').value).to.equal(10);
    (0, _chai.expect)(enumType.getValue('BAR').value).to.equal(20);
  });
  (0, _mocha.it)('rejects an Enum type with incorrectly typed values', function () {
    var config = {
      name: 'SomeEnum',
      values: [{
        FOO: 10
      }]
    };
    (0, _chai.expect)(function () {
      return new _.GraphQLEnumType(config);
    }).to.throw('SomeEnum values must be an object with value names as keys.');
  });
  (0, _mocha.it)('rejects an Enum type with missing value definition', function () {
    var config = {
      name: 'SomeEnum',
      values: {
        FOO: null
      }
    };
    (0, _chai.expect)(function () {
      return new _.GraphQLEnumType(config);
    }).to.throw('SomeEnum.FOO must refer to an object with a "value" key representing ' + 'an internal value but got: null.');
  });
  (0, _mocha.it)('rejects an Enum type with incorrectly typed value definition', function () {
    var config = {
      name: 'SomeEnum',
      values: {
        FOO: 10
      }
    };
    (0, _chai.expect)(function () {
      return new _.GraphQLEnumType(config);
    }).to.throw('SomeEnum.FOO must refer to an object with a "value" key representing ' + 'an internal value but got: 10.');
  });
  (0, _mocha.it)('does not allow isDeprecated without deprecationReason on enum', function () {
    var config = {
      name: 'SomeEnum',
      values: {
        FOO: {
          isDeprecated: true
        }
      }
    };
    (0, _chai.expect)(function () {
      return new _.GraphQLEnumType(config);
    }).to.throw('SomeEnum.FOO should provide "deprecationReason" instead ' + 'of "isDeprecated".');
  });
});
(0, _mocha.describe)('Type System: List must accept only types', function () {
  var types = [_.GraphQLString, ScalarType, ObjectType, UnionType, InterfaceType, EnumType, InputObjectType, (0, _.GraphQLList)(_.GraphQLString), (0, _.GraphQLNonNull)(_.GraphQLString)];
  var notTypes = [{}, String, undefined, null];
  types.forEach(function (type) {
    (0, _mocha.it)("accepts an type as item type of list: ".concat(type), function () {
      (0, _chai.expect)(function () {
        return (0, _.GraphQLList)(type);
      }).not.to.throw();
    });
  });
  notTypes.forEach(function (type) {
    (0, _mocha.it)("rejects a non-type as item type of list: ".concat(type), function () {
      (0, _chai.expect)(function () {
        return (0, _.GraphQLList)(type);
      }).to.throw("Expected ".concat(type, " to be a GraphQL type."));
    });
  });
});
(0, _mocha.describe)('Type System: NonNull must only accept non-nullable types', function () {
  var nullableTypes = [_.GraphQLString, ScalarType, ObjectType, UnionType, InterfaceType, EnumType, InputObjectType, (0, _.GraphQLList)(_.GraphQLString), (0, _.GraphQLList)((0, _.GraphQLNonNull)(_.GraphQLString))];
  var notNullableTypes = [(0, _.GraphQLNonNull)(_.GraphQLString), {}, String, undefined, null];
  nullableTypes.forEach(function (type) {
    (0, _mocha.it)("accepts an type as nullable type of non-null: ".concat(type), function () {
      (0, _chai.expect)(function () {
        return (0, _.GraphQLNonNull)(type);
      }).not.to.throw();
    });
  });
  notNullableTypes.forEach(function (type) {
    (0, _mocha.it)("rejects a non-type as nullable type of non-null: ".concat(type), function () {
      (0, _chai.expect)(function () {
        return (0, _.GraphQLNonNull)(type);
      }).to.throw("Expected ".concat(type, " to be a GraphQL nullable type."));
    });
  });
});
(0, _mocha.describe)('Type System: A Schema must contain uniquely named types', function () {
  (0, _mocha.it)('rejects a Schema which redefines a built-in type', function () {
    (0, _chai.expect)(function () {
      var FakeString = new _.GraphQLScalarType({
        name: 'String',
        serialize: function serialize() {
          return null;
        }
      });
      var QueryType = new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          normal: {
            type: _.GraphQLString
          },
          fake: {
            type: FakeString
          }
        }
      });
      return new _.GraphQLSchema({
        query: QueryType
      });
    }).to.throw('Schema must contain unique named types but contains multiple types ' + 'named "String".');
  });
  (0, _mocha.it)('rejects a Schema which defines an object type twice', function () {
    (0, _chai.expect)(function () {
      var A = new _.GraphQLObjectType({
        name: 'SameName',
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      var B = new _.GraphQLObjectType({
        name: 'SameName',
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      var QueryType = new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          a: {
            type: A
          },
          b: {
            type: B
          }
        }
      });
      return new _.GraphQLSchema({
        query: QueryType
      });
    }).to.throw('Schema must contain unique named types but contains multiple types ' + 'named "SameName".');
  });
  (0, _mocha.it)('rejects a Schema which have same named objects implementing an interface', function () {
    (0, _chai.expect)(function () {
      var AnotherInterface = new _.GraphQLInterfaceType({
        name: 'AnotherInterface',
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      var FirstBadObject = new _.GraphQLObjectType({
        name: 'BadObject',
        interfaces: [AnotherInterface],
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      var SecondBadObject = new _.GraphQLObjectType({
        name: 'BadObject',
        interfaces: [AnotherInterface],
        fields: {
          f: {
            type: _.GraphQLString
          }
        }
      });
      var QueryType = new _.GraphQLObjectType({
        name: 'Query',
        fields: {
          iface: {
            type: AnotherInterface
          }
        }
      });
      return new _.GraphQLSchema({
        query: QueryType,
        types: [FirstBadObject, SecondBadObject]
      });
    }).to.throw('Schema must contain unique named types but contains multiple types ' + 'named "BadObject".');
  });
});