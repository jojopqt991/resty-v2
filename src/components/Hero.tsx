
import React from 'react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import HeroChatbot from './HeroChatbot';
import PixelFoodPattern from './PixelFoodPattern';
import FoodIcon from './FoodIcon';
import { MessageSquare } from 'lucide-react';

const Hero = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate('/chat');
  };
  
  return (
    <section id="home" className="relative bg-white min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Background pattern with lower opacity */}
      <PixelFoodPattern className="opacity-5" />
      
      {/* Floating food icons */}
      <FoodIcon icon="🍕" color="#FFE2DD" size={60} top="10%" left="15%" delay="0s" duration="6s" />
      <FoodIcon icon="🥗" color="#E0F5E0" size={50} top="70%" left="10%" delay="0.5s" duration="7s" />
      <FoodIcon icon="🍣" color="#FFE8F0" size={45} top="30%" left="85%" delay="1s" duration="8s" />
      <FoodIcon icon="🍔" color="#FFF0D6" size={55} top="80%" left="75%" delay="1.5s" duration="5s" />
      <FoodIcon icon="🍷" color="#FFE2E2" size={40} top="15%" left="60%" delay="2s" duration="9s" />
      <FoodIcon icon="🥂" color="#E8F4FF" size={42} top="60%" left="25%" delay="2.5s" duration="6.5s" />
      
      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              Discover & Book
              <div className="flex items-baseline">
                <span>Restaurants with </span>
                <span className="text-resty-primary ml-2">Resty</span>
              </div>
            </h1>
            
            <p className="text-xl text-gray-600 tracking-wide leading-relaxed">
              Your AI-powered restaurant concierge. Chat to find the perfect spot from our curated list and book instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-resty-primary hover:bg-resty-primary/90 text-white font-medium text-lg px-8 py-6 h-auto rounded-xl"
                onClick={handleChatClick}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with Resty
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 text-gray-700 font-medium text-lg px-8 py-6 h-auto rounded-xl hover:bg-gray-50"
                onClick={handleChatClick}
              >
                View Restaurants
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
              <HeroChatbot className="w-full h-auto aspect-[4/5]" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-40 h-40 bg-resty-accent/30 rounded-full blur-xl"></div>
            <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-resty-secondary/30 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
