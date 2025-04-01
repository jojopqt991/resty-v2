
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

    const requestData = await req.json();
    const { messages, restaurants, criteria, action } = requestData;
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid request format');
    }

    // Handle different types of requests
    if (action === "extractCriteria") {
      return await handleCriteriaExtraction(messages);
    } else if (action === "chatCompletion") {
      return await handleChatCompletion(messages, restaurants, criteria);
    } else {
      // Default to chat completion for backward compatibility
      return await handleChatCompletion(messages, restaurants, criteria);
    }
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

// Function to handle criteria extraction
async function handleCriteriaExtraction(messages) {
  console.log('Extracting criteria using OpenAI');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.3,
      max_tokens: 200
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error during criteria extraction:', errorData);
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
}

// Function to handle chat completion
async function handleChatCompletion(messages, restaurants, criteria) {
  console.log('Calling OpenAI API with gpt-4o-mini for chat completion...');
  console.log('Filtering criteria:', JSON.stringify(criteria, null, 2));
  
  // Filter restaurants based on criteria
  let processedRestaurants = filterRestaurants(restaurants, criteria);
  
  // Find system message and replace restaurant data if present
  const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
  let updatedMessages = [...messages];
  
  if (systemMessageIndex !== -1) {
    // Replace the system prompt with one that includes the filtered restaurants
    const systemPrompt = createSystemPromptWithRestaurants(processedRestaurants, criteria);
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
    console.error('OpenAI API error during chat completion:', errorData);
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
}

// Function to create a system prompt with restaurant data
function createSystemPromptWithRestaurants(restaurants, criteria) {
  return `You are Resty, an AI restaurant concierge for London. Your job is to help users find restaurants based on their preferences. Use British English in your responses.
  
I've analysed the conversation and extracted these criteria from the user:
${JSON.stringify(criteria, null, 2)}

I've found ${restaurants.length} real restaurants from our database that match the user's criteria. Here they are:
${JSON.stringify(restaurants, null, 2)}

Your task:
1. Format a nice response that recommends the real London restaurants from our database
2. Present all recommendations in a BULLET POINT list (not numbered)
3. For each restaurant, provide the name and a brief 1-sentence description
4. Make it conversational and engaging, using British English
5. If the user hasn't provided enough criteria, ask follow-up questions to get more specific details about their London dining preferences

Format your response like this:

"Here are some restaurants in London that match your criteria:
• [Restaurant Name] - [Brief description]
• [Restaurant Name] - [Brief description]
• [Restaurant Name] - [Brief description]"

IMPORTANT: ONLY recommend restaurants from the provided list. DO NOT make up or suggest any restaurants that aren't in the data provided above.`;
}

// Function to filter restaurants based on criteria
function filterRestaurants(restaurants, criteria) {
  // If no restaurants or not an array, return empty array
  if (!restaurants || !Array.isArray(restaurants) || restaurants.length === 0) {
    return [];
  }

  // Log original restaurant count
  console.log(`Starting with ${restaurants.length} restaurants`);
  
  // If no criteria, just take a sample
  if (!criteria || Object.keys(criteria).length === 0) {
    console.log('No criteria provided, returning sample restaurants');
    return restaurants.slice(0, 5).map(simplifyRestaurant);
  }
  
  let filteredRestaurants = [...restaurants];
  
  // Filter by area if specified
  if (criteria.area && criteria.area !== null) {
    filteredRestaurants = filterByArea(filteredRestaurants, criteria.area);
  }
  
  // Filter by cuisine if specified
  if (criteria.cuisine && criteria.cuisine !== null && filteredRestaurants.length > 0) {
    filteredRestaurants = filterByCuisine(filteredRestaurants, criteria.cuisine);
  }
  
  // If we still have too many restaurants after filtering, take a representative sample
  if (filteredRestaurants.length > 5) {
    filteredRestaurants = filteredRestaurants.slice(0, 5);
    console.log(`Limited to 5 representative restaurants`);
  } else if (filteredRestaurants.length === 0) {
    // If no matches after all filtering, fall back to unfiltered but limited list
    console.log('No restaurants matched the criteria, falling back to random selection');
    filteredRestaurants = restaurants.slice(0, 3);
  }
  
  // Simplify restaurant objects to reduce token count
  return filteredRestaurants.map(simplifyRestaurant);
}

// Function to filter restaurants by area
function filterByArea(restaurants, area) {
  const areaLower = area.toLowerCase();
  console.log(`Filtering by area: "${areaLower}"`);
  
  // Log all available areas for debugging
  const uniqueAreas = new Set();
  restaurants.forEach(r => {
    if (r.area) uniqueAreas.add(r.area.toLowerCase());
    if (r.neighborhood) uniqueAreas.add(r.neighborhood.toLowerCase());
  });
  console.log(`Available areas in database: ${Array.from(uniqueAreas).slice(0, 15).join(', ')}${uniqueAreas.size > 15 ? '...' : ''}`);
  
  // Try exact match first
  let exactMatches = restaurants.filter(r => {
    return (r.area && r.area.toLowerCase() === areaLower) ||
           (r.neighborhood && r.neighborhood.toLowerCase() === areaLower);
  });
  
  if (exactMatches.length > 0) {
    console.log(`Found ${exactMatches.length} exact area matches`);
    return exactMatches;
  }
  
  // Try partial matches
  let partialMatches = restaurants.filter(r => {
    const areaMatch = 
      (r.area && r.area.toLowerCase().includes(areaLower)) ||
      (r.neighborhood && r.neighborhood.toLowerCase().includes(areaLower));
    
    if (areaMatch) {
      console.log(`Area match: ${r.name} - ${r.area || r.neighborhood}`);
    }
    return areaMatch;
  });
  
  console.log(`Found ${partialMatches.length} partial area matches`);
  return partialMatches;
}

// Function to filter restaurants by cuisine
function filterByCuisine(restaurants, cuisine) {
  const cuisineLower = cuisine.toLowerCase();
  console.log(`Filtering by cuisine: "${cuisineLower}"`);
  
  // Log sample of available cuisines
  const uniqueCuisines = new Set();
  restaurants.slice(0, 50).forEach(r => {
    if (r.primary_type) uniqueCuisines.add(r.primary_type.toLowerCase());
    if (r.types) {
      r.types.toLowerCase().split(',').map(t => t.trim()).forEach(t => uniqueCuisines.add(t));
    }
  });
  console.log(`Sample cuisines in database: ${Array.from(uniqueCuisines).slice(0, 15).join(', ')}${uniqueCuisines.size > 15 ? '...' : ''}`);

  // Use multiple strategies for matching
  let matchedRestaurants = [];
  
  // 1. Exact matches
  let exactMatches = restaurants.filter(r => {
    const primaryTypeMatch = r.primary_type && 
                           r.primary_type.toLowerCase() === cuisineLower;
    
    const typesExactMatch = r.types && 
                          r.types.toLowerCase().split(',')
                          .some(t => t.trim() === cuisineLower);
    
    const isExactMatch = primaryTypeMatch || typesExactMatch;
    
    if (isExactMatch) {
      console.log(`EXACT cuisine match for "${cuisineLower}": ${r.name}`);
    }
    
    return isExactMatch;
  });
  
  matchedRestaurants = [...exactMatches];
  
  // 2. Compound term matches (e.g., italian_restaurant)
  if (matchedRestaurants.length < 3) {
    const compoundMatches = restaurants.filter(r => {
      // Skip already matched
      if (exactMatches.some(m => m.id === r.id)) return false;
      
      const hasCompoundMatch = r.types && 
        r.types.toLowerCase().split(',').some(t => {
          const trimmed = t.trim();
          return trimmed.includes(cuisineLower + "_") || 
                 trimmed.startsWith(cuisineLower);
        });
      
      if (hasCompoundMatch) {
        console.log(`COMPOUND cuisine match for "${cuisineLower}": ${r.name} - Types: ${r.types}`);
      }
      
      return hasCompoundMatch;
    });
    
    matchedRestaurants = [...matchedRestaurants, ...compoundMatches];
  }
  
  // 3. Substring matches
  if (matchedRestaurants.length < 3) {
    const substringMatches = restaurants.filter(r => {
      // Skip already matched
      if (matchedRestaurants.some(m => m.id === r.id)) return false;
      
      const typesContainCuisine = r.types && 
                               r.types.toLowerCase().includes(cuisineLower);
      
      if (typesContainCuisine) {
        console.log(`SUBSTRING cuisine match for "${cuisineLower}": ${r.name} - Types: ${r.types}`);
      }
      
      return typesContainCuisine;
    });
    
    matchedRestaurants = [...matchedRestaurants, ...substringMatches];
  }
  
  // 4. Word-based matching
  if (matchedRestaurants.length < 3) {
    const wordMatches = restaurants.filter(r => {
      // Skip already matched
      if (matchedRestaurants.some(m => m.id === r.id)) return false;
      
      const cuisineWords = cuisineLower.split(/\s+/);
      if (cuisineWords.length < 2) return false; // Skip single-word cuisines
      
      const allText = ((r.primary_type || '') + ' ' + (r.types || '')).toLowerCase();
      
      // Check if all words are present
      const allWordsPresent = cuisineWords.every(word => {
        return word.length > 2 && allText.includes(word);
      });
      
      if (allWordsPresent) {
        console.log(`WORD-BASED cuisine match for "${cuisineLower}": ${r.name} - ${allText}`);
      }
      
      return allWordsPresent;
    });
    
    matchedRestaurants = [...matchedRestaurants, ...wordMatches];
  }
  
  if (matchedRestaurants.length > 0) {
    console.log(`Found ${matchedRestaurants.length} total cuisine matches for "${cuisineLower}"`);
    return matchedRestaurants;
  } 
  
  console.log(`No cuisine matches found for "${cuisineLower}"`);
  return [];
}

// Function to simplify restaurant objects to reduce token count
function simplifyRestaurant(restaurant) {
  return {
    id: restaurant.id,
    name: restaurant.name,
    area: restaurant.area,
    neighborhood: restaurant.neighborhood,
    primary_type: restaurant.primary_type,
    types: restaurant.types,
    price_level: restaurant.price_level,
    rating: restaurant.rating,
    description: restaurant.description
  };
}
