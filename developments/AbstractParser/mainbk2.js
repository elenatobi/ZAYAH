/**
 * Parses arithmetic expressions using a user-defined grammar that specifies whitespace handling.
 * This parser tracks the farthest error position along with line and column numbers.
 *
 * @param {string} input - The input string to parse.
 * @param {object} grammar - The grammar definition, including a `skip` property.
 * @returns {object} - The abstract syntax tree (AST) if parsing succeeds.
 * @throws {Error} - If parsing fails with a detailed message.
 */
function parseArithmetic(input, grammar) {
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
      for (const production of grammar.rules[symbol]) {
        let currentPos = pos;
        let currentLine = line;
        let currentCol = col;
        const children = [];
        let failed = false;
        // Handle epsilon (empty production)
        if (production.length === 0) {
          return { node: { symbol, children: [] }, pos: currentPos, line: currentLine, col: currentCol };
        }
        for (const token of production) {
          let result;
          if (typeof token === "string" && grammar.rules.hasOwnProperty(token)) {
            result = match(token, currentPos, currentLine, currentCol);
          } else if (typeof token === "object" && token.type === "regex") {
            const remaining = input.slice(currentPos);
            const matchResult = token.pattern.exec(remaining);
            if (matchResult && matchResult.index === 0) {
              const matchedText = matchResult[0];
              // Update line and col based on matched text.
              const updated = updateLineCol(matchedText, currentLine, currentCol);
              result = { node: matchedText, pos: currentPos + matchedText.length, line: updated.line, col: updated.col };
            } else {
              // Record expectation for a regex match.
              expectedAtFarthest.add(`pattern ${token.pattern}`);
              result = null;
            }
          } else if (typeof token === "string") {
            if (input.substr(currentPos, token.length) === token) {
              // Update line and col for literal text.
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
          return { node: { symbol, children }, pos: currentPos, line: currentLine, col: currentCol };
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
  // Construct an error message using the farthest error position and expectations.
  const expectedList = Array.from(expectedAtFarthest).join(", ");
  throw new Error(
    `Syntax error at line ${farthestLine}, column ${farthestCol}. Expected: ${expectedList}`
  );
}

// Example arithmetic grammar remains the same as before.
const arithmeticGrammar = {
  start: "Expr",
  skip: { type: "regex", pattern: /^\s+/ },
  rules: {
    Expr: [
      ["Term", "ExprPrime"]
    ],
    ExprPrime: [
      ["+", "Term", "ExprPrime"],
      ["-", "Term", "ExprPrime"],
      []
    ],
    Term: [
      ["Factor", "TermPrime"]
    ],
    TermPrime: [
      ["*", "Factor", "TermPrime"],
      ["/", "Factor", "TermPrime"],
      []
    ],
    Factor: [
      ["(", "Expr", ")"],
      ["number"]
    ],
    number: [
      [{ type: "regex", pattern: /^[0-9]+(\.[0-9]+)?/ }]
    ]
  }
};

// Testing with malformed input:
const inputExpression = "12 + 3* (3 - 1)";
try {
  const ast = parseArithmetic(inputExpression, arithmeticGrammar);
  console.log("Parsing succeeded. AST:");
  console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error("Error:", error.message);
}
