
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export interface RestaurantCriteria {
  area?: string;
  cuisine?: string;
  priceLevel?: string;
  timeOfDay?: string;
  dayOfWeek?: string;
  partySize?: number;
  needsReservation?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  street_address: string;
  city: string;
  country: string;
  neighborhood: string;
  postcode: string;
  area: string;
  region: string;
  parliamentary_constituency: string;
  primary_type: string;
  types: string;
  phone: string;
  website: string;
  hours: string;
  rating: string;
  total_ratings: string;
  price_level: string;
  description: string;
  plus_code: string;
  dine_in: string;
  delivery: string;
  takeout: string;
  reservable: string;
  business_status: string;
  google_maps_url: string;
  input_url: string;
}
