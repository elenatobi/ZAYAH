from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def fetch_page_with_selenium(url):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    
    service = Service("/path/to/chromedriver")  # Update with your chromedriver path
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    driver.get(url)
    page_content = driver.page_source
    driver.quit()
    
    return page_content

# Example usage
url = "https://study.com/learn/lesson/what-is-physical-health.html"
content = fetch_page_with_selenium(url)
print(content)
