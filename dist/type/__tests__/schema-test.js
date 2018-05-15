"use strict";

var _ = require("../");

var _mocha = require("mocha");

var _chai = require("chai");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var InterfaceType = new _.GraphQLInterfaceType({
  name: 'Interface',
  fields: {
    fieldName: {
      type: _.GraphQLString
    }
  }
});
var DirectiveInputType = new _.GraphQLInputObjectType({
  name: 'DirInput',
  fields: {
    field: {
      type: _.GraphQLString
    }
  }
});
var WrappedDirectiveInputType = new _.GraphQLInputObjectType({
  name: 'WrappedDirInput',
  fields: {
    field: {
      type: _.GraphQLString
    }
  }
});
var Directive = new _.GraphQLDirective({
  name: 'dir',
  locations: ['OBJECT'],
  args: {
    arg: {
      type: DirectiveInputType
    },
    argList: {
      type: new _.GraphQLList(WrappedDirectiveInputType)
    }
  }
});
var Schema = new _.GraphQLSchema({
  query: new _.GraphQLObjectType({
    name: 'Query',
    fields: {
      getObject: {
        type: InterfaceType,
        resolve: function resolve() {
          return {};
        }
      }
    }
  }),
  directives: [Directive]
});
(0, _mocha.describe)('Type System: Schema', function () {
  (0, _mocha.describe)('Type Map', function () {
    (0, _mocha.it)('includes input types only used in directives', function () {
      (0, _chai.expect)(Schema.getTypeMap()).to.include.key('DirInput');
      (0, _chai.expect)(Schema.getTypeMap()).to.include.key('WrappedDirInput');
    });
  });
  (0, _mocha.describe)('Validity', function () {
    (0, _mocha.describe)('when not assumed valid', function () {
      (0, _mocha.it)('configures the schema to still needing validation', function () {
        (0, _chai.expect)(new _.GraphQLSchema({
          assumeValid: false
        }).__validationErrors).to.equal(undefined);
      });
      (0, _mocha.it)('configures the schema for allowed legacy names', function () {
        (0, _chai.expect)(new _.GraphQLSchema({
          allowedLegacyNames: ['__badName']
        }).__allowedLegacyNames).to.deep.equal(['__badName']);
      });
      (0, _mocha.it)('checks the configuration for mistakes', function () {
        (0, _chai.expect)(function () {
          return new _.GraphQLSchema(function () {
            return null;
          });
        }).to.throw();
        (0, _chai.expect)(function () {
          return new _.GraphQLSchema({
            types: {}
          });
        }).to.throw();
        (0, _chai.expect)(function () {
          return new _.GraphQLSchema({
            directives: {}
          });
        }).to.throw();
        (0, _chai.expect)(function () {
          return new _.GraphQLSchema({
            allowedLegacyNames: {}
          });
        }).to.throw();
      });
    });
    (0, _mocha.describe)('when assumed valid', function () {
      (0, _mocha.it)('configures the schema to have no errors', function () {
        (0, _chai.expect)(new _.GraphQLSchema({
          assumeValid: true
        }).__validationErrors).to.deep.equal([]);
      });
      (0, _mocha.it)('still configures the schema for allowed legacy names', function () {
        (0, _chai.expect)(new _.GraphQLSchema({
          assumeValid: true,
          allowedLegacyNames: ['__badName']
        }).__allowedLegacyNames).to.deep.equal(['__badName']);
      });
      (0, _mocha.it)('does not check the configuration for mistakes', function () {
        (0, _chai.expect)(function () {
          var config = function config() {
            return null;
          };

          config.assumeValid = true;
          return new _.GraphQLSchema(config);
        }).to.not.throw();
        (0, _chai.expect)(function () {
          return new _.GraphQLSchema({
            assumeValid: true,
            types: {},
            directives: {
              reduce: function reduce() {
                return [];
              }
            },
            allowedLegacyNames: {}
          });
        }).to.not.throw();
      });
    });
  });
});