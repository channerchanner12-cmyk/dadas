
import React, { useState, useEffect, useRef } from 'react';
import { Message, UserIdentity } from './types';
import { ADJECTIVES, NOUNS, COLORS } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('nexus_identity');
    if (savedId) {
      setIdentity(JSON.parse(savedId));
    } else {
      const newId: UserIdentity = {
        name: `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
      setIdentity(newId);
      localStorage.setItem('nexus_identity', JSON.stringify(newId));
    }

    const savedMessages = localStorage.getItem('nexus_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !identity) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: identity.name,
      content: inputText.trim(),
      timestamp: Date.now(),
      isSelf: true
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('nexus_messages', JSON.stringify(updatedMessages));
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto overflow-hidden bg-[#0f172a]">
      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
            No history found.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[11px] font-bold tracking-tight uppercase" style={{ color: msg.author === identity?.name ? identity.color : '#94a3b8' }}>
                  {msg.author}
                </span>
                <span className="text-[10px] text-slate-600">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-slate-300 text-[15px] leading-relaxed break-words">
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-800/50 bg-[#0f172a]">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <input
            autoFocus
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message as ${identity?.name}...`}
            className="flex-1 bg-slate-900/50 border border-slate-800 rounded px-4 py-3 text-slate-100 focus:outline-none focus:border-slate-600 transition-colors text-sm"
          />
          <button 
            type="submit"
            className="text-slate-400 hover:text-slate-100 font-bold px-2 transition-colors text-xs tracking-widest"
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
