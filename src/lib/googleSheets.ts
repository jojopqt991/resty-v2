
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/types/chat';

export async function getRestaurantData(): Promise<Restaurant[]> {
  // Get the spreadsheet ID from localStorage
  // We still need this client-side since it can be set by the user
  const spreadsheetId = localStorage.getItem('google_sheet_id');
  
  if (!spreadsheetId) {
    console.error('Missing configuration: Google Sheet ID not set');
    throw new Error('Google Sheet ID not set');
  }

  try {
    console.log('Calling Google Sheets edge function...');
    
    // Call our edge function to securely fetch the Google Sheets data
    const { data, error } = await supabase.functions.invoke('google-sheets', {
      body: { spreadsheetId }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Failed to fetch restaurant data: ${error.message}`);
    }

    if (!data || !data.restaurants) {
      console.error('Invalid response from edge function:', data);
      throw new Error('Invalid response from server');
    }

    console.log(`Received ${data.restaurants.length} restaurants from edge function`);
    return data.restaurants as Restaurant[];
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    throw error;
  }
}
