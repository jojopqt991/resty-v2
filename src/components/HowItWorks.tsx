
import React from 'react';
import { MessageCircle, ListChecked, Calendar, Utensils } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step = ({ number, title, description, icon }: StepProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
      <div className="bg-resty-primary/10 p-4 rounded-full mb-4">
        {icon}
      </div>
      
      <div className="mb-2 flex items-center justify-center">
        <span className="bg-resty-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg mr-2">
          {number}
        </span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Chat",
      description: "Tell our AI concierge your dining preferences, location, and cuisine preferences.",
      icon: <MessageCircle className="w-6 h-6 text-resty-primary" />
    },
    {
      title: "Browse",
      description: "Review personalized restaurant options with ratings, reviews, and menu highlights.",
      icon: <ListChecked className="w-6 h-6 text-resty-primary" />
    },
    {
      title: "Book",
      description: "Select your restaurant and let Resty handle your reservation instantly.",
      icon: <Calendar className="w-6 h-6 text-resty-primary" />
    },
    {
      title: "Enjoy",
      description: "Enjoy your meal and share feedback to improve future recommendations.",
      icon: <Utensils className="w-6 h-6 text-resty-primary" />
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-resty-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and book your perfect restaurant in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
