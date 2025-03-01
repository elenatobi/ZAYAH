const grammar = {
  // The start symbol for the parser.
  start: "Document",

  // Skip whitespace between tokens.
  skip: { type: "regex", pattern: /^[ \t\r\n]+/ },

  rules: {
    // A Document consists of a single top-level entry.
    Document: [
      {
        symbols: ["TopEntry"],
        action: (children) => {
          // children[0] is the TopEntry
          return { type: "Document", entry: children[0] };
        }
      }
    ],

    // A TopEntry is a list item starting with '-' then a number (e.g. "1:"),
    // followed by one or more sections.
    TopEntry: [
      {
        symbols: ["-", "TopId", ":", "SectionList"],
        action: (children) => ({
          type: "TopEntry",
          id: children[1],
          sections: children[3]
        })
      }
    ],

    // TopId is one or more digits.
    TopId: [
      {
        symbols: [{ type: "regex", pattern: /^[0-9]+/ }],
        action: (children) => parseInt(children[0], 10)
      }
    ],

    // SectionList: either a Section followed by a SectionList or empty.
    SectionList: [
      {
        symbols: ["Section", "SectionList"],
        action: (children) => [children[0], ...children[1]]
      },
      {
        symbols: [],
        action: () => []
      }
    ],

    // A Section is a list item starting with '-' and then a TableId (like "$T 1:"),
    // followed by one or more rows.
    Section: [
      {
        symbols: ["-", "TableId", ":", "RowList"],
        action: (children) => ({
          type: "Section",
          table: children[1],
          rows: children[3]
        })
      }
    ],

    // TableId: the literal "$T" followed by a Number.
    TableId: [
      {
        symbols: ["$T", "number"],
        action: (children) => children[1]
      }
    ],

    // A Number is one or more digits.
    number: [
      {
        symbols: [{ type: "regex", pattern: /^[0-9]+/ }],
        action: (children) => parseInt(children[0], 10)
      }
    ],

    // RowList: one or more rows.
    RowList: [
      {
        symbols: ["Row", "RowList"],
        action: (children) => [children[0], ...children[1]]
      },
      {
        symbols: [],
        action: () => []
      }
    ],

    // A Row is a list item starting with '-' followed by a FieldList.
    Row: [
      {
        symbols: ["-", "FieldList"],
        action: (children) => ({
          type: "Row",
          fields: children[1]
        })
      }
    ],

    // A FieldList consists of a Field followed by an optional FieldTail.
    FieldList: [
      {
        symbols: ["Field", "FieldTail"],
        action: (children) => [children[0], ...children[1]]
      }
    ],

    // FieldTail: either a comma, then a Field, then more FieldTail or empty.
    FieldTail: [
      {
        symbols: [",", "Field", "FieldTail"],
        action: (children) => [children[1], ...children[2]]
      },
      {
        symbols: [],
        action: () => []
      }
    ],

    // A Field is defined as one or more alphanumeric characters.
    Field: [
      {
        symbols: [{ type: "regex", pattern: /^[A-Za-z0-9]+/ }],
        action: (children) => children[0]
      }
    ]
  }
};




const inputExpression = `- 1:
  - $T 1:
    - id, name, length
    - 1, First, 22
    - 2, Second, 98
    - 3, Third, 78
    - 4, Fourth, 23
  - $T 2:
    - id, name, ref
    - 1, First, 22
    - 2, Second, 98
    - 3, Third, 78
  - 3, Something
    - $T 3:
      - id, name, date, foreign
      - 1, First, 2023-11-30, 3
`;

const ast = parse(inputExpression, grammar);
console.log("Parsing succeeded. AST:");
console.log(JSON.stringify(ast, null, 2));