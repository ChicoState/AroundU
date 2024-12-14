import axios from 'axios';

const geocodeAddress = async (address: string) => {
  try {
    const geocodeResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    );
    if (geocodeResponse.data.status === 'ZERO_RESULTS') {
      throw new Error('Invalid address or unable to geocode.');
    }
    const { location } = geocodeResponse.data.results[0].geometry;
    return { lat: location.lat, lng: location.lng };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export default {
  geocodeAddress,
};
