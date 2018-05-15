"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _ProvidedRequiredArguments = require("../../validation/rules/ProvidedRequiredArguments");

var _3 = require("../../");

var _introspectionQuery = require("../../utilities/introspectionQuery");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Introspection', function () {
  (0, _mocha.it)('executes an introspection query', function () {
    var EmptySchema = new _3.GraphQLSchema({
      query: new _3.GraphQLObjectType({
        name: 'QueryRoot',
        fields: {
          onlyField: {
            type: _3.GraphQLString
          }
        }
      })
    });
    var query = (0, _introspectionQuery.getIntrospectionQuery)({
      descriptions: false
    });
    var result = (0, _3.graphqlSync)(EmptySchema, query);
    (0, _chai.expect)(result).to.deep.equal({
      data: {
        __schema: {
          mutationType: null,
          subscriptionType: null,
          queryType: {
            name: 'QueryRoot'
          },
          types: [{
            kind: 'OBJECT',
            name: 'QueryRoot',
            fields: [{
              name: 'onlyField',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }],
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'SCALAR',
            name: 'String',
            fields: null,
            inputFields: null,
            interfaces: null,
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'OBJECT',
            name: '__Schema',
            fields: [{
              name: 'types',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'LIST',
                  name: null,
                  ofType: {
                    kind: 'NON_NULL',
                    name: null,
                    ofType: {
                      kind: 'OBJECT',
                      name: '__Type',
                      ofType: null
                    }
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'queryType',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'OBJECT',
                  name: '__Type',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'mutationType',
              args: [],
              type: {
                kind: 'OBJECT',
                name: '__Type',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'subscriptionType',
              args: [],
              type: {
                kind: 'OBJECT',
                name: '__Type',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'directives',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'LIST',
                  name: null,
                  ofType: {
                    kind: 'NON_NULL',
                    name: null,
                    ofType: {
                      kind: 'OBJECT',
                      name: '__Directive',
                      ofType: null
                    }
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }],
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'OBJECT',
            name: '__Type',
            fields: [{
              name: 'kind',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'ENUM',
                  name: '__TypeKind',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'name',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'description',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'fields',
              args: [{
                name: 'includeDeprecated',
                type: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                },
                defaultValue: 'false'
              }],
              type: {
                kind: 'LIST',
                name: null,
                ofType: {
                  kind: 'NON_NULL',
                  name: null,
                  ofType: {
                    kind: 'OBJECT',
                    name: '__Field',
                    ofType: null
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'interfaces',
              args: [],
              type: {
                kind: 'LIST',
                name: null,
                ofType: {
                  kind: 'NON_NULL',
                  name: null,
                  ofType: {
                    kind: 'OBJECT',
                    name: '__Type',
                    ofType: null
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'possibleTypes',
              args: [],
              type: {
                kind: 'LIST',
                name: null,
                ofType: {
                  kind: 'NON_NULL',
                  name: null,
                  ofType: {
                    kind: 'OBJECT',
                    name: '__Type',
                    ofType: null
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'enumValues',
              args: [{
                name: 'includeDeprecated',
                type: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                },
                defaultValue: 'false'
              }],
              type: {
                kind: 'LIST',
                name: null,
                ofType: {
                  kind: 'NON_NULL',
                  name: null,
                  ofType: {
                    kind: 'OBJECT',
                    name: '__EnumValue',
                    ofType: null
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'inputFields',
              args: [],
              type: {
                kind: 'LIST',
                name: null,
                ofType: {
                  kind: 'NON_NULL',
                  name: null,
                  ofType: {
                    kind: 'OBJECT',
                    name: '__InputValue',
                    ofType: null
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'ofType',
              args: [],
              type: {
                kind: 'OBJECT',
                name: '__Type',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }],
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'ENUM',
            name: '__TypeKind',
            fields: null,
            inputFields: null,
            interfaces: null,
            enumValues: [{
              name: 'SCALAR',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'OBJECT',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'INTERFACE',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'UNION',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'ENUM',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'INPUT_OBJECT',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'LIST',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'NON_NULL',
              isDeprecated: false,
              deprecationReason: null
            }],
            possibleTypes: null
          }, {
            kind: 'SCALAR',
            name: 'Boolean',
            fields: null,
            inputFields: null,
            interfaces: null,
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'OBJECT',
            name: '__Field',
            fields: [{
              name: 'name',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'String',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'description',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'args',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'LIST',
                  name: null,
                  ofType: {
                    kind: 'NON_NULL',
                    name: null,
                    ofType: {
                      kind: 'OBJECT',
                      name: '__InputValue',
                      ofType: null
                    }
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'type',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'OBJECT',
                  name: '__Type',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'isDeprecated',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'deprecationReason',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }],
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'OBJECT',
            name: '__InputValue',
            fields: [{
              name: 'name',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'String',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'description',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'type',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'OBJECT',
                  name: '__Type',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'defaultValue',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }],
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'OBJECT',
            name: '__EnumValue',
            fields: [{
              name: 'name',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'String',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'description',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'isDeprecated',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'deprecationReason',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }],
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'OBJECT',
            name: '__Directive',
            fields: [{
              name: 'name',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'String',
                  ofType: null
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'description',
              args: [],
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'locations',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'LIST',
                  name: null,
                  ofType: {
                    kind: 'NON_NULL',
                    name: null,
                    ofType: {
                      kind: 'ENUM',
                      name: '__DirectiveLocation',
                      ofType: null
                    }
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'args',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'LIST',
                  name: null,
                  ofType: {
                    kind: 'NON_NULL',
                    name: null,
                    ofType: {
                      kind: 'OBJECT',
                      name: '__InputValue',
                      ofType: null
                    }
                  }
                }
              },
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'onOperation',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                }
              },
              isDeprecated: true,
              deprecationReason: 'Use `locations`.'
            }, {
              name: 'onFragment',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                }
              },
              isDeprecated: true,
              deprecationReason: 'Use `locations`.'
            }, {
              name: 'onField',
              args: [],
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                }
              },
              isDeprecated: true,
              deprecationReason: 'Use `locations`.'
            }],
            inputFields: null,
            interfaces: [],
            enumValues: null,
            possibleTypes: null
          }, {
            kind: 'ENUM',
            name: '__DirectiveLocation',
            fields: null,
            inputFields: null,
            interfaces: null,
            enumValues: [{
              name: 'QUERY',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'MUTATION',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'SUBSCRIPTION',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'FIELD',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'FRAGMENT_DEFINITION',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'FRAGMENT_SPREAD',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'INLINE_FRAGMENT',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'SCHEMA',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'SCALAR',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'OBJECT',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'FIELD_DEFINITION',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'ARGUMENT_DEFINITION',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'INTERFACE',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'UNION',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'ENUM',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'ENUM_VALUE',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'INPUT_OBJECT',
              isDeprecated: false,
              deprecationReason: null
            }, {
              name: 'INPUT_FIELD_DEFINITION',
              isDeprecated: false,
              deprecationReason: null
            }],
            possibleTypes: null
          }],
          directives: [{
            name: 'include',
            locations: ['FIELD', 'FRAGMENT_SPREAD', 'INLINE_FRAGMENT'],
            args: [{
              defaultValue: null,
              name: 'if',
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                }
              }
            }]
          }, {
            name: 'skip',
            locations: ['FIELD', 'FRAGMENT_SPREAD', 'INLINE_FRAGMENT'],
            args: [{
              defaultValue: null,
              name: 'if',
              type: {
                kind: 'NON_NULL',
                name: null,
                ofType: {
                  kind: 'SCALAR',
                  name: 'Boolean',
                  ofType: null
                }
              }
            }]
          }, {
            name: 'deprecated',
            locations: ['FIELD_DEFINITION', 'ENUM_VALUE'],
            args: [{
              defaultValue: '"No longer supported"',
              name: 'reason',
              type: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              }
            }]
          }]
        }
      }
    });
  });
  (0, _mocha.it)('introspects on input object', function () {
    var TestInputObject = new _3.GraphQLInputObjectType({
      name: 'TestInputObject',
      fields: {
        a: {
          type: _3.GraphQLString,
          defaultValue: 'tes\t de\fault'
        },
        b: {
          type: (0, _3.GraphQLList)(_3.GraphQLString)
        },
        c: {
          type: _3.GraphQLString,
          defaultValue: null
        }
      }
    });
    var TestType = new _3.GraphQLObjectType({
      name: 'TestType',
      fields: {
        field: {
          type: _3.GraphQLString,
          args: {
            complex: {
              type: TestInputObject
            }
          },
          resolve: function resolve(_, _ref) {
            var complex = _ref.complex;
            return JSON.stringify(complex);
          }
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: TestType
    });
    var request = "\n      {\n        __type(name: \"TestInputObject\") {\n          kind\n          name\n          inputFields {\n            name\n            type { ...TypeRef }\n            defaultValue\n          }\n        }\n      }\n\n      fragment TypeRef on __Type {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n            }\n          }\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        __type: {
          kind: 'INPUT_OBJECT',
          name: 'TestInputObject',
          inputFields: [{
            name: 'a',
            type: {
              kind: 'SCALAR',
              name: 'String',
              ofType: null
            },
            defaultValue: '"tes\\t de\\fault"'
          }, {
            name: 'b',
            type: {
              kind: 'LIST',
              name: null,
              ofType: {
                kind: 'SCALAR',
                name: 'String',
                ofType: null
              }
            },
            defaultValue: null
          }, {
            name: 'c',
            type: {
              kind: 'SCALAR',
              name: 'String',
              ofType: null
            },
            defaultValue: 'null'
          }]
        }
      }
    });
  });
  (0, _mocha.it)('supports the __type root field', function () {
    var TestType = new _3.GraphQLObjectType({
      name: 'TestType',
      fields: {
        testField: {
          type: _3.GraphQLString
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: TestType
    });
    var request = "\n      {\n        __type(name: \"TestType\") {\n          name\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        __type: {
          name: 'TestType'
        }
      }
    });
  });
  (0, _mocha.it)('identifies deprecated fields', function () {
    var TestType = new _3.GraphQLObjectType({
      name: 'TestType',
      fields: {
        nonDeprecated: {
          type: _3.GraphQLString
        },
        deprecated: {
          type: _3.GraphQLString,
          deprecationReason: 'Removed in 1.0'
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: TestType
    });
    var request = "\n      {\n        __type(name: \"TestType\") {\n          name\n          fields(includeDeprecated: true) {\n            name\n            isDeprecated,\n            deprecationReason\n          }\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        __type: {
          name: 'TestType',
          fields: [{
            name: 'nonDeprecated',
            isDeprecated: false,
            deprecationReason: null
          }, {
            name: 'deprecated',
            isDeprecated: true,
            deprecationReason: 'Removed in 1.0'
          }]
        }
      }
    });
  });
  (0, _mocha.it)('respects the includeDeprecated parameter for fields', function () {
    var TestType = new _3.GraphQLObjectType({
      name: 'TestType',
      fields: {
        nonDeprecated: {
          type: _3.GraphQLString
        },
        deprecated: {
          type: _3.GraphQLString,
          deprecationReason: 'Removed in 1.0'
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: TestType
    });
    var request = "\n      {\n        __type(name: \"TestType\") {\n          name\n          trueFields: fields(includeDeprecated: true) {\n            name\n          }\n          falseFields: fields(includeDeprecated: false) {\n            name\n          }\n          omittedFields: fields {\n            name\n          }\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        __type: {
          name: 'TestType',
          trueFields: [{
            name: 'nonDeprecated'
          }, {
            name: 'deprecated'
          }],
          falseFields: [{
            name: 'nonDeprecated'
          }],
          omittedFields: [{
            name: 'nonDeprecated'
          }]
        }
      }
    });
  });
  (0, _mocha.it)('identifies deprecated enum values', function () {
    var TestEnum = new _3.GraphQLEnumType({
      name: 'TestEnum',
      values: {
        NONDEPRECATED: {
          value: 0
        },
        DEPRECATED: {
          value: 1,
          deprecationReason: 'Removed in 1.0'
        },
        ALSONONDEPRECATED: {
          value: 2
        }
      }
    });
    var TestType = new _3.GraphQLObjectType({
      name: 'TestType',
      fields: {
        testEnum: {
          type: TestEnum
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: TestType
    });
    var request = "\n      {\n        __type(name: \"TestEnum\") {\n          name\n          enumValues(includeDeprecated: true) {\n            name\n            isDeprecated,\n            deprecationReason\n          }\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        __type: {
          name: 'TestEnum',
          enumValues: [{
            name: 'NONDEPRECATED',
            isDeprecated: false,
            deprecationReason: null
          }, {
            name: 'DEPRECATED',
            isDeprecated: true,
            deprecationReason: 'Removed in 1.0'
          }, {
            name: 'ALSONONDEPRECATED',
            isDeprecated: false,
            deprecationReason: null
          }]
        }
      }
    });
  });
  (0, _mocha.it)('respects the includeDeprecated parameter for enum values', function () {
    var TestEnum = new _3.GraphQLEnumType({
      name: 'TestEnum',
      values: {
        NONDEPRECATED: {
          value: 0
        },
        DEPRECATED: {
          value: 1,
          deprecationReason: 'Removed in 1.0'
        },
        ALSONONDEPRECATED: {
          value: 2
        }
      }
    });
    var TestType = new _3.GraphQLObjectType({
      name: 'TestType',
      fields: {
        testEnum: {
          type: TestEnum
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: TestType
    });
    var request = "\n      {\n        __type(name: \"TestEnum\") {\n          name\n          trueValues: enumValues(includeDeprecated: true) {\n            name\n          }\n          falseValues: enumValues(includeDeprecated: false) {\n            name\n          }\n          omittedValues: enumValues {\n            name\n          }\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        __type: {
          name: 'TestEnum',
          trueValues: [{
            name: 'NONDEPRECATED'
          }, {
            name: 'DEPRECATED'
          }, {
            name: 'ALSONONDEPRECATED'
          }],
          falseValues: [{
            name: 'NONDEPRECATED'
          }, {
            name: 'ALSONONDEPRECATED'
          }],
          omittedValues: [{
            name: 'NONDEPRECATED'
          }, {
            name: 'ALSONONDEPRECATED'
          }]
        }
      }
    });
  });
  (0, _mocha.it)('fails as expected on the __type root field without an arg', function () {
    var TestType = new _3.GraphQLObjectType({
      name: 'TestType',
      fields: {
        testField: {
          type: _3.GraphQLString
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: TestType
    });
    var request = "\n      {\n        __type {\n          name\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      errors: [{
        message: (0, _ProvidedRequiredArguments.missingFieldArgMessage)('__type', 'name', 'String!'),
        locations: [{
          line: 3,
          column: 9
        }]
      }]
    });
  });
  (0, _mocha.it)('exposes descriptions on types and fields', function () {
    var QueryRoot = new _3.GraphQLObjectType({
      name: 'QueryRoot',
      fields: {
        onlyField: {
          type: _3.GraphQLString
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: QueryRoot
    });
    var request = "\n      {\n        schemaType: __type(name: \"__Schema\") {\n          name,\n          description,\n          fields {\n            name,\n            description\n          }\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        schemaType: {
          name: '__Schema',
          description: 'A GraphQL Schema defines the capabilities of a ' + 'GraphQL server. It exposes all available types and ' + 'directives on the server, as well as the entry ' + 'points for query, mutation, ' + 'and subscription operations.',
          fields: [{
            name: 'types',
            description: 'A list of all types supported by this server.'
          }, {
            name: 'queryType',
            description: 'The type that query operations will be rooted at.'
          }, {
            name: 'mutationType',
            description: 'If this server supports mutation, the type that ' + 'mutation operations will be rooted at.'
          }, {
            name: 'subscriptionType',
            description: 'If this server support subscription, the type ' + 'that subscription operations will be rooted at.'
          }, {
            name: 'directives',
            description: 'A list of all directives supported by this server.'
          }]
        }
      }
    });
  });
  (0, _mocha.it)('exposes descriptions on enums', function () {
    var QueryRoot = new _3.GraphQLObjectType({
      name: 'QueryRoot',
      fields: {
        onlyField: {
          type: _3.GraphQLString
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: QueryRoot
    });
    var request = "\n      {\n        typeKindType: __type(name: \"__TypeKind\") {\n          name,\n          description,\n          enumValues {\n            name,\n            description\n          }\n        }\n      }\n    ";
    (0, _chai.expect)((0, _3.graphqlSync)(schema, request)).to.deep.equal({
      data: {
        typeKindType: {
          name: '__TypeKind',
          description: 'An enum describing what kind of type a given `__Type` is.',
          enumValues: [{
            description: 'Indicates this type is a scalar.',
            name: 'SCALAR'
          }, {
            description: 'Indicates this type is an object. ' + '`fields` and `interfaces` are valid fields.',
            name: 'OBJECT'
          }, {
            description: 'Indicates this type is an interface. ' + '`fields` and `possibleTypes` are valid fields.',
            name: 'INTERFACE'
          }, {
            description: 'Indicates this type is a union. ' + '`possibleTypes` is a valid field.',
            name: 'UNION'
          }, {
            description: 'Indicates this type is an enum. ' + '`enumValues` is a valid field.',
            name: 'ENUM'
          }, {
            description: 'Indicates this type is an input object. ' + '`inputFields` is a valid field.',
            name: 'INPUT_OBJECT'
          }, {
            description: 'Indicates this type is a list. ' + '`ofType` is a valid field.',
            name: 'LIST'
          }, {
            description: 'Indicates this type is a non-null. ' + '`ofType` is a valid field.',
            name: 'NON_NULL'
          }]
        }
      }
    });
  });
  (0, _mocha.it)('executes an introspection query without calling global fieldResolver', function () {
    var QueryRoot = new _3.GraphQLObjectType({
      name: 'QueryRoot',
      fields: {
        onlyField: {
          type: _3.GraphQLString
        }
      }
    });
    var schema = new _3.GraphQLSchema({
      query: QueryRoot
    });
    var source = (0, _introspectionQuery.getIntrospectionQuery)();
    var calledForFields = {};
    /* istanbul ignore next */

    function fieldResolver(value, _1, _2, info) {
      calledForFields["".concat(info.parentType.name, "::").concat(info.fieldName)] = true;
      return value;
    }

    (0, _3.graphqlSync)({
      schema: schema,
      source: source,
      fieldResolver: fieldResolver
    });
    (0, _chai.expect)(calledForFields).to.deep.equal({});
  });
});