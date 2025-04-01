
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  position: string;
  content: string;
  rating: number;
  avatar: string;
}

const Testimonial = ({ name, position, content, rating, avatar }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 flex items-center justify-center text-xl">
          {avatar}
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-gray-500 text-sm">{position}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
      
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "Foodie & Travel Blogger",
      content: "Resty found me the most amazing hidden Italian restaurant when I was visiting Chicago. The AI understood exactly what I was looking for and made the booking process seamless.",
      rating: 5,
      avatar: "👩🏽"
    },
    {
      name: "Michael Chen",
      position: "Tech Executive",
      content: "I use Resty for all my business dinners. It saves me time and consistently recommends restaurants that impress my clients. The personalized approach beats any other app I've tried.",
      rating: 5,
      avatar: "👨🏻"
    },
    {
      name: "Priya Sharma",
      position: "Food Photographer",
      content: "As someone with specific dietary needs, finding suitable restaurants used to be frustrating. Resty remembers my preferences and suggests perfect places every time.",
      rating: 4,
      avatar: "👩🏾"
    },
    {
      name: "David Reynolds",
      position: "Restaurant Enthusiast",
      content: "What impresses me most about Resty is how it learns from my feedback. Each recommendation gets more and more aligned with my taste. It's like having a personal food concierge.",
      rating: 5,
      avatar: "👨🏼"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Calculate visible slides based on current screen size
  const visibleSlides = testimonials.length > 1 ? 
    [
      currentSlide,
      (currentSlide + 1) % testimonials.length
    ] : [0];

  return (
    <section id="testimonials" className="section-padding bg-resty-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how Resty is transforming the restaurant discovery and booking experience.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-6">
            {visibleSlides.map((slideIndex) => (
              <Testimonial
                key={slideIndex}
                name={testimonials[slideIndex].name}
                position={testimonials[slideIndex].position}
                content={testimonials[slideIndex].content}
                rating={testimonials[slideIndex].rating}
                avatar={testimonials[slideIndex].avatar}
              />
            ))}
          </div>
          
          {testimonials.length > 2 && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={prevSlide}
                className="mx-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      visibleSlides.includes(index) ? 'bg-resty-primary' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextSlide}
                className="mx-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
