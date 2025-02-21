/**
 * Parses arithmetic expressions using a user-defined grammar that specifies whitespace handling.
 * This parser tracks the farthest error position and expected tokens for improved error reporting.
 *
 * @param {string} input - The input string to parse.
 * @param {object} grammar - The grammar definition, including a `skip` property.
 * @returns {object} - The abstract syntax tree (AST) if parsing succeeds.
 * @throws {Error} - If parsing fails with a detailed message.
 */
function parseArithmetic(input, grammar) {
  let farthestPos = 0;
  let expectedAtFarthest = new Set();

  // Helper: uses grammar.skip (if provided) to skip ignorable input.
  function skipIgnored(pos) {
    if (grammar.skip && grammar.skip.type === "regex") {
      while (true) {
        const remaining = input.slice(pos);
        const matchResult = grammar.skip.pattern.exec(remaining);
        if (matchResult && matchResult.index === 0) {
          pos += matchResult[0].length;
        } else {
          break;
        }
      }
    }
    return pos;
  }

  /**
   * Attempts to match a given symbol starting at position `pos`.
   * @param {string|object} symbol - The symbol (nonterminal, literal, or regex object) to match.
   * @param {number} pos - The current position in the input.
   * @returns {object|null} - { node, pos } if successful, otherwise null.
   */
  function match(symbol, pos = 0, line = 1, col = 0) {
    pos = skipIgnored(pos);

    // Update farthest position if needed.
    if (pos > farthestPos) {
      farthestPos = pos;
      expectedAtFarthest.clear();
    }

    // If symbol is a nonterminal (a string that's a key in grammar.rules)
    if (typeof symbol === "string" && grammar.rules.hasOwnProperty(symbol)) {
      for (const production of grammar.rules[symbol]) {
        let currentPos = pos;
        const children = [];
        let failed = false;
        // Handle epsilon (empty production)
        if (production.length === 0) {
          return { node: { symbol, children: [] }, pos: currentPos };
        }
        for (const token of production) {
          let result;
          if (typeof token === "string" && grammar.rules.hasOwnProperty(token)) {
            result = match(token, currentPos);
          } else if (typeof token === "object" && token.type === "regex") {
            const remaining = input.slice(currentPos);
            const matchResult = token.pattern.exec(remaining);
            if (matchResult && matchResult.index === 0) {
              const matchedText = matchResult[0];
              result = { node: matchedText, pos: currentPos + matchedText.length };
            } else {
              // Record expectation for a regex match.
              expectedAtFarthest.add(`pattern ${token.pattern}`);
              result = null;
            }
          } else if (typeof token === "string") {
            if (input.substr(currentPos, token.length) === token) {
              result = { node: token, pos: currentPos + token.length };
            } else {
              // Record expectation for a literal match.
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
          currentPos = skipIgnored(result.pos);
        }
        if (!failed) {
          return { node: { symbol, children }, pos: currentPos };
        }
      }
      return null;
    } else if (typeof symbol === "object" && symbol.type === "regex") {
      const remaining = input.slice(pos);
      const matchResult = symbol.pattern.exec(remaining);
      if (matchResult && matchResult.index === 0) {
        return { node: matchResult[0], pos: pos + matchResult[0].length };
      }
      // Record expectation for this regex terminal.
      expectedAtFarthest.add(`pattern ${symbol.pattern}`);
      return null;
    } else if (typeof symbol === "string") {
      if (input.substr(pos, symbol.length) === symbol) {
        return { node: symbol, pos: pos + symbol.length };
      }
      expectedAtFarthest.add(`'${symbol}'`);
      return null;
    } else {
      throw new Error(`Unknown symbol type: ${symbol}`);
    }
  }

  const result = match(grammar.start);
  if (result && skipIgnored(result.pos) === input.length) {
    return result.node;
  }
  // Construct an error message using the farthest error position and expectations.
  const expectedList = Array.from(expectedAtFarthest).join(", ");
  throw new Error(
    `Syntax error at position ${farthestPos}. Expected: ${expectedList}`
  );
}

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
const inputExpression = "12 + 3* . (3 - 1)";
try {
  const ast = parseArithmetic(inputExpression, arithmeticGrammar);
  console.log("Parsing succeeded. AST:");
  console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error("Error:", error.message);
}
