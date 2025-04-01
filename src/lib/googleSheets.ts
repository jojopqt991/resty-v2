
import { supabase } from '@/integrations/supabase/client';
import { Restaurant, RestaurantCriteria } from '@/types/chat';

// Default Google Sheet ID
const DEFAULT_SHEET_ID = '1cIyJyPBm5i7ux7RLYIDBkXpJVjzDDiR0BrANuDKaJn0';

export async function getRestaurantData(): Promise<Restaurant[]> {
  try {
    console.log('Calling Google Sheets edge function...');
    
    // Use the default spreadsheet ID
    const spreadsheetId = DEFAULT_SHEET_ID;
    
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
