/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'mocha';
import { expectPassesRule, expectFailsRule } from './harness';
import { SingleFieldSubscriptions, singleFieldOnlyMessage } from '../rules/SingleFieldSubscriptions';
describe('Validate: Subscriptions with single field', function () {
  it('valid subscription', function () {
    expectPassesRule(SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n      }\n    ");
  });
  it('fails with more than one root field', function () {
    expectFailsRule(SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n        notImportantEmails\n      }\n    ", [{
      message: singleFieldOnlyMessage('ImportantEmails'),
      locations: [{
        line: 4,
        column: 9
      }]
    }]);
  });
  it('fails with more than one root field including introspection', function () {
    expectFailsRule(SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n        __typename\n      }\n    ", [{
      message: singleFieldOnlyMessage('ImportantEmails'),
      locations: [{
        line: 4,
        column: 9
      }]
    }]);
  });
  it('fails with many more than one root field', function () {
    expectFailsRule(SingleFieldSubscriptions, "\n      subscription ImportantEmails {\n        importantEmails\n        notImportantEmails\n        spamEmails\n      }\n    ", [{
      message: singleFieldOnlyMessage('ImportantEmails'),
      locations: [{
        line: 4,
        column: 9
      }, {
        line: 5,
        column: 9
      }]
    }]);
  });
  it('fails with more than one root field in anonymous subscriptions', function () {
    expectFailsRule(SingleFieldSubscriptions, "\n      subscription {\n        importantEmails\n        notImportantEmails\n      }\n    ", [{
      message: singleFieldOnlyMessage(null),
      locations: [{
        line: 4,
        column: 9
      }]
    }]);
  });
});