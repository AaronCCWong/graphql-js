"use strict";

var _mocha = require("mocha");

var _harness = require("./harness");

var _SingleFieldSubscriptions = require("../rules/SingleFieldSubscriptions");

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(0, _mocha.describe)('Validate: Subscriptions with single field', function () {
  (0, _mocha.it)('valid subscription', function () {
    (0, _harness.expectPassesRule)(_SingleFieldSubscriptions.SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n      }\n    ");
  });
  (0, _mocha.it)('fails with more than one root field', function () {
    (0, _harness.expectFailsRule)(_SingleFieldSubscriptions.SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n        notImportantEmails\n      }\n    ", [{
      message: (0, _SingleFieldSubscriptions.singleFieldOnlyMessage)('ImportantEmails'),
      locations: [{
        line: 4,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('fails with more than one root field including introspection', function () {
    (0, _harness.expectFailsRule)(_SingleFieldSubscriptions.SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n        __typename\n      }\n    ", [{
      message: (0, _SingleFieldSubscriptions.singleFieldOnlyMessage)('ImportantEmails'),
      locations: [{
        line: 4,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('fails with many more than one root field', function () {
    (0, _harness.expectFailsRule)(_SingleFieldSubscriptions.SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n        notImportantEmails\n        spamEmails\n      }\n    ", [{
      message: (0, _SingleFieldSubscriptions.singleFieldOnlyMessage)('ImportantEmails'),
      locations: [{
        line: 4,
        column: 9
      }, {
        line: 5,
        column: 9
      }]
    }]);
  });
  (0, _mocha.it)('fails with more than one root field in anonymous subscriptions', function () {
    (0, _harness.expectFailsRule)(_SingleFieldSubscriptions.SingleFieldSubscriptions, "\n      subscription {\n        importantEmails\n        notImportantEmails\n      }\n    ", [{
      message: (0, _SingleFieldSubscriptions.singleFieldOnlyMessage)(null),
      locations: [{
        line: 4,
        column: 9
      }]
    }]);
  });
});