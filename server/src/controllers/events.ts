import { RequestHandler } from 'express';
import { createEvent, fetchEvents } from '@/services/events';
import { EventCategory } from '@aroundu/shared';

export const processPostEvents: RequestHandler = async (req, res) => {
  try {
    const { name, date, address, description, category } = req.body;
    const newEvent = await createEvent({
      name,
      date,
      address,
      description,
      category,
    });
    return res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: (error as Error).message,
    });
  }
};

export const processGetEvents: RequestHandler = async (req, res) => {
  try {
    const { date, address, lat, lng, radius, category } = req.query;
    const events = await fetchEvents({
      date: date as string,
      address: address as string,
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string),
      radius: parseFloat(radius as string),
      category: (category as EventCategory) || undefined,
    });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: (error as Error).message,
    });
  }
};
