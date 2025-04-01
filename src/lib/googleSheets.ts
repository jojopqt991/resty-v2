
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

export async function getRestaurantData(): Promise<Restaurant[]> {
  const apiKey = localStorage.getItem('google_sheets_api_key');
  const spreadsheetId = localStorage.getItem('google_sheet_id');
  
  if (!apiKey || !spreadsheetId) {
    throw new Error('Google Sheets API key or spreadsheet ID not set');
  }

  try {
    // Get sheet data from Google Sheets API
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:I?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }

    const data = await response.json();
    
    if (!data.values || data.values.length <= 1) {
      throw new Error('No data found in the spreadsheet');
    }

    // First row should be headers
    const headers = data.values[0];
    
    // Convert to array of restaurant objects
    const restaurants = data.values.slice(1).map((row: string[], index: number) => {
      const restaurant: Restaurant = {
        id: (index + 1).toString(),
        name: row[0] || '',
        cuisine: row[1] || '',
        priceRange: row[2] || '',
        location: row[3] || '',
        rating: row[4] || '',
        specialFeatures: row[5] || '',
        openingHours: row[6] || '',
        contactNumber: row[7] || ''
      };
      return restaurant;
    });

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    throw error;
  }
}
