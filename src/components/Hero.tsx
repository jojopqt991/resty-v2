
import React from 'react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section id="home" className="bg-gradient-to-br from-resty-background to-white pt-16 pb-20 md:pt-24 md:pb-32">
      <div className="container-custom grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 md:pr-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-resty-text leading-tight">
            Discover Your Perfect Meal with <span className="text-resty-primary">Resty</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Your personal AI restaurant concierge helping you find and book the best restaurants tailored to your taste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-resty-primary hover:bg-resty-primary/90 text-white">
              Chat with Resty
            </Button>
            <Button variant="outline" size="lg" className="border-resty-primary text-resty-primary hover:bg-resty-primary/10">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full h-64 md:h-96 bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Replace with Lottie animation in production */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-resty-accent/20 to-resty-primary/20 rounded-2xl">
              <div className="text-center p-4">
                <div className="text-6xl mb-4">🍔🍕🥗</div>
                <p className="text-resty-text font-medium">
                  {isMobile ? "Food animation placeholder" : "Interactive food animation would appear here"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-resty-accent rounded-full opacity-30 blur-xl"></div>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-resty-secondary rounded-full opacity-20 blur-xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
