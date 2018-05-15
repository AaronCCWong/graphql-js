"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _LoneAnonymousOperation = require("../rules/LoneAnonymousOperation");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function anonNotAlone(line, column) {
  return {
    message: (0, _LoneAnonymousOperation.anonOperationNotAloneMessage)(),
    locations: [{
      line: line,
      column: column
    }]
  };
}

(0, _mocha.describe)('Validate: Anonymous operation must be alone', function () {
  (0, _mocha.it)('no operations', function () {
    (0, _harness.expectPassesRule)(_LoneAnonymousOperation.LoneAnonymousOperation, "\n      fragment fragA on Type {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('one anon operation', function () {
    (0, _harness.expectPassesRule)(_LoneAnonymousOperation.LoneAnonymousOperation, "\n      {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('multiple named operations', function () {
    (0, _harness.expectPassesRule)(_LoneAnonymousOperation.LoneAnonymousOperation, "\n      query Foo {\n        field\n      }\n\n      query Bar {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('anon operation with fragment', function () {
    (0, _harness.expectPassesRule)(_LoneAnonymousOperation.LoneAnonymousOperation, "\n      {\n        ...Foo\n      }\n      fragment Foo on Type {\n        field\n      }\n    ");
  });
  (0, _mocha.it)('multiple anon operations', function () {
    (0, _harness.expectFailsRule)(_LoneAnonymousOperation.LoneAnonymousOperation, "\n      {\n        fieldA\n      }\n      {\n        fieldB\n      }\n    ", [anonNotAlone(2, 7), anonNotAlone(5, 7)]);
  });
  (0, _mocha.it)('anon operation with a mutation', function () {
    (0, _harness.expectFailsRule)(_LoneAnonymousOperation.LoneAnonymousOperation, "\n      {\n        fieldA\n      }\n      mutation Foo {\n        fieldB\n      }\n    ", [anonNotAlone(2, 7)]);
  });
  (0, _mocha.it)('anon operation with a subscription', function () {
    (0, _harness.expectFailsRule)(_LoneAnonymousOperation.LoneAnonymousOperation, "\n      {\n        fieldA\n      }\n      subscription Foo {\n        fieldB\n      }\n    ", [anonNotAlone(2, 7)]);
  });
});