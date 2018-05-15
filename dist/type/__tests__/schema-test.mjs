/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { GraphQLSchema, GraphQLInterfaceType, GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLDirective, GraphQLList } from '../';
import { describe, it } from 'mocha';
import { expect } from 'chai';
var InterfaceType = new GraphQLInterfaceType({
  name: 'Interface',
  fields: {
    fieldName: {
      type: GraphQLString
    }
  }
});
var DirectiveInputType = new GraphQLInputObjectType({
  name: 'DirInput',
  fields: {
    field: {
      type: GraphQLString
    }
  }
});
var WrappedDirectiveInputType = new GraphQLInputObjectType({
  name: 'WrappedDirInput',
  fields: {
    field: {
      type: GraphQLString
    }
  }
});
var Directive = new GraphQLDirective({
  name: 'dir',
  locations: ['OBJECT'],
  args: {
    arg: {
      type: DirectiveInputType
    },
    argList: {
      type: new GraphQLList(WrappedDirectiveInputType)
    }
  }
});
var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
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
describe('Type System: Schema', function () {
  describe('Type Map', function () {
    it('includes input types only used in directives', function () {
      expect(Schema.getTypeMap()).to.include.key('DirInput');
      expect(Schema.getTypeMap()).to.include.key('WrappedDirInput');
    });
  });
  describe('Validity', function () {
    describe('when not assumed valid', function () {
      it('configures the schema to still needing validation', function () {
        expect(new GraphQLSchema({
          assumeValid: false
        }).__validationErrors).to.equal(undefined);
      });
      it('configures the schema for allowed legacy names', function () {
        expect(new GraphQLSchema({
          allowedLegacyNames: ['__badName']
        }).__allowedLegacyNames).to.deep.equal(['__badName']);
      });
      it('checks the configuration for mistakes', function () {
        expect(function () {
          return new GraphQLSchema(function () {
            return null;
          });
        }).to.throw();
        expect(function () {
          return new GraphQLSchema({
            types: {}
          });
        }).to.throw();
        expect(function () {
          return new GraphQLSchema({
            directives: {}
          });
        }).to.throw();
        expect(function () {
          return new GraphQLSchema({
            allowedLegacyNames: {}
          });
        }).to.throw();
      });
    });
    describe('when assumed valid', function () {
      it('configures the schema to have no errors', function () {
        expect(new GraphQLSchema({
          assumeValid: true
        }).__validationErrors).to.deep.equal([]);
      });
      it('still configures the schema for allowed legacy names', function () {
        expect(new GraphQLSchema({
          assumeValid: true,
          allowedLegacyNames: ['__badName']
        }).__allowedLegacyNames).to.deep.equal(['__badName']);
      });
      it('does not check the configuration for mistakes', function () {
        expect(function () {
          var config = function config() {
            return null;
          };

          config.assumeValid = true;
          return new GraphQLSchema(config);
        }).to.not.throw();
        expect(function () {
          return new GraphQLSchema({
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