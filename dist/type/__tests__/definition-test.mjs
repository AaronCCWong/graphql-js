/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { GraphQLSchema, GraphQLScalarType, GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLObjectType, GraphQLUnionType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLBoolean } from '../';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { isObjectType, isInputType, isOutputType } from '../definition';
var BlogImage = new GraphQLObjectType({
  name: 'Image',
  fields: {
    url: {
      type: GraphQLString
    },
    width: {
      type: GraphQLInt
    },
    height: {
      type: GraphQLInt
    }
  }
});
var BlogAuthor = new GraphQLObjectType({
  name: 'Author',
  fields: function fields() {
    return {
      id: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      pic: {
        args: {
          width: {
            type: GraphQLInt
          },
          height: {
            type: GraphQLInt
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
var BlogArticle = new GraphQLObjectType({
  name: 'Article',
  fields: {
    id: {
      type: GraphQLString
    },
    isPublished: {
      type: GraphQLBoolean
    },
    author: {
      type: BlogAuthor
    },
    title: {
      type: GraphQLString
    },
    body: {
      type: GraphQLString
    }
  }
});
var BlogQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    article: {
      args: {
        id: {
          type: GraphQLString
        }
      },
      type: BlogArticle
    },
    feed: {
      type: GraphQLList(BlogArticle)
    }
  }
});
var BlogMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    writeArticle: {
      type: BlogArticle
    }
  }
});
var BlogSubscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    articleSubscribe: {
      args: {
        id: {
          type: GraphQLString
        }
      },
      type: BlogArticle
    }
  }
});
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

function schemaWithFieldType(type) {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
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

describe('Type System: Example', function () {
  it('defines a query only schema', function () {
    var BlogSchema = new GraphQLSchema({
      query: BlogQuery
    });
    expect(BlogSchema.getQueryType()).to.equal(BlogQuery);
    var articleField = BlogQuery.getFields()['article'];
    expect(articleField && articleField.type).to.equal(BlogArticle);
    expect(articleField && articleField.type.name).to.equal('Article');
    expect(articleField && articleField.name).to.equal('article');
    var articleFieldType = articleField ? articleField.type : null;
    var titleField = isObjectType(articleFieldType) && articleFieldType.getFields()['title'];
    expect(titleField && titleField.name).to.equal('title');
    expect(titleField && titleField.type).to.equal(GraphQLString);
    expect(titleField && titleField.type.name).to.equal('String');
    var authorField = isObjectType(articleFieldType) && articleFieldType.getFields()['author'];
    var authorFieldType = authorField ? authorField.type : null;
    var recentArticleField = isObjectType(authorFieldType) && authorFieldType.getFields()['recentArticle'];
    expect(recentArticleField && recentArticleField.type).to.equal(BlogArticle);
    var feedField = BlogQuery.getFields()['feed'];
    expect(feedField && feedField.type.ofType).to.equal(BlogArticle);
    expect(feedField && feedField.name).to.equal('feed');
  });
  it('defines a mutation schema', function () {
    var BlogSchema = new GraphQLSchema({
      query: BlogQuery,
      mutation: BlogMutation
    });
    expect(BlogSchema.getMutationType()).to.equal(BlogMutation);
    var writeMutation = BlogMutation.getFields()['writeArticle'];
    expect(writeMutation && writeMutation.type).to.equal(BlogArticle);
    expect(writeMutation && writeMutation.type.name).to.equal('Article');
    expect(writeMutation && writeMutation.name).to.equal('writeArticle');
  });
  it('defines a subscription schema', function () {
    var BlogSchema = new GraphQLSchema({
      query: BlogQuery,
      subscription: BlogSubscription
    });
    expect(BlogSchema.getSubscriptionType()).to.equal(BlogSubscription);
    var sub = BlogSubscription.getFields()['articleSubscribe'];
    expect(sub && sub.type).to.equal(BlogArticle);
    expect(sub && sub.type.name).to.equal('Article');
    expect(sub && sub.name).to.equal('articleSubscribe');
  });
  it('defines an enum type with deprecated value', function () {
    var EnumTypeWithDeprecatedValue = new GraphQLEnumType({
      name: 'EnumWithDeprecatedValue',
      values: {
        foo: {
          deprecationReason: 'Just because'
        }
      }
    });
    expect(EnumTypeWithDeprecatedValue.getValues()[0]).to.deep.equal({
      name: 'foo',
      description: undefined,
      isDeprecated: true,
      deprecationReason: 'Just because',
      value: 'foo',
      astNode: undefined
    });
  });
  it('defines an enum type with a value of `null` and `undefined`', function () {
    var EnumTypeWithNullishValue = new GraphQLEnumType({
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
    expect(EnumTypeWithNullishValue.getValues()).to.deep.equal([{
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
  it('defines an object type with deprecated field', function () {
    var TypeWithDeprecatedField = new GraphQLObjectType({
      name: 'foo',
      fields: {
        bar: {
          type: GraphQLString,
          deprecationReason: 'A terrible reason'
        }
      }
    });
    expect(TypeWithDeprecatedField.getFields().bar).to.deep.equal({
      type: GraphQLString,
      deprecationReason: 'A terrible reason',
      isDeprecated: true,
      name: 'bar',
      args: []
    });
  });
  it('includes nested input objects in the map', function () {
    var NestedInputObject = new GraphQLInputObjectType({
      name: 'NestedInputObject',
      fields: {
        value: {
          type: GraphQLString
        }
      }
    });
    var SomeInputObject = new GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        nested: {
          type: NestedInputObject
        }
      }
    });
    var SomeMutation = new GraphQLObjectType({
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
    var SomeSubscription = new GraphQLObjectType({
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
    var schema = new GraphQLSchema({
      query: BlogQuery,
      mutation: SomeMutation,
      subscription: SomeSubscription
    });
    expect(schema.getTypeMap().NestedInputObject).to.equal(NestedInputObject);
  });
  it('includes interface possible types in the type map', function () {
    var SomeInterface = new GraphQLInterfaceType({
      name: 'SomeInterface',
      fields: {
        f: {
          type: GraphQLInt
        }
      }
    });
    var SomeSubtype = new GraphQLObjectType({
      name: 'SomeSubtype',
      fields: {
        f: {
          type: GraphQLInt
        }
      },
      interfaces: [SomeInterface]
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          iface: {
            type: SomeInterface
          }
        }
      }),
      types: [SomeSubtype]
    });
    expect(schema.getTypeMap().SomeSubtype).to.equal(SomeSubtype);
  });
  it("includes interfaces' thunk subtypes in the type map", function () {
    var SomeInterface = new GraphQLInterfaceType({
      name: 'SomeInterface',
      fields: {
        f: {
          type: GraphQLInt
        }
      }
    });
    var SomeSubtype = new GraphQLObjectType({
      name: 'SomeSubtype',
      fields: {
        f: {
          type: GraphQLInt
        }
      },
      interfaces: function interfaces() {
        return [SomeInterface];
      }
    });
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          iface: {
            type: SomeInterface
          }
        }
      }),
      types: [SomeSubtype]
    });
    expect(schema.getTypeMap().SomeSubtype).to.equal(SomeSubtype);
  });
  it('stringifies simple types', function () {
    expect(String(GraphQLInt)).to.equal('Int');
    expect(String(BlogArticle)).to.equal('Article');
    expect(String(InterfaceType)).to.equal('Interface');
    expect(String(UnionType)).to.equal('Union');
    expect(String(EnumType)).to.equal('Enum');
    expect(String(InputObjectType)).to.equal('InputObject');
    expect(String(GraphQLNonNull(GraphQLInt))).to.equal('Int!');
    expect(String(GraphQLList(GraphQLInt))).to.equal('[Int]');
    expect(String(GraphQLNonNull(GraphQLList(GraphQLInt)))).to.equal('[Int]!');
    expect(String(GraphQLList(GraphQLNonNull(GraphQLInt)))).to.equal('[Int!]');
    expect(String(GraphQLList(GraphQLList(GraphQLInt)))).to.equal('[[Int]]');
  });
  it('identifies input types', function () {
    var expected = [[GraphQLInt, true], [ObjectType, false], [InterfaceType, false], [UnionType, false], [EnumType, true], [InputObjectType, true]];
    expected.forEach(function (_ref) {
      var type = _ref[0],
          answer = _ref[1];
      expect(isInputType(type)).to.equal(answer);
      expect(isInputType(GraphQLList(type))).to.equal(answer);
      expect(isInputType(GraphQLNonNull(type))).to.equal(answer);
    });
  });
  it('identifies output types', function () {
    var expected = [[GraphQLInt, true], [ObjectType, true], [InterfaceType, true], [UnionType, true], [EnumType, true], [InputObjectType, false]];
    expected.forEach(function (_ref2) {
      var type = _ref2[0],
          answer = _ref2[1];
      expect(isOutputType(type)).to.equal(answer);
      expect(isOutputType(GraphQLList(type))).to.equal(answer);
      expect(isOutputType(GraphQLNonNull(type))).to.equal(answer);
    });
  });
  it('prohibits nesting NonNull inside NonNull', function () {
    expect(function () {
      return GraphQLNonNull(GraphQLNonNull(GraphQLInt));
    }).to.throw('Expected Int! to be a GraphQL nullable type.');
  });
  it('allows a thunk for Union member types', function () {
    var union = new GraphQLUnionType({
      name: 'ThunkUnion',
      types: function types() {
        return [ObjectType];
      }
    });
    var types = union.getTypes();
    expect(types.length).to.equal(1);
    expect(types[0]).to.equal(ObjectType);
  });
  it('does not mutate passed field definitions', function () {
    var fields = {
      field1: {
        type: GraphQLString
      },
      field2: {
        type: GraphQLString,
        args: {
          id: {
            type: GraphQLString
          }
        }
      }
    };
    var testObject1 = new GraphQLObjectType({
      name: 'Test1',
      fields: fields
    });
    var testObject2 = new GraphQLObjectType({
      name: 'Test2',
      fields: fields
    });
    expect(testObject1.getFields()).to.deep.equal(testObject2.getFields());
    expect(fields).to.deep.equal({
      field1: {
        type: GraphQLString
      },
      field2: {
        type: GraphQLString,
        args: {
          id: {
            type: GraphQLString
          }
        }
      }
    });
    var testInputObject1 = new GraphQLInputObjectType({
      name: 'Test1',
      fields: fields
    });
    var testInputObject2 = new GraphQLInputObjectType({
      name: 'Test2',
      fields: fields
    });
    expect(testInputObject1.getFields()).to.deep.equal(testInputObject2.getFields());
    expect(fields).to.deep.equal({
      field1: {
        type: GraphQLString
      },
      field2: {
        type: GraphQLString,
        args: {
          id: {
            type: GraphQLString
          }
        }
      }
    });
  });
});
describe('Field config must be object', function () {
  it('accepts an Object type with a field function', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      fields: function fields() {
        return {
          f: {
            type: GraphQLString
          }
        };
      }
    });
    expect(objType.getFields().f.type).to.equal(GraphQLString);
  });
  it('rejects an Object type field with undefined config', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        f: undefined
      }
    });
    expect(function () {
      return objType.getFields();
    }).to.throw('SomeObject.f field config must be an object');
  });
  it('rejects an Object type with incorrectly typed fields', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      fields: [{
        field: GraphQLString
      }]
    });
    expect(function () {
      return objType.getFields();
    }).to.throw('SomeObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
  it('rejects an Object type with a field function that returns incorrect type', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      fields: function fields() {
        return [{
          field: GraphQLString
        }];
      }
    });
    expect(function () {
      return objType.getFields();
    }).to.throw('SomeObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
});
describe('Field arg config must be object', function () {
  it('accepts an Object type with field args', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        goodField: {
          type: GraphQLString,
          args: {
            goodArg: {
              type: GraphQLString
            }
          }
        }
      }
    });
    expect(function () {
      return objType.getFields();
    }).not.to.throw();
  });
  it('rejects an Object type with incorrectly typed field args', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      fields: {
        badField: {
          type: GraphQLString,
          args: [{
            badArg: GraphQLString
          }]
        }
      }
    });
    expect(function () {
      return objType.getFields();
    }).to.throw('SomeObject.badField args must be an object with argument names as keys.');
  });
  it('does not allow isDeprecated without deprecationReason on field', function () {
    expect(function () {
      var OldObject = new GraphQLObjectType({
        name: 'OldObject',
        fields: {
          field: {
            type: GraphQLString,
            isDeprecated: true
          }
        }
      });
      return schemaWithFieldType(OldObject);
    }).to.throw('OldObject.field should provide "deprecationReason" instead ' + 'of "isDeprecated".');
  });
});
describe('Object interfaces must be array', function () {
  it('accepts an Object type with array interfaces', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      interfaces: [InterfaceType],
      fields: {
        f: {
          type: GraphQLString
        }
      }
    });
    expect(objType.getInterfaces()[0]).to.equal(InterfaceType);
  });
  it('accepts an Object type with interfaces as a function returning an array', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      interfaces: function interfaces() {
        return [InterfaceType];
      },
      fields: {
        f: {
          type: GraphQLString
        }
      }
    });
    expect(objType.getInterfaces()[0]).to.equal(InterfaceType);
  });
  it('rejects an Object type with incorrectly typed interfaces', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      interfaces: {},
      fields: {
        f: {
          type: GraphQLString
        }
      }
    });
    expect(function () {
      return objType.getInterfaces();
    }).to.throw('SomeObject interfaces must be an Array or a function which returns an Array.');
  });
  it('rejects an Object type with interfaces as a function returning an incorrect type', function () {
    var objType = new GraphQLObjectType({
      name: 'SomeObject',
      interfaces: function interfaces() {
        return {};
      },
      fields: {
        f: {
          type: GraphQLString
        }
      }
    });
    expect(function () {
      return objType.getInterfaces();
    }).to.throw('SomeObject interfaces must be an Array or a function which returns an Array.');
  });
});
describe('Type System: Object fields must have valid resolve values', function () {
  function schemaWithObjectWithFieldResolver(resolveValue) {
    var BadResolverType = new GraphQLObjectType({
      name: 'BadResolver',
      fields: {
        badField: {
          type: GraphQLString,
          resolve: resolveValue
        }
      }
    });
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          f: {
            type: BadResolverType
          }
        }
      })
    });
  }

  it('accepts a lambda as an Object field resolver', function () {
    expect(function () {
      return schemaWithObjectWithFieldResolver(function () {
        return {};
      });
    }).not.to.throw();
  });
  it('rejects an empty Object field resolver', function () {
    expect(function () {
      return schemaWithObjectWithFieldResolver({});
    }).to.throw('BadResolver.badField field resolver must be a function if provided, ' + 'but got: [object Object].');
  });
  it('rejects a constant scalar value resolver', function () {
    expect(function () {
      return schemaWithObjectWithFieldResolver(0);
    }).to.throw('BadResolver.badField field resolver must be a function if provided, ' + 'but got: 0.');
  });
});
describe('Type System: Interface types must be resolvable', function () {
  it('accepts an Interface type defining resolveType', function () {
    expect(function () {
      var AnotherInterfaceType = new GraphQLInterfaceType({
        name: 'AnotherInterface',
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      schemaWithFieldType(new GraphQLObjectType({
        name: 'SomeObject',
        interfaces: [AnotherInterfaceType],
        fields: {
          f: {
            type: GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  it('accepts an Interface with implementing type defining isTypeOf', function () {
    expect(function () {
      var InterfaceTypeWithoutResolveType = new GraphQLInterfaceType({
        name: 'InterfaceTypeWithoutResolveType',
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      schemaWithFieldType(new GraphQLObjectType({
        name: 'SomeObject',
        interfaces: [InterfaceTypeWithoutResolveType],
        fields: {
          f: {
            type: GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  it('accepts an Interface type defining resolveType with implementing type defining isTypeOf', function () {
    expect(function () {
      var AnotherInterfaceType = new GraphQLInterfaceType({
        name: 'AnotherInterface',
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      schemaWithFieldType(new GraphQLObjectType({
        name: 'SomeObject',
        interfaces: [AnotherInterfaceType],
        fields: {
          f: {
            type: GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  it('rejects an Interface type with an incorrect type for resolveType', function () {
    expect(function () {
      return new GraphQLInterfaceType({
        name: 'AnotherInterface',
        resolveType: {},
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
    }).to.throw('AnotherInterface must provide "resolveType" as a function.');
  });
});
describe('Type System: Union types must be resolvable', function () {
  var ObjectWithIsTypeOf = new GraphQLObjectType({
    name: 'ObjectWithIsTypeOf',
    fields: {
      f: {
        type: GraphQLString
      }
    }
  });
  it('accepts a Union type defining resolveType', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectType]
      }));
    }).not.to.throw();
  });
  it('accepts a Union of Object types defining isTypeOf', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectWithIsTypeOf]
      }));
    }).not.to.throw();
  });
  it('accepts a Union type defining resolveType of Object types defining isTypeOf', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectWithIsTypeOf]
      }));
    }).not.to.throw();
  });
  it('rejects an Interface type with an incorrect type for resolveType', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion',
        resolveType: {},
        types: [ObjectWithIsTypeOf]
      }));
    }).to.throw('SomeUnion must provide "resolveType" as a function.');
  });
});
describe('Type System: Scalar types must be serializable', function () {
  it('accepts a Scalar type defining serialize', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLScalarType({
        name: 'SomeScalar',
        serialize: function serialize() {
          return null;
        }
      }));
    }).not.to.throw();
  });
  it('rejects a Scalar type not defining serialize', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLScalarType({
        name: 'SomeScalar'
      }));
    }).to.throw('SomeScalar must provide "serialize" function. If this custom Scalar ' + 'is also used as an input type, ensure "parseValue" and "parseLiteral" ' + 'functions are also provided.');
  });
  it('rejects a Scalar type defining serialize with an incorrect type', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLScalarType({
        name: 'SomeScalar',
        serialize: {}
      }));
    }).to.throw('SomeScalar must provide "serialize" function. If this custom Scalar ' + 'is also used as an input type, ensure "parseValue" and "parseLiteral" ' + 'functions are also provided.');
  });
  it('accepts a Scalar type defining parseValue and parseLiteral', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLScalarType({
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
  it('rejects a Scalar type defining parseValue but not parseLiteral', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLScalarType({
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
  it('rejects a Scalar type defining parseLiteral but not parseValue', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLScalarType({
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
  it('rejects a Scalar type defining parseValue and parseLiteral with an incorrect type', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLScalarType({
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
describe('Type System: Object types must be assertable', function () {
  it('accepts an Object type with an isTypeOf function', function () {
    expect(function () {
      schemaWithFieldType(new GraphQLObjectType({
        name: 'AnotherObject',
        fields: {
          f: {
            type: GraphQLString
          }
        }
      }));
    }).not.to.throw();
  });
  it('rejects an Object type with an incorrect type for isTypeOf', function () {
    expect(function () {
      schemaWithFieldType(new GraphQLObjectType({
        name: 'AnotherObject',
        isTypeOf: {},
        fields: {
          f: {
            type: GraphQLString
          }
        }
      }));
    }).to.throw('AnotherObject must provide "isTypeOf" as a function.');
  });
});
describe('Type System: Union types must be array', function () {
  it('accepts a Union type with array types', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion',
        types: [ObjectType]
      }));
    }).not.to.throw();
  });
  it('accepts a Union type with function returning an array of types', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion',
        types: function types() {
          return [ObjectType];
        }
      }));
    }).not.to.throw();
  });
  it('rejects a Union type without types', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion'
      }));
    }).not.to.throw();
  });
  it('rejects a Union type with incorrectly typed types', function () {
    expect(function () {
      return schemaWithFieldType(new GraphQLUnionType({
        name: 'SomeUnion',
        types: {
          ObjectType: ObjectType
        }
      }));
    }).to.throw('Must provide Array of types or a function which returns such an array ' + 'for Union SomeUnion.');
  });
});
describe('Type System: Input Objects must have fields', function () {
  it('accepts an Input Object type with fields', function () {
    var inputObjType = new GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        f: {
          type: GraphQLString
        }
      }
    });
    expect(inputObjType.getFields().f.type).to.equal(GraphQLString);
  });
  it('accepts an Input Object type with a field function', function () {
    var inputObjType = new GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: function fields() {
        return {
          f: {
            type: GraphQLString
          }
        };
      }
    });
    expect(inputObjType.getFields().f.type).to.equal(GraphQLString);
  });
  it('rejects an Input Object type with incorrect fields', function () {
    var inputObjType = new GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: []
    });
    expect(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
  it('rejects an Input Object type with fields function that returns incorrect type', function () {
    var inputObjType = new GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: function fields() {
        return [];
      }
    });
    expect(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  });
});
describe('Type System: Input Object fields must not have resolvers', function () {
  it('rejects an Input Object type with resolvers', function () {
    var inputObjType = new GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        f: {
          type: GraphQLString,
          resolve: function resolve() {
            return 0;
          }
        }
      }
    });
    expect(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject.f field type has a resolve property, ' + 'but Input Types cannot define resolvers.');
  });
  it('rejects an Input Object type with resolver constant', function () {
    var inputObjType = new GraphQLInputObjectType({
      name: 'SomeInputObject',
      fields: {
        f: {
          type: GraphQLString,
          resolve: {}
        }
      }
    });
    expect(function () {
      return inputObjType.getFields();
    }).to.throw('SomeInputObject.f field type has a resolve property, ' + 'but Input Types cannot define resolvers.');
  });
});
describe('Type System: Enum types must be well defined', function () {
  it('accepts a well defined Enum type with empty value definition', function () {
    var enumType = new GraphQLEnumType({
      name: 'SomeEnum',
      values: {
        FOO: {},
        BAR: {}
      }
    });
    expect(enumType.getValue('FOO').value).to.equal('FOO');
    expect(enumType.getValue('BAR').value).to.equal('BAR');
  });
  it('accepts a well defined Enum type with internal value definition', function () {
    var enumType = new GraphQLEnumType({
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
    expect(enumType.getValue('FOO').value).to.equal(10);
    expect(enumType.getValue('BAR').value).to.equal(20);
  });
  it('rejects an Enum type with incorrectly typed values', function () {
    var config = {
      name: 'SomeEnum',
      values: [{
        FOO: 10
      }]
    };
    expect(function () {
      return new GraphQLEnumType(config);
    }).to.throw('SomeEnum values must be an object with value names as keys.');
  });
  it('rejects an Enum type with missing value definition', function () {
    var config = {
      name: 'SomeEnum',
      values: {
        FOO: null
      }
    };
    expect(function () {
      return new GraphQLEnumType(config);
    }).to.throw('SomeEnum.FOO must refer to an object with a "value" key representing ' + 'an internal value but got: null.');
  });
  it('rejects an Enum type with incorrectly typed value definition', function () {
    var config = {
      name: 'SomeEnum',
      values: {
        FOO: 10
      }
    };
    expect(function () {
      return new GraphQLEnumType(config);
    }).to.throw('SomeEnum.FOO must refer to an object with a "value" key representing ' + 'an internal value but got: 10.');
  });
  it('does not allow isDeprecated without deprecationReason on enum', function () {
    var config = {
      name: 'SomeEnum',
      values: {
        FOO: {
          isDeprecated: true
        }
      }
    };
    expect(function () {
      return new GraphQLEnumType(config);
    }).to.throw('SomeEnum.FOO should provide "deprecationReason" instead ' + 'of "isDeprecated".');
  });
});
describe('Type System: List must accept only types', function () {
  var types = [GraphQLString, ScalarType, ObjectType, UnionType, InterfaceType, EnumType, InputObjectType, GraphQLList(GraphQLString), GraphQLNonNull(GraphQLString)];
  var notTypes = [{}, String, undefined, null];
  types.forEach(function (type) {
    it("accepts an type as item type of list: ".concat(type), function () {
      expect(function () {
        return GraphQLList(type);
      }).not.to.throw();
    });
  });
  notTypes.forEach(function (type) {
    it("rejects a non-type as item type of list: ".concat(type), function () {
      expect(function () {
        return GraphQLList(type);
      }).to.throw("Expected ".concat(type, " to be a GraphQL type."));
    });
  });
});
describe('Type System: NonNull must only accept non-nullable types', function () {
  var nullableTypes = [GraphQLString, ScalarType, ObjectType, UnionType, InterfaceType, EnumType, InputObjectType, GraphQLList(GraphQLString), GraphQLList(GraphQLNonNull(GraphQLString))];
  var notNullableTypes = [GraphQLNonNull(GraphQLString), {}, String, undefined, null];
  nullableTypes.forEach(function (type) {
    it("accepts an type as nullable type of non-null: ".concat(type), function () {
      expect(function () {
        return GraphQLNonNull(type);
      }).not.to.throw();
    });
  });
  notNullableTypes.forEach(function (type) {
    it("rejects a non-type as nullable type of non-null: ".concat(type), function () {
      expect(function () {
        return GraphQLNonNull(type);
      }).to.throw("Expected ".concat(type, " to be a GraphQL nullable type."));
    });
  });
});
describe('Type System: A Schema must contain uniquely named types', function () {
  it('rejects a Schema which redefines a built-in type', function () {
    expect(function () {
      var FakeString = new GraphQLScalarType({
        name: 'String',
        serialize: function serialize() {
          return null;
        }
      });
      var QueryType = new GraphQLObjectType({
        name: 'Query',
        fields: {
          normal: {
            type: GraphQLString
          },
          fake: {
            type: FakeString
          }
        }
      });
      return new GraphQLSchema({
        query: QueryType
      });
    }).to.throw('Schema must contain unique named types but contains multiple types ' + 'named "String".');
  });
  it('rejects a Schema which defines an object type twice', function () {
    expect(function () {
      var A = new GraphQLObjectType({
        name: 'SameName',
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      var B = new GraphQLObjectType({
        name: 'SameName',
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      var QueryType = new GraphQLObjectType({
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
      return new GraphQLSchema({
        query: QueryType
      });
    }).to.throw('Schema must contain unique named types but contains multiple types ' + 'named "SameName".');
  });
  it('rejects a Schema which have same named objects implementing an interface', function () {
    expect(function () {
      var AnotherInterface = new GraphQLInterfaceType({
        name: 'AnotherInterface',
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      var FirstBadObject = new GraphQLObjectType({
        name: 'BadObject',
        interfaces: [AnotherInterface],
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      var SecondBadObject = new GraphQLObjectType({
        name: 'BadObject',
        interfaces: [AnotherInterface],
        fields: {
          f: {
            type: GraphQLString
          }
        }
      });
      var QueryType = new GraphQLObjectType({
        name: 'Query',
        fields: {
          iface: {
            type: AnotherInterface
          }
        }
      });
      return new GraphQLSchema({
        query: QueryType,
        types: [FirstBadObject, SecondBadObject]
      });
    }).to.throw('Schema must contain unique named types but contains multiple types ' + 'named "BadObject".');
  });
});