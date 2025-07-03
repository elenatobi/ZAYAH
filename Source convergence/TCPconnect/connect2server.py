import os
import json
import socket
import time
from datetime import datetime

# Configurations
SERVER_HOST = 'http://localhost/ConnectTest/'  # Replace with your server IP
SERVER_PORT = 8080
LOCAL_FOLDER = './local_folder'
SYNC_FILE = os.path.join(LOCAL_FOLDER, 'sync_times.json')


# Helper: Load sync times
def load_sync_times():
    if os.path.exists(SYNC_FILE):
        with open(SYNC_FILE, 'r') as f:
            return json.load(f)
    return {}


# Helper: Save sync times
def save_sync_times(sync_times):
    with open(SYNC_FILE, 'w') as f:
        json.dump(sync_times, f, indent=4)


# Helper: Get all files in a folder
def get_all_files(folder):
    return [os.path.join(folder, f) for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]


# Upload changed files to server
def upload_files():
    sync_times = load_sync_times()
    last_sync_time = sync_times.get('last_sync', 0)

    for file in get_all_files(LOCAL_FOLDER):
        if file == SYNC_FILE:
            continue  # Skip sync file itself
        mod_time = os.path.getmtime(file)
        if mod_time > last_sync_time:  # File changed since last sync
            print(f"Uploading: {file}")
            upload_file(file)
            sync_times[file] = mod_time

    sync_times['last_sync'] = time.time()
    save_sync_times(sync_times)


# Download changed files from server
def download_files():
    sync_times = load_sync_times()
    last_sync_time = sync_times.get('last_sync', 0)

    print("Requesting file updates from server...")
    updated_files = request_files_from_server(last_sync_time)

    for file_name, file_data in updated_files.items():
        file_path = os.path.join(LOCAL_FOLDER, file_name)
        print(f"Downloading: {file_name}")
        with open(file_path, 'wb') as f:
            f.write(file_data)
        sync_times[file_path] = time.time()

    sync_times['last_sync'] = time.time()
    save_sync_times(sync_times)


# Upload a single file
def upload_file(file_path):
    file_name = os.path.basename(file_path)
    with open(file_path, 'rb') as f:
        file_data = f.read()

    payload = f"POST /upload.php HTTP/1.1\r\nHost: {SERVER_HOST}\r\n"
    payload += f"Content-Length: {len(file_data)}\r\n"
    payload += f"Content-Type: application/octet-stream\r\n"
    payload += f"File-Name: {file_name}\r\n\r\n"
    payload = payload.encode() + file_data

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((SERVER_HOST, SERVER_PORT))
        s.sendall(payload)
        response = s.recv(1024)
        print(f"Server response: {response.decode()}")


# Request files from the server
def request_files_from_server(last_sync_time):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((SERVER_HOST, SERVER_PORT))
        request = f"GET /download.php?last_sync={last_sync_time} HTTP/1.1\r\nHost: {SERVER_HOST}\r\n\r\n"
        s.sendall(request.encode())
        response = s.recv(4096)
    return json.loads(response.decode())  # Assuming server sends JSON


# Main program
def main():
    os.makedirs(LOCAL_FOLDER, exist_ok=True)
    while True:
        print("1. Upload files to server")
        print("2. Download files from server")
        choice = input("Choose an option: ")

        if choice == '1':
            upload_files()
        elif choice == '2':
            download_files()
        else:
            print("Invalid choice!")
            break


if __name__ == "__main__":
    main()
