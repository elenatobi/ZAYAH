'''
import socket

class WebFetcher:
    def __init__(self):
        self.port = 80

    def request(self, url):
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        host, path = parse_url(url)
        client_socket.connect((host, self.port))
        request = f"GET {path} HTTP/1.1\r\nHost: {host}\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\nConnection: close\r\n\r\n"
        client_socket.sendall(request.encode())
        result = ""
        data_fragment = client_socket.recv(1024).decode()
        while data_fragment != "":
        	result += data_fragment
        	data_fragment = client_socket.recv(1024).decode()
        client_socket.shutdown(socket.SHUT_RD)
        client_socket.close()
        return result

    def fetch(self, url, max_redirects = 5):
        result = self.request(url)
        arr_result = result.split("\r\n")
        status_code = arr_result[0].split(" ")[1]
        if status_code == 301:
            print("301")
        #print(status_code)
        return result


def parse_url(url):
    # Remove the "http://" or "https://" prefix if present
    if url.startswith("http://"):
        url = url[7:]
    elif url.startswith("https://"):
        url = url[8:]

    # Split the URL into hostname and path
    parts = url.split("/", 1)
    hostname = parts[0]
    path = "/" + parts[1] if len(parts) > 1 else "/index.html"

    return hostname, path

url_google = "https://www.google.com"
url_studycom = "https://study.com/learn/architecture.html"
url_google1 = "https://www.google.com/index.html?gws_rd=ssl"

w = WebFetcher()
print(w.fetch(url_studycom))
print(w.fetch(url_google))
print(w.fetch(url_google1))
'''
'''
import socket

def get_url(url):
    # Parse the URL to extract the hostname and path
    hostname, path = parse_url(url)

    # Create a TCP socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect to the web server (port 80)
    s.connect((hostname, 80))

    # Send an HTTP GET request
    request = f"GET {path} HTTP/1.1\r\nHost: {hostname}\r\n\r\n"
    s.send(request.encode())

    # Receive the response
    response = b""
    while True:
        data = s.recv(4096)
        if not data:
            break
        response += data

    # Close the socket
    s.close()

    # Print the response
    print(response.decode())

def parse_url(url):
    # Remove the "http://" or "https://" prefix if present
    if url.startswith("http://"):
        url = url[7:]
    elif url.startswith("https://"):
        url = url[8:]

    # Split the URL into hostname and path
    parts = url.split("/", 1)
    hostname = parts[0]
    path = "/" + parts[1] if len(parts) > 1 else "/"

    return hostname, path

# Test the crawler
get_url("http://www.google.com")
'''