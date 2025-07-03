from lxml import html

string = '''
<div>
    <h1>First header</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <div>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo <b>voluptas</b> nulla pariatur?</p>
        <p>Porta si felis phasellus scelerisque quam magna dis primis dolor tempus suspendisse nam finibus taciti hendrerit est sem ac sollicitudin maecenas nostra lectus suscipit habitant sociosqu urna ultrices luctus vivamus purus turpis a porttitor sodales eros egestas dictumst semper nascetur mi aenean nisi convallis gravida tellus pharetra <i>quis</i> volutpat bibendum mattis quisque eget iaculis aptent neque mus id tempor amet at potenti conubia ridiculus erat metus litora hac adipiscing cras consectetur mollis vitae rhoncus molestie sapien vehicula maximus praesent ipsum placerat ut auctor netus pellentesque inceptos
          <a>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</a>
        </p>
    </div>
</div>
'''

root = html.fromstring(string)

# Define which tags are block and which are inline
block_tags = {'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}
inline_tags = {'b', 'i', 'a'}

def render_inline(element):
    """Process inline content as a continuous flow."""
    result = ''

    if element.text:
        result += element.text

    for child in element:
        if child.tag == 'b':
            result += f"**{render_inline(child)}**"
        elif child.tag == 'i':
            result += f"*{render_inline(child)}*"
        elif child.tag == 'a':
            # Optionally handle links (if href is available, otherwise plain text)
            result += f"[{render_inline(child)}]"
        else:
            # For unknown inline tags, just process their content
            result += render_inline(child)

        if child.tail:
            result += child.tail

    return result

def render_block(element):
    """Process block content, adding spacing correctly."""
    markdown = ''

    if element.tag in {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}:
        level = int(element.tag[1])
        header_text = render_inline(element).strip()
        markdown += f"{'#' * level} {header_text}\n\n"
    elif element.tag == 'p':
        paragraph_text = render_inline(element).strip()
        if paragraph_text:
            markdown += f"{paragraph_text}\n\n"
    elif element.tag == 'div':
        for child in element:
            markdown += render_block(child)

    else:
        # For unhandled tags, just process children
        for child in element:
            markdown += render_block(child)

    return markdown

def render(element):
    return render_block(root).strip()

print(render(root))
