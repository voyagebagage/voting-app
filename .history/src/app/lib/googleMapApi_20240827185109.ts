import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function fetchPlacesFromGoogle(
  category: string,
  location: string
) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query: `${category} in ${location}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return response.data.results.map((place: any) => ({
      name: place.name,
      category,
      type: "place",
      googlePlaceId: place.place_id,
      location: place.formatted_address,
      distance: null, // You'd need to calculate this based on user's location
      googleUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      rating: place.rating,
      addedBy: "system",
    }));
  } catch (error) {
    console.error("Error fetching places from Google:", error);
    throw error;
  }
}
