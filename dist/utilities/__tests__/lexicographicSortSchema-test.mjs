var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      input Bar {\n        barB: String\n        barA: String\n        barC: String\n      }\n\n      interface FooInterface {\n        fooB: String\n        fooA: String\n        fooC: String\n      }\n\n      type FooType implements FooInterface {\n        fooC: String\n        fooA: String\n        fooB: String\n      }\n\n      type Query {\n        dummy(arg: Bar): FooType\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      input Bar {\n        barA: String\n        barB: String\n        barC: String\n      }\n\n      interface FooInterface {\n        fooA: String\n        fooB: String\n        fooC: String\n      }\n\n      type FooType implements FooInterface {\n        fooA: String\n        fooB: String\n        fooC: String\n      }\n\n      type Query {\n        dummy(arg: Bar): FooType\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      interface FooA {\n        dummy: String\n      }\n\n      interface FooB {\n        dummy: String\n      }\n\n      interface FooC {\n        dummy: String\n      }\n\n      type Query implements FooB & FooA & FooC {\n        dummy: String\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      interface FooA {\n        dummy: String\n      }\n\n      interface FooB {\n        dummy: String\n      }\n\n      interface FooC {\n        dummy: String\n      }\n\n      type Query implements FooA & FooB & FooC {\n        dummy: String\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type FooA {\n        dummy: String\n      }\n\n      type FooB {\n        dummy: String\n      }\n\n      type FooC {\n        dummy: String\n      }\n\n      union FooUnion = FooB | FooA | FooC\n\n      type Query {\n        dummy: FooUnion\n      }\n    "]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type FooA {\n        dummy: String\n      }\n\n      type FooB {\n        dummy: String\n      }\n\n      type FooC {\n        dummy: String\n      }\n\n      union FooUnion = FooA | FooB | FooC\n\n      type Query {\n        dummy: FooUnion\n      }\n    "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      enum Foo {\n        B\n        C\n        A\n      }\n\n      type Query {\n        dummy: Foo\n      }\n    "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      enum Foo {\n        A\n        B\n        C\n      }\n\n      type Query {\n        dummy: Foo\n      }\n    "]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        dummy(argB: Int, argA: String, argC: Float): ID\n      }\n    "]),
    _templateObject10 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        dummy(argA: String, argB: Int, argC: Float): ID\n      }\n    "]),
    _templateObject11 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        dummy(arg1: FooF, arg2: FooA, arg3: FooG): FooD\n      }\n\n      type FooC implements FooE {\n        dummy: String\n      }\n\n      enum FooG {\n        enumValue\n      }\n\n      scalar FooA\n\n      input FooF {\n        dummy: String\n      }\n\n      union FooD = FooC | FooB\n\n      interface FooE {\n        dummy: String\n      }\n\n      type FooB {\n        dummy: String\n      }\n    "]),
    _templateObject12 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      scalar FooA\n\n      type FooB {\n        dummy: String\n      }\n\n      type FooC implements FooE {\n        dummy: String\n      }\n\n      union FooD = FooB | FooC\n\n      interface FooE {\n        dummy: String\n      }\n\n      input FooF {\n        dummy: String\n      }\n\n      enum FooG {\n        enumValue\n      }\n\n      type Query {\n        dummy(arg1: FooF, arg2: FooA, arg3: FooG): FooD\n      }\n    "]),
    _templateObject13 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @test(argC: Float, argA: String, argB: Int) on FIELD\n\n      type Query {\n        dummy: String\n      }\n    "]),
    _templateObject14 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @test(argA: String, argB: Int, argC: Float) on FIELD\n\n      type Query {\n        dummy: String\n      }\n    "]),
    _templateObject15 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @test(argC: Float, argA: String, argB: Int) on UNION | FIELD | ENUM\n\n      type Query {\n        dummy: String\n      }\n    "]),
    _templateObject16 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @test(argA: String, argB: Int, argC: Float) on ENUM | FIELD | UNION\n\n      type Query {\n        dummy: String\n      }\n    "]),
    _templateObject17 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @fooC on FIELD\n\n      directive @fooB on UNION\n\n      directive @fooA on ENUM\n\n      type Query {\n        dummy: String\n      }\n    "]),
    _templateObject18 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @fooA on ENUM\n\n      directive @fooB on UNION\n\n      directive @fooC on FIELD\n\n      type Query {\n        dummy: String\n      }\n    "]),
    _templateObject19 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      interface FooC {\n        fooB: FooB\n        fooA: FooA\n        fooC: FooC\n      }\n\n      type FooB implements FooC {\n        fooB: FooB\n        fooA: FooA\n      }\n\n      type FooA implements FooC {\n        fooB: FooB\n        fooA: FooA\n      }\n\n      type Query {\n        fooC: FooC\n        fooB: FooB\n        fooA: FooA\n      }\n    "]),
    _templateObject20 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type FooA implements FooC {\n        fooA: FooA\n        fooB: FooB\n      }\n\n      type FooB implements FooC {\n        fooA: FooA\n        fooB: FooB\n      }\n\n      interface FooC {\n        fooA: FooA\n        fooB: FooB\n        fooC: FooC\n      }\n\n      type Query {\n        fooA: FooA\n        fooB: FooB\n        fooC: FooC\n      }\n    "]);

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import dedent from '../../jsutils/dedent';
import { printSchema } from '../schemaPrinter';
import { buildSchema } from '../buildASTSchema';
import { lexicographicSortSchema } from '../lexicographicSortSchema';

function sortSDL(sdl) {
  var schema = buildSchema(sdl);
  return printSchema(lexicographicSortSchema(schema));
}

describe('lexicographicSortSchema', function () {
  it('sort fields', function () {
    var sorted = sortSDL(dedent(_templateObject));
    expect(sorted).to.equal(dedent(_templateObject2));
  });
  it('sort implemented interfaces', function () {
    var sorted = sortSDL(dedent(_templateObject3));
    expect(sorted).to.equal(dedent(_templateObject4));
  });
  it('sort types in union', function () {
    var sorted = sortSDL(dedent(_templateObject5));
    expect(sorted).to.equal(dedent(_templateObject6));
  });
  it('sort enum values', function () {
    var sorted = sortSDL(dedent(_templateObject7));
    expect(sorted).to.equal(dedent(_templateObject8));
  });
  it('sort field arguments', function () {
    var sorted = sortSDL(dedent(_templateObject9));
    expect(sorted).to.equal(dedent(_templateObject10));
  });
  it('sort types', function () {
    var sorted = sortSDL(dedent(_templateObject11));
    expect(sorted).to.equal(dedent(_templateObject12));
  });
  it('sort directive arguments', function () {
    var sorted = sortSDL(dedent(_templateObject13));
    expect(sorted).to.equal(dedent(_templateObject14));
  });
  it('sort directive locations', function () {
    var sorted = sortSDL(dedent(_templateObject15));
    expect(sorted).to.equal(dedent(_templateObject16));
  });
  it('sort directives', function () {
    var sorted = sortSDL(dedent(_templateObject17));
    expect(sorted).to.equal(dedent(_templateObject18));
  });
  it('sort recursive types', function () {
    var sorted = sortSDL(dedent(_templateObject19));
    expect(sorted).to.equal(dedent(_templateObject20));
  });
});