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
import { printSchema, printIntrospectionSchema } from '../schemaPrinter';
import { buildSchema } from '../buildASTSchema';
import { GraphQLSchema, GraphQLInputObjectType, GraphQLScalarType, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLEnumType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull } from '../../';
import { GraphQLDirective } from '../../type/directives';
import { DirectiveLocation } from '../../language/directiveLocation';

function printForTest(schema) {
  var schemaText = printSchema(schema); // keep printSchema and buildSchema in sync

  expect(printSchema(buildSchema(schemaText))).to.equal(schemaText);
  return schemaText;
}

function printSingleFieldSchema(fieldConfig) {
  var Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      singleField: fieldConfig
    }
  });
  return printForTest(new GraphQLSchema({
    query: Query
  }));
}

function listOf(type) {
  return GraphQLList(type);
}

function nonNull(type) {
  return GraphQLNonNull(type);
}

describe('Type System Printer', function () {
  it('Prints String Field', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString
    });
    expect(output).to.equal(dedent(_templateObject));
  });
  it('Prints [String] Field', function () {
    var output = printSingleFieldSchema({
      type: listOf(GraphQLString)
    });
    expect(output).to.equal(dedent(_templateObject2));
  });
  it('Prints String! Field', function () {
    var output = printSingleFieldSchema({
      type: nonNull(GraphQLString)
    });
    expect(output).to.equal(dedent(_templateObject3));
  });
  it('Prints [String]! Field', function () {
    var output = printSingleFieldSchema({
      type: nonNull(listOf(GraphQLString))
    });
    expect(output).to.equal(dedent(_templateObject4));
  });
  it('Prints [String!] Field', function () {
    var output = printSingleFieldSchema({
      type: listOf(nonNull(GraphQLString))
    });
    expect(output).to.equal(dedent(_templateObject5));
  });
  it('Prints [String!]! Field', function () {
    var output = printSingleFieldSchema({
      type: nonNull(listOf(nonNull(GraphQLString)))
    });
    expect(output).to.equal(dedent(_templateObject6));
  });
  it('Print Object Field', function () {
    var FooType = new GraphQLObjectType({
      name: 'Foo',
      fields: {
        str: {
          type: GraphQLString
        }
      }
    });
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        foo: {
          type: FooType
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject7));
  });
  it('Prints String Field With Int Arg', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLInt
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject8));
  });
  it('Prints String Field With Int Arg With Default', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLInt,
          defaultValue: 2
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject9));
  });
  it('Prints String Field With String Arg With Default', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLString,
          defaultValue: 'tes\t de\fault'
        }
      }
    });
    expect(output).to.equal(dedent(String.raw(_templateObject10)));
  });
  it('Prints String Field With Int Arg With Default Null', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLInt,
          defaultValue: null
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject11));
  });
  it('Prints String Field With Int! Arg', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: nonNull(GraphQLInt)
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject12));
  });
  it('Prints String Field With Multiple Args', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLInt
        },
        argTwo: {
          type: GraphQLString
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject13));
  });
  it('Prints String Field With Multiple Args, First is Default', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLInt,
          defaultValue: 1
        },
        argTwo: {
          type: GraphQLString
        },
        argThree: {
          type: GraphQLBoolean
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject14));
  });
  it('Prints String Field With Multiple Args, Second is Default', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLInt
        },
        argTwo: {
          type: GraphQLString,
          defaultValue: 'foo'
        },
        argThree: {
          type: GraphQLBoolean
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject15));
  });
  it('Prints String Field With Multiple Args, Last is Default', function () {
    var output = printSingleFieldSchema({
      type: GraphQLString,
      args: {
        argOne: {
          type: GraphQLInt
        },
        argTwo: {
          type: GraphQLString
        },
        argThree: {
          type: GraphQLBoolean,
          defaultValue: false
        }
      }
    });
    expect(output).to.equal(dedent(_templateObject16));
  });
  it('Prints custom query root type', function () {
    var CustomQueryType = new GraphQLObjectType({
      name: 'CustomQueryType',
      fields: {
        bar: {
          type: GraphQLString
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: CustomQueryType
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject17));
  });
  it('Print Interface', function () {
    var FooType = new GraphQLInterfaceType({
      name: 'Foo',
      fields: {
        str: {
          type: GraphQLString
        }
      }
    });
    var BarType = new GraphQLObjectType({
      name: 'Bar',
      fields: {
        str: {
          type: GraphQLString
        }
      },
      interfaces: [FooType]
    });
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        bar: {
          type: BarType
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query,
      types: [BarType]
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject18));
  });
  it('Print Multiple Interface', function () {
    var FooType = new GraphQLInterfaceType({
      name: 'Foo',
      fields: {
        str: {
          type: GraphQLString
        }
      }
    });
    var BaazType = new GraphQLInterfaceType({
      name: 'Baaz',
      fields: {
        int: {
          type: GraphQLInt
        }
      }
    });
    var BarType = new GraphQLObjectType({
      name: 'Bar',
      fields: {
        str: {
          type: GraphQLString
        },
        int: {
          type: GraphQLInt
        }
      },
      interfaces: [FooType, BaazType]
    });
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        bar: {
          type: BarType
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query,
      types: [BarType]
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject19));
  });
  it('Print Unions', function () {
    var FooType = new GraphQLObjectType({
      name: 'Foo',
      fields: {
        bool: {
          type: GraphQLBoolean
        }
      }
    });
    var BarType = new GraphQLObjectType({
      name: 'Bar',
      fields: {
        str: {
          type: GraphQLString
        }
      }
    });
    var SingleUnion = new GraphQLUnionType({
      name: 'SingleUnion',
      types: [FooType]
    });
    var MultipleUnion = new GraphQLUnionType({
      name: 'MultipleUnion',
      types: [FooType, BarType]
    });
    var Query = new GraphQLObjectType({
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
    var Schema = new GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject20));
  });
  it('Print Input Type', function () {
    var InputType = new GraphQLInputObjectType({
      name: 'InputType',
      fields: {
        int: {
          type: GraphQLInt
        }
      }
    });
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        str: {
          type: GraphQLString,
          args: {
            argOne: {
              type: InputType
            }
          }
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject21));
  });
  it('Custom Scalar', function () {
    var OddType = new GraphQLScalarType({
      name: 'Odd',
      serialize: function serialize(value) {
        return value % 2 === 1 ? value : null;
      }
    });
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        odd: {
          type: OddType
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject22));
  });
  it('Enum', function () {
    var RGBType = new GraphQLEnumType({
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
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        rgb: {
          type: RGBType
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject23));
  });
  it('Prints custom directives', function () {
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        field: {
          type: GraphQLString
        }
      }
    });
    var CustomDirective = new GraphQLDirective({
      name: 'customDirective',
      locations: [DirectiveLocation.FIELD]
    });
    var Schema = new GraphQLSchema({
      query: Query,
      directives: [CustomDirective]
    });
    var output = printForTest(Schema);
    expect(output).to.equal(dedent(_templateObject24));
  });
  it('One-line prints a short description', function () {
    var description = 'This field is awesome';
    var output = printSingleFieldSchema({
      type: GraphQLString,
      description: description
    });
    expect(output).to.equal(dedent(_templateObject25));
    var recreatedRoot = buildSchema(output).getTypeMap()['Query'];
    var recreatedField = recreatedRoot.getFields()['singleField'];
    expect(recreatedField.description).to.equal(description);
  });
  it('Does not one-line print a description that ends with a quote', function () {
    var description = 'This field is "awesome"';
    var output = printSingleFieldSchema({
      type: GraphQLString,
      description: description
    });
    expect(output).to.equal(dedent(_templateObject26));
    var recreatedRoot = buildSchema(output).getTypeMap()['Query'];
    var recreatedField = recreatedRoot.getFields()['singleField'];
    expect(recreatedField.description).to.equal(description);
  });
  it('Preserves leading spaces when printing a description', function () {
    var description = '    This field is "awesome"';
    var output = printSingleFieldSchema({
      type: GraphQLString,
      description: description
    });
    expect(output).to.equal(dedent(_templateObject27));
    var recreatedRoot = buildSchema(output).getTypeMap()['Query'];
    var recreatedField = recreatedRoot.getFields()['singleField'];
    expect(recreatedField.description).to.equal(description);
  });
  it('Print Introspection Schema', function () {
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        onlyField: {
          type: GraphQLString
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query
    });
    var output = printIntrospectionSchema(Schema);
    var introspectionSchema = dedent(_templateObject28);
    expect(output).to.equal(introspectionSchema);
  });
  it('Print Introspection Schema with comment descriptions', function () {
    var Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        onlyField: {
          type: GraphQLString
        }
      }
    });
    var Schema = new GraphQLSchema({
      query: Query
    });
    var output = printIntrospectionSchema(Schema, {
      commentDescriptions: true
    });
    var introspectionSchema = dedent(_templateObject29);
    expect(output).to.equal(introspectionSchema);
  });
});