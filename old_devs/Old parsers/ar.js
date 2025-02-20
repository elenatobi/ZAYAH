class State {
  constructor(rule, dot, start, end, action = null) {
    this.rule = rule;
    this.dot = dot;
    this.start = start;
    this.end = end;
    this.action = action;
    this.children = [];
  }

  isComplete() {
    return this.dot >= this.rule.length;
  }
}

class Parser {
  constructor(grammar) {
    this.grammar = grammar;
    this.chart = [];
  }

  parse(tokens) {
    this.chart = Array(tokens.length + 1)
      .fill(null)
      .map(() => []);

    const startState = new State([this.grammar.start], 0, 0, 0);
    this.chart[0].push(startState);

    for (let i = 0; i <= tokens.length; i++) {
      const states = this.chart[i];
      for (const state of states) {
        if (state.isComplete()) {
          this.complete(state, i);
        } else {
          const next = state.rule[state.dot];
          if (this.isNonTerminal(next)) {
            this.predict(next, i);
          } else {
            this.scan(state, tokens, i);
          }
        }
      }
    }

    const finalStates = this.chart[tokens.length].filter(
      (state) => state.isComplete() && state.rule[0] === this.grammar.start
    );

    if (finalStates.length > 0) {
      return this.buildAST(finalStates[0]);
    }

    return null;
  }

  predict(nonTerminal, position) {
    const rules = this.grammar.rules[nonTerminal];
    for (const [rule, action] of rules) {
      this.chart[position].push(new State(rule, 0, position, position, action));
    }
  }

  scan(state, tokens, position) {
    const next = state.rule[state.dot];
    if (position < tokens.length && tokens[position].type === next) {
      const newState = new State(
        state.rule,
        state.dot + 1,
        state.start,
        position + 1,
        state.action
      );
      newState.children = [...state.children, tokens[position]];
      this.chart[position + 1].push(newState);
    }
  }

  complete(state, position) {
    const states = this.chart[state.start];
    for (const prevState of states) {
      const next = prevState.rule[prevState.dot];
      if (next === state.rule[0]) { // Ensure matching the right symbol, not the whole rule
        const newState = new State(
          prevState.rule,
          prevState.dot + 1,
          prevState.start,
          position,
          prevState.action
        );
        newState.children = [...prevState.children, state];
        this.chart[position].push(newState);
      }
    }
  }

  isNonTerminal(symbol) {
    return this.grammar.rules[symbol] !== undefined;
  }

  buildAST(state) {
    const processChildren = state.children.map((child) => {
      if (child instanceof State) {
        return this.buildAST(child);
      }
      return child;
    });

    if (state.action) {
      return state.action(processChildren);
    }
    return processChildren;
  }
}

const grammar = {
  rules: {
    S: [
      [
        ["A", "B"],
        (children) => ({ type: "S", children }),
      ],
      [
        ["B", "A"],
        (children) => ({ type: "S", children }),
      ],
    ],
    A: [
      [
        ["TOKEN_A"],
        (children) => ({ type: "A", value: children[0].value }),
      ],
    ],
    B: [
      [
        ["TOKEN_B"],
        (children) => ({ type: "B", value: children[0].value }),
      ],
    ],
  },
  start: "S",
};

const tokens = [
  { type: "TOKEN_B", value: "b" },
  { type: "TOKEN_A", value: "a" },
];

const parser = new Parser(grammar);
const ast = parser.parse(tokens);
console.log(ast);
