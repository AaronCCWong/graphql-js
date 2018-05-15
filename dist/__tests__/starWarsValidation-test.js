"use strict";

var _chai = require("chai");

var _mocha = require("mocha");

var _starWarsSchema = require("./starWarsSchema.js");

var _source = require("../language/source");

var _parser = require("../language/parser");

var _validate = require("../validation/validate");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 */

/**
 * Helper function to test a query and the expected response.
 */
function validationErrors(query) {
  var source = new _source.Source(query, 'StarWars.graphql');
  var ast = (0, _parser.parse)(source);
  return (0, _validate.validate)(_starWarsSchema.StarWarsSchema, ast);
}

(0, _mocha.describe)('Star Wars Validation Tests', function () {
  (0, _mocha.describe)('Basic Queries', function () {
    (0, _mocha.it)('Validates a complex but valid query', function () {
      var query = "\n        query NestedQueryWithFragment {\n          hero {\n            ...NameAndAppearances\n            friends {\n              ...NameAndAppearances\n              friends {\n                ...NameAndAppearances\n              }\n            }\n          }\n        }\n\n        fragment NameAndAppearances on Character {\n          name\n          appearsIn\n        }\n      ";
      return (0, _chai.expect)(validationErrors(query)).to.be.empty;
    });
    (0, _mocha.it)('Notes that non-existent fields are invalid', function () {
      var query = "\n        query HeroSpaceshipQuery {\n          hero {\n            favoriteSpaceship\n          }\n        }\n      ";
      return (0, _chai.expect)(validationErrors(query)).to.not.be.empty;
    });
    (0, _mocha.it)('Requires fields on objects', function () {
      var query = "\n        query HeroNoFieldsQuery {\n          hero\n        }\n      ";
      return (0, _chai.expect)(validationErrors(query)).to.not.be.empty;
    });
    (0, _mocha.it)('Disallows fields on scalars', function () {
      var query = "\n        query HeroFieldsOnScalarQuery {\n          hero {\n            name {\n              firstCharacterOfName\n            }\n          }\n        }\n      ";
      return (0, _chai.expect)(validationErrors(query)).to.not.be.empty;
    });
    (0, _mocha.it)('Disallows object fields on interfaces', function () {
      var query = "\n        query DroidFieldOnCharacter {\n          hero {\n            name\n            primaryFunction\n          }\n        }\n      ";
      return (0, _chai.expect)(validationErrors(query)).to.not.be.empty;
    });
    (0, _mocha.it)('Allows object fields in fragments', function () {
      var query = "\n        query DroidFieldInFragment {\n          hero {\n            name\n            ...DroidFields\n          }\n        }\n\n        fragment DroidFields on Droid {\n          primaryFunction\n        }\n      ";
      return (0, _chai.expect)(validationErrors(query)).to.be.empty;
    });
    (0, _mocha.it)('Allows object fields in inline fragments', function () {
      var query = "\n        query DroidFieldInFragment {\n          hero {\n            name\n            ... on Droid {\n              primaryFunction\n            }\n          }\n        }\n      ";
      return (0, _chai.expect)(validationErrors(query)).to.be.empty;
    });
  });
});