from SockFetch import fetch_page
from lxml import html
from RenderText import render
import re

DEBUG = True

def fetch_wrapped(url):
    result = fetch_page(url)
    print(" ----------------------- HTTP Headers ----------------------- :")
    print(result["headers"])
    print(" ------------------------------------------------------------ \n")
    tree = html.fromstring(result["body"])
    if DEBUG:
        with open("body.txt", "w") as file_opener:
            file_opener.write(result["body"])
    return tree

def query_selector(element, class_name):
    return element.xpath(f'//*[contains(concat(" ", normalize-space(@class), " "), " {class_name} ")]')

def extract_lesson():
    url = "https://study.com/academy/lesson/management-in-organizations-top-middle-low-level-managers.html"
    
    tree = fetch_wrapped(url)
    d1 = tree.xpath('//*[contains(concat(" ", normalize-space(@class), " "), " accordionOne ")]')
    d2 = tree.xpath('//*[contains(concat(" ", normalize-space(@class), " "), " lesson-transcript-content ")]')
    extracted_text = [f"# {tree.xpath('//title/text()')[0]}"]
    for i in d1:
        extracted_text.append(render(i))
    extracted_text.append(render(d2[0]))
    extracted = "\n".join(extracted_text)
    minified_html = re.sub(r'>\s+<', '><', extracted.strip())
    return minified_html

def extract_course():
    # document.querySelector(".course-nav-2025__chapters").querySelectorAll("a.course-page-lesson-nav-item-2025__title")

    url = "https://study.com/academy/course/principles-of-management-course.html"
    # url = "https://study.com/academy/course/principles-of-supervision.html"
    tree = fetch_wrapped(url)
    chapters_div = query_selector(tree, "course-nav-2025__chapters")
    print(chapters_div)
    a_elements = query_selector(chapters_div[0], "course-page-lesson-nav-item-2025__title")
    for a_element in a_elements:
        print(a_element)


def main():
    print(extract_course())

if __name__ == "__main__":
    main()