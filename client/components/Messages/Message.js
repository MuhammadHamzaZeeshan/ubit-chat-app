const Message = ({content, type, own, user, timestamp}) => {
    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className={`flex ${own ? "justify-end" : "justify-start"} gap-3 mb-4`}>
            {!own && (
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            )}
            <div className={`flex flex-col ${own ? "items-end" : "items-start"}`}>
                <div className={`max-w-sm lg:max-w-lg px-5 py-3 rounded-2xl shadow-lg ${
                    own
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none"
                }`}>
                    {type === "text" ? (
                        <p className="text-base leading-relaxed">{content}</p>
                    ) : (
                        <img src={content} className="rounded-lg max-w-xs max-h-64 object-cover" alt="message" />
                    )}
                </div>
                {timestamp && (
                    <span className="text-xs text-slate-500 uppercase tracking-widest mt-1.5">
                        {formatTime(timestamp)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Message;