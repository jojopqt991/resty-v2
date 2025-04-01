
interface ChatMessage {
  id?: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  location: string;
  rating: string;
  specialFeatures: string;
  openingHours: string;
  contactNumber: string;
}

// Your API key is hardcoded here - replace 'YOUR_OPENAI_API_KEY_HERE' with your actual OpenAI API key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

export async function sendMessageToGPT(
  message: string, 
  previousMessages: ChatMessage[], 
  restaurants: Restaurant[]
): Promise<string> {
  // No longer checking localStorage since we're using the hardcoded key
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    return "The API key has not been properly configured. Please contact the administrator.";
  }

  try {
    // Format previous messages for OpenAI's format
    const formattedPreviousMessages = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Create system prompt with restaurant data
    const systemPrompt = `You are Resty, an AI restaurant concierge. Your job is to help users find restaurants based on their preferences.
    
Here is the database of restaurants you have access to:
${JSON.stringify(restaurants, null, 2)}

When recommending restaurants:
1. Match user preferences to the available options
2. Consider cuisine, price range, location, and special features
3. Provide specific details like opening hours and contact information
4. Offer to make a booking on their behalf
5. Be conversational and helpful
6. If a restaurant matches the user's request well, always provide its name, cuisine type, and location

If the user asks something not related to restaurants or if you don't have enough information, politely guide them back to restaurant-related queries or ask for more details.`;

    // Prepare messages for the API call
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedPreviousMessages.slice(-10), // Only keep last 10 messages for context
      { role: "user", content: message }
    ];

    // Show loading indicator or toast while waiting
    console.log('Sending request to OpenAI...');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`Failed to get response from OpenAI: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return `Sorry, I couldn't connect to the OpenAI API. Error: ${error.message}`;
  }
}
