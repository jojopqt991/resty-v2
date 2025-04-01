
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
For any criteria not mentioned in the conversation, use null for that field.

IMPORTANT: Keep area and cuisine values EXTREMELY simple. 
- For area, use ONLY neighborhood names like "Soho", "Islington", "Chelsea", etc. 
- For cuisine, use ONLY broad categories like "Italian", "Chinese", "Japanese", etc.
- Do not use phrases or qualifiers, just the plain area or cuisine name.
- For cuisine, try to match from this list if possible: ["Italian", "Chinese", "Japanese", "Indian", "French", "Thai", "Mexican", "British", "American", "Spanish", "Korean", "Vietnamese", "Greek", "Turkish", "Lebanese", "Pub", "Cafe", "Seafood", "Steak", "Pizza", "Burger", "Vegetarian", "Vegan"]`;

    // Prepare messages for the API call
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedPreviousMessages.slice(-5), // Only keep last 5 messages for context
      { role: "user", content: message }
    ];

    console.log('Sending criteria extraction request to OpenAI edge function...');
    console.log('User message for criteria extraction:', message);

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
      // Check if we have data.content before trying to process it
      if (!data || !data.content) {
        console.error('Invalid response from OpenAI:', data);
        return {};
      }

      // Parse the response as JSON
      let criteriaObject;
      try {
        criteriaObject = JSON.parse(data.content);
      } catch (e) {
        console.error("Failed to parse criteria JSON:", data.content);
        // If the content is not valid JSON, attempt to extract JSON from it
        const jsonMatch = data.content.match(/\{.*\}/s);
        if (jsonMatch) {
          try {
            criteriaObject = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            // Return empty object if all parsing fails
            return {};
          }
        } else {
          // Return empty object if no JSON-like structure found
          return {};
        }
      }

      // Normalize criteria values to improve matching
      if (criteriaObject) {
        if (criteriaObject.area) {
          criteriaObject.area = criteriaObject.area.trim();
        }
        if (criteriaObject.cuisine) {
          criteriaObject.cuisine = criteriaObject.cuisine.trim();
          console.log(`Extracted cuisine criteria: "${criteriaObject.cuisine}"`);
        }
      }

      console.log("Extracted criteria object:", criteriaObject);
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

    // Create system prompt with criteria but not the full restaurant database
    const systemPrompt = `You are Resty, an AI restaurant concierge. Your job is to help users find restaurants based on their preferences.

I've analyzed the conversation and extracted these criteria from the user:
${JSON.stringify(criteria, null, 2)}

During your conversation with the user, gather information about:
1. Location (area) - Which area they want to dine in
2. Food type/cuisine - What cuisine they're interested in
3. Time of day - When they want to dine
4. Day of the week - Which day they plan to visit
5. Number of people in their party
6. Price level preference (optional)
7. Whether they need reservations (optional)

Be conversational and helpful. If you don't have enough information yet, ask follow-up questions to get the details you need.`;

    // Prepare messages for the API call - only keep last few messages to reduce token count
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedPreviousMessages.slice(-5), // Only keep last 5 messages for context
      { role: "user", content: message }
    ];

    console.log('Sending request to OpenAI edge function with criteria:', JSON.stringify(criteria));

    // Call our edge function with both messages and restaurant data
    const response = await fetch('https://ajhbefztgrigzaddwvrb.supabase.co/functions/v1/openai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaGJlZnp0Z3JpZ3phZGR3dnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDk5MzIsImV4cCI6MjA1OTA4NTkzMn0.zVmNCS-j49Z2n_J0UWJzBsIEwnWxoYKhQnLtZ9-Spt8'
      },
      body: JSON.stringify({
        messages: messages,
        restaurants: restaurants,
        criteria: criteria
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
