
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/use-in-view';

interface MessageProps {
  isUser: boolean;
  text: string;
  delay: number;
  isVisible: boolean;
}

const Message = ({ isUser, text, delay, isVisible }: MessageProps) => {
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`
      }}
    >
      <div 
        className={`rounded-2xl px-4 py-3 max-w-xs md:max-w-md ${
          isUser 
            ? 'bg-resty-primary text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

const ChatPreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.3 });
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      setVisible(true);
    }
  }, [isInView]);

  const conversation = [
    { isUser: true, text: "Hi Resty! I'm looking for a romantic Italian restaurant in downtown for tonight." },
    { isUser: false, text: "Hi there! I'd be happy to help you find the perfect romantic Italian spot for tonight. Do you have any preferences for price range or specific dishes?" },
    { isUser: true, text: "I'm looking for something mid-range with great pasta and a nice wine selection." },
    { isUser: false, text: "Based on your preferences, I recommend Bella Notte on Main Street. They have handmade pasta and an excellent wine list. They have a table for 2 available at 7:30pm tonight. Would you like me to book it for you?" },
    { isUser: true, text: "That sounds perfect! Yes, please book it for 7:30pm." }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Resty in Action</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how easy it is to discover and book your perfect dining experience with our AI concierge.
          </p>
        </div>
        
        <div 
          ref={ref}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
        >
          {/* Chat header */}
          <div className="bg-resty-primary text-white p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">R</div>
            <div>
              <h3 className="font-medium">Resty</h3>
              <p className="text-sm opacity-80">AI Restaurant Concierge</p>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="p-4 bg-gray-50 h-96 overflow-y-auto">
            {conversation.map((message, index) => (
              <Message 
                key={index}
                isUser={message.isUser}
                text={message.text}
                delay={index * 700}
                isVisible={visible}
              />
            ))}
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t border-gray-200 flex items-center">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-resty-primary"
              disabled
            />
            <button className="bg-resty-primary text-white rounded-r-md px-4 py-2 font-medium">
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;
