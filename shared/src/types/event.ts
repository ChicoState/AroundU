import { Document, ObjectId } from 'mongoose';

type EventCategory =
  | 'All'
  | 'Concert'
  | 'Happy Hour'
  | 'Karaoke'
  | 'Yard Sale'
  | 'Other';

type EventModel = Document & {
  _id: string | ObjectId;
  name: string;
  date: Date;
  address: string;
  description?: string;
  category: EventCategory;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
};

type EventData = {
  name: string;
  date: Date;
  address: string;
  description?: string;
  category: EventCategory;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type EventQuery = {
  date?: Date | string;
  address?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  category?: EventCategory;
};

export type { EventModel, EventData, EventQuery, EventCategory };
