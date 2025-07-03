import re

class AbstractLexer:
    def __init__(self, rules, text):
        self.rules = rules
        self.text = text
        self.position = 0
        self.tokens = []

    def tokenize(self):
        combined_pattern = '|'.join(f'(?P<{pair[0]}>{pair[1]})' for pair in self.rules)
        regex = re.compile(combined_pattern)

        for match in regex.finditer(self.text):
            for name, value in match.groupdict().items():
                if value is not None:
                    self.tokens.append((name, value))
        return self.tokens

HTML_RULES = [
    ('DOCTYPE', r'<!DOCTYPE[^>]*>'),
    ('TAG_OPEN', r'<([a-zA-Z][\w-]*)\s*([^>]*?)>'),
    ('TAG_CLOSE', r'</([a-zA-Z][\w-]*)>'),
    ('WHITESPACE', r'\s+'),
    ('TEXT', r'[^<]+'),
    ('COMMENT', r'<!--.*?-->'),
    ('SELF_CLOSING_TAG', r'<([a-zA-Z][\w-]*)(\s*[^>]*?)\s*/?>')
]

# Example usage
html_content = '''
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
        </head>
<body>
    <p id="aabb">something</p>
</body>
</html>
'''

lexer = AbstractLexer(HTML_RULES, html_content)
tokens = lexer.tokenize()

# Print tokens
for token in tokens:
    print(token)

