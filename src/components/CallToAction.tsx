
import React from 'react';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PixelFoodPattern from './PixelFoodPattern';

const CallToAction = () => {
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate('/chat');
  };
  
  return (
    <section className="py-24 bg-gradient-to-br from-resty-primary/90 to-resty-primary relative overflow-hidden">
      {/* Background pattern */}
      <PixelFoodPattern className="opacity-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">
            Ready to Find Your Next Favorite Restaurant?
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Let Resty help you discover the perfect dining experience tailored to your preferences.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-resty-primary hover:bg-white/90 group font-medium text-lg px-8 py-6 h-auto rounded-xl"
            onClick={handleChatClick}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat with Resty
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
