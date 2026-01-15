import { useState, useEffect } from "react";

const SignUp = ({user, socket, input, setInput}) => {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Listen for join errors (duplicate username, etc.)
        const handleJoinError = (data) => {
            setIsLoading(false);
            setError(data.message || "Failed to join. Please try again.");
            console.log("[Join Error]", data);
        };

        // Listen for successful join
        const handleJoinSuccess = (data) => {
            setIsLoading(false);
            user.current = {name: data.username, id: socket.id};
            console.log("[Join Success]", data.username);
        };

        socket.on("join_error", handleJoinError);
        socket.on("join_success", handleJoinSuccess);

        return () => {
            socket.off("join_error", handleJoinError);
            socket.off("join_success", handleJoinSuccess);
        };
    }, [socket, user]);

    const addUser = () => {
        const trimmed = input.trim();
        if(!trimmed) {
            setError("Please enter a username");
            return;
        }
        
        // Clear previous errors
        setError("");
        setIsLoading(true);
        
        // Emit join request to server
        socket.emit("join_room", trimmed);
        
        // Note: Don't set user.current here - wait for join_success event
        // Don't clear input yet - wait for confirmation
    }

    const handleInputChange = (e) => {
        setInput(e.target.value);
        // Clear error when user starts typing
        if (error) setError("");
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-xl">
                {/* Logo/Title */}
                <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">UBIT</span>
                                <span className="text-white">Chat</span>
                            </span>
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    <p className="text-slate-400 text-sm">Professional peer-to-peer messaging</p>
                </div>

                {/* Card */}
                <div className="bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-3xl p-10 md:p-12 shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Join the Chat</h2>
                    
                    <div className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 flex items-start gap-2">
                                <span className="text-red-500 text-lg">⚠</span>
                                <p className="text-red-400 text-sm flex-1">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-base font-medium text-slate-300 mb-2">
                                Your Name
                            </label>
                            <input 
                                type="text" 
                                className={`w-full bg-slate-900/50 border rounded-xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none transition text-base ${
                                    error 
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                                        : "border-slate-700 focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30"
                                }`}
                                placeholder="Enter your name..."
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === "Enter" && !isLoading && addUser()}
                                disabled={isLoading}
                            />
                        </div>

                        <button 
                            className={`w-full py-3 md:py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                input && !isLoading
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                            }`}
                            disabled={!input || isLoading}
                            onClick={addUser}
                        >
                            {isLoading ? "Joining..." : "Join Chat"}
                        </button>
                    </div>

                    <p className="text-sm text-slate-500 text-center mt-6">
                        {error ? "Choose a unique username" : "Use any name to get started"}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
