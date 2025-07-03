import socket

# Configure server
HOST = '0.0.0.0'  # Listen on all available interfaces
PORT = 12345      # Use any open port

# Create a socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))
server_socket.listen(1)

print(f"Server listening on {HOST}:{PORT}")

# Wait for a connection
conn, addr = server_socket.accept()
print(f"Connected by {addr}")

# Receive and send data
while True:
    data = conn.recv(1024)
    if not data:
        break
    print(f"Received: {data.decode()}")
    conn.sendall(b"Message received")

conn.close()
