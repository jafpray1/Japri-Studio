import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate "Encryption" Error / Blocking
    setTimeout(() => {
      setIsTyping(false);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: 'An internal error occurred. Communication disabled.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }, 1000);
  };

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
          <Bot size={20} className="text-neon" />
          AI Chat Assistant
        </h2>
        <span className="ml-auto text-xs font-mono text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md border border-red-200 dark:border-red-800">
          <ShieldAlert size={12} />
          LOCKED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50 dark:bg-slate-900/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Bot size={32} />
            </div>
            <p className="text-sm font-medium">Start a conversation...</p>
            <p className="text-xs text-slate-500 mt-1">AI Assistant is ready.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] lg:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-neon text-white rounded-tr-none' 
                : msg.role === 'error'
                  ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-tl-none flex items-start gap-3'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-tl-none'
            }`}>
              {msg.role === 'error' && <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
              <div>
                  {msg.role === 'error' && <p className="font-bold mb-1">Error</p>}
                  {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan anda..."
            className="flex-1 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-neon transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3.5 bg-neon text-white rounded-xl hover:bg-neon-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-neon/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;