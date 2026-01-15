const Navbar = ({ username, onSignOut, isConnected = true }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 z-40">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left - User Info with Connection Status */}
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        isConnected ? "bg-emerald-600" : "bg-red-600"
                    }`}>
                        {username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm hidden md:inline">{username}</span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                            isConnected 
                                ? "bg-emerald-600/20 text-emerald-400" 
                                : "bg-red-600/20 text-red-400"
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                                isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                            }`}></span>
                            {isConnected ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs md:text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-all hover:scale-[1.02]">
                        Profile
                    </button>
                    <button className="px-3 py-1.5 text-xs md:text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-all hover:scale-[1.02]">
                        Settings
                    </button>
                    <button
                        onClick={onSignOut}
                        className="px-3 py-1.5 text-xs md:text-sm text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all hover:scale-[1.02]"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
