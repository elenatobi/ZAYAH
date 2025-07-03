from html.parser import HTMLParser

class HTMLElement:
    def __init__(self, tag, attrs=None):
        self.tag = tag
        self.attrs = attrs or {}
        self.children = []
        self.data = []  # Changed to store both raw text and nested elements
        self.parent = None

    def append_child(self, child):
        self.children.append(child)
        child.parent = self

    def append_data(self, text):
        if text.strip():
            self.data.append(text)

    def find_attr(self, attr_name, attr_value):
        result = []        
        if self.attrs.get(attr_name) == attr_value:
            result.append(self)
        for child in self.children:
            result.extend(child.find_attr(attr_name, attr_value))
        
        return result

    def find_tag(self, tag_name):
        result = []        
        if self.tag == tag_name:
            result.append(self)
        for child in self.children:
            result.extend(child.find_tag(tag_name))
        
        return result

    def serialize(self):
        # Serialize attributes
        attr_str = " ".join(f'{key}="{value}"' for key, value in self.attrs.items())
        attr_str = f" {attr_str}" if attr_str else ""

        # Open tag
        opening_tag = f"<{self.tag}{attr_str}>"

        # Close tag
        closing_tag = f"</{self.tag}>"

        # Serialize children and mixed data
        children_html = "".join(child.serialize() for child in self.children)
        data_html = "".join(self.data)  # Concatenate text data

        # Combine everything
        if self.children or self.data:
            return f"{opening_tag}{data_html}{children_html}{closing_tag}"
        else:
            return f"<{self.tag}{attr_str} />"

    def extract_text(self):
        text = ""
        for data_item in self.data:
            text += data_item
        for child in self.children:
            text += child.extract_text()
        return text

    def __getitem__(self, index):
        return self.children[index]


class HTMLDOMParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = None
        self.current_element = None
        self.last_text = ""

    def handle_starttag(self, tag, attrs):
        # If there is any pending text, create a new element for it
        if self.last_text.strip():
            text_element = HTMLElement("span")
            self.current_element.append_child(text_element)
            text_element.append_data(self.last_text)
            self.last_text = ""

        # Create a new element for the start tag
        element = HTMLElement(tag, dict(attrs))
        
        if self.current_element is None:
            # This is the root element (if no parent)
            self.root = element
        else:
            # Append to current element's children
            self.current_element.append_child(element)
        
        # Now set the current element to this new element
        self.current_element = element

    def handle_endtag(self, tag):
        # If there is any pending text, create a new element for it
        if self.last_text.strip():
            text_element = HTMLElement("span")
            self.current_element.append_child(text_element)
            text_element.append_data(self.last_text)
            self.last_text = ""
        
        # Move back up to the parent element
        if self.current_element is not None and self.current_element.tag == tag:
            self.current_element = self.current_element.parent

    def handle_data(self, data):
        # Accumulate text data
        if self.current_element:
            self.last_text += data

    def get_dom_tree(self):
        return self.root

    def print_dom_tree(self, element=None, level=0):
        if element is None:
            element = self.root
        print(" " * level * 2 + f"<{element.tag}> {''.join(element.data)}")
        for child in element.children:
            self.print_dom_tree(child, level + 1)


html_content = None

with open("result3.txt", "r") as file:
    html_content = file.read()

parser = HTMLDOMParser()
parser.feed(html_content)

dom_tree = parser.get_dom_tree()
content_list = dom_tree.find_attr("class", "accordionOne")
for content_element in content_list:
    header = content_element.find_tag("h2")[0][0].data[0].strip()
    body = content_element[1][0].extract_text().strip()
    print(header)
    print(body)
    print(64*"-")