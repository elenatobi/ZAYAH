import re

class HTMLNode:
    def __init__(self, tag, attributes=None, content=None):
        self.tag = tag
        self.attributes = attributes or {}
        self.children = []
        self.content = content or ""

    def __repr__(self, level=0):
        '''
        indent = "  " * level
        attrs = " ".join(f'{k}="{v}"' for k, v in self.attributes.items())
        attrs = f" {attrs}" if attrs else ""
        
        # Start tag
        result = f"{indent}<{self.tag}{attrs}>"
        
        # Add content if available, inline if no children
        if self.content and not self.children:
            result += f"{self.content}"
        
        # Add children tags (if any) in one line if possible
        if self.children:
            child_repr = " ".join(str(child) for child in self.children)
            result += f"{child_repr}"
        
        # Close the tag
        result += f"</{self.tag}>"
        
        return result
        '''
        return str(vars(self))

class HTMLParser:
    def __init__(self, html, strict_mode=True):
        self.html = html
        self.pos = 0
        self.strict_mode = strict_mode

    def parse(self):
        """Parses the HTML into a tree structure."""
        root = HTMLNode("root")
        stack = [root]
        while self.pos < len(self.html):
            if self.html[self.pos] == "<":
                try:
                    element = self.parse_tag()
                    if element["type"] == "start":
                        node = HTMLNode(element["tag"], element["attributes"])
                        stack[-1].children.append(node)
                        if not element["is_self_closing"]:
                            stack.append(node)
                    elif element["type"] == "end":
                        if stack[-1].tag != element["tag"]:
                            self.handle_malformed_tag(element['tag'])
                        stack.pop()
                except ValueError as e:
                    if self.strict_mode:
                        raise e  # Raise error if strict mode is enabled
                    else:
                        print(f"Warning: {e}. Attempting to recover...")
                        self.handle_malformed_html()  # Handle recovery
            else:
                content = self.parse_content()
                if content.strip():
                    stack[-1].content += content.strip()
        return root

    def handle_malformed_tag(self, tag_name):
        """Handle a malformed closing tag error by trying to recover or filling missing parts."""
        if self.strict_mode:
            raise ValueError(f"Malformed HTML: Mismatched tag </{tag_name}>")
        else:
            print(f"Warning: Mismatched tag </{tag_name}>. Attempting to recover.")
            # Recovery logic for malformed tag (skip over it, or attempt to fix the context)
            self.pos = self.html.find("<", self.pos)  # Skip to the next tag for recovery

    def handle_malformed_html(self):
        """Attempts to recover from malformed HTML by filling missing parts or closing unclosed tags."""
        next_tag = self.html.find("<", self.pos)
        if next_tag == -1:
            self.pos = len(self.html)
        else:
            self.pos = next_tag

    def parse_tag(self):
        """Parses a tag and returns its details."""
        if self.html[self.pos] != "<":
            raise ValueError("Expected a tag.")

        tag_end = self.html.find(">", self.pos)
        if tag_end == -1:
            raise ValueError("Malformed HTML: Tag not closed.")

        tag_content = self.html[self.pos + 1:tag_end].strip()
        self.pos = tag_end + 1

        # Closing tag
        if tag_content.startswith("/"):
            return {"type": "end", "tag": tag_content[1:].strip()}

        # Opening/self-closing tag
        is_self_closing = tag_content.endswith("/")
        if is_self_closing:
            tag_content = tag_content[:-1].strip()

        tag_name, attrs = self.parse_tag_name_and_attrs(tag_content)
        return {"type": "start", "tag": tag_name, "attributes": attrs, "is_self_closing": is_self_closing}

    def parse_tag_name_and_attrs(self, tag_content):
        """Extracts tag name and attributes."""
        tag_name_match = re.match(r'^[a-zA-Z][\w-]*', tag_content)  # Allow for more characters in tag names
        if not tag_name_match:
            raise ValueError(f"Malformed HTML: Invalid tag name in '{tag_content}'")

        tag_name = tag_name_match.group(0)
        attrs = dict(re.findall(r'(\w+)=["\']([^"\']+)["\']', tag_content))
        return tag_name, attrs

    def parse_content(self):
        """Parses text content until the next tag."""
        next_tag = self.html.find("<", self.pos)
        if next_tag == -1:
            content = self.html[self.pos:]
            self.pos = len(self.html)
        else:
            content = self.html[self.pos:next_tag]
            self.pos = next_tag
        return content


def read_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        return content

# Example usage
html = read_file("test.html")

# Parser with strict_mode set to False to attempt error recovery
parser = HTMLParser(html, strict_mode=False)
parsed_tree = parser.parse()
print(vars(parsed_tree))
