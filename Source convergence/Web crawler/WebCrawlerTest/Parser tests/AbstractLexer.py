import re

class AbstractLexer:
    def __init__(self, rules, strict_mode=True):
        self.rules = rules
        self.strict_mode = strict_mode
        self.position = 0
        self.line_number = 1

    def reset(self, input_text):
        self.input_text = input_text
        self.position = 0
        self.line_number = 1

    def next(self):
        if self.position >= len(self.input_text):
            return None

        for token_name, matcher in self.rules:
            if isinstance(matcher, str):
                match = self._match_regex(matcher, self.input_text, self.position)
            elif callable(matcher):
                match = matcher(self.input_text, self.position)
            else:
                raise ValueError(f"Invalid matcher type for token '{token_name}'. Must be a string or callable.")

            if match:
                token_value, new_position = match
                token = {"type": token_name, "value": token_value}
                self.position = new_position
                return token

        # Handle unexpected character based on strict_mode
        if self.strict_mode:
            raise ValueError(f"LexerError: Unexpected character at position {self.position}: {self.input_text[self.position]}")
        else:
            # Recover: skip the unexpected character
            self.position += 1
            return {"type": "ERROR", "value": self.input_text[self.position - 1]}

    def _match_regex(self, pattern, text, position):
        regex = re.compile(pattern)
        match = regex.match(text, position)
        if match:
            return match.group(), match.end()
        return None

def match_keyword(keywords):
    def matcher(text, position):
        for keyword in keywords:
            if text.startswith(keyword, position) and (position + len(keyword) == len(text) or not text[position + len(keyword)].isalnum()):
                return keyword, position + len(keyword)
        return None
    return matcher

# HTML rules
HTML_RULES = [
    ('DOCTYPE', r'<!DOCTYPE[^>]*>'),
    ('TAG_OPEN', r'<([a-zA-Z][\w-]*)\s*([^>]*?)>'),
    ('TAG_CLOSE', r'</([a-zA-Z][\w-]*)>'),
    ('WHITESPACE', r'\s+'),
    ('TEXT', r'[^<]+'),
    ('COMMENT', r'<!--.*?-->'),
    ('SELF_CLOSING_TAG', r'<([a-zA-Z][\w-]*)(\s*[^>]*?)\s*/?>')
]

# Test content
html_content = '''
<div>
    <invalid>Some text</in
    <valid-tag>Content</valid-tag>
    <p>This is a <strong>nested</strong> paragraph.</p>
    <ul>
        <li>Item 1</li>
        <li id = "aa">Item 2</li>
    </ul>
</div>
'''

lexer = AbstractLexer(HTML_RULES, strict_mode=False)
lexer.reset(html_content)

while token := lexer.next():
    print(token)
