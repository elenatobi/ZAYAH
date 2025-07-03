import socket
import ssl

max_redirects = 10
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

def read_headers(sock):
    headers = b""
    while b"\r\n\r\n" not in headers:
        chunk = sock.recv(4096)
        if not chunk:
            raise Exception("Connection closed while reading headers")
        headers += chunk
    headers, body_start = headers.split(b"\r\n\r\n", 1)
    return headers.decode('utf-8', errors='ignore'), body_start

def decode_chunked_body(sock, initial_body): 
    decoded_body = b""

    position = 0
    remaining_size = 0
    initial_remaining = True
    while position < len(initial_body) and initial_remaining:
        chunk_size_line = b""
        while not chunk_size_line.endswith(b"\r\n"):
            chunk_size_line += initial_body[position:position+1]
            position += 1
        chunk_size = int(chunk_size_line.strip(), 16)
        if chunk_size == 0:
            initial_remaining = False
        elif position + chunk_size > len(initial_body):
            decoded_body += initial_body[position:]
            initial_remaining = False
            remaining_size = position + chunk_size - len(initial_body)
        else:
            end_position = position + chunk_size
            decoded_body += initial_body[position:chunk_size]

    if remaining_size != 0:
        decoded_body += sock.recv(remaining_size)
        sock.recv(4)

    print("\r\nMessage from decode_chunk_body:")
    print("Decoded body:", decoded_body)
    # print("Next pack", sock.recv(64))

    """
    while True:
        # Read the chunk size
        chunk_size_line = b""
        while not chunk_size_line.endswith(b"\r\n") or chunk_size_line.strip() != b"":
            chunk_size_line += sock.recv(1)
        if not chunk_size_line.strip():
            break
        chunk_size = int(chunk_size_line.strip(), 16)

        # Break if this is the final chunk
        if chunk_size == 0:
            break

        # Read the chunk data
        chunk_data = b""
        while len(chunk_data) < chunk_size:
            chunk_data += sock.recv(chunk_size - len(chunk_data))

        decoded_body += chunk_data

        # Consume the trailing \r\n
        sock.recv(2)

    """
    return decoded_body

def fetch_page(url):
    for _ in range(max_redirects):
        scheme, host, port, path = parse_url(url)

        try:
            sock = socket.create_connection((host, port), timeout=timeout)

            if scheme == 'https':
                sock = ssl.create_default_context().wrap_socket(sock, server_hostname=host)

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

            # Read headers
            headers, initial_body = read_headers(sock)

            # Check for redirection
            if 'Location:' in headers:
                for line in headers.split("\r\n"):
                    if line.lower().startswith('location:'):
                        redirect_url = line.split(':', 1)[1].strip()
                        if not redirect_url.startswith(('http://', 'https://')):
                            redirect_url = f"{scheme}://{host}{redirect_url}"
                        url = redirect_url
                        break
            else:
                # Check for chunked transfer encoding
                if 'transfer-encoding: chunked' in headers.lower():
                    body = decode_chunked_body(sock, initial_body)
                else:
                    # Read raw data for non-chunked response
                    body = initial_body
                    while True:
                        chunk = sock.recv(4096)
                        if not chunk:
                            break
                        body += chunk

                sock.close()
                return {
                    'headers': headers,
                    'body': body.decode('utf-8', errors='ignore')
                }

        except socket.gaierror:
            raise Exception(f"Failed to resolve hostname: {host}")
        except socket.timeout:
            raise Exception(f"Connection to {host} timed out")
        except ssl.SSLError as e:
            raise Exception(f"SSL error: {e}")

    raise Exception("Too many redirects")

"""

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
        print("Data package of 4096", data)
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
"""
