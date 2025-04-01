
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

// This function needs an OpenAI API key to be set by the user
export async function sendMessageToGPT(
  message: string, 
  previousMessages: ChatMessage[], 
  restaurants: Restaurant[]
): Promise<string> {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    return "Please set your OpenAI API key in the settings page first.";
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

If the user asks something not related to restaurants or if you don't have enough information, politely guide them back to restaurant-related queries or ask for more details.`;

    // Prepare messages for the API call
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedPreviousMessages.slice(-10), // Only keep last 10 messages for context
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to connect to OpenAI API');
  }
}
