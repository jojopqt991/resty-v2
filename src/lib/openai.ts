
import { Message, Restaurant, RestaurantCriteria } from '@/types/chat';

// Function to extract restaurant criteria from user message
export async function extractRestaurantCriteria(
  message: string,
  previousMessages: Message[]
): Promise<RestaurantCriteria> {
  try {
    // Format previous messages for OpenAI's format
    const formattedPreviousMessages = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Create system prompt focused on extracting criteria
    const systemPrompt = `You are an AI designed to extract restaurant search criteria from user messages.
    
Analyze the conversation and extract the following criteria (if present):
1. Area: Geographic location/neighborhood the user wants to dine in
2. Cuisine: Type of food/cuisine mentioned
3. Price Level: Budget preference (e.g., cheap, moderate, expensive)
4. Time of Day: When they want to dine (breakfast, lunch, dinner, etc.)
5. Day of Week: Which day they plan to visit
6. Party Size: Number of people in their party
7. Needs Reservation: Whether they specifically need a place that takes reservations

Return ONLY a JSON object with these fields. Do not include any explanation or other text.
Example output: {"area":"Soho","cuisine":"Italian","priceLevel":"moderate","timeOfDay":"dinner","dayOfWeek":"Friday","partySize":4,"needsReservation":true}
For any criteria not mentioned in the conversation, omit that field from the JSON.`;

    // Prepare messages for the API call
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedPreviousMessages.slice(-10), // Only keep last 10 messages for context
      { role: "user", content: message }
    ];

    console.log('Sending criteria extraction request to OpenAI edge function...');

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
      throw new Error(`Failed to extract criteria from message: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    try {
      // Parse the response as JSON
      const criteriaObject = JSON.parse(data.content);
      return criteriaObject as RestaurantCriteria;
    } catch (e) {
      console.error("Failed to parse criteria JSON:", data.content);
      // Return empty object if parsing fails
      return {};
    }
  } catch (error) {
    console.error('Error extracting criteria:', error);
    // Return empty criteria on error
    return {};
  }
}

// Using Supabase edge function to securely call OpenAI API
export async function sendMessageToGPT(
  message: string, 
  previousMessages: Message[], 
  restaurants: Restaurant[],
  criteria: RestaurantCriteria = {}
): Promise<string> {
  try {
    // Format previous messages for OpenAI's format
    const formattedPreviousMessages = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Create system prompt with restaurant data and extracted criteria
    const systemPrompt = `You are Resty, an AI restaurant concierge. Your job is to help users find restaurants based on their preferences.
    
Here is the database of restaurants you have access to:
${JSON.stringify(restaurants, null, 2)}

I've analyzed the conversation and extracted these criteria from the user:
${JSON.stringify(criteria, null, 2)}

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
