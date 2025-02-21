/**
 * Parses expressions using a user-defined grammar that specifies whitespace handling.
 * This parser tracks the farthest error position along with line and column numbers.
 *
 * Productions can be either an array of tokens or an object with a `symbols` array
 * and an `action` function that transforms the raw children into a custom AST node.
 *
 * @param {string} input - The input string to parse.
 * @param {object} grammar - The grammar definition, including a `skip` property and semantic actions.
 * @returns {object} - The abstract syntax tree (AST) if parsing succeeds.
 * @throws {Error} - If parsing fails with a detailed message.
 */
function parse(input, grammar) {
  let farthestPos = 0;
  let farthestLine = 1;
  let farthestCol = 0;
  let expectedAtFarthest = new Set();

  /**
   * Updates line and column numbers based on the text that was consumed.
   * @param {string} text - The consumed text.
   * @param {number} line - The starting line number.
   * @param {number} col - The starting column number.
   * @returns {{line: number, col: number}} - The updated line and column.
   */
  function updateLineCol(text, line, col) {
    for (const char of text) {
      if (char === "\n") {
        line++;
        col = 0;
      } else {
        col++;
      }
    }
    return { line, col };
  }

  // Helper: uses grammar.skip (if provided) to skip ignorable input.
  function skipIgnored(pos, line, col) {
    if (grammar.skip && grammar.skip.type === "regex") {
      while (true) {
        const remaining = input.slice(pos);
        const matchResult = grammar.skip.pattern.exec(remaining);
        if (matchResult && matchResult.index === 0) {
          const matchedText = matchResult[0];
          pos += matchedText.length;
          ({ line, col } = updateLineCol(matchedText, line, col));
        } else {
          break;
        }
      }
    }
    return { pos, line, col };
  }

  /**
   * Attempts to match a given symbol starting at position `pos`.
   * @param {string|object} symbol - The symbol (nonterminal, literal, or regex object) to match.
   * @param {number} pos - The current position in the input.
   * @param {number} line - The current line number.
   * @param {number} col - The current column number.
   * @returns {object|null} - { node, pos, line, col } if successful, otherwise null.
   */
  function match(symbol, pos = 0, line = 1, col = 0) {
    // First, skip ignored input.
    let skipResult = skipIgnored(pos, line, col);
    pos = skipResult.pos;
    line = skipResult.line;
    col = skipResult.col;

    // Update farthest position and line/col if needed.
    if (pos > farthestPos) {
      farthestPos = pos;
      farthestLine = line;
      farthestCol = col;
      expectedAtFarthest.clear();
    }

    // If symbol is a nonterminal (a string that's a key in grammar.rules)
    if (typeof symbol === "string" && grammar.rules.hasOwnProperty(symbol)) {
      for (const prod of grammar.rules[symbol]) {
        // Allow a production to be either an array (old style) or an object with { symbols, action }
        let productionSymbols, action;
        if (Array.isArray(prod)) {
          productionSymbols = prod;
          action = null;
        } else if (typeof prod === "object" && Array.isArray(prod.symbols)) {
          productionSymbols = prod.symbols;
          action = prod.action;
        } else {
          throw new Error(`Invalid production for symbol "${symbol}".`);
        }

        let currentPos = pos;
        let currentLine = line;
        let currentCol = col;
        const children = [];
        let failed = false;
        // Handle epsilon (empty production)
        if (productionSymbols.length === 0) {
          let node = { symbol, children: [] };
          if (action) node = action([]);
          return { node, pos: currentPos, line: currentLine, col: currentCol };
        }
        for (const token of productionSymbols) {
          let result;
          if (typeof token === "string" && grammar.rules.hasOwnProperty(token)) {
            result = match(token, currentPos, currentLine, currentCol);
          } else if (typeof token === "object" && token.type === "regex") {
            const remaining = input.slice(currentPos);
            const matchResult = token.pattern.exec(remaining);
            if (matchResult && matchResult.index === 0) {
              const matchedText = matchResult[0];
              const updated = updateLineCol(matchedText, currentLine, currentCol);
              result = { node: matchedText, pos: currentPos + matchedText.length, line: updated.line, col: updated.col };
            } else {
              expectedAtFarthest.add(`pattern ${token.pattern}`);
              result = null;
            }
          } else if (typeof token === "string") {
            if (input.substr(currentPos, token.length) === token) {
              const updated = updateLineCol(token, currentLine, currentCol);
              result = { node: token, pos: currentPos + token.length, line: updated.line, col: updated.col };
            } else {
              expectedAtFarthest.add(`'${token}'`);
              result = null;
            }
          } else {
            result = null;
          }
          if (result === null) {
            failed = true;
            break;
          }
          children.push(result.node);
          // Always skip ignored tokens after matching.
          let skipAfter = skipIgnored(result.pos, result.line, result.col);
          currentPos = skipAfter.pos;
          currentLine = skipAfter.line;
          currentCol = skipAfter.col;
        }
        if (!failed) {
          // By default, wrap the children in an object.
          let node = { symbol, children };
          // If an action was provided, use it to transform the children.
          if (action) {
            node = action(children);
          }
          return { node, pos: currentPos, line: currentLine, col: currentCol };
        }
      }
      return null;
    } else if (typeof symbol === "object" && symbol.type === "regex") {
      const remaining = input.slice(pos);
      const matchResult = symbol.pattern.exec(remaining);
      if (matchResult && matchResult.index === 0) {
        const matchedText = matchResult[0];
        const updated = updateLineCol(matchedText, line, col);
        return { node: matchedText, pos: pos + matchedText.length, line: updated.line, col: updated.col };
      }
      expectedAtFarthest.add(`pattern ${symbol.pattern}`);
      return null;
    } else if (typeof symbol === "string") {
      if (input.substr(pos, symbol.length) === symbol) {
        const updated = updateLineCol(symbol, line, col);
        return { node: symbol, pos: pos + symbol.length, line: updated.line, col: updated.col };
      }
      expectedAtFarthest.add(`'${symbol}'`);
      return null;
    } else {
      throw new Error(`Unknown symbol type: ${symbol}`);
    }
  }

  const result = match(grammar.start);
  let finalSkip = skipIgnored(result ? result.pos : 0, result ? result.line : 1, result ? result.col : 0);
  if (result && finalSkip.pos === input.length) {
    return result.node;
  }
  const expectedList = Array.from(expectedAtFarthest).join(", ");
  throw new Error(
    `Syntax error at line ${farthestLine}, column ${farthestCol}. Expected: ${expectedList}`
  );
}

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