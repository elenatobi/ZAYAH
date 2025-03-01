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
  const ast = parse(inputExpression, arithmeticGrammar);
  console.log("Parsing succeeded. AST:");
  console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error("Error:", error.message);
}
