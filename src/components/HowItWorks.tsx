
import React from 'react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  isEven: boolean;
}

const Step = ({ number, title, description, isEven }: StepProps) => {
  return (
    <div className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-12 items-center mb-16`}>
      <div className="w-full md:w-1/2">
        <div className="flex items-center mb-3">
          <div className="bg-resty-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
            {number}
          </div>
          <h3 className="text-2xl font-semibold ml-3">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Start a Conversation",
      description: "Open Resty and tell our AI concierge what kind of dining experience you're looking for today. Mention your preferences, location, or specific cuisines you're craving."
    },
    {
      title: "Review Recommendations",
      description: "Resty will analyze your preferences and present you with personalized restaurant options from our curated database, complete with ratings, reviews, and menu highlights."
    },
    {
      title: "Choose and Book",
      description: "Found the perfect spot? Simply tell Resty you'd like to book a table. Specify the date, time, and number of guests, and we'll handle the reservation instantly."
    },
    {
      title: "Enjoy Your Meal",
      description: "Head to your chosen restaurant and enjoy your dining experience! After your visit, Resty will check in for feedback to improve future recommendations."
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-resty-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Finding and booking your perfect restaurant is just a few simple steps away with Resty.
          </p>
        </div>
        
        <div className="mt-12">
          {steps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
              isEven={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
