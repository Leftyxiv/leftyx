import mongoose from "mongoose";
import { OrderStatus } from '@leftyx/common';

import { TicketDoc } from './Ticket';


interface OrdersAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// user model interface

interface OrdersDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrdersModel extends mongoose.Model<OrdersDoc> {
  build(attrs: OrdersAttrs): OrdersDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);


orderSchema.statics.build = (attrs: OrdersAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrdersDoc, OrdersModel>("Orders", orderSchema);

export { Order };