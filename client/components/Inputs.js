import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { send, upload } from "@/assets"
import CryptoJS from "crypto-js"
import LZString from "lz-string"
import { debounce } from "lodash"

const SECRET_KEY = 'dcn-project-2026';

const Inputs = ({user, socket, setChat, selectedUser, isOnline = true, isConnected = true}) => {

    const [input, setInput] = useState("")

    const uploadInput = useRef(null)

    // Check if input should be disabled
    const isDisabled = !selectedUser || !isOnline || !isConnected;

    // Debounced typing indicator - only emits after 300ms of no typing
    const debouncedTyping = useCallback(
        debounce((isTyping, userName, receiver) => {
            if (!receiver) return;
            socket.emit("user_typing", {
                user: userName,
                typing: isTyping,
                receiverName: receiver
            });
        }, 300),
        [socket]
    );

    const sendMessage = () => {
        if(!selectedUser) return;
        if(input) {
            // Encrypt the message content
            const encryptedContent = CryptoJS.AES.encrypt(input, SECRET_KEY).toString();
            
            // Compress encrypted content to reduce bandwidth
            const compressedContent = LZString.compressToBase64(encryptedContent);
            
            // Optimized message: send only username instead of full user object
            const encryptedMsg = {
                content: compressedContent, 
                type: "text", 
                userName: user.name,  // Send only username (not full user object)
                userId: user.id,      // Include ID for message ownership
                receiverName: selectedUser, 
                timestamp: new Date().toISOString(),
                encrypted: true,
                compressed: true
            };
            
            // Message displayed locally (plain text for sender)
            const localMsg = {
                content: input,
                type: "text",
                user,
                receiverName: selectedUser,
                timestamp: new Date().toISOString(),
                encrypted: false
            };
            
            socket.emit("send_message", encryptedMsg);
            
            // Cancel any pending typing indicator and send final "not typing"
            debouncedTyping.cancel();
            socket.emit("user_typing", {user: user.name, typing: false, receiverName: selectedUser});
            
            setChat((prev) => [...prev, localMsg]);
            setInput("");
        } else {
            uploadInput.current.click();
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if(!selectedUser || !file) return;
        if(file.type === "image/jpeg" || file.type === "image/png") {
            // Note: Base64 is still inefficient. For production, use proper file upload endpoint
            const img = URL.createObjectURL(file);
            const msg = {
                content: img, 
                type: "image", 
                userName: user.name,
                userId: user.id,
                receiverName: selectedUser, 
                timestamp: new Date().toISOString()
            }
            setChat((prev) => [...prev, {...msg, user}])
            socket.emit("send_message", msg)
        }
    }

    const userTyping = (e) => {
        setInput(e.target.value)
        if(!selectedUser) return;
        
        // Debounced typing indicator
        debouncedTyping(e.target.value ? true : false, user.name, selectedUser);
    }

    return (
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <input 
                className={`flex-1 bg-slate-800/50 border rounded-xl px-5 py-3 text-base text-white placeholder-slate-500 focus:outline-none transition ${
                    isDisabled 
                        ? "border-red-600/30 cursor-not-allowed" 
                        : "border-slate-700 focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30"
                }`}
                type="text" 
                placeholder={
                    !isOnline 
                        ? "You are offline" 
                        : !isConnected 
                            ? "Connecting to server..." 
                            : !selectedUser 
                                ? "Select a user to chat" 
                                : "Type a message..."
                }
                value={input}
                onChange={(e) => userTyping(e)}
                onKeyDown={(e) => e.key === "Enter" && !isDisabled && sendMessage()}
                disabled={isDisabled}
            />
            <input 
                className="hidden" 
                type="file" 
                ref={uploadInput}
                onChange={(e) => handleImageUpload(e)}
            />
            <button 
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={sendMessage}
                disabled={isDisabled}
            >
                {input ? "Send" : <span className="text-2xl leading-none">+</span>}
            </button>
        </div>
    )
}

export default Inputs
