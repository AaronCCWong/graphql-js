/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StarWarsSchema } from './starWarsSchema.js';
import { Source } from '../language/source';
import { parse } from '../language/parser';
import { validate } from '../validation/validate';
/**
 * Helper function to test a query and the expected response.
 */

function validationErrors(query) {
  var source = new Source(query, 'StarWars.graphql');
  var ast = parse(source);
  return validate(StarWarsSchema, ast);
}

describe('Star Wars Validation Tests', function () {
  describe('Basic Queries', function () {
    it('Validates a complex but valid query', function () {
      var query = "\n        query NestedQueryWithFragment {\n          hero {\n            ...NameAndAppearances\n            friends {\n              ...NameAndAppearances\n              friends {\n                ...NameAndAppearances\n              }\n            }\n          }\n        }\n\n        fragment NameAndAppearances on Character {\n          name\n          appearsIn\n        }\n      ";
      return expect(validationErrors(query)).to.be.empty;
    });
    it('Notes that non-existent fields are invalid', function () {
      var query = "\n        query HeroSpaceshipQuery {\n          hero {\n            favoriteSpaceship\n          }\n        }\n      ";
      return expect(validationErrors(query)).to.not.be.empty;
    });
    it('Requires fields on objects', function () {
      var query = "\n        query HeroNoFieldsQuery {\n          hero\n        }\n      ";
      return expect(validationErrors(query)).to.not.be.empty;
    });
    it('Disallows fields on scalars', function () {
      var query = "\n        query HeroFieldsOnScalarQuery {\n          hero {\n            name {\n              firstCharacterOfName\n            }\n          }\n        }\n      ";
      return expect(validationErrors(query)).to.not.be.empty;
    });
    it('Disallows object fields on interfaces', function () {
      var query = "\n        query DroidFieldOnCharacter {\n          hero {\n            name\n            primaryFunction\n          }\n        }\n      ";
      return expect(validationErrors(query)).to.not.be.empty;
    });
    it('Allows object fields in fragments', function () {
      var query = "\n        query DroidFieldInFragment {\n          hero {\n            name\n            ...DroidFields\n          }\n        }\n\n        fragment DroidFields on Droid {\n          primaryFunction\n        }\n      ";
      return expect(validationErrors(query)).to.be.empty;
    });
    it('Allows object fields in inline fragments', function () {
      var query = "\n        query DroidFieldInFragment {\n          hero {\n            name\n            ... on Droid {\n              primaryFunction\n            }\n          }\n        }\n      ";
      return expect(validationErrors(query)).to.be.empty;
    });
  });
});