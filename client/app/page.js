"use client";
import { useEffect, useState, useRef } from "react";
import { Chat, Inputs, SignUp, Sidebar, ConnectionStatus, Header } from "@/components" 
import { io } from "socket.io-client";
import CryptoJS from "crypto-js";
import LZString from "lz-string";

const SECRET_KEY = 'dcn-project-2026';

// Socket.io client with auto-reconnection configuration
const socket = io("http://localhost:3001", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000
});

export default function Home() {

  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("");

  const user = useRef(null);

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (!user.current) return;
      
      // Decrypt and decompress incoming text messages
      if (msg.type === "text" && msg.encrypted) {
        try {
          // Decompress if compressed
          let encryptedContent = msg.content;
          if (msg.compressed) {
            encryptedContent = LZString.decompressFromBase64(msg.content);
          }
          
          // Decrypt
          const decryptedContent = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY).toString(CryptoJS.enc.Utf8);
          
          // Reconstruct user object from userName and userId for consistency
          const userObj = {
            name: msg.userName,
            id: msg.userId
          };
          
          const decryptedMsg = {
            ...msg,
            content: decryptedContent,
            user: userObj,
            encrypted: false,
            compressed: false
          };
          setChat((prev) => [...prev, decryptedMsg]);
        } catch (error) {
          console.error('[Decryption/Decompression Error]', error);
          // Fallback: show encrypted message with warning
          setChat((prev) => [...prev, {
            ...msg, 
            content: '[Encrypted message - decryption failed]',
            user: { name: msg.userName || 'Unknown', id: msg.userId }
          }]);
        }
      } else {
        // Non-encrypted messages (images, etc.) - reconstruct user object
        const userObj = msg.userName ? { name: msg.userName, id: msg.userId } : msg.user;
        setChat((prev) => [...prev, {...msg, user: userObj}]);
      }
    };

    const handleUserTyping = (data) => {
      if (!user.current) return;
      if (data.receiverName !== user.current.name) return;
      setTypingUser(data.typing ? data.user : null);
    };

    const handleOnlineUsers = (users) => {
      console.log('[Frontend] Online users received from server:', users);
      if (!user.current) {
        console.log('[Frontend] User not set yet, skipping update');
        return;
      }
      const others = users.filter((name) => name !== user.current.name);
      console.log('[Frontend] Filtered users (excluding self):', others);
      setAvailableUsers(others);
      setSelectedUser((prev) => {
        if (prev && others.includes(prev)) return prev;
        const newSelection = others[0] || null;
        console.log('[Frontend] Selected user updated to:', newSelection);
        return newSelection;
      });
    };

    socket.on("receive_private_message", handleReceiveMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("online_users", handleOnlineUsers);

    // Connection event listeners
    socket.on("connect", () => {
      console.log('[Socket] Connected to server');
      setIsConnected(true);
      setConnectionStatus("Connected");
      
      // Re-join room if user was logged in
      if (user.current) {
        socket.emit("join_room", user.current.name);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus("Disconnected");
      
      if (reason === "io server disconnect") {
        setConnectionStatus("Server disconnected you");
      }
    });

    socket.on("connect_error", (error) => {
      console.error('[Socket] Connection error:', error);
      setIsConnected(false);
      setConnectionStatus("Connection failed - Retrying...");
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setConnectionStatus("Reconnected successfully");
      
      // Clear status after 3 seconds
      setTimeout(() => setConnectionStatus(""), 3000);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`[Socket] Reconnection attempt ${attemptNumber}`);
      setConnectionStatus(`Reconnecting (${attemptNumber}/5)...`);
    });

    socket.on("reconnect_failed", () => {
      console.error('[Socket] Reconnection failed');
      setConnectionStatus("Connection failed. Please refresh the page.");
    });

    return () => {
      socket.off("receive_private_message", handleReceiveMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("online_users", handleOnlineUsers);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect");
      socket.off("reconnect_attempt");
      socket.off("reconnect_failed");
    };
  }, []);

  // Network online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Online');
      setIsOnline(true);
      setConnectionStatus("Network restored");
      
      // Re-sync online users when network returns
      if (user.current && socket.connected) {
        socket.emit("join_room", user.current.name);
      }
      
      setTimeout(() => setConnectionStatus(""), 3000);
    };

    const handleOffline = () => {
      console.log('[Network] Offline');
      setIsOnline(false);
      setConnectionStatus("No internet connection");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setTypingUser(null);
  }, [selectedUser]);

  const filteredChat = selectedUser && user.current
    ? chat.filter((message) =>
        (message.user?.name === user.current.name && message.receiverName === selectedUser) ||
        (message.user?.name === selectedUser && message.receiverName === user.current.name)
      )
    : [];

  const handleSignOut = () => {
    socket.disconnect();
    user.current = null;
    setChat([]);
    setAvailableUsers([]);
    setSelectedUser(null);
    setTypingUser(null);
  };
  
  return (
    <main className="h-screen w-screen bg-[#020617] flex flex-col pt-16">
      {/* Connection Status Toast */}
      <ConnectionStatus status={connectionStatus} isConnected={isConnected} isOnline={isOnline} />
      
      {user.current ? (
        <>
          {/* Top Header */}
          <Header username={user.current.name} onSignOut={handleSignOut} isConnected={isConnected} />
          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden px-6 py-8">
            {/* Centered Card Container */}
            <div className="w-full max-w-7xl h-full rounded-3xl bg-slate-950/60 backdrop-blur-md border border-slate-800 ring-1 ring-slate-800/50 shadow-2xl flex overflow-hidden">
              {/* Chat Section (Left) */}
              <div className="flex-1 flex flex-col min-w-0">
                <Chat user={user.current} chat={filteredChat} typingUser={typingUser} selectedUser={selectedUser} availableUsers={availableUsers}/>
                <Inputs setChat={setChat} user={user.current} socket={socket} selectedUser={selectedUser} isOnline={isOnline} isConnected={isConnected}/>
              </div>

              {/* Sidebar (Right) */}
              <Sidebar availableUsers={availableUsers} selectedUser={selectedUser} onSelect={setSelectedUser} />
            </div>
          </div>
        </>
      ) : (
        <SignUp user={user} socket={socket} input={input} setInput={setInput}/>
      )}
    </main>
  );
}
