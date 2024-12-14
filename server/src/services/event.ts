import Event from '@/models/Event';
import geocodeService from '@/services/geocode';
import { EventData, EventModel, EventQuery } from '@aroundu/shared';
import { FilterQuery } from 'mongoose';

const create = async (partialEventData: Omit<EventData, 'location'>) => {
  try {
    const { address } = partialEventData;
    const { lat, lng } = await geocodeService.geocodeAddress(address);
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
    if (query.category) {
      filters.category = query.category;
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
