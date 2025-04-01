
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { getRestaurantData } from '@/lib/googleSheets';
import { sendMessageToGPT } from '@/lib/openai';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Resty, your AI restaurant concierge. Tell me what kind of restaurant you're looking for today and I'll help you find the perfect dining spot!",
      role: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [sheetId, setSheetId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const googleSheetId = localStorage.getItem('google_sheet_id');
    
    if (!googleSheetId) {
      setShowConfigDialog(true);
    }
    
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveSheetId = () => {
    if (sheetId.trim()) {
      localStorage.setItem('google_sheet_id', sheetId.trim());
      setShowConfigDialog(false);
      toast({
        title: "Settings saved",
        description: "Your Google Sheet ID has been saved successfully.",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if Google Sheet ID is set
      const googleSheetId = localStorage.getItem('google_sheet_id');
      
      if (!googleSheetId) {
        setShowConfigDialog(true);
        throw new Error('Google Sheet ID not set');
      }

      const restaurants = await getRestaurantData();
      
      const response = await sendMessageToGPT(userMessage.content, messages, restaurants);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant'
      }]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      if (error.message === 'Google Sheet ID not set') {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: "I need access to restaurant data to help you. Please provide a Google Sheet ID in the settings.",
          role: 'assistant'
        }]);
      } else {
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

  return (
    <div className="min-h-screen bg-resty-background flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-resty-primary">Chat with Resty</h1>
        
        <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
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
          
          <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
            <Textarea
              placeholder="What kind of restaurant are you looking for?"
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

      {/* Google Sheet ID Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurant Data Needed</DialogTitle>
            <DialogDescription>
              To provide restaurant recommendations, Resty needs access to a Google Sheet with restaurant data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sheet-id">Google Sheet ID</Label>
              <Input
                id="sheet-id"
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Find this in your Google Sheet URL: docs.google.com/spreadsheets/d/<strong>[THIS-IS-YOUR-SHEET-ID]</strong>/edit
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveSheetId}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
