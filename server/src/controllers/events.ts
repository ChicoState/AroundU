import { RequestHandler } from 'express';
import eventService from '@/services/event';
import { EventCategory } from '@aroundu/shared';

const processPostEvents: RequestHandler = async (req, res) => {
  try {
    const { name, date, address, description, category } = req.body;
    const newEvent = await eventService.create({
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
      message: (error as Error).message,
    });
  }
};

const processGetEvents: RequestHandler = async (req, res) => {
  try {
    const { date, address, lat, lng, radius, category } = req.query;
    const events = await eventService.fetch({
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
      message: (error as Error).message,
    });
  }
};

export { processPostEvents, processGetEvents };
