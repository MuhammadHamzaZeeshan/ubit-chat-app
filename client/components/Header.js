const Header = ({ username = "", onSignOut = () => {}, isConnected = true }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 hover:opacity-80 transition-all select-none">
          <span className="text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">UBIT</span>
            <span className="text-white">Chat</span>
          </span>
          <span
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}
            aria-label={isConnected ? "Live" : "Offline"}
          />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-slate-300">Welcome, <span className="text-white font-semibold">{username}</span></span>
          <button
            onClick={onSignOut}
            className="px-3 py-1.5 text-xs md:text-sm rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
