import { Message, ServerMessage, Typing } from "./Messages"
import { useEffect, useMemo, useRef } from "react"

const Chat = ({chat, user, typingUser, selectedUser, availableUsers = []}) => {

    const scroller = useRef(null);

    useEffect(() => {
        if(!scroller.current) return

        scroller.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
    }, [chat])

    const selectedInitials = useMemo(() => {
        if(!selectedUser) return "?";
        const parts = selectedUser.trim().split(/\s+/);
        const initials = parts.slice(0,2).map(p => p[0]?.toUpperCase()).join("");
        return initials || selectedUser[0]?.toUpperCase() || "?";
    }, [selectedUser]);

    const isOnline = useMemo(() => {
        return !!(selectedUser && availableUsers.includes(selectedUser));
    }, [selectedUser, availableUsers]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center text-emerald-400 font-bold text-base">
                        {selectedInitials}
                    </div>
                    <div className="leading-tight">
                        <div className="text-white font-bold text-lg flex items-center gap-2">
                            {selectedUser || "Select a user"}
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 border border-emerald-600/40 rounded text-xs text-emerald-400 font-semibold uppercase tracking-widest">
                                🔒 Encrypted
                            </span>
                        </div>
                        <div className={`text-sm font-medium flex items-center gap-1.5 ${isOnline ? "text-emerald-400" : "text-slate-500"}`}>
                            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}></span>
                            {isOnline ? "Online" : "Offline"}
                        </div>
                    </div>
                </div>
                <button aria-label="Options" className="text-slate-400 hover:text-slate-200 transition hover:scale-[1.02] text-xl">
                    ⋮
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                {/* Typing Indicator at top */}
                {typingUser && (
                    <Typing user={typingUser}/>
                )}
                
                {/* Messages */}
                <div className="space-y-4">
                    {chat.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                            <p>No messages yet</p>
                            <p className="text-xs text-slate-600">Start a conversation</p>
                        </div>
                    ) : (
                        chat.map((message, index) => {
                            message = {...message, own: message.user?.id === user.id}
                            return message.type === "server" ?
                                <ServerMessage key={index} {...message} />
                            :
                                <Message key={index} {...message} />
                        })
                    )}
                </div>
                
                <div ref={scroller} />
            </div>
        </div>
    )
}

export default Chat
