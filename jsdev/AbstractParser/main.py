import re
import json

def parse(input, grammar):
    farthestPos = 0
    farthestLine = 1
    farthestCol = 0
    expectedAtFarthest = set()

    """
    Updates line and column numbers based on the text that was consumed.
    @param text: The consumed text.
    @param line: The starting line number.
    @param col: The starting column number.
    @returns: A dict with updated 'line' and 'col'.
    """
    def updateLineCol(text, line, col):
        for char in text:
            if char == "\n":
                line += 1
                col = 0
            else:
                col += 1
        return { "line": line, "col": col }

    # Helper: uses grammar.skip (if provided) to skip ignorable input.
    def skipIgnored(pos, line, col):
        if "skip" in grammar and grammar["skip"].get("type") == "regex":
            while True:
                remaining = input[pos:]
                matchResult = grammar["skip"]["pattern"].match(remaining)
                if matchResult is not None and matchResult.start() == 0:
                    matchedText = matchResult.group(0)
                    pos += len(matchedText)
                    updated = updateLineCol(matchedText, line, col)
                    line = updated["line"]
                    col = updated["col"]
                else:
                    break
        return { "pos": pos, "line": line, "col": col }

    """
    Attempts to match a given symbol starting at position 'pos'.
    @param symbol: The symbol (nonterminal, literal, or regex object) to match.
    @param pos: The current position in the input.
    @param line: The current line number.
    @param col: The current column number.
    @returns: A dict { node, pos, line, col } if successful, otherwise None.
    """
    def match(symbol, pos=0, line=1, col=0):
        nonlocal farthestPos, farthestLine, farthestCol, expectedAtFarthest
        # First, skip ignored input.
        skipResult = skipIgnored(pos, line, col)
        pos = skipResult["pos"]
        line = skipResult["line"]
        col = skipResult["col"]

        # Update farthest position and line/col if needed.
        if pos > farthestPos:
            farthestPos = pos
            farthestLine = line
            farthestCol = col
            expectedAtFarthest.clear()

        # If symbol is a nonterminal (a string that's a key in grammar.rules)
        if isinstance(symbol, str) and symbol in grammar["rules"]:
            for prod in grammar["rules"][symbol]:
                # Allow a production to be either an array (old style) or an object with { symbols, action }
                if isinstance(prod, list):
                    productionSymbols = prod
                    action = None
                elif isinstance(prod, dict) and isinstance(prod.get("symbols"), list):
                    productionSymbols = prod["symbols"]
                    action = prod.get("action")
                else:
                    raise Exception(f'Invalid production for symbol "{symbol}".')

                currentPos = pos
                currentLine = line
                currentCol = col
                children = []
                failed = False
                # Handle epsilon (empty production)
                if len(productionSymbols) == 0:
                    node = { "symbol": symbol, "children": [] }
                    if action is not None:
                        node = action([])
                    return { "node": node, "pos": currentPos, "line": currentLine, "col": currentCol }
                for token in productionSymbols:
                    result = None
                    if isinstance(token, str) and token in grammar["rules"]:
                        result = match(token, currentPos, currentLine, currentCol)
                    elif isinstance(token, dict) and token.get("type") == "regex":
                        remaining = input[currentPos:]
                        matchResult = token["pattern"].match(remaining)
                        if matchResult is not None and matchResult.start() == 0:
                            matchedText = matchResult.group(0)
                            updated = updateLineCol(matchedText, currentLine, currentCol)
                            result = { "node": matchedText, "pos": currentPos + len(matchedText), "line": updated["line"], "col": updated["col"] }
                        else:
                            expectedAtFarthest.add(f'pattern {token["pattern"]}')
                            result = None
                    elif isinstance(token, str):
                        if input[currentPos:currentPos+len(token)] == token:
                            updated = updateLineCol(token, currentLine, currentCol)
                            result = { "node": token, "pos": currentPos + len(token), "line": updated["line"], "col": updated["col"] }
                        else:
                            expectedAtFarthest.add(f"'{token}'")
                            result = None
                    else:
                        result = None

                    if result is None:
                        failed = True
                        break
                    children.append(result["node"])
                    # Always skip ignored tokens after matching.
                    skipAfter = skipIgnored(result["pos"], result["line"], result["col"])
                    currentPos = skipAfter["pos"]
                    currentLine = skipAfter["line"]
                    currentCol = skipAfter["col"]
                if not failed:
                    # By default, wrap the children in an object.
                    node = { "symbol": symbol, "children": children }
                    # If an action was provided, use it to transform the children.
                    if action is not None:
                        node = action(children)
                    return { "node": node, "pos": currentPos, "line": currentLine, "col": currentCol }
            return None
        elif isinstance(symbol, dict) and symbol.get("type") == "regex":
            remaining = input[pos:]
            matchResult = symbol["pattern"].match(remaining)
            if matchResult is not None and matchResult.start() == 0:
                matchedText = matchResult.group(0)
                updated = updateLineCol(matchedText, line, col)
                return { "node": matchedText, "pos": pos + len(matchedText), "line": updated["line"], "col": updated["col"] }
            expectedAtFarthest.add(f'pattern {symbol["pattern"]}')
            return None
        elif isinstance(symbol, str):
            if input[pos:pos+len(symbol)] == symbol:
                updated = updateLineCol(symbol, line, col)
                return { "node": symbol, "pos": pos + len(symbol), "line": updated["line"], "col": updated["col"] }
            expectedAtFarthest.add(f"'{symbol}'")
            return None
        else:
            raise Exception(f"Unknown symbol type: {symbol}")

    result = match(grammar["start"])
    finalSkip = skipIgnored(result["pos"] if result is not None else 0, result["line"] if result is not None else 1, result["col"] if result is not None else 0)
    if result is not None and finalSkip["pos"] == len(input):
        return result["node"]
    expectedList = ", ".join(expectedAtFarthest)
    raise Exception(f"Syntax error at line {farthestLine}, column {farthestCol}. Expected: {expectedList}")

# ------------------------------------------------------------------
# An updated arithmetic grammar that uses semantic actions to build an AST.
# We will use the “functional continuation” style for left-associative operators.
# ------------------------------------------------------------------

# Semantic action functions for the grammar productions.
def expr_action(children):
    # children[0] is a Term node; children[1] is a function (from ExprPrime)
    termNode = children[0]
    exprPrimeFunc = children[1]
    return exprPrimeFunc(termNode)

def exprprime_plus_action(children):
    # children[0] is "+", children[1] is a Term node, children[2] is a function.
    return lambda left: children[2]({
        "type": "BinaryExpression",
        "operator": "+",
        "left": left,
        "right": children[1]
    })

def exprprime_minus_action(children):
    return lambda left: children[2]({
        "type": "BinaryExpression",
        "operator": "-",
        "left": left,
        "right": children[1]
    })

def exprprime_epsilon_action(children):
    # Epsilon: identity function.
    return lambda left: left

def term_action(children):
    # children[0] is a Factor node; children[1] is a function (from TermPrime)
    factorNode = children[0]
    termPrimeFunc = children[1]
    return termPrimeFunc(factorNode)

def termprime_mul_action(children):
    return lambda left: children[2]({
        "type": "BinaryExpression",
        "operator": "*",
        "left": left,
        "right": children[1]
    })

def termprime_div_action(children):
    return lambda left: children[2]({
        "type": "BinaryExpression",
        "operator": "/",
        "left": left,
        "right": children[1]
    })

def termprime_epsilon_action(children):
    return lambda left: left

def factor_paren_action(children):
    # Simply return the expression inside the parentheses.
    return children[1]

def factor_number_action(children):
    # Wrap the number (a string) into a NumberLiteral AST node.
    return { "type": "NumberLiteral", "value": float(children[0]) }

def number_action(children):
    # Return the matched number as a string (to be processed later by Factor)
    return children[0]

arithmeticGrammar = {
    "start": "Expr",
    "skip": { "type": "regex", "pattern": re.compile(r"^\s+") },
    "rules": {
        # Expr -> Term ExprPrime
        "Expr": [
            {
                "symbols": ["Term", "ExprPrime"],
                "action": expr_action
            }
        ],
        # ExprPrime -> '+' Term ExprPrime | '-' Term ExprPrime | ε
        "ExprPrime": [
            {
                "symbols": ["+", "Term", "ExprPrime"],
                "action": exprprime_plus_action
            },
            {
                "symbols": ["-", "Term", "ExprPrime"],
                "action": exprprime_minus_action
            },
            {
                "symbols": [],
                "action": exprprime_epsilon_action
            }
        ],
        # Term -> Factor TermPrime
        "Term": [
            {
                "symbols": ["Factor", "TermPrime"],
                "action": term_action
            }
        ],
        # TermPrime -> '*' Factor TermPrime | '/' Factor TermPrime | ε
        "TermPrime": [
            {
                "symbols": ["*", "Factor", "TermPrime"],
                "action": termprime_mul_action
            },
            {
                "symbols": ["/", "Factor", "TermPrime"],
                "action": termprime_div_action
            },
            {
                "symbols": [],
                "action": termprime_epsilon_action
            }
        ],
        # Factor -> '(' Expr ')' | number
        "Factor": [
            {
                "symbols": ["(", "Expr", ")"],
                "action": factor_paren_action
            },
            {
                "symbols": ["number"],
                "action": factor_number_action
            }
        ],
        # number -> regex for a number
        "number": [
            {
                "symbols": [{ "type": "regex", "pattern": re.compile(r"^[0-9]+(\.[0-9]+)?" ) }],
                "action": number_action
            }
        ]
    }
}

# ------------------------------------------------------------------
# Testing the parser with a sample input expression.
# ------------------------------------------------------------------
inputExpression = "2 + 5 + 7 * 432.32 + 9 +5+3"
ast = parse(inputExpression, arithmeticGrammar)
print("Parsing succeeded. AST:")
print(json.dumps(ast, indent=2))
