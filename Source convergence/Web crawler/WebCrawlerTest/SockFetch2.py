from SockFetch import fetch_page

page = fetch_page("https://app.binogi.se/l/de-fyra-raeknesaetten?subject=11379")
print(page["headers"])
print(page["body"])