"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _starWarsSchema = require("./starWarsSchema.js");

var _graphql = require("../graphql");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 */
(0, _mocha.describe)('Star Wars Introspection Tests', function () {
  (0, _mocha.describe)('Basic Introspection', function () {
    (0, _mocha.it)('Allows querying the schema for types', function () {
      var query = "\n        query IntrospectionTypeQuery {\n          __schema {\n            types {\n              name\n            }\n          }\n        }\n      ";
      var expected = {
        __schema: {
          types: [{
            name: 'Query'
          }, {
            name: 'Episode'
          }, {
            name: 'Character'
          }, {
            name: 'String'
          }, {
            name: 'Human'
          }, {
            name: 'Droid'
          }, {
            name: '__Schema'
          }, {
            name: '__Type'
          }, {
            name: '__TypeKind'
          }, {
            name: 'Boolean'
          }, {
            name: '__Field'
          }, {
            name: '__InputValue'
          }, {
            name: '__EnumValue'
          }, {
            name: '__Directive'
          }, {
            name: '__DirectiveLocation'
          }]
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for query type', function () {
      var query = "\n        query IntrospectionQueryTypeQuery {\n          __schema {\n            queryType {\n              name\n            }\n          }\n        }\n      ";
      var expected = {
        __schema: {
          queryType: {
            name: 'Query'
          }
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for a specific type', function () {
      var query = "\n        query IntrospectionDroidTypeQuery {\n          __type(name: \"Droid\") {\n            name\n          }\n        }\n      ";
      var expected = {
        __type: {
          name: 'Droid'
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for an object kind', function () {
      var query = "\n        query IntrospectionDroidKindQuery {\n          __type(name: \"Droid\") {\n            name\n            kind\n          }\n        }\n      ";
      var expected = {
        __type: {
          name: 'Droid',
          kind: 'OBJECT'
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for an interface kind', function () {
      var query = "\n        query IntrospectionCharacterKindQuery {\n          __type(name: \"Character\") {\n            name\n            kind\n          }\n        }\n      ";
      var expected = {
        __type: {
          name: 'Character',
          kind: 'INTERFACE'
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for object fields', function () {
      var query = "\n        query IntrospectionDroidFieldsQuery {\n          __type(name: \"Droid\") {\n            name\n            fields {\n              name\n              type {\n                name\n                kind\n              }\n            }\n          }\n        }\n      ";
      var expected = {
        __type: {
          name: 'Droid',
          fields: [{
            name: 'id',
            type: {
              name: null,
              kind: 'NON_NULL'
            }
          }, {
            name: 'name',
            type: {
              name: 'String',
              kind: 'SCALAR'
            }
          }, {
            name: 'friends',
            type: {
              name: null,
              kind: 'LIST'
            }
          }, {
            name: 'appearsIn',
            type: {
              name: null,
              kind: 'LIST'
            }
          }, {
            name: 'secretBackstory',
            type: {
              name: 'String',
              kind: 'SCALAR'
            }
          }, {
            name: 'primaryFunction',
            type: {
              name: 'String',
              kind: 'SCALAR'
            }
          }]
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for nested object fields', function () {
      var query = "\n        query IntrospectionDroidNestedFieldsQuery {\n          __type(name: \"Droid\") {\n            name\n            fields {\n              name\n              type {\n                name\n                kind\n                ofType {\n                  name\n                  kind\n                }\n              }\n            }\n          }\n        }\n      ";
      var expected = {
        __type: {
          name: 'Droid',
          fields: [{
            name: 'id',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: {
                name: 'String',
                kind: 'SCALAR'
              }
            }
          }, {
            name: 'name',
            type: {
              name: 'String',
              kind: 'SCALAR',
              ofType: null
            }
          }, {
            name: 'friends',
            type: {
              name: null,
              kind: 'LIST',
              ofType: {
                name: 'Character',
                kind: 'INTERFACE'
              }
            }
          }, {
            name: 'appearsIn',
            type: {
              name: null,
              kind: 'LIST',
              ofType: {
                name: 'Episode',
                kind: 'ENUM'
              }
            }
          }, {
            name: 'secretBackstory',
            type: {
              name: 'String',
              kind: 'SCALAR',
              ofType: null
            }
          }, {
            name: 'primaryFunction',
            type: {
              name: 'String',
              kind: 'SCALAR',
              ofType: null
            }
          }]
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for field args', function () {
      var query = "\n        query IntrospectionQueryTypeQuery {\n          __schema {\n            queryType {\n              fields {\n                name\n                args {\n                  name\n                  description\n                  type {\n                    name\n                    kind\n                    ofType {\n                      name\n                      kind\n                    }\n                  }\n                  defaultValue\n                }\n              }\n            }\n          }\n        }\n      ";
      var expected = {
        __schema: {
          queryType: {
            fields: [{
              name: 'hero',
              args: [{
                defaultValue: null,
                description: 'If omitted, returns the hero of the whole ' + 'saga. If provided, returns the hero of ' + 'that particular episode.',
                name: 'episode',
                type: {
                  kind: 'ENUM',
                  name: 'Episode',
                  ofType: null
                }
              }]
            }, {
              name: 'human',
              args: [{
                name: 'id',
                description: 'id of the human',
                type: {
                  kind: 'NON_NULL',
                  name: null,
                  ofType: {
                    kind: 'SCALAR',
                    name: 'String'
                  }
                },
                defaultValue: null
              }]
            }, {
              name: 'droid',
              args: [{
                name: 'id',
                description: 'id of the droid',
                type: {
                  kind: 'NON_NULL',
                  name: null,
                  ofType: {
                    kind: 'SCALAR',
                    name: 'String'
                  }
                },
                defaultValue: null
              }]
            }]
          }
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
    (0, _mocha.it)('Allows querying the schema for documentation', function () {
      var query = "\n        query IntrospectionDroidDescriptionQuery {\n          __type(name: \"Droid\") {\n            name\n            description\n          }\n        }\n      ";
      var expected = {
        __type: {
          name: 'Droid',
          description: 'A mechanical creature in the Star Wars universe.'
        }
      };
      var result = (0, _graphql.graphqlSync)(_starWarsSchema.StarWarsSchema, query);
      (0, _chai.expect)(result).to.deep.equal({
        data: expected
      });
    });
  });
});