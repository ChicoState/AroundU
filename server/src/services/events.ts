import Event from '@/models/Event';
import { EventData, EventModel, EventQuery } from '@aroundu/shared';
import axios from 'axios';
import { FilterQuery } from 'mongoose';

const create = async (partialEventData: Omit<EventData, 'location'>) => {
  try {
    const { address } = partialEventData;
    const geocodeResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    );
    if (geocodeResponse.data.status !== 'OK') {
      throw new Error('Invalid address or unable to geocode.');
    }
    const { location } = geocodeResponse.data.results[0].geometry;
    const { lat, lng } = location;
    const eventData = {
      ...partialEventData,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };
    const event = new Event(eventData);
    await event.save();
    return event;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const fetch = async (query: EventQuery) => {
  try {
    const filters: FilterQuery<EventModel> = {};
    if (query.date) {
      filters.date = new Date(query.date);
    }
    if (query.address) {
      filters.address = { $regex: query.address, $options: 'i' };
    }
    if (query.lat && query.lng && query.radius) {
      const radiusInMeters = query.radius * 1000;
      filters.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [query.lng, query.lat],
          },
          $maxDistance: radiusInMeters,
        },
      };
    }
    const events = await Event.find(filters);
    return events;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export default {
  create,
  fetch,
};
