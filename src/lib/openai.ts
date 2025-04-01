
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

// Using Supabase edge function to securely call OpenAI API
export async function sendMessageToGPT(
  message: string, 
  previousMessages: ChatMessage[], 
  restaurants: Restaurant[]
): Promise<string> {
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

    console.log('Sending request to OpenAI edge function...');

    // Call our edge function instead of OpenAI directly
    const response = await fetch('https://ajhbefztgrigzaddwvrb.supabase.co/functions/v1/openai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaGJlZnp0Z3JpZ3phZGR3dnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDk5MzIsImV4cCI6MjA1OTA4NTkzMn0.zVmNCS-j49Z2n_J0UWJzBsIEwnWxoYKhQnLtZ9-Spt8'
      },
      body: JSON.stringify({
        messages: messages,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`Failed to get response from OpenAI: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return `Sorry, I couldn't connect to the AI service. Error: ${error.message}`;
  }
}
