
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get the Google Sheets API key from Supabase environment variables
const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY');

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
    if (!GOOGLE_SHEETS_API_KEY) {
      throw new Error('Missing Google Sheets API key');
    }

    // Get the spreadsheetId from the request body
    const { spreadsheetId } = await req.json();
    
    if (!spreadsheetId) {
      throw new Error('No spreadsheet ID provided');
    }

    console.log('Fetching Google Sheets data, spreadsheet ID:', spreadsheetId);
    
    // Fix the range format - using 'A1:Z1000' instead of 'A:Z'
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:Z1000?key=${GOOGLE_SHEETS_API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', response.status, errorText);
      throw new Error(`Failed to fetch data from Google Sheets: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.values || data.values.length <= 1) {
      throw new Error('No data found in the spreadsheet');
    }

    // First row should be headers
    const headers = data.values[0];
    
    // Convert to array of restaurant objects
    const restaurants = data.values.slice(1).map((row, index) => {
      const restaurant = {};
      
      // Map each column to its header
      headers.forEach((header, colIndex) => {
        restaurant[header.toLowerCase()] = row[colIndex] || '';
      });
      
      // Add id if it's not in the spreadsheet
      if (!restaurant.id) {
        restaurant.id = (index + 1).toString();
      }

      return restaurant;
    });

    console.log(`Successfully processed ${restaurants.length} restaurants`);

    return new Response(
      JSON.stringify({ restaurants }),
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
