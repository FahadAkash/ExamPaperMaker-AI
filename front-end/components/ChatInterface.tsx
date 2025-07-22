'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { Bot, User } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  regeneratingSection?: string;
}

export function ChatInterface({ messages, isLoading, regeneratingSection }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Start a conversation by asking me to create HTML components!</p>
            <p className="text-sm mt-2">Try: &quot;Create a landing page for my app&quot;</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-full ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            
            <div className={`flex-1 max-w-xs md:max-w-sm lg:max-w-md ${
              message.role === 'user' ? 'text-right' : ''
            }`}>
              <div className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}>
                {message.role === 'assistant' && message.id === messages[messages.length - 1]?.id ? (
                  <TypewriterText 
                    text={message.content}
                    speed={20}
                    className="text-sm whitespace-pre-wrap"
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                {message.htmlOutput && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                    ✨ HTML generated - check the preview panel!
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-gray-200 text-gray-600">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <TypewriterText 
                  text={regeneratingSection ? "Regenerating selected content..." : "Generating question paper..."}
                  speed={50}
                  className="text-sm text-gray-600"
                />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}