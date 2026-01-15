const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

// username -> socket.id
const onlineUsers = {};

io.on("connection", (socket) => {
    console.log(`[Socket] New connection: ${socket.id}`);

    socket.on("join_room", (username) => {
        if (!username) {
            socket.emit("join_error", { message: "Username is required" });
            return;
        }
        
        // Conflict Resolution Protocol: Check for duplicate username
        if (onlineUsers[username]) {
            console.log(`[Join Rejected] ${username} - Already logged in from socket ${onlineUsers[username]}`);
            socket.emit("join_error", { 
                message: "This username is already in use. Please choose a different name.",
                code: "DUPLICATE_USERNAME"
            });
            return;
        }
        
        // Username is unique - allow connection
        onlineUsers[username] = socket.id;
        socket.data.username = username;
        console.log(`[Join Success] ${username} joined. Online users:`, Object.keys(onlineUsers));
        
        // Confirm successful join to the client
        socket.emit("join_success", { username });
        
        // Broadcast updated user list to all clients
        io.emit("online_users", Object.keys(onlineUsers));
    });

    socket.on("send_message", (msg) => {
        const { receiverName } = msg || {};
        const receiverSocketId = receiverName ? onlineUsers[receiverName] : null;
        if (receiverSocketId) {
            const messageWithTimestamp = {
                ...msg,
                timestamp: new Date().toISOString()
            };
            io.to(receiverSocketId).emit("receive_private_message", messageWithTimestamp);
        }
    });

    socket.on("user_typing", (data) => {
        const receiverSocketId = data?.receiverName ? onlineUsers[data.receiverName] : null;
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("user_typing", data);
        }
    });

    socket.on("disconnect", () => {
        const username = socket.data.username;
        if (username && onlineUsers[username]) {
            delete onlineUsers[username];
            console.log(`[Disconnect] ${username} left. Online users:`, Object.keys(onlineUsers));
            io.emit("online_users", Object.keys(onlineUsers));
        }
    });
});

server.listen(3001, () => {
    console.log("Server is running on port 3001");
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
    console.log(`\n[${signal}] Shutting down gracefully...`);
    
    // Notify all connected clients
    io.emit("server_shutdown", { message: "Server is shutting down" });
    
    // Disconnect all sockets
    io.sockets.sockets.forEach((socket) => {
        socket.disconnect(true);
    });
    
    // Clear online users
    const userCount = Object.keys(onlineUsers).length;
    console.log(`[Shutdown] Disconnecting ${userCount} users`);
    Object.keys(onlineUsers).forEach((username) => {
        delete onlineUsers[username];
    });
    
    // Close server
    server.close(() => {
        console.log("[Shutdown] Server closed");
        process.exit(0);
    });
    
    // Force shutdown after 10 seconds if graceful shutdown fails
    setTimeout(() => {
        console.error("[Shutdown] Forced shutdown after timeout");
        process.exit(1);
    }, 10000);
};

// Listen for termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("[Fatal Error] Uncaught Exception:", error);
    gracefulShutdown("UNCAUGHT_EXCEPTION");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("[Fatal Error] Unhandled Rejection at:", promise, "reason:", reason);
    gracefulShutdown("UNHANDLED_REJECTION");
});