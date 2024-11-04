import { EventModel } from '@aroundu/shared';
import mongoose, { Schema } from 'mongoose';

const EventSchema: Schema = new Schema<EventModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Concert', 'Happy Hour', 'Karaoke', 'Yard Sale', 'Other'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

EventSchema.index({ location: '2dsphere' });

const Event = mongoose.model<EventModel>('Event', EventSchema);
export default Event;
