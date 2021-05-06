import { Message } from 'node-nats-streaming';
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@leftyx/common";

import { OrderCancelledListener } from './../OrderCancelledListener';
import { natsWrapper } from "../../../natsWrapper";

import { Ticket } from "../../../models/Ticket";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'singer',
    price: 15,
    userId: 'arp',
  })
  ticket.set({orderId})
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }
// @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return { msg, data, ticket, orderId, listener }
}

it('updates the tickets publishes an event and acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toBeUndefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled()

})