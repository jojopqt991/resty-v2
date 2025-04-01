
import React, { useState } from 'react';

interface CuisineCardProps {
  name: string;
  emoji: string;
  description: string;
}

const CuisineCard = ({ name, emoji, description }: CuisineCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all group">
      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{emoji}</div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const CuisineShowcase = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const cuisines = [
    {
      name: "Italian",
      emoji: "🍕",
      description: "Authentic pasta, pizza, and Mediterranean flavors from traditional trattorias to modern Italian fusion.",
      type: "european"
    },
    {
      name: "Japanese",
      emoji: "🍣",
      description: "From delicate sushi to hearty ramen, experience the precision and artistry of Japanese cuisine.",
      type: "asian"
    },
    {
      name: "Mexican",
      emoji: "🌮",
      description: "Vibrant flavors with authentic tacos, enchiladas, and regional specialties from across Mexico.",
      type: "american"
    },
    {
      name: "Indian",
      emoji: "🍛",
      description: "Rich curries, tandoori specialties, and a vast array of vegetarian options from across the subcontinent.",
      type: "asian"
    },
    {
      name: "Mediterranean",
      emoji: "🥙",
      description: "Fresh ingredients, healthy options, and bold flavors from Greece, Lebanon, Morocco and beyond.",
      type: "european"
    },
    {
      name: "American",
      emoji: "🍔",
      description: "Classic burgers, steaks, and comfort food with modern twists from diners to upscale establishments.",
      type: "american"
    },
    {
      name: "Thai",
      emoji: "🍜",
      description: "Aromatic herbs, spicy flavors, and the perfect balance of sweet, sour, salty and spicy elements.",
      type: "asian"
    },
    {
      name: "French",
      emoji: "🥐",
      description: "Sophisticated techniques, decadent pastries, and classic bistro fare from casual cafes to fine dining.",
      type: "european"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Cuisines' },
    { id: 'asian', label: 'Asian' },
    { id: 'european', label: 'European' },
    { id: 'american', label: 'American' }
  ];

  const filteredCuisines = activeFilter === 'all' 
    ? cuisines 
    : cuisines.filter(cuisine => cuisine.type === activeFilter);

  return (
    <section id="cuisines" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Cuisines</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Resty can recommend restaurants across a wide range of cuisines to match any craving or occasion.
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-10 flex-wrap">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-resty-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCuisines.map((cuisine, index) => (
            <CuisineCard 
              key={index}
              name={cuisine.name}
              emoji={cuisine.emoji}
              description={cuisine.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuisineShowcase;
