import { Message } from 'node-nats-streaming';
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@leftyx/common";

import { OrderCreatedListener } from "./../OrderCreatedListener";
import { natsWrapper } from "../../../natsWrapper";

import request from "supertest";
import { app } from "../../../app";
import { Ticket } from "../../../models/Ticket";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({ title: "concert", price: 9, userId: "nerd" });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "nerd",
    expiresAt: "dxfdg",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
};

it('sets the user id of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
//@ts-ignore
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})