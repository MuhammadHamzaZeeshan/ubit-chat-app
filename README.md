# UBIT Secure Chat Application

A real-time, end-to-end encrypted chat application designed for secure one-on-one communication. The system uses AES-256 encryption, message compression for bandwidth efficiency, and automatic reconnection to ensure reliability.

## Tech Stack

- Next.js 15
- React 19
- Node.js
- Express
- Socket.IO
- Tailwind CSS

## Features

- AES-256 encrypted messaging
- Real-time private chat
- Message compression
- Auto-reconnection on network loss

## Prerequisites

- Node.js v18 or higher
- Download from: https://nodejs.org

## Installation

### Server Setup

```bash
cd server
npm install
```

### Client Setup

```bash
cd client
npm install
```

## Running the Application

Open two terminal windows.

### Start the Server

```bash
cd server
node server.js
```

Expected output:

```
Server is running on port 3001
```

Keep this terminal running.

### Start the Client

```bash
cd client
npm run dev
```

After compilation:

```
Local: http://localhost:3000
```

Open the URL in your browser if it does not open automatically.

## Usage

### Join the Chat

- Open http://localhost:3000
- Enter a display name
- Click Join Chat

### Chat with Another User

#### Same Computer

- Open a second browser window
- Visit http://localhost:3000
- Join with a different name
- Select a user from the sidebar to start chatting

#### Different Computers (Same Network)

- Find your system IP address
  - Windows: `ipconfig`
  - macOS/Linux: `ifconfig`
- On the second device, open: `http://<IP_ADDRESS>:3000`
- Join using a different name

## Interface Overview

### Sidebar
Displays online users and their status

### Chat Header
Shows selected user and encryption status

### Message Area
- Sent messages appear on the right
- Received messages appear on the left

### Bottom Bar
Displays profile icon, connection status, and sign-out option

## Notes

- This application is intended for educational and academic use.
- Ensure both server and client are running simultaneously.


## 👨‍💻 Author

**Muhammad Hamza Zeeshan**  
BSCS – University of Karachi  
📧 hamzazeeshan675@gmail.com


⭐ *Star this repo if you found it helpful or want to contribute!*