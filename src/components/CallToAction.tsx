
import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate('/chat');
  };
  
  return (
    <section className="py-20 bg-gradient-to-br from-resty-primary to-resty-secondary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Find Your Next Favorite Restaurant?
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            Let Resty help you discover the perfect dining experience tailored to your preferences.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-resty-primary hover:bg-white/90 group"
            onClick={handleChatClick}
          >
            Start Chatting with Resty
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
