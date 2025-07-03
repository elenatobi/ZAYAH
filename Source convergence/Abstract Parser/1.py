class AbstractLexer:
    def __init__(self, input_text):
        self.input_text = input_text
        self.index = 0
        self.length = len(input_text)

    def get_next_token(self):
        raise NotImplementedError("Subclasses must implement get_next_token")

    def consume_until(self, stop_chars):
        start = self.index
        while self.index < self.length and self.input_text[self.index] not in stop_chars:
            self.index += 1
        return self.input_text[start:self.index]

    def skip_whitespace(self):
        while self.index < self.length and self.input_text[self.index].isspace():
            self.index += 1

class HTMLLexer(AbstractLexer):
    def get_next_token(self):
        if self.index >= self.length:
            return None

        char = self.input_text[self.index]

        if char == '<':
            if self.input_text[self.index + 1:self.index + 9].upper() == '!DOCTYPE':
                return self._consume_doctype()
            elif self.input_text[self.index + 1] == '/':
                return self._consume_closing_tag()
            elif self.input_text[self.index + 1] == '!':
                return self._consume_comment()
            else:
                return self._consume_opening_tag()
        else:
            return self._consume_text()

    def _consume_doctype(self):
        self.index += 2  # Skip '<!'
        self.skip_whitespace()
        doctype = self.consume_until('>')
        self.index += 1  # Skip '>'
        return Doctype(doctype.strip())

    def _consume_opening_tag(self):
        self.index += 1  # Skip '<'
        self.skip_whitespace()
        tag_name = self.consume_until(' />\t\n')
        attributes = self._consume_attributes()
        is_self_closing = self.input_text[self.index] == '/'
        if is_self_closing:
            self.index += 1
        self.index += 1  # Skip '>'
        return StartTag(tag_name, attributes, is_self_closing)

    def _consume_closing_tag(self):
        self.index += 2  # Skip '</'
        self.skip_whitespace()
        tag_name = self.consume_until('>\t\n')
        self.index += 1  # Skip '>'
        return EndTag(tag_name)

    def _consume_text(self):
        text = self.consume_until('<')
        return Text(text.strip())

    def _consume_comment(self):
        self.index += 4  # Skip '<!--'
        comment = self.consume_until('-->')
        self.index += 3  # Skip '-->'
        return Comment(comment.strip())

    def _consume_attributes(self):
        attributes = {}
        while self.input_text[self.index] not in '>/':
            self.skip_whitespace()
            if self.input_text[self.index] in '/>':
                break

            attr_name = self.consume_until('=')
            self.index += 1  # Skip '='
            quote = self.input_text[self.index]
            self.index += 1  # Skip opening quote
            attr_value = self.consume_until(quote)
            self.index += 1  # Skip closing quote

            attributes[attr_name.strip()] = attr_value.strip()
        return attributes

class HTMLToken:
    pass

class Doctype(HTMLToken):
    def __init__(self, content):
        self.type = "doctype"
        self.content = content

    def __repr__(self):
        return f"Doctype(content={self.content!r})"

class StartTag(HTMLToken):
    def __init__(self, tag, attributes, self_closing):
        self.type = "start_tag"
        self.tag = tag
        self.attributes = attributes
        self.self_closing = self_closing

    def __repr__(self):
        return f"StartTag(tag={self.tag!r}, attributes={self.attributes!r}, self_closing={self.self_closing})"

class EndTag(HTMLToken):
    def __init__(self, tag):
        self.type = "end_tag"
        self.tag = tag

    def __repr__(self):
        return f"EndTag(tag={self.tag!r})"

class Text(HTMLToken):
    def __init__(self, content):
        self.type = "text"
        self.content = content

    def __repr__(self):
        return f"Text(content={self.content!r})"

class Comment(HTMLToken):
    def __init__(self, content):
        self.type = "comment"
        self.content = content

    def __repr__(self):
        return f"Comment(content={self.content!r})"

class HTMLTag(HTMLToken):
    def __init__(self, tag, attributes, content):
        self.tag = tag
        self.attributes = attributes
        self.content = content

    def __repr__(self):
        return f"HTMLTag(tag={self.tag!r}, attributes={self.attributes!r}, content={self.content!r})"

class HTML5Parser:
    def __init__(self, html):
        self.lexer = HTMLLexer(html)
        self.tree = []

    def parse(self):
        stack = []
        while True:
            token = self.lexer.get_next_token()
            if not token:
                break

            if isinstance(token, StartTag):
                if token.self_closing:
                    self.tree.append(HTMLTag(token.tag, token.attributes, None))
                else:
                    stack.append(token)
            elif isinstance(token, EndTag):
                if stack and stack[-1].tag == token.tag:
                    start_tag = stack.pop()
                    content = []
                    while self.tree and not isinstance(self.tree[-1], StartTag):
                        content.insert(0, self.tree.pop())
                    self.tree.append(HTMLTag(start_tag.tag, start_tag.attributes, content))
            else:
                self.tree.append(token)

        return self.tree

# Example usage
html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a simple paragraph.</p>
    <!-- This is a comment -->
</body>
</html>
"""

parser = HTML5Parser(html_content)
parsed_tree = parser.parse()
for element in parsed_tree:
    print(element)

