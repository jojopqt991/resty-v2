
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { getRestaurantData } from '@/lib/googleSheets';
import { sendMessageToGPT, extractRestaurantCriteria } from '@/lib/openai';
import { Message, Restaurant, RestaurantCriteria } from '@/types/chat';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Resty, your AI restaurant concierge for London. Tell me what kind of restaurant you're looking for in London and I'll help you find the perfect dining spot!",
      role: 'assistant'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState<Restaurant[]>([]);
  const [currentCriteria, setCurrentCriteria] = useState<RestaurantCriteria>({});
  const { toast } = useToast();

  // Fetch restaurant data when component mounts
  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurantData();
        setRestaurantData(data);
        console.log(`Loaded ${data.length} restaurants`);
        
        // Log a sample of cuisines in the data to help with debugging
        const cuisineSet = new Set<string>();
        data.slice(0, 50).forEach(restaurant => {
          if (restaurant.primary_type) {
            cuisineSet.add(restaurant.primary_type);
          }
          if (restaurant.types) {
            restaurant.types.split(',').forEach(type => {
              cuisineSet.add(type.trim());
            });
          }
        });
        console.log('Sample of cuisines in dataset:', Array.from(cuisineSet).slice(0, 20));
      } catch (error) {
        console.error('Error loading restaurant data:', error);
        toast({
          title: "Error",
          description: "Failed to load restaurant data. Some features may be limited.",
          variant: "destructive",
        });
      }
    };
    
    fetchRestaurants();
  }, [toast]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // First, extract criteria from the message
      const extractedCriteria = await extractRestaurantCriteria(userMessage.content, messages);
      console.log("Extracted criteria:", extractedCriteria);
      
      // Update our current criteria with any new information
      const updatedCriteria = {
        ...currentCriteria,
        ...extractedCriteria
      };
      setCurrentCriteria(updatedCriteria);
      
      // Now get a response from the AI assistant 
      const response = await sendMessageToGPT(
        userMessage.content, 
        messages, 
        restaurantData,
        updatedCriteria
      );
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant'
      }]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: `I'm sorry, I encountered an error while processing your request. Let's try again with a simpler question.`,
        role: 'assistant'
      }]);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
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
    </div>
  );
};

export default Chat;
