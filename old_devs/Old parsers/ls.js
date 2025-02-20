class AbstractLexer {
  constructor(states, state) {
    this.startState = state;
    this.states = states;
    this.buffer = "";
    this.stack = [];
    this.reset();
  }

  reset(data = "", info = {}) {
    this.buffer = data;
    this.index = 0;
    this.line = info.line || 1;
    this.col = info.col || 1;
    this.queuedToken = info.queuedToken || null;
    this.queuedText = info.queuedText || "";
    this.queuedThrow = info.queuedThrow || null;
    this.setState(info.state || this.startState);
    this.stack = info.stack ? [...info.stack] : [];
    return this;
  }

  save() {
    return {
      line: this.line,
      col: this.col,
      state: this.state,
      stack: [...this.stack],
      queuedToken: this.queuedToken,
      queuedText: this.queuedText,
      queuedThrow: this.queuedThrow,
    };
  }

  setState(state) {
    if (!state || this.state === state) return;
    this.state = state;
    const info = this.states[state];
    this.groups = info.groups;
    this.error = info.error;
    this.re = info.regexp;
    this.fast = info.fast;
  }

  popState() {
    this.setState(this.stack.pop());
  }

  pushState(state) {
    this.stack.push(this.state);
    this.setState(state);
  }

  next() {
    const index = this.index;
    if (this.queuedGroup) {
      const token = this._token(this.queuedGroup, this.queuedText, index);
      this.queuedGroup = null;
      this.queuedText = "";
      return token;
    }

    if (index === this.buffer.length) {
      return; // EOF
    }

    const group = this.fast[this.buffer.charCodeAt(index)];
    if (group) {
      return this._token(group, this.buffer.charAt(index), index);
    }

    const re = this.re;
    re.lastIndex = index;
    const match = AbstractLexer._eat(re, this.buffer);

    if (!match) {
      return this._token(this.error, this.buffer.slice(index), index);
    }

    const groupMatch = this._getGroup(match);
    const text = match[0];

    if (this.error.fallback && match.index !== index) {
      this.queuedGroup = groupMatch;
      this.queuedText = text;
      return this._token(this.error, this.buffer.slice(index, match.index), index);
    }

    return this._token(groupMatch, text, index);
  }

  _token(group, text, offset) {
    let lineBreaks = 0;
    if (group.lineBreaks) {
      const matchNL = /\n/g;
      let nl = 1;
      if (text === "\n") {
        lineBreaks = 1;
      } else {
        while (matchNL.exec(text)) {
          lineBreaks++;
          nl = matchNL.lastIndex;
        }
      }
    }

    const token = {
      type: typeof group.type === "function" ? group.type(text) : group.defaultType,
      value: typeof group.value === "function" ? group.value(text) : text,
      text,
      toString: AbstractLexer._tokenToString,
      offset,
      lineBreaks,
      line: this.line,
      col: this.col,
    };

    const size = text.length;
    this.index += size;
    this.line += lineBreaks;
    if (lineBreaks !== 0) {
      this.col = size - nl + 1;
    } else {
      this.col += size;
    }

    if (group.shouldThrow) {
      throw new Error(this.formatError(token, "invalid syntax"));
    }

    if (group.pop) this.popState();
    else if (group.push) this.pushState(group.push);
    else if (group.next) this.setState(group.next);

    return token;
  }

  _getGroup(match) {
    for (let i = 0; i < this.groups.length; i++) {
      if (match[i + 1] !== undefined) {
        return this.groups[i];
      }
    }
    throw new Error("Cannot find token type for matched text");
  }

  static _tokenToString() {
    return this.value;
  }

  static _eat(re, buffer) {
    const match = re.exec(buffer);
    return match && match[0].length > 0 ? match : null;
  }

  formatError(token, message) {
    const lines = AbstractLexer._lastNLines(this.buffer, token.line);
    const start = Math.max(0, token.col - 1);
    const indicator = "^".padStart(start + 1);
    return `${message}\n${lines.join("\n")}\n${indicator}`;
  }

  static _lastNLines(string, numLines) {
    let position = string.length;
    let lineBreaks = 0;
    while (position > 0 && lineBreaks < numLines) {
      position = string.lastIndexOf("\n", position - 1);
      if (position !== -1) lineBreaks++;
    }
    return string.substring(position + 1).split("\n");
  }
}

