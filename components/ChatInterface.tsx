import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon, CloseIcon } from './IconComponents';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  onClose?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatHistory, onSendMessage, isStreaming, onClose }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-sky-50 dark:bg-slate-800 transition-colors">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-sm">
                <BotIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">AI Assistant</h2>
        </div>
        {onClose && (
            <button 
                onClick={onClose} 
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                aria-label="Close chat"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
        )}
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                 <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-white" />
                 </div>
              )}
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-sky-500 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'
                }`}>
                <p className="whitespace-pre-wrap">{msg.text}{isStreaming && msg.role === 'model' && index === chatHistory.length - 1 && <span className="inline-block w-1.5 h-3.5 bg-slate-400 dark:bg-slate-500 ml-1.5 animate-pulse rounded-sm align-middle"></span>}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isStreaming ? "Thinking..." : "Ask to change schedule..."}
            disabled={isStreaming}
            className="flex-grow bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};