import React from 'react';

const ChatCard = ({ icon: Icon, title, client, coach, time }) => (
    <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-50 pb-4">
            <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{title}</span>
        </div>
        <div className="space-y-4 flex-1">
            <div className="flex flex-col items-end">
                <div className="bg-[#007AFF] text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed max-w-[90%] shadow-sm">
                    {client}
                </div>
                <span className="text-[10px] text-stone-400 mt-1.5 mr-1">You • {time}</span>
            </div>
            <div className="flex flex-col items-start">
                <div className="bg-[#E9E9EB] text-black rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm font-medium leading-relaxed max-w-[90%] shadow-sm">
                    {coach}
                </div>
                <span className="text-[10px] text-stone-400 mt-1.5 ml-1">Coach</span>
            </div>
        </div>
    </div>
);

export default ChatCard;
