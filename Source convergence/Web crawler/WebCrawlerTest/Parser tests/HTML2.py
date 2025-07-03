from collections import namedtuple
import re

# Define a simple token structure
Token = namedtuple("Token", ["type", "value"])


class AbstractParser:
    """Abstract parser interface."""

    def __init__(self, tokens):
        self.tokens = tokens
        self.position = 0

    def parse(self):
        """Main entry point for parsing."""
        raise NotImplementedError("Subclasses must implement the parse method.")

    def current_token(self):
        """Returns the current token or None if out of tokens."""
        if self.position < len(self.tokens):
            return self.tokens[self.position]
        return None

    def advance(self):
        """Advance to the next token."""
        self.position += 1

class Node:
    """Represents an HTML node."""
    def __init__(self, tag, attributes=None, parent=None):
        self.tag = tag
        self.attributes = attributes or {}
        self.children = []
        self.parent = parent

    def __repr__(self):
        return self._repr(0).strip()

    def _repr(self, level):
        indent = "    " * level
        attr_string = " ".join(f'{key}="{value}"' for key, value in self.attributes.items())
        opening_tag = f"<{self.tag} {attr_string.strip()}>" if attr_string else f"<{self.tag}>"
        closing_tag = f"</{self.tag}>" if self.tag != "text" else ""

        # Render opening tag
        result = f"{indent}{opening_tag}\n"

        # Render children
        for child in self.children:
            result += child._repr(level + 1)

        # Render closing tag
        result += f"{indent}{closing_tag}\n" if closing_tag else ""
        return result


class TextNode(Node):
    """Represents a text node."""
    def __init__(self, content, parent=None):
        super().__init__(tag="text", parent=parent)
        self.content = content

    def _repr(self, level):
        indent = "    " * level
        return f"{indent}{self.content}\n"


class HTMLParser(AbstractParser):
    """Parser for HTML tokens into a DOM tree."""

    def __init__(self, tokens):
        super().__init__(tokens)
        self.root = Node("document")  # Root of the DOM tree
        self.current_node = self.root

    def parse(self):
        """Parses the token stream into a DOM tree."""
        while self.current_token() is not None:
            token = self.current_token()
            if token.type == "starttag":
                self.handle_start_tag(token)
            elif token.type == "endtag":
                self.handle_end_tag(token)
            elif token.type == "content":
                self.handle_content(token)
            elif token.type == "whitespace":
                self.advance()  # Skip whitespace tokens
            else:
                raise ValueError(f"Unknown token type: {token.type}")
        return self.root

    def handle_start_tag(self, token):
        """Handles start tags."""
        tag, attributes = self.parse_start_tag(token.value)
        new_node = Node(tag, attributes, parent=self.current_node)
        self.current_node.children.append(new_node)
        self.current_node = new_node
        self.advance()

    def handle_end_tag(self, token):
        """Handles end tags."""
        tag = token.value.strip("</>")
        if self.current_node.tag == tag:
            self.current_node = self.current_node.parent
        else:
            raise ValueError(f"Unexpected end tag: {tag}")
        self.advance()

    def handle_content(self, token):
        """Handles text content."""
        text_node = TextNode(token.value, parent=self.current_node)
        self.current_node.children.append(text_node)
        self.advance()

    def parse_start_tag(self, tag_content):
        """Parses a start tag and extracts attributes."""
        # Match the tag name and attributes using regex
        tag_match = re.match(r"<(\w+)", tag_content)
        if not tag_match:
            raise ValueError(f"Invalid tag content: {tag_content}")

        tag = tag_match.group(1)  # Extract the tag name
        attributes = {}

        # Match attributes in the form key="value" or key = "value"
        attr_matches = re.findall(r'(\w+)\s*=\s*["\']([^"\']*)["\']', tag_content)
        for key, value in attr_matches:
            attributes[key] = value

        return tag, attributes

# Define tokens for the example HTML
tokens = [
    Token("starttag", "<html>"),
    Token("starttag", "<body>"),
    Token("starttag", "<ul id=\"aabb\" attr2=\"attr2content\">"),
    Token("starttag", "<li>"),
    Token("content", "First item"),
    Token("endtag", "</li>"),
    Token("starttag", "<li>"),
    Token("content", "Second item with "),
    Token("starttag", "<em>"),
    Token("content", "emphasis"),
    Token("endtag", "</em>"),
    Token("content", "."),
    Token("endtag", "</li>"),
    Token("endtag", "</ul>"),
    Token("endtag", "</body>"),
    Token("endtag", "</html>"),
]

# Parse the tokens into a DOM tree
parser = HTMLParser(tokens)
dom_tree = parser.parse()
print(dom_tree)
