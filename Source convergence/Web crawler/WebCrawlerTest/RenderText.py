block_tags = {'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'}
inline_tags = {'b', 'i', 'a'}

def render_inline(element):
    """Render inline content continuously."""
    result = ''

    if element.text:
        result += element.text

    for child in element:
        if child.tag == 'b':
            result += f"**{render_inline(child)}**"
        elif child.tag == 'i':
            result += f"*{render_inline(child)}*"
        elif child.tag == 'a':
            href = child.get('href')
            if href:
                result += f"[{render_inline(child)}]({href})"
            else:
                result += f"[{render_inline(child)}]"
        else:
            result += render_inline(child)

        if child.tail:
            result += child.tail

    return result

def render_block(element, indent_level=0):
    """Render block elements with correct formatting."""
    markdown = ''

    if element.tag in {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}:
        level = int(element.tag[1])
        header_text = render_inline(element).strip()
        markdown += f"{'#' * level} {header_text}\n\n"

    elif element.tag == 'p':
        paragraph_text = render_inline(element).strip()
        if paragraph_text:
            markdown += f"{paragraph_text}\n\n"

    elif element.tag == 'ul':
        for li in element:
            if li.tag == 'li':
                item_text = render_inline(li).strip()
                markdown += f"{' ' * indent_level}- {item_text}\n"
                # Handle nested lists
                for child in li:
                    if child.tag in {'ul', 'ol'}:
                        markdown += render_block(child, indent_level + 2)

        markdown += '\n'

    elif element.tag == 'ol':
        item_counter = 1
        for li in element:
            if li.tag == 'li':
                item_text = render_inline(li).strip()
                markdown += f"{' ' * indent_level}{item_counter}. {item_text}\n"
                item_counter += 1
                # Handle nested lists
                for child in li:
                    if child.tag in {'ul', 'ol'}:
                        markdown += render_block(child, indent_level + 2)

        markdown += '\n'

    elif element.tag == 'div':
        for child in element:
            markdown += render_block(child, indent_level)

    else:
        for child in element:
            markdown += render_block(child, indent_level)

    return markdown

def render(root):
    return render_block(root).strip()