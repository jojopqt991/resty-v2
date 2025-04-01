
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
      content: "Hi there! I'm Resty, your restaurant concierge. How can I help you find the perfect dining experience today?",
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
    <div className={`bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 ${className}`}>
      {/* Chat header */}
      <div className="bg-resty-primary text-white p-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 text-resty-primary font-bold">
          R
        </div>
        <div>
          <h3 className="font-semibold">Resty</h3>
          <p className="text-xs opacity-90">Your restaurant concierge</p>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-300"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="p-4 bg-gray-50 h-[60vh] max-h-[400px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[80%] shadow-sm ${
                message.role === 'user' 
                  ? 'bg-resty-primary text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2 bg-white">
        <input 
          type="text" 
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-resty-primary focus:ring-1 focus:ring-resty-primary"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading || input.trim() === ''}
          className="rounded-full h-10 w-10 bg-resty-primary hover:bg-resty-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default HeroChatbot;
