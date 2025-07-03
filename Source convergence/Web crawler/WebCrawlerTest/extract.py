import re

def clean_text(text):
    """Normalize whitespace."""
    return re.sub(r'\s+', ' ', text).strip()

def extract_text_recursively(element, prefix=''):
    result = []

    tag = element.tag.lower()

    if tag in ['script', 'style']:
        return ''  # Ignore these completely

    if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        heading_level = int(tag[1])
        heading_text = clean_text(element.text or '')
        result.append(f"{'#' * heading_level} {heading_text}")

    elif tag == 'p':
        para_text = clean_text(element.text or '')
        result.append(para_text)

    elif tag == 'li':
        item_text = clean_text(element.text or '')
        result.append(f"{prefix}- {item_text}")

    # You can handle other tags like blockquote, strong, etc., if you wish
    elif tag == 'ul':
        for child in element:
            child_text = extract_text_recursively(child, prefix=prefix + '  ')
            if child_text:
                result.append(child_text)

    else:
        # For other tags, collect text but don't apply formatting
        text = clean_text(element.text or '')
        if text:
            result.append(text)

    # Recursively process children
    for child in element:
        child_text = extract_text_recursively(child, prefix=prefix)
        if child_text:
            result.append(child_text)

    # Capture tail text (text after the current element)
    tail_text = clean_text(element.tail or '')
    if tail_text:
        result.append(tail_text)

    return '\n'.join([line for line in result if line.strip()])
