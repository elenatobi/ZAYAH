from SockFetch import fetch_page

url = "https://study.com/"
result = fetch_page(url)
print(result["headers"])
print(result["body"])