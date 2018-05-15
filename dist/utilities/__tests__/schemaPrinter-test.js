"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _dedent = _interopRequireDefault(require("../../jsutils/dedent"));

var _schemaPrinter = require("../schemaPrinter");

var _buildASTSchema = require("../buildASTSchema");

var _ = require("../../");

var _directives = require("../../type/directives");

var _directiveLocation = require("../../language/directiveLocation");

var _templateObject = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField: String\n      }\n    "]),
    _templateObject2 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField: [String]\n      }\n    "]),
    _templateObject3 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField: String!\n      }\n    "]),
    _templateObject4 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField: [String]!\n      }\n    "]),
    _templateObject5 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField: [String!]\n      }\n    "]),
    _templateObject6 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField: [String!]!\n      }\n    "]),
    _templateObject7 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Foo {\n        str: String\n      }\n\n      type Query {\n        foo: Foo\n      }\n    "]),
    _templateObject8 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int): String\n      }\n    "]),
    _templateObject9 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int = 2): String\n      }\n    "]),
    _templateObject10 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: String = \"tes\t de\fault\"): String\n      }\n    "], ["\n      type Query {\n        singleField(argOne: String = \"tes\\t de\\fault\"): String\n      }\n    "]),
    _templateObject11 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int = null): String\n      }\n    "]),
    _templateObject12 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int!): String\n      }\n    "]),
    _templateObject13 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int, argTwo: String): String\n      }\n    "]),
    _templateObject14 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int = 1, argTwo: String, argThree: Boolean): String\n      }\n    "]),
    _templateObject15 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int, argTwo: String = \"foo\", argThree: Boolean): String\n      }\n    "]),
    _templateObject16 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        singleField(argOne: Int, argTwo: String, argThree: Boolean = false): String\n      }\n    "]),
    _templateObject17 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      schema {\n        query: CustomQueryType\n      }\n\n      type CustomQueryType {\n        bar: String\n      }\n    "]),
    _templateObject18 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Bar implements Foo {\n        str: String\n      }\n\n      interface Foo {\n        str: String\n      }\n\n      type Query {\n        bar: Bar\n      }\n    "]),
    _templateObject19 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      interface Baaz {\n        int: Int\n      }\n\n      type Bar implements Foo & Baaz {\n        str: String\n        int: Int\n      }\n\n      interface Foo {\n        str: String\n      }\n\n      type Query {\n        bar: Bar\n      }\n    "]),
    _templateObject20 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Bar {\n        str: String\n      }\n\n      type Foo {\n        bool: Boolean\n      }\n\n      union MultipleUnion = Foo | Bar\n\n      type Query {\n        single: SingleUnion\n        multiple: MultipleUnion\n      }\n\n      union SingleUnion = Foo\n    "]),
    _templateObject21 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      input InputType {\n        int: Int\n      }\n\n      type Query {\n        str(argOne: InputType): String\n      }\n    "]),
    _templateObject22 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      scalar Odd\n\n      type Query {\n        odd: Odd\n      }\n    "]),
    _templateObject23 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        rgb: RGB\n      }\n\n      enum RGB {\n        RED\n        GREEN\n        BLUE\n      }\n    "]),
    _templateObject24 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      directive @customDirective on FIELD\n\n      type Query {\n        field: String\n      }\n    "]),
    _templateObject25 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        \"\"\"This field is awesome\"\"\"\n        singleField: String\n      }\n    "]),
    _templateObject26 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        \"\"\"\n        This field is \"awesome\"\n        \"\"\"\n        singleField: String\n      }\n    "]),
    _templateObject27 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      type Query {\n        \"\"\"    This field is \"awesome\"\n        \"\"\"\n        singleField: String\n      }\n    "]),
    _templateObject28 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      \"\"\"\n      Directs the executor to include this field or fragment only when the `if` argument is true.\n      \"\"\"\n      directive @include(\n        \"\"\"Included when true.\"\"\"\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      \"\"\"\n      Directs the executor to skip this field or fragment when the `if` argument is true.\n      \"\"\"\n      directive @skip(\n        \"\"\"Skipped when true.\"\"\"\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      \"\"\"Marks an element of a GraphQL schema as no longer supported.\"\"\"\n      directive @deprecated(\n        \"\"\"\n        Explains why this element was deprecated, usually also including a suggestion\n        for how to access supported similar data. Formatted in\n        [Markdown](https://daringfireball.net/projects/markdown/).\n        \"\"\"\n        reason: String = \"No longer supported\"\n      ) on FIELD_DEFINITION | ENUM_VALUE\n\n      \"\"\"\n      A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\n      In some cases, you need to provide options to alter GraphQL's execution behavior\n      in ways field arguments will not suffice, such as conditionally including or\n      skipping a field. Directives provide this by describing additional information\n      to the executor.\n      \"\"\"\n      type __Directive {\n        name: String!\n        description: String\n        locations: [__DirectiveLocation!]!\n        args: [__InputValue!]!\n        onOperation: Boolean! @deprecated(reason: \"Use `locations`.\")\n        onFragment: Boolean! @deprecated(reason: \"Use `locations`.\")\n        onField: Boolean! @deprecated(reason: \"Use `locations`.\")\n      }\n\n      \"\"\"\n      A Directive can be adjacent to many parts of the GraphQL language, a\n      __DirectiveLocation describes one such possible adjacencies.\n      \"\"\"\n      enum __DirectiveLocation {\n        \"\"\"Location adjacent to a query operation.\"\"\"\n        QUERY\n\n        \"\"\"Location adjacent to a mutation operation.\"\"\"\n        MUTATION\n\n        \"\"\"Location adjacent to a subscription operation.\"\"\"\n        SUBSCRIPTION\n\n        \"\"\"Location adjacent to a field.\"\"\"\n        FIELD\n\n        \"\"\"Location adjacent to a fragment definition.\"\"\"\n        FRAGMENT_DEFINITION\n\n        \"\"\"Location adjacent to a fragment spread.\"\"\"\n        FRAGMENT_SPREAD\n\n        \"\"\"Location adjacent to an inline fragment.\"\"\"\n        INLINE_FRAGMENT\n\n        \"\"\"Location adjacent to a schema definition.\"\"\"\n        SCHEMA\n\n        \"\"\"Location adjacent to a scalar definition.\"\"\"\n        SCALAR\n\n        \"\"\"Location adjacent to an object type definition.\"\"\"\n        OBJECT\n\n        \"\"\"Location adjacent to a field definition.\"\"\"\n        FIELD_DEFINITION\n\n        \"\"\"Location adjacent to an argument definition.\"\"\"\n        ARGUMENT_DEFINITION\n\n        \"\"\"Location adjacent to an interface definition.\"\"\"\n        INTERFACE\n\n        \"\"\"Location adjacent to a union definition.\"\"\"\n        UNION\n\n        \"\"\"Location adjacent to an enum definition.\"\"\"\n        ENUM\n\n        \"\"\"Location adjacent to an enum value definition.\"\"\"\n        ENUM_VALUE\n\n        \"\"\"Location adjacent to an input object type definition.\"\"\"\n        INPUT_OBJECT\n\n        \"\"\"Location adjacent to an input object field definition.\"\"\"\n        INPUT_FIELD_DEFINITION\n      }\n\n      \"\"\"\n      One possible value for a given Enum. Enum values are unique values, not a\n      placeholder for a string or numeric value. However an Enum value is returned in\n      a JSON response as a string.\n      \"\"\"\n      type __EnumValue {\n        name: String!\n        description: String\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      \"\"\"\n      Object and Interface types are described by a list of Fields, each of which has\n      a name, potentially a list of arguments, and a return type.\n      \"\"\"\n      type __Field {\n        name: String!\n        description: String\n        args: [__InputValue!]!\n        type: __Type!\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      \"\"\"\n      Arguments provided to Fields or Directives and the input fields of an\n      InputObject are represented as Input Values which describe their type and\n      optionally a default value.\n      \"\"\"\n      type __InputValue {\n        name: String!\n        description: String\n        type: __Type!\n\n        \"\"\"\n        A GraphQL-formatted string representing the default value for this input value.\n        \"\"\"\n        defaultValue: String\n      }\n\n      \"\"\"\n      A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all\n      available types and directives on the server, as well as the entry points for\n      query, mutation, and subscription operations.\n      \"\"\"\n      type __Schema {\n        \"\"\"A list of all types supported by this server.\"\"\"\n        types: [__Type!]!\n\n        \"\"\"The type that query operations will be rooted at.\"\"\"\n        queryType: __Type!\n\n        \"\"\"\n        If this server supports mutation, the type that mutation operations will be rooted at.\n        \"\"\"\n        mutationType: __Type\n\n        \"\"\"\n        If this server support subscription, the type that subscription operations will be rooted at.\n        \"\"\"\n        subscriptionType: __Type\n\n        \"\"\"A list of all directives supported by this server.\"\"\"\n        directives: [__Directive!]!\n      }\n\n      \"\"\"\n      The fundamental unit of any GraphQL Schema is the type. There are many kinds of\n      types in GraphQL as represented by the `__TypeKind` enum.\n\n      Depending on the kind of a type, certain fields describe information about that\n      type. Scalar types provide no information beyond a name and description, while\n      Enum types provide their values. Object and Interface types provide the fields\n      they describe. Abstract types, Union and Interface, provide the Object types\n      possible at runtime. List and NonNull types compose other types.\n      \"\"\"\n      type __Type {\n        kind: __TypeKind!\n        name: String\n        description: String\n        fields(includeDeprecated: Boolean = false): [__Field!]\n        interfaces: [__Type!]\n        possibleTypes: [__Type!]\n        enumValues(includeDeprecated: Boolean = false): [__EnumValue!]\n        inputFields: [__InputValue!]\n        ofType: __Type\n      }\n\n      \"\"\"An enum describing what kind of type a given `__Type` is.\"\"\"\n      enum __TypeKind {\n        \"\"\"Indicates this type is a scalar.\"\"\"\n        SCALAR\n\n        \"\"\"\n        Indicates this type is an object. `fields` and `interfaces` are valid fields.\n        \"\"\"\n        OBJECT\n\n        \"\"\"\n        Indicates this type is an interface. `fields` and `possibleTypes` are valid fields.\n        \"\"\"\n        INTERFACE\n\n        \"\"\"Indicates this type is a union. `possibleTypes` is a valid field.\"\"\"\n        UNION\n\n        \"\"\"Indicates this type is an enum. `enumValues` is a valid field.\"\"\"\n        ENUM\n\n        \"\"\"\n        Indicates this type is an input object. `inputFields` is a valid field.\n        \"\"\"\n        INPUT_OBJECT\n\n        \"\"\"Indicates this type is a list. `ofType` is a valid field.\"\"\"\n        LIST\n\n        \"\"\"Indicates this type is a non-null. `ofType` is a valid field.\"\"\"\n        NON_NULL\n      }\n    "], ["\n      \"\"\"\n      Directs the executor to include this field or fragment only when the \\`if\\` argument is true.\n      \"\"\"\n      directive @include(\n        \"\"\"Included when true.\"\"\"\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      \"\"\"\n      Directs the executor to skip this field or fragment when the \\`if\\` argument is true.\n      \"\"\"\n      directive @skip(\n        \"\"\"Skipped when true.\"\"\"\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      \"\"\"Marks an element of a GraphQL schema as no longer supported.\"\"\"\n      directive @deprecated(\n        \"\"\"\n        Explains why this element was deprecated, usually also including a suggestion\n        for how to access supported similar data. Formatted in\n        [Markdown](https://daringfireball.net/projects/markdown/).\n        \"\"\"\n        reason: String = \"No longer supported\"\n      ) on FIELD_DEFINITION | ENUM_VALUE\n\n      \"\"\"\n      A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\n      In some cases, you need to provide options to alter GraphQL's execution behavior\n      in ways field arguments will not suffice, such as conditionally including or\n      skipping a field. Directives provide this by describing additional information\n      to the executor.\n      \"\"\"\n      type __Directive {\n        name: String!\n        description: String\n        locations: [__DirectiveLocation!]!\n        args: [__InputValue!]!\n        onOperation: Boolean! @deprecated(reason: \"Use \\`locations\\`.\")\n        onFragment: Boolean! @deprecated(reason: \"Use \\`locations\\`.\")\n        onField: Boolean! @deprecated(reason: \"Use \\`locations\\`.\")\n      }\n\n      \"\"\"\n      A Directive can be adjacent to many parts of the GraphQL language, a\n      __DirectiveLocation describes one such possible adjacencies.\n      \"\"\"\n      enum __DirectiveLocation {\n        \"\"\"Location adjacent to a query operation.\"\"\"\n        QUERY\n\n        \"\"\"Location adjacent to a mutation operation.\"\"\"\n        MUTATION\n\n        \"\"\"Location adjacent to a subscription operation.\"\"\"\n        SUBSCRIPTION\n\n        \"\"\"Location adjacent to a field.\"\"\"\n        FIELD\n\n        \"\"\"Location adjacent to a fragment definition.\"\"\"\n        FRAGMENT_DEFINITION\n\n        \"\"\"Location adjacent to a fragment spread.\"\"\"\n        FRAGMENT_SPREAD\n\n        \"\"\"Location adjacent to an inline fragment.\"\"\"\n        INLINE_FRAGMENT\n\n        \"\"\"Location adjacent to a schema definition.\"\"\"\n        SCHEMA\n\n        \"\"\"Location adjacent to a scalar definition.\"\"\"\n        SCALAR\n\n        \"\"\"Location adjacent to an object type definition.\"\"\"\n        OBJECT\n\n        \"\"\"Location adjacent to a field definition.\"\"\"\n        FIELD_DEFINITION\n\n        \"\"\"Location adjacent to an argument definition.\"\"\"\n        ARGUMENT_DEFINITION\n\n        \"\"\"Location adjacent to an interface definition.\"\"\"\n        INTERFACE\n\n        \"\"\"Location adjacent to a union definition.\"\"\"\n        UNION\n\n        \"\"\"Location adjacent to an enum definition.\"\"\"\n        ENUM\n\n        \"\"\"Location adjacent to an enum value definition.\"\"\"\n        ENUM_VALUE\n\n        \"\"\"Location adjacent to an input object type definition.\"\"\"\n        INPUT_OBJECT\n\n        \"\"\"Location adjacent to an input object field definition.\"\"\"\n        INPUT_FIELD_DEFINITION\n      }\n\n      \"\"\"\n      One possible value for a given Enum. Enum values are unique values, not a\n      placeholder for a string or numeric value. However an Enum value is returned in\n      a JSON response as a string.\n      \"\"\"\n      type __EnumValue {\n        name: String!\n        description: String\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      \"\"\"\n      Object and Interface types are described by a list of Fields, each of which has\n      a name, potentially a list of arguments, and a return type.\n      \"\"\"\n      type __Field {\n        name: String!\n        description: String\n        args: [__InputValue!]!\n        type: __Type!\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      \"\"\"\n      Arguments provided to Fields or Directives and the input fields of an\n      InputObject are represented as Input Values which describe their type and\n      optionally a default value.\n      \"\"\"\n      type __InputValue {\n        name: String!\n        description: String\n        type: __Type!\n\n        \"\"\"\n        A GraphQL-formatted string representing the default value for this input value.\n        \"\"\"\n        defaultValue: String\n      }\n\n      \"\"\"\n      A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all\n      available types and directives on the server, as well as the entry points for\n      query, mutation, and subscription operations.\n      \"\"\"\n      type __Schema {\n        \"\"\"A list of all types supported by this server.\"\"\"\n        types: [__Type!]!\n\n        \"\"\"The type that query operations will be rooted at.\"\"\"\n        queryType: __Type!\n\n        \"\"\"\n        If this server supports mutation, the type that mutation operations will be rooted at.\n        \"\"\"\n        mutationType: __Type\n\n        \"\"\"\n        If this server support subscription, the type that subscription operations will be rooted at.\n        \"\"\"\n        subscriptionType: __Type\n\n        \"\"\"A list of all directives supported by this server.\"\"\"\n        directives: [__Directive!]!\n      }\n\n      \"\"\"\n      The fundamental unit of any GraphQL Schema is the type. There are many kinds of\n      types in GraphQL as represented by the \\`__TypeKind\\` enum.\n\n      Depending on the kind of a type, certain fields describe information about that\n      type. Scalar types provide no information beyond a name and description, while\n      Enum types provide their values. Object and Interface types provide the fields\n      they describe. Abstract types, Union and Interface, provide the Object types\n      possible at runtime. List and NonNull types compose other types.\n      \"\"\"\n      type __Type {\n        kind: __TypeKind!\n        name: String\n        description: String\n        fields(includeDeprecated: Boolean = false): [__Field!]\n        interfaces: [__Type!]\n        possibleTypes: [__Type!]\n        enumValues(includeDeprecated: Boolean = false): [__EnumValue!]\n        inputFields: [__InputValue!]\n        ofType: __Type\n      }\n\n      \"\"\"An enum describing what kind of type a given \\`__Type\\` is.\"\"\"\n      enum __TypeKind {\n        \"\"\"Indicates this type is a scalar.\"\"\"\n        SCALAR\n\n        \"\"\"\n        Indicates this type is an object. \\`fields\\` and \\`interfaces\\` are valid fields.\n        \"\"\"\n        OBJECT\n\n        \"\"\"\n        Indicates this type is an interface. \\`fields\\` and \\`possibleTypes\\` are valid fields.\n        \"\"\"\n        INTERFACE\n\n        \"\"\"Indicates this type is a union. \\`possibleTypes\\` is a valid field.\"\"\"\n        UNION\n\n        \"\"\"Indicates this type is an enum. \\`enumValues\\` is a valid field.\"\"\"\n        ENUM\n\n        \"\"\"\n        Indicates this type is an input object. \\`inputFields\\` is a valid field.\n        \"\"\"\n        INPUT_OBJECT\n\n        \"\"\"Indicates this type is a list. \\`ofType\\` is a valid field.\"\"\"\n        LIST\n\n        \"\"\"Indicates this type is a non-null. \\`ofType\\` is a valid field.\"\"\"\n        NON_NULL\n      }\n    "]),
    _templateObject29 = /*#__PURE__*/ _taggedTemplateLiteral(["\n      # Directs the executor to include this field or fragment only when the `if` argument is true.\n      directive @include(\n        # Included when true.\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      # Directs the executor to skip this field or fragment when the `if` argument is true.\n      directive @skip(\n        # Skipped when true.\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      # Marks an element of a GraphQL schema as no longer supported.\n      directive @deprecated(\n        # Explains why this element was deprecated, usually also including a suggestion\n        # for how to access supported similar data. Formatted in\n        # [Markdown](https://daringfireball.net/projects/markdown/).\n        reason: String = \"No longer supported\"\n      ) on FIELD_DEFINITION | ENUM_VALUE\n\n      # A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n      #\n      # In some cases, you need to provide options to alter GraphQL's execution behavior\n      # in ways field arguments will not suffice, such as conditionally including or\n      # skipping a field. Directives provide this by describing additional information\n      # to the executor.\n      type __Directive {\n        name: String!\n        description: String\n        locations: [__DirectiveLocation!]!\n        args: [__InputValue!]!\n        onOperation: Boolean! @deprecated(reason: \"Use `locations`.\")\n        onFragment: Boolean! @deprecated(reason: \"Use `locations`.\")\n        onField: Boolean! @deprecated(reason: \"Use `locations`.\")\n      }\n\n      # A Directive can be adjacent to many parts of the GraphQL language, a\n      # __DirectiveLocation describes one such possible adjacencies.\n      enum __DirectiveLocation {\n        # Location adjacent to a query operation.\n        QUERY\n\n        # Location adjacent to a mutation operation.\n        MUTATION\n\n        # Location adjacent to a subscription operation.\n        SUBSCRIPTION\n\n        # Location adjacent to a field.\n        FIELD\n\n        # Location adjacent to a fragment definition.\n        FRAGMENT_DEFINITION\n\n        # Location adjacent to a fragment spread.\n        FRAGMENT_SPREAD\n\n        # Location adjacent to an inline fragment.\n        INLINE_FRAGMENT\n\n        # Location adjacent to a schema definition.\n        SCHEMA\n\n        # Location adjacent to a scalar definition.\n        SCALAR\n\n        # Location adjacent to an object type definition.\n        OBJECT\n\n        # Location adjacent to a field definition.\n        FIELD_DEFINITION\n\n        # Location adjacent to an argument definition.\n        ARGUMENT_DEFINITION\n\n        # Location adjacent to an interface definition.\n        INTERFACE\n\n        # Location adjacent to a union definition.\n        UNION\n\n        # Location adjacent to an enum definition.\n        ENUM\n\n        # Location adjacent to an enum value definition.\n        ENUM_VALUE\n\n        # Location adjacent to an input object type definition.\n        INPUT_OBJECT\n\n        # Location adjacent to an input object field definition.\n        INPUT_FIELD_DEFINITION\n      }\n\n      # One possible value for a given Enum. Enum values are unique values, not a\n      # placeholder for a string or numeric value. However an Enum value is returned in\n      # a JSON response as a string.\n      type __EnumValue {\n        name: String!\n        description: String\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      # Object and Interface types are described by a list of Fields, each of which has\n      # a name, potentially a list of arguments, and a return type.\n      type __Field {\n        name: String!\n        description: String\n        args: [__InputValue!]!\n        type: __Type!\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      # Arguments provided to Fields or Directives and the input fields of an\n      # InputObject are represented as Input Values which describe their type and\n      # optionally a default value.\n      type __InputValue {\n        name: String!\n        description: String\n        type: __Type!\n\n        # A GraphQL-formatted string representing the default value for this input value.\n        defaultValue: String\n      }\n\n      # A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all\n      # available types and directives on the server, as well as the entry points for\n      # query, mutation, and subscription operations.\n      type __Schema {\n        # A list of all types supported by this server.\n        types: [__Type!]!\n\n        # The type that query operations will be rooted at.\n        queryType: __Type!\n\n        # If this server supports mutation, the type that mutation operations will be rooted at.\n        mutationType: __Type\n\n        # If this server support subscription, the type that subscription operations will be rooted at.\n        subscriptionType: __Type\n\n        # A list of all directives supported by this server.\n        directives: [__Directive!]!\n      }\n\n      # The fundamental unit of any GraphQL Schema is the type. There are many kinds of\n      # types in GraphQL as represented by the `__TypeKind` enum.\n      #\n      # Depending on the kind of a type, certain fields describe information about that\n      # type. Scalar types provide no information beyond a name and description, while\n      # Enum types provide their values. Object and Interface types provide the fields\n      # they describe. Abstract types, Union and Interface, provide the Object types\n      # possible at runtime. List and NonNull types compose other types.\n      type __Type {\n        kind: __TypeKind!\n        name: String\n        description: String\n        fields(includeDeprecated: Boolean = false): [__Field!]\n        interfaces: [__Type!]\n        possibleTypes: [__Type!]\n        enumValues(includeDeprecated: Boolean = false): [__EnumValue!]\n        inputFields: [__InputValue!]\n        ofType: __Type\n      }\n\n      # An enum describing what kind of type a given `__Type` is.\n      enum __TypeKind {\n        # Indicates this type is a scalar.\n        SCALAR\n\n        # Indicates this type is an object. `fields` and `interfaces` are valid fields.\n        OBJECT\n\n        # Indicates this type is an interface. `fields` and `possibleTypes` are valid fields.\n        INTERFACE\n\n        # Indicates this type is a union. `possibleTypes` is a valid field.\n        UNION\n\n        # Indicates this type is an enum. `enumValues` is a valid field.\n        ENUM\n\n        # Indicates this type is an input object. `inputFields` is a valid field.\n        INPUT_OBJECT\n\n        # Indicates this type is a list. `ofType` is a valid field.\n        LIST\n\n        # Indicates this type is a non-null. `ofType` is a valid field.\n        NON_NULL\n      }\n    "], ["\n      # Directs the executor to include this field or fragment only when the \\`if\\` argument is true.\n      directive @include(\n        # Included when true.\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      # Directs the executor to skip this field or fragment when the \\`if\\` argument is true.\n      directive @skip(\n        # Skipped when true.\n        if: Boolean!\n      ) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT\n\n      # Marks an element of a GraphQL schema as no longer supported.\n      directive @deprecated(\n        # Explains why this element was deprecated, usually also including a suggestion\n        # for how to access supported similar data. Formatted in\n        # [Markdown](https://daringfireball.net/projects/markdown/).\n        reason: String = \"No longer supported\"\n      ) on FIELD_DEFINITION | ENUM_VALUE\n\n      # A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n      #\n      # In some cases, you need to provide options to alter GraphQL's execution behavior\n      # in ways field arguments will not suffice, such as conditionally including or\n      # skipping a field. Directives provide this by describing additional information\n      # to the executor.\n      type __Directive {\n        name: String!\n        description: String\n        locations: [__DirectiveLocation!]!\n        args: [__InputValue!]!\n        onOperation: Boolean! @deprecated(reason: \"Use \\`locations\\`.\")\n        onFragment: Boolean! @deprecated(reason: \"Use \\`locations\\`.\")\n        onField: Boolean! @deprecated(reason: \"Use \\`locations\\`.\")\n      }\n\n      # A Directive can be adjacent to many parts of the GraphQL language, a\n      # __DirectiveLocation describes one such possible adjacencies.\n      enum __DirectiveLocation {\n        # Location adjacent to a query operation.\n        QUERY\n\n        # Location adjacent to a mutation operation.\n        MUTATION\n\n        # Location adjacent to a subscription operation.\n        SUBSCRIPTION\n\n        # Location adjacent to a field.\n        FIELD\n\n        # Location adjacent to a fragment definition.\n        FRAGMENT_DEFINITION\n\n        # Location adjacent to a fragment spread.\n        FRAGMENT_SPREAD\n\n        # Location adjacent to an inline fragment.\n        INLINE_FRAGMENT\n\n        # Location adjacent to a schema definition.\n        SCHEMA\n\n        # Location adjacent to a scalar definition.\n        SCALAR\n\n        # Location adjacent to an object type definition.\n        OBJECT\n\n        # Location adjacent to a field definition.\n        FIELD_DEFINITION\n\n        # Location adjacent to an argument definition.\n        ARGUMENT_DEFINITION\n\n        # Location adjacent to an interface definition.\n        INTERFACE\n\n        # Location adjacent to a union definition.\n        UNION\n\n        # Location adjacent to an enum definition.\n        ENUM\n\n        # Location adjacent to an enum value definition.\n        ENUM_VALUE\n\n        # Location adjacent to an input object type definition.\n        INPUT_OBJECT\n\n        # Location adjacent to an input object field definition.\n        INPUT_FIELD_DEFINITION\n      }\n\n      # One possible value for a given Enum. Enum values are unique values, not a\n      # placeholder for a string or numeric value. However an Enum value is returned in\n      # a JSON response as a string.\n      type __EnumValue {\n        name: String!\n        description: String\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      # Object and Interface types are described by a list of Fields, each of which has\n      # a name, potentially a list of arguments, and a return type.\n      type __Field {\n        name: String!\n        description: String\n        args: [__InputValue!]!\n        type: __Type!\n        isDeprecated: Boolean!\n        deprecationReason: String\n      }\n\n      # Arguments provided to Fields or Directives and the input fields of an\n      # InputObject are represented as Input Values which describe their type and\n      # optionally a default value.\n      type __InputValue {\n        name: String!\n        description: String\n        type: __Type!\n\n        # A GraphQL-formatted string representing the default value for this input value.\n        defaultValue: String\n      }\n\n      # A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all\n      # available types and directives on the server, as well as the entry points for\n      # query, mutation, and subscription operations.\n      type __Schema {\n        # A list of all types supported by this server.\n        types: [__Type!]!\n\n        # The type that query operations will be rooted at.\n        queryType: __Type!\n\n        # If this server supports mutation, the type that mutation operations will be rooted at.\n        mutationType: __Type\n\n        # If this server support subscription, the type that subscription operations will be rooted at.\n        subscriptionType: __Type\n\n        # A list of all directives supported by this server.\n        directives: [__Directive!]!\n      }\n\n      # The fundamental unit of any GraphQL Schema is the type. There are many kinds of\n      # types in GraphQL as represented by the \\`__TypeKind\\` enum.\n      #\n      # Depending on the kind of a type, certain fields describe information about that\n      # type. Scalar types provide no information beyond a name and description, while\n      # Enum types provide their values. Object and Interface types provide the fields\n      # they describe. Abstract types, Union and Interface, provide the Object types\n      # possible at runtime. List and NonNull types compose other types.\n      type __Type {\n        kind: __TypeKind!\n        name: String\n        description: String\n        fields(includeDeprecated: Boolean = false): [__Field!]\n        interfaces: [__Type!]\n        possibleTypes: [__Type!]\n        enumValues(includeDeprecated: Boolean = false): [__EnumValue!]\n        inputFields: [__InputValue!]\n        ofType: __Type\n      }\n\n      # An enum describing what kind of type a given \\`__Type\\` is.\n      enum __TypeKind {\n        # Indicates this type is a scalar.\n        SCALAR\n\n        # Indicates this type is an object. \\`fields\\` and \\`interfaces\\` are valid fields.\n        OBJECT\n\n        # Indicates this type is an interface. \\`fields\\` and \\`possibleTypes\\` are valid fields.\n        INTERFACE\n\n        # Indicates this type is a union. \\`possibleTypes\\` is a valid field.\n        UNION\n\n        # Indicates this type is an enum. \\`enumValues\\` is a valid field.\n        ENUM\n\n        # Indicates this type is an input object. \\`inputFields\\` is a valid field.\n        INPUT_OBJECT\n\n        # Indicates this type is a list. \\`ofType\\` is a valid field.\n        LIST\n\n        # Indicates this type is a non-null. \\`ofType\\` is a valid field.\n        NON_NULL\n      }\n    "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function printForTest(schema) {
  var schemaText = (0, _schemaPrinter.printSchema)(schema); // keep printSchema and buildSchema in sync

  (0, _chai.expect)((0, _schemaPrinter.printSchema)((0, _buildASTSchema.buildSchema)(schemaText))).to.equal(schemaText);
  return schemaText;
}

function printSingleFieldSchema(fieldConfig) {
  var Query = new _.GraphQLObjectType({
    name: 'Query',
    fields: {
      singleField: fieldConfig
    }
  });
  return printForTest(new _.GraphQLSchema({
    query: Query
  }));
}

function listOf(type) {
  return (0, _.GraphQLList)(type);
}

function nonNull(type) {
  return (0, _.GraphQLNonNull)(type);
}

(0, _mocha.describe)('Type System Printer', function () {
  (0, _mocha.it)('Prints String Field', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject));
  });
  (0, _mocha.it)('Prints [String] Field', function () {
    var output = printSingleFieldSchema({
      type: listOf(_.GraphQLString)
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject2));
  });
  (0, _mocha.it)('Prints String! Field', function () {
    var output = printSingleFieldSchema({
      type: nonNull(_.GraphQLString)
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject3));
  });
  (0, _mocha.it)('Prints [String]! Field', function () {
    var output = printSingleFieldSchema({
      type: nonNull(listOf(_.GraphQLString))
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject4));
  });
  (0, _mocha.it)('Prints [String!] Field', function () {
    var output = printSingleFieldSchema({
      type: listOf(nonNull(_.GraphQLString))
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject5));
  });
  (0, _mocha.it)('Prints [String!]! Field', function () {
    var output = printSingleFieldSchema({
      type: nonNull(listOf(nonNull(_.GraphQLString)))
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject6));
  });
  (0, _mocha.it)('Print Object Field', function () {
    var FooType = new _.GraphQLObjectType({
      name: 'Foo',
      fields: {
        str: {
          type: _.GraphQLString
        }
      }
    });
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        foo: {
          type: FooType
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject7));
  });
  (0, _mocha.it)('Prints String Field With Int Arg', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLInt
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject8));
  });
  (0, _mocha.it)('Prints String Field With Int Arg With Default', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLInt,
          defaultValue: 2
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject9));
  });
  (0, _mocha.it)('Prints String Field With String Arg With Default', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLString,
          defaultValue: 'tes\t de\fault'
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(String.raw(_templateObject10)));
  });
  (0, _mocha.it)('Prints String Field With Int Arg With Default Null', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLInt,
          defaultValue: null
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject11));
  });
  (0, _mocha.it)('Prints String Field With Int! Arg', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: nonNull(_.GraphQLInt)
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject12));
  });
  (0, _mocha.it)('Prints String Field With Multiple Args', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLInt
        },
        argTwo: {
          type: _.GraphQLString
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject13));
  });
  (0, _mocha.it)('Prints String Field With Multiple Args, First is Default', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLInt,
          defaultValue: 1
        },
        argTwo: {
          type: _.GraphQLString
        },
        argThree: {
          type: _.GraphQLBoolean
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject14));
  });
  (0, _mocha.it)('Prints String Field With Multiple Args, Second is Default', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLInt
        },
        argTwo: {
          type: _.GraphQLString,
          defaultValue: 'foo'
        },
        argThree: {
          type: _.GraphQLBoolean
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject15));
  });
  (0, _mocha.it)('Prints String Field With Multiple Args, Last is Default', function () {
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      args: {
        argOne: {
          type: _.GraphQLInt
        },
        argTwo: {
          type: _.GraphQLString
        },
        argThree: {
          type: _.GraphQLBoolean,
          defaultValue: false
        }
      }
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject16));
  });
  (0, _mocha.it)('Prints custom query root type', function () {
    var CustomQueryType = new _.GraphQLObjectType({
      name: 'CustomQueryType',
      fields: {
        bar: {
          type: _.GraphQLString
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: CustomQueryType
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject17));
  });
  (0, _mocha.it)('Print Interface', function () {
    var FooType = new _.GraphQLInterfaceType({
      name: 'Foo',
      fields: {
        str: {
          type: _.GraphQLString
        }
      }
    });
    var BarType = new _.GraphQLObjectType({
      name: 'Bar',
      fields: {
        str: {
          type: _.GraphQLString
        }
      },
      interfaces: [FooType]
    });
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        bar: {
          type: BarType
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query,
      types: [BarType]
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject18));
  });
  (0, _mocha.it)('Print Multiple Interface', function () {
    var FooType = new _.GraphQLInterfaceType({
      name: 'Foo',
      fields: {
        str: {
          type: _.GraphQLString
        }
      }
    });
    var BaazType = new _.GraphQLInterfaceType({
      name: 'Baaz',
      fields: {
        int: {
          type: _.GraphQLInt
        }
      }
    });
    var BarType = new _.GraphQLObjectType({
      name: 'Bar',
      fields: {
        str: {
          type: _.GraphQLString
        },
        int: {
          type: _.GraphQLInt
        }
      },
      interfaces: [FooType, BaazType]
    });
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        bar: {
          type: BarType
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query,
      types: [BarType]
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject19));
  });
  (0, _mocha.it)('Print Unions', function () {
    var FooType = new _.GraphQLObjectType({
      name: 'Foo',
      fields: {
        bool: {
          type: _.GraphQLBoolean
        }
      }
    });
    var BarType = new _.GraphQLObjectType({
      name: 'Bar',
      fields: {
        str: {
          type: _.GraphQLString
        }
      }
    });
    var SingleUnion = new _.GraphQLUnionType({
      name: 'SingleUnion',
      types: [FooType]
    });
    var MultipleUnion = new _.GraphQLUnionType({
      name: 'MultipleUnion',
      types: [FooType, BarType]
    });
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        single: {
          type: SingleUnion
        },
        multiple: {
          type: MultipleUnion
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject20));
  });
  (0, _mocha.it)('Print Input Type', function () {
    var InputType = new _.GraphQLInputObjectType({
      name: 'InputType',
      fields: {
        int: {
          type: _.GraphQLInt
        }
      }
    });
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        str: {
          type: _.GraphQLString,
          args: {
            argOne: {
              type: InputType
            }
          }
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject21));
  });
  (0, _mocha.it)('Custom Scalar', function () {
    var OddType = new _.GraphQLScalarType({
      name: 'Odd',
      serialize: function serialize(value) {
        return value % 2 === 1 ? value : null;
      }
    });
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        odd: {
          type: OddType
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject22));
  });
  (0, _mocha.it)('Enum', function () {
    var RGBType = new _.GraphQLEnumType({
      name: 'RGB',
      values: {
        RED: {
          value: 0
        },
        GREEN: {
          value: 1
        },
        BLUE: {
          value: 2
        }
      }
    });
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        rgb: {
          type: RGBType
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject23));
  });
  (0, _mocha.it)('Prints custom directives', function () {
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        field: {
          type: _.GraphQLString
        }
      }
    });
    var CustomDirective = new _directives.GraphQLDirective({
      name: 'customDirective',
      locations: [_directiveLocation.DirectiveLocation.FIELD]
    });
    var Schema = new _.GraphQLSchema({
      query: Query,
      directives: [CustomDirective]
    });
    var output = printForTest(Schema);
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject24));
  });
  (0, _mocha.it)('One-line prints a short description', function () {
    var description = 'This field is awesome';
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      description: description
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject25));
    var recreatedRoot = (0, _buildASTSchema.buildSchema)(output).getTypeMap()['Query'];
    var recreatedField = recreatedRoot.getFields()['singleField'];
    (0, _chai.expect)(recreatedField.description).to.equal(description);
  });
  (0, _mocha.it)('Does not one-line print a description that ends with a quote', function () {
    var description = 'This field is "awesome"';
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      description: description
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject26));
    var recreatedRoot = (0, _buildASTSchema.buildSchema)(output).getTypeMap()['Query'];
    var recreatedField = recreatedRoot.getFields()['singleField'];
    (0, _chai.expect)(recreatedField.description).to.equal(description);
  });
  (0, _mocha.it)('Preserves leading spaces when printing a description', function () {
    var description = '    This field is "awesome"';
    var output = printSingleFieldSchema({
      type: _.GraphQLString,
      description: description
    });
    (0, _chai.expect)(output).to.equal((0, _dedent.default)(_templateObject27));
    var recreatedRoot = (0, _buildASTSchema.buildSchema)(output).getTypeMap()['Query'];
    var recreatedField = recreatedRoot.getFields()['singleField'];
    (0, _chai.expect)(recreatedField.description).to.equal(description);
  });
  (0, _mocha.it)('Print Introspection Schema', function () {
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        onlyField: {
          type: _.GraphQLString
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query
    });
    var output = (0, _schemaPrinter.printIntrospectionSchema)(Schema);
    var introspectionSchema = (0, _dedent.default)(_templateObject28);
    (0, _chai.expect)(output).to.equal(introspectionSchema);
  });
  (0, _mocha.it)('Print Introspection Schema with comment descriptions', function () {
    var Query = new _.GraphQLObjectType({
      name: 'Query',
      fields: {
        onlyField: {
          type: _.GraphQLString
        }
      }
    });
    var Schema = new _.GraphQLSchema({
      query: Query
    });
    var output = (0, _schemaPrinter.printIntrospectionSchema)(Schema, {
      commentDescriptions: true
    });
    var introspectionSchema = (0, _dedent.default)(_templateObject29);
    (0, _chai.expect)(output).to.equal(introspectionSchema);
  });
});