
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface HeroChatbotProps {
  className?: string;
}

const HeroChatbot = ({ className = '' }: HeroChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Resty. How can I help you find the perfect dining experience today?",
      role: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate loading response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your message! This is a demo version. Chat with the full version to get personalized restaurant recommendations!",
          role: 'assistant'
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 ${className}`}>
      {/* Chat header */}
      <div className="bg-resty-primary text-white p-3 flex items-center">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">R</div>
        <div>
          <h3 className="font-medium text-sm">Resty</h3>
          <p className="text-xs opacity-80">Restaurant Concierge</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="p-3 bg-gray-50 h-56 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-3 py-2 max-w-[80%] text-sm ${
                message.role === 'user' 
                  ? 'bg-resty-primary text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="border-t p-2 flex gap-2">
        <input 
          type="text" 
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-resty-primary"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={isLoading || input.trim() === ''}
          className="px-3"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default HeroChatbot;
