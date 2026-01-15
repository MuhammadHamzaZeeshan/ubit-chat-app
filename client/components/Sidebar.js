const Sidebar = ({ availableUsers, selectedUser, onSelect }) => {
  return (
    <aside className="w-56 border-l border-slate-800 bg-slate-950/30 backdrop-blur-sm p-5 overflow-y-auto">
      <h3 className="text-white font-bold text-base uppercase tracking-widest mb-4 text-slate-200">Active Users</h3>
      <div className="space-y-2">
        {availableUsers.length === 0 && (
          <p className="text-slate-500 text-sm">Waiting for users...</p>
        )}
        {availableUsers.map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all hover:scale-[1.02] ${
              selectedUser === name
                ? "bg-emerald-600/20 border border-emerald-600/40 text-white"
                : "bg-slate-800/30 border border-transparent text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-base font-medium truncate">{name}</span>
            <span className="ml-auto text-xs text-emerald-400 uppercase tracking-widest font-semibold">Live</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
