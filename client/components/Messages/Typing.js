const Typing = ({user}) => {
    return (
        <div className="py-2 px-4">
            <p className="text-sm text-slate-400 italic">
                <span className="font-medium text-slate-300">{user}</span> is typing
                <span className="ml-1 animate-pulse text-base">•</span>
            </p>
        </div>
    );
};

export default Typing;