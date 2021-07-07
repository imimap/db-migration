import { Types, Schema } from "mongoose";

export interface IEvent {
  timestamp: number;
  creator: Types.ObjectId;
  changesProperty: string;
  newPropertyValue: string;
}

export const EventSchema = new Schema<IEvent>({
  timestamp: {
    default: Date.now(),
    immutable: true,
    type: Number,
  },
  creator: {
    immutable: true,
    type: Schema.Types.ObjectId,
  },
  changesProperty: {
    type: String,
  },
  newPropertyValue: {
    type: String,
  },
});
