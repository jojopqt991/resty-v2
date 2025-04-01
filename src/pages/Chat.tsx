
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { getRestaurantData } from '@/lib/googleSheets';
import { sendMessageToGPT } from '@/lib/openai';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Resty, your AI restaurant concierge. How can I help you find the perfect dining experience today?",
      role: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Google Sheets API and spreadsheet ID are configured
    const googleSheetsApiKey = localStorage.getItem('google_sheets_api_key');
    const googleSheetId = localStorage.getItem('google_sheet_id');
    
    setIsConfigured(!!googleSheetsApiKey && !!googleSheetId);
    
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
      if (!isConfigured) {
        throw new Error('Google Sheets API key or spreadsheet ID not set');
      }

      // Get restaurant data from Google Sheets
      const restaurants = await getRestaurantData();
      
      // Send message to GPT with the context of restaurant data
      const response = await sendMessageToGPT(userMessage.content, messages, restaurants);
      
      // Add assistant response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant'
      }]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Handle missing configuration error specially
      if (error.message === 'Google Sheets API key or spreadsheet ID not set') {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: "I need access to restaurant data to help you. Please visit the Settings page to configure the Google Sheets API key and spreadsheet ID.",
          role: 'assistant'
        }]);
      } else {
        // Generic error
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: `I'm sorry, I encountered an error. ${error.message}`,
          role: 'assistant'
        }]);
        
        toast({
          title: "Error",
          description: "Failed to get a response. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-resty-background">
        <Header />
        <main className="container max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-resty-primary">Chat with Resty</h1>
          
          <Card className="mb-8">
            <CardHeader className="bg-amber-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span>Configuration Required</span>
              </CardTitle>
              <CardDescription>
                Missing restaurant data configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Before you can chat with Resty, you need to configure your Google Sheets API key and spreadsheet ID.
                This will allow Resty to access restaurant data and provide recommendations.
              </p>
              <p>
                Please visit the Settings page to configure these values.
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Link to="/settings">
                <Button>
                  Go to Settings
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-resty-background flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-resty-primary">Chat with Resty</h1>
        
        {/* Chat container */}
        <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
          {/* Messages area */}
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
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && input.trim()) {
                    handleSendMessage(e);
                  }
                }
              }}
            />
            <Button type="submit" disabled={isLoading || input.trim() === ''}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
