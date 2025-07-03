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

// ------------------------------------------------------------------
// An updated arithmetic grammar that uses semantic actions to build an AST.
// We will use the “functional continuation” style for left-associative operators.
// ------------------------------------------------------------------
const arithmeticGrammar = {
  start: "Expr",
  skip: { type: "regex", pattern: /^\s+/ },
  rules: {
    // Expr -> Term ExprPrime
    Expr: [
      {
        symbols: ["Term", "ExprPrime"],
        action: (children) => {
          // children[0] is a Term node; children[1] is a function (from ExprPrime)
          const termNode = children[0];
          const exprPrimeFunc = children[1];
          return exprPrimeFunc(termNode);
        }
      }
    ],
    // ExprPrime -> '+' Term ExprPrime | '-' Term ExprPrime | ε
    ExprPrime: [
      {
        symbols: ["+", "Term", "ExprPrime"],
        action: (children) => {
          // children[0] is "+", children[1] is a Term node, children[2] is a function.
          return (left) => children[2]({
            type: "BinaryExpression",
            operator: "+",
            left,
            right: children[1]
          });
        }
      },
      {
        symbols: ["-", "Term", "ExprPrime"],
        action: (children) => {
          return (left) => children[2]({
            type: "BinaryExpression",
            operator: "-",
            left,
            right: children[1]
          });
        }
      },
      {
        symbols: [],
        action: () => {
          // Epsilon: identity function.
          return (left) => left;
        }
      }
    ],
    // Term -> Factor TermPrime
    Term: [
      {
        symbols: ["Factor", "TermPrime"],
        action: (children) => {
          const factorNode = children[0];
          const termPrimeFunc = children[1];
          return termPrimeFunc(factorNode);
        }
      }
    ],
    // TermPrime -> '*' Factor TermPrime | '/' Factor TermPrime | ε
    TermPrime: [
      {
        symbols: ["*", "Factor", "TermPrime"],
        action: (children) => {
          return (left) => children[2]({
            type: "BinaryExpression",
            operator: "*",
            left,
            right: children[1]
          });
        }
      },
      {
        symbols: ["/", "Factor", "TermPrime"],
        action: (children) => {
          return (left) => children[2]({
            type: "BinaryExpression",
            operator: "/",
            left,
            right: children[1]
          });
        }
      },
      {
        symbols: [],
        action: () => {
          return (left) => left;
        }
      }
    ],
    // Factor -> '(' Expr ')' | number
    Factor: [
      {
        symbols: ["(", "Expr", ")"],
        action: (children) => {
          // Simply return the expression inside the parentheses.
          return children[1];
        }
      },
      {
        symbols: ["number"],
        action: (children) => {
          // Wrap the number (a string) into a NumberLiteral AST node.
          return { type: "NumberLiteral", value: parseFloat(children[0]) };
        }
      }
    ],
    // number -> regex for a number
    number: [
      {
        symbols: [{ type: "regex", pattern: /^[0-9]+(\.[0-9]+)?/ }],
        action: (children) => {
          // Return the matched number as a string (to be processed later by Factor)
          return children[0];
        }
      }
    ]
  }
};

// ------------------------------------------------------------------
// Testing the parser with a sample input expression.
// ------------------------------------------------------------------
const inputExpression = "2 + 5 + 7 * 432.32 + 9 +5+3";
const ast = parse(inputExpression, arithmeticGrammar);
console.log("Parsing succeeded. AST:");
console.log(JSON.stringify(ast, null, 2));