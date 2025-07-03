from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# List of URLs to fetch
urls = [
    "https://app.binogi.se/l/religion-och-andra-livsaaskaadningar?subject=64646",
    "https://app.binogi.se/l/religion-och-identitet",
    "https://app.binogi.se/l/ritual-och-boen",
    "https://app.binogi.se/l/religionsfrihet?subject=64652",
    "https://app.binogi.se/l/oktoberrevolutionen?subject=64656",
]

urls = [
    "https://app.binogi.se/l/religion-och-andra-livsaaskaadningar?subject=64646",
    ]

def fetch_html_data(url):
    """
    Fetch HTML content of the page after the DOM is fully loaded.

    Args:
        url (str): URL to fetch HTML from.

    Returns:
        str: HTML content of the page.
    """
    # Initialize the WebDriver (make sure the appropriate driver is installed and in PATH)
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in headless mode
    driver = webdriver.Chrome(options=options)

    try:
        # Open the URL
        driver.get(url)

        # Wait until the DOM is fully loaded
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )

        # Get the page source
        html_content = driver.page_source

    finally:
        # Close the WebDriver
        driver.quit()

    return html_content

# Fetch HTML content for each URL
for url in urls:
    print(f"Fetching data from {url}...")
    html_content = fetch_html_data(url)
    print("html content", html_content)