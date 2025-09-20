import React, { useState, useEffect, useRef } from 'react';
import { trackEngagement } from './AnalyticsTracker.tsx';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  isTyping?: boolean;
}

interface LiveChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ isOpen, onToggle, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 Welcome to VidScriptHub Support. How can I help you today?',
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate online status
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% chance of being online
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Track chat engagement
    trackEngagement('live_chat_message', { message: inputText });

    // Simulate support response
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Our support team will get back to you within 2 hours during business hours.",
        "I understand your concern. Let me help you with that right away!",
        "That's a great question! Here's what I can tell you...",
        "I'll need to check that for you. Can you provide more details?",
        "Perfect! I can definitely help you with that. Let me guide you through it."
      ];

      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'support',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            
            {/* Online Status Indicator */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            
            {/* Notification Badge */}
            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              1
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A0F3C] to-[#0F0A2A] text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-[#DAFF00] rounded-full flex items-center justify-center">
                  <span className="text-[#1A0F3C] font-bold text-sm">VS</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              <div>
                <h3 className="font-semibold">VidScriptHub Support</h3>
                <p className="text-xs text-gray-300">
                  {isOnline ? 'Online now' : 'Away'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#DAFF00] text-[#1A0F3C]'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DAFF00] text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-[#DAFF00] text-[#1A0F3C] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Our support team typically responds within 2 hours during business hours.
            </p>
          </div>
        </div>
      )}
    </>
  );
};






