
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

    const { messages, restaurants } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid request format');
    }

    console.log('Calling OpenAI API with gpt-4o-mini...');
    
    // Extract only a subset of restaurant data to reduce token count
    let processedRestaurants = restaurants;
    
    // If we have restaurant data and need to reduce tokens
    if (restaurants && Array.isArray(restaurants) && restaurants.length > 10) {
      // Extract essential fields only to reduce token count
      processedRestaurants = restaurants.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        area: restaurant.area,
        neighborhood: restaurant.neighborhood,
        primary_type: restaurant.primary_type,
        types: restaurant.types,
        hours: restaurant.hours,
        rating: restaurant.rating,
        price_level: restaurant.price_level,
        reservable: restaurant.reservable,
        phone: restaurant.phone
      }));
      
      // If we still have too many restaurants, limit to 50
      if (processedRestaurants.length > 50) {
        processedRestaurants = processedRestaurants.slice(0, 50);
        console.log(`Reduced restaurants from ${restaurants.length} to 50 to save tokens`);
      }
    }
    
    // Find system message and replace restaurant data if present
    const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
    let updatedMessages = [...messages];
    
    if (systemMessageIndex !== -1 && processedRestaurants) {
      // Replace the system prompt with one that doesn't include the full restaurant database
      const originalSystemMessage = messages[systemMessageIndex].content;
      
      // Create a new system message without embedding all restaurant data
      updatedMessages[systemMessageIndex] = {
        role: 'system',
        content: `You are Resty, an AI restaurant concierge. Your job is to help users find restaurants based on their preferences. 
        You have access to ${processedRestaurants.length} restaurants to recommend.
        
        During your conversation with the user, gather information about:
        1. Location (area) - Which area they want to dine in
        2. Food type/cuisine - What cuisine they're interested in
        3. Time of day - When they want to dine
        4. Day of the week - Which day they plan to visit
        5. Number of people in their party
        6. Price level preference (optional)
        7. Whether they need reservations (optional)
        
        Be conversational and helpful. Ask questions to get the information you need.`
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
