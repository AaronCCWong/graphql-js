/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { PossibleFragmentSpreads, typeIncompatibleSpreadMessage, typeIncompatibleAnonSpreadMessage } from '../rules/PossibleFragmentSpreads';

function error(fragName, parentType, fragType, line, column) {
  return {
    message: typeIncompatibleSpreadMessage(fragName, parentType, fragType),
    locations: [{
      line: line,
      column: column
    }]
  };
}

function errorAnon(parentType, fragType, line, column) {
  return {
    message: typeIncompatibleAnonSpreadMessage(parentType, fragType),
    locations: [{
      line: line,
      column: column
    }]
  };
}

describe('Validate: Possible fragment spreads', function () {
  it('of the same object', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment objectWithinObject on Dog { ...dogFragment }\n      fragment dogFragment on Dog { barkVolume }\n    ");
  });
  it('of the same object with inline fragment', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment objectWithinObjectAnon on Dog { ... on Dog { barkVolume } }\n    ");
  });
  it('object into an implemented interface', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment objectWithinInterface on Pet { ...dogFragment }\n      fragment dogFragment on Dog { barkVolume }\n    ");
  });
  it('object into containing union', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment objectWithinUnion on CatOrDog { ...dogFragment }\n      fragment dogFragment on Dog { barkVolume }\n    ");
  });
  it('union into contained object', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment unionWithinObject on Dog { ...catOrDogFragment }\n      fragment catOrDogFragment on CatOrDog { __typename }\n    ");
  });
  it('union into overlapping interface', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment unionWithinInterface on Pet { ...catOrDogFragment }\n      fragment catOrDogFragment on CatOrDog { __typename }\n    ");
  });
  it('union into overlapping union', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment unionWithinUnion on DogOrHuman { ...catOrDogFragment }\n      fragment catOrDogFragment on CatOrDog { __typename }\n    ");
  });
  it('interface into implemented object', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment interfaceWithinObject on Dog { ...petFragment }\n      fragment petFragment on Pet { name }\n    ");
  });
  it('interface into overlapping interface', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment interfaceWithinInterface on Pet { ...beingFragment }\n      fragment beingFragment on Being { name }\n    ");
  });
  it('interface into overlapping interface in inline fragment', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment interfaceWithinInterface on Pet { ... on Being { name } }\n    ");
  });
  it('interface into overlapping union', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment interfaceWithinUnion on CatOrDog { ...petFragment }\n      fragment petFragment on Pet { name }\n    ");
  });
  it('ignores incorrect type (caught by FragmentsOnCompositeTypes)', function () {
    expectPassesRule(PossibleFragmentSpreads, "\n      fragment petFragment on Pet { ...badInADifferentWay }\n      fragment badInADifferentWay on String { name }\n    ");
  });
  it('different object into object', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidObjectWithinObject on Cat { ...dogFragment }\n      fragment dogFragment on Dog { barkVolume }\n    ", [error('dogFragment', 'Cat', 'Dog', 2, 51)]);
  });
  it('different object into object in inline fragment', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidObjectWithinObjectAnon on Cat {\n        ... on Dog { barkVolume }\n      }\n    ", [errorAnon('Cat', 'Dog', 3, 9)]);
  });
  it('object into not implementing interface', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidObjectWithinInterface on Pet { ...humanFragment }\n      fragment humanFragment on Human { pets { name } }\n    ", [error('humanFragment', 'Pet', 'Human', 2, 54)]);
  });
  it('object into not containing union', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidObjectWithinUnion on CatOrDog { ...humanFragment }\n      fragment humanFragment on Human { pets { name } }\n    ", [error('humanFragment', 'CatOrDog', 'Human', 2, 55)]);
  });
  it('union into not contained object', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidUnionWithinObject on Human { ...catOrDogFragment }\n      fragment catOrDogFragment on CatOrDog { __typename }\n    ", [error('catOrDogFragment', 'Human', 'CatOrDog', 2, 52)]);
  });
  it('union into non overlapping interface', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidUnionWithinInterface on Pet { ...humanOrAlienFragment }\n      fragment humanOrAlienFragment on HumanOrAlien { __typename }\n    ", [error('humanOrAlienFragment', 'Pet', 'HumanOrAlien', 2, 53)]);
  });
  it('union into non overlapping union', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidUnionWithinUnion on CatOrDog { ...humanOrAlienFragment }\n      fragment humanOrAlienFragment on HumanOrAlien { __typename }\n    ", [error('humanOrAlienFragment', 'CatOrDog', 'HumanOrAlien', 2, 54)]);
  });
  it('interface into non implementing object', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidInterfaceWithinObject on Cat { ...intelligentFragment }\n      fragment intelligentFragment on Intelligent { iq }\n    ", [error('intelligentFragment', 'Cat', 'Intelligent', 2, 54)]);
  });
  it('interface into non overlapping interface', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidInterfaceWithinInterface on Pet {\n        ...intelligentFragment\n      }\n      fragment intelligentFragment on Intelligent { iq }\n    ", [error('intelligentFragment', 'Pet', 'Intelligent', 3, 9)]);
  });
  it('interface into non overlapping interface in inline fragment', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidInterfaceWithinInterfaceAnon on Pet {\n        ...on Intelligent { iq }\n      }\n    ", [errorAnon('Pet', 'Intelligent', 3, 9)]);
  });
  it('interface into non overlapping union', function () {
    expectFailsRule(PossibleFragmentSpreads, "\n      fragment invalidInterfaceWithinUnion on HumanOrAlien { ...petFragment }\n      fragment petFragment on Pet { name }\n    ", [error('petFragment', 'HumanOrAlien', 'Pet', 2, 62)]);
  });
});