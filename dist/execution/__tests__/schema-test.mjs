/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { execute } from '../execute';
import { parse } from '../../language';
import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLID } from '../../type';
describe('Execute: Handles execution with a complex schema', function () {
  it('executes using a schema', function () {
    var BlogImage = new GraphQLObjectType({
      name: 'Image',
      fields: {
        url: {
          type: GraphQLString
        },
        width: {
          type: GraphQLInt
        },
        height: {
          type: GraphQLInt
        }
      }
    });
    var BlogAuthor = new GraphQLObjectType({
      name: 'Author',
      fields: function fields() {
        return {
          id: {
            type: GraphQLString
          },
          name: {
            type: GraphQLString
          },
          pic: {
            args: {
              width: {
                type: GraphQLInt
              },
              height: {
                type: GraphQLInt
              }
            },
            type: BlogImage,
            resolve: function resolve(obj, _ref) {
              var width = _ref.width,
                  height = _ref.height;
              return obj.pic(width, height);
            }
          },
          recentArticle: {
            type: BlogArticle
          }
        };
      }
    });
    var BlogArticle = new GraphQLObjectType({
      name: 'Article',
      fields: {
        id: {
          type: GraphQLNonNull(GraphQLString)
        },
        isPublished: {
          type: GraphQLBoolean
        },
        author: {
          type: BlogAuthor
        },
        title: {
          type: GraphQLString
        },
        body: {
          type: GraphQLString
        },
        keywords: {
          type: GraphQLList(GraphQLString)
        }
      }
    });
    var BlogQuery = new GraphQLObjectType({
      name: 'Query',
      fields: {
        article: {
          type: BlogArticle,
          args: {
            id: {
              type: GraphQLID
            }
          },
          resolve: function resolve(_, _ref2) {
            var id = _ref2.id;
            return article(id);
          }
        },
        feed: {
          type: GraphQLList(BlogArticle),
          resolve: function resolve() {
            return [article(1), article(2), article(3), article(4), article(5), article(6), article(7), article(8), article(9), article(10)];
          }
        }
      }
    });
    var BlogSchema = new GraphQLSchema({
      query: BlogQuery
    });

    function article(id) {
      return {
        id: id,
        isPublished: 'true',
        author: johnSmith,
        title: 'My Article ' + id,
        body: 'This is a post',
        hidden: 'This data is not exposed in the schema',
        keywords: ['foo', 'bar', 1, true, null]
      };
    }

    var johnSmith = {
      id: 123,
      name: 'John Smith',
      pic: function pic(width, height) {
        return getPic(123, width, height);
      },
      recentArticle: article(1)
    };

    function getPic(uid, width, height) {
      return {
        url: "cdn://".concat(uid),
        width: "".concat(width),
        height: "".concat(height)
      };
    }

    var request = "\n      {\n        feed {\n          id,\n          title\n        },\n        article(id: \"1\") {\n          ...articleFields,\n          author {\n            id,\n            name,\n            pic(width: 640, height: 480) {\n              url,\n              width,\n              height\n            },\n            recentArticle {\n              ...articleFields,\n              keywords\n            }\n          }\n        }\n      }\n\n      fragment articleFields on Article {\n        id,\n        isPublished,\n        title,\n        body,\n        hidden,\n        notdefined\n      }\n    "; // Note: this is intentionally not validating to ensure appropriate
    // behavior occurs when executing an invalid query.

    expect(execute(BlogSchema, parse(request))).to.deep.equal({
      data: {
        feed: [{
          id: '1',
          title: 'My Article 1'
        }, {
          id: '2',
          title: 'My Article 2'
        }, {
          id: '3',
          title: 'My Article 3'
        }, {
          id: '4',
          title: 'My Article 4'
        }, {
          id: '5',
          title: 'My Article 5'
        }, {
          id: '6',
          title: 'My Article 6'
        }, {
          id: '7',
          title: 'My Article 7'
        }, {
          id: '8',
          title: 'My Article 8'
        }, {
          id: '9',
          title: 'My Article 9'
        }, {
          id: '10',
          title: 'My Article 10'
        }],
        article: {
          id: '1',
          isPublished: true,
          title: 'My Article 1',
          body: 'This is a post',
          author: {
            id: '123',
            name: 'John Smith',
            pic: {
              url: 'cdn://123',
              width: 640,
              height: 480
            },
            recentArticle: {
              id: '1',
              isPublished: true,
              title: 'My Article 1',
              body: 'This is a post',
              keywords: ['foo', 'bar', '1', 'true', null]
            }
          }
        }
      }
    });
  });
});