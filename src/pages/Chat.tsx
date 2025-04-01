
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import ConfigDialog from '@/components/chat/ConfigDialog';
import { getRestaurantData } from '@/lib/googleSheets';
import { sendMessageToGPT } from '@/lib/openai';
import { Message, Restaurant } from '@/types/chat';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Resty, your AI restaurant concierge. Tell me what kind of restaurant you're looking for today and I'll help you find the perfect dining spot!",
      role: 'assistant'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [sheetId, setSheetId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const googleSheetId = localStorage.getItem('google_sheet_id');
    
    if (!googleSheetId) {
      setShowConfigDialog(true);
    }
  }, []);

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

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
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
          <MessageList messages={messages} />
          <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
      <Footer />

      <ConfigDialog 
        open={showConfigDialog} 
        setOpen={setShowConfigDialog}
        sheetId={sheetId}
        setSheetId={setSheetId}
        onSave={saveSheetId}
      />
    </div>
  );
};

export default Chat;
