
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get API key from Supabase environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }

    const { messages, restaurants, criteria } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid request format');
    }

    console.log('Calling OpenAI API with gpt-4o-mini...');
    console.log('Filtering criteria:', criteria);
    
    // Extract only a subset of restaurant data to reduce token count
    let processedRestaurants = restaurants;
    
    // If we have restaurant data and need to reduce tokens
    if (restaurants && Array.isArray(restaurants) && restaurants.length > 0) {
      // Filter restaurants based on criteria if available
      let filteredRestaurants = restaurants;
      
      if (criteria) {
        // Filter by area if specified
        if (criteria.area && criteria.area !== null) {
          const areaLower = criteria.area.toLowerCase();
          console.log(`Filtering by area: ${areaLower}`);
          filteredRestaurants = filteredRestaurants.filter(r => {
            const areaMatch = (r.area && r.area.toLowerCase().includes(areaLower)) ||
                            (r.neighborhood && r.neighborhood.toLowerCase().includes(areaLower));
            if (areaMatch) {
              console.log(`Area match: ${r.name} - ${r.area || r.neighborhood}`);
            }
            return areaMatch;
          });
          console.log(`After area filter: ${filteredRestaurants.length} restaurants`);
        }
        
        // Filter by cuisine if specified
        if (criteria.cuisine && criteria.cuisine !== null) {
          const cuisineLower = criteria.cuisine.toLowerCase();
          console.log(`Filtering by cuisine: ${cuisineLower}`);
          filteredRestaurants = filteredRestaurants.filter(r => {
            const cuisineMatch = (r.primary_type && r.primary_type.toLowerCase().includes(cuisineLower)) ||
                                (r.types && r.types.toLowerCase().includes(cuisineLower));
            if (cuisineMatch) {
              console.log(`Cuisine match: ${r.name} - ${r.primary_type || r.types}`);
            }
            return cuisineMatch;
          });
          console.log(`After cuisine filter: ${filteredRestaurants.length} restaurants`);
        }

        // If we still have too many restaurants after filtering, take the first 3 for real recommendations
        if (filteredRestaurants.length > 3) {
          filteredRestaurants = filteredRestaurants.slice(0, 3);
        } else if (filteredRestaurants.length === 0) {
          // If no matches after filtering, fall back to unfiltered but limited list
          console.log('No restaurants matched the criteria, falling back to random selection');
          filteredRestaurants = restaurants.slice(0, 3);
        }
      } else {
        // No criteria, just take first 3
        filteredRestaurants = restaurants.slice(0, 3);
      }
      
      // Extract essential fields only to reduce token count
      processedRestaurants = filteredRestaurants.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        area: restaurant.area,
        neighborhood: restaurant.neighborhood,
        primary_type: restaurant.primary_type,
        types: restaurant.types,
        price_level: restaurant.price_level,
        rating: restaurant.rating,
        description: restaurant.description
      }));
      
      console.log(`Using ${processedRestaurants.length} filtered restaurants for recommendations`);
    }
    
    // Find system message and replace restaurant data if present
    const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
    let updatedMessages = [...messages];
    
    if (systemMessageIndex !== -1) {
      // Replace the system prompt with one that doesn't include the full restaurant database
      const systemPrompt = `You are Resty, an AI restaurant concierge. Your job is to help users find restaurants based on their preferences. 
      
I've analyzed the conversation and extracted these criteria from the user:
${JSON.stringify(criteria, null, 2)}

I've found ${processedRestaurants.length} real restaurants from our database that match the user's criteria. Here they are:
${JSON.stringify(processedRestaurants, null, 2)}

Your task:
1. Format a nice response that recommends the real restaurants from our database
2. Also suggest 2 additional fictional restaurants that would be perfect for the user based on their preferences
3. Present all recommendations in a BULLET POINT list (not numbered), with a clear separation between real and AI-generated suggestions
4. For each restaurant, provide ONLY the name and a brief 1-sentence description
5. Make it conversational and engaging
6. If the user hasn't provided enough criteria, ask follow-up questions to get more specific details

Format your response like this:

"Here are some real restaurants that match your criteria:
• [Restaurant Name] - [Brief description]
• [Restaurant Name] - [Brief description]
• [Restaurant Name] - [Brief description]

I've also created these recommendations based on your preferences:
• [AI Restaurant Name] - [Brief description]
• [AI Restaurant Name] - [Brief description]"

Real restaurants should be presented first, followed by your AI-generated suggestions.`;

      updatedMessages[systemMessageIndex] = {
        role: 'system',
        content: systemPrompt
      };
    }
    
    // Call OpenAI API with the updated messages and gpt-4o-mini model
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: updatedMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
