
import React from 'react';
import { Utensils, MessageSquare, Calendar } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <div 
      className="feature-card animate-fade-in" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 inline-block p-3 bg-resty-accent/30 rounded-full text-resty-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-resty-text">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Utensils size={28} />,
      title: "Tell Resty What You Crave",
      description: "Simply chat with Resty about your food preferences, dietary restrictions, or current cravings."
    },
    {
      icon: <MessageSquare size={28} />,
      title: "Get Personalized Recommendations",
      description: "Receive curated restaurant suggestions perfectly matched to your taste from our database."
    },
    {
      icon: <Calendar size={28} />,
      title: "Book With One Click",
      description: "Instantly secure your reservation without leaving the chat. No more phone calls or app-switching."
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Resty Helps You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Finding and booking the perfect restaurant has never been easier with our AI-powered concierge service.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
