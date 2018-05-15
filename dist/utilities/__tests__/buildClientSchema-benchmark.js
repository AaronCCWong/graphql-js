"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.measure = measure;
exports.name = void 0;

var _path = require("path");

var _fs = require("fs");

var _buildClientSchema = require("../buildClientSchema");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var schemaJSON = JSON.parse((0, _fs.readFileSync)((0, _path.join)(__dirname, 'github-schema.json'), 'utf8'));
var name = 'Build Schema from Introspection';
exports.name = name;

function measure() {
  (0, _buildClientSchema.buildClientSchema)(schemaJSON.data);
}