
import { Message, Restaurant } from '@/types/chat';

// Using Supabase edge function to securely call OpenAI API
export async function sendMessageToGPT(
  message: string, 
  previousMessages: Message[], 
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

During your conversation with the user, ALWAYS gather the following information:
1. Location (area) - Which area they want to dine in
2. Food type (primary_type and types) - What cuisine they're interested in
3. Time of day - When they want to dine
4. Day of the week - Which day they plan to visit
5. Number of people in their party

Optional information that is helpful if you can gather:
- Price level preference
- Whether they need a place that takes reservations

PROCESS:
1. Engage in conversation to gather all required information
2. Once you have sufficient information, search the restaurant database for matches
3. Filter restaurants by:
   - Matching the area or nearby neighborhoods
   - Matching the food type/cuisine
   - Ensuring it's open on the requested day/time (check 'hours')
   - Can accommodate the party size
   - Matches price level and reservation requirements if specified
4. Present 1-3 recommendations that best match their criteria

When recommending restaurants:
1. Always include the restaurant name, cuisine type, and neighborhood
2. Mention relevant information like hours, rating, and whether reservation is needed
3. Include a brief description of what makes this restaurant a good match
4. Provide contact information for making reservations
5. Be conversational and helpful

If you don't have enough information yet, ask follow-up questions to get the details you need.
If no restaurants match the exact criteria, suggest alternatives and explain why.

Remember to be conversational and friendly throughout the interaction.`;

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
