
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
    body = initial_body

    while True:
        chunk_size_end = body.find(b"\r\n")
        if chunk_size_end == -1:
            body += sock.recv(4096)
            continue

        chunk_size = int(body[:chunk_size_end].decode(), 16)
        if chunk_size == 0:
            break

        chunk_start = chunk_size_end + 2
        chunk_end = chunk_start + chunk_size
        while len(body) < chunk_end + 2:
            body += sock.recv(4096)

        decoded_body += body[chunk_start:chunk_end]
        body = body[chunk_end + 2:]

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

            headers, initial_body = read_headers(sock)

            if 'Location:' in headers:
                for line in headers.split("\r\n"):
                    if line.lower().startswith('location:'):
                        redirect_url = line.split(':', 1)[1].strip()
                        if not redirect_url.startswith(('http://', 'https://')):
                            redirect_url = f"{scheme}://{host}{redirect_url}"
                        url = redirect_url
                        break
            else:
                if 'transfer-encoding: chunked' in headers.lower():
                    body = decode_chunked_body(sock, initial_body)
                else:
                    body = initial_body
                    while True:
                        chunk = sock.recv(4096)
                        if not chunk:
                            break
                        body += chunk
                sock.close()
                return {'headers': headers, 'body': body.decode('utf-8', errors='ignore')}
        
        except (socket.gaierror, socket.timeout, ssl.SSLError) as e:
            raise Exception(f"Error: {e}")
    raise Exception("Too many redirects")