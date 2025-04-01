
import React, { useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to format restaurant recommendations with better styling
  const formatMessage = (content: string) => {
    // Check if the message contains numbered restaurant recommendations
    if (content.match(/\d+\.\s+[A-Za-z\s]+:/)) {
      // Split the message by newlines
      const lines = content.split('\n');
      
      const formattedLines = lines.map((line, index) => {
        // Check if this line is a restaurant recommendation (starts with a number and period)
        const restaurantMatch = line.match(/^(\d+\.\s+)([A-Za-z\s\-']+):(.*)/);
        
        if (restaurantMatch) {
          // Extract the restaurant name and description
          const [, number, name, description] = restaurantMatch;
          return (
            <div key={index} className="my-2">
              <span className="font-bold">{number}</span>
              <span className="font-bold text-resty-primary">{name}:</span>
              <span>{description}</span>
            </div>
          );
        }
        
        return <div key={index} className="my-1">{line}</div>;
      });
      
      return <>{formattedLines}</>;
    }
    
    // If no restaurant formatting needed, return as is
    return content;
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`rounded-2xl px-4 py-3 max-w-xs md:max-w-md ${
              message.role === 'user' 
                ? 'bg-resty-primary text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}
          >
            {formatMessage(message.content)}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
