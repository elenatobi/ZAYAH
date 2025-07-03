import socket
import ssl

max_redirects = 10
max_response_size = 10485760  # 10 MB
timeout = 10  # seconds

def parse_url(url):
    if not url.startswith(('http://', 'https://')):
        raise ValueError("URL must start with http:// or https://")

    scheme, _, host_path = url.partition('://')
    host, _, path = host_path.partition('/')
    path = '/' + path

    if ':' in host:
        host, port = host.split(':', 1)
        port = int(port)
    else:
        port = 443 if scheme == 'https' else 80

    return scheme, host, port, path

def read_raw_response(sock):
    response = b''
    while True:
        data = sock.recv(4096)
        if not data:
            break
        response += data
        # print("data chunk", data)
        if len(response) > max_response_size:
            raise Exception("Response size exceeds limit")
    return response

def fetch_page(url):
    for _ in range(max_redirects):
        scheme, host, port, path = parse_url(url)

        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            sock.connect((host, port))

            if scheme == 'https':
                sock = ssl.create_default_context().wrap_socket(sock, server_hostname=host)

            # request = f"GET {path} HTTP/1.1\r\nHost: {host}\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\nConnection: close\r\n\r\n"

            request = (
                f"GET {path} HTTP/1.1\r\n"
                f"Host: {host}\r\n"
                f"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                f"(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\n"
                f"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
                f"Accept-Language: en-US,en;q=0.5\r\n"
                f"Referer: https://www.google.com/\r\n"
                f"Connection: close\r\n\r\n"
            )
            sock.sendall(request.encode('utf-8'))

            response = read_raw_response(sock)

            sock.close()

            response_text = response.decode('utf-8', errors='ignore')
            headers, _, body = response_text.partition("\r\n\r\n")

            if 'Location:' in headers:
                for line in headers.split("\r\n"):
                    if line.lower().startswith('location:'):
                        redirect_url = line.split(':', 1)[1].strip()
                        if not redirect_url.startswith(('http://', 'https://')):
                            redirect_url = f"{scheme}://{host}{redirect_url}"
                        url = redirect_url
                        break
            else:
                if not headers.startswith("HTTP/1.1"):
                    raise Exception("Unsupported HTTP version")
                return {
                    'headers': headers,
                    'body': body
                }

        except socket.gaierror:
            raise Exception(f"Failed to resolve hostname: {host}")
        except socket.timeout:
            raise Exception(f"Connection to {host} timed out")
        except ssl.SSLError as e:
            raise Exception(f"SSL error: {e}")

    raise Exception("Too many redirects")

def main():
    link1 = "https://info.cern.ch/hypertext/WWW/TheProject.html"
    results = fetch_page(link1)
    print(results["headers"])
    print(results["body"])
    '''
    results = fetch_page("https://study.com/learn/lesson/what-is-physical-health.html")
    print(results["headers"])
    with open("result.txt", "w") as file:
        file.write(results["body"])
    '''


if __name__ == "__main__":
    main()
