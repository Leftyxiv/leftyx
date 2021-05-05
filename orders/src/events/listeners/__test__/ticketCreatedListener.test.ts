import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@leftyx/common';
import { TicketCreatedListener } from '../ticketCreatedListener';
import { natsWrapper } from './../../../natsWrapper';
import { Ticket } from '../../../models/Ticket';


const setup = async () => {

  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = { 
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 5,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
const { listener, data, msg } = await setup();
await listener.onMessage(data, msg)
const ticket = Ticket.findById(data.id)
expect(ticket).toBeDefined();
})

it('acknowledges the message', async () => {
const { data, listener, msg } = await setup();

await listener.onMessage(data, msg)

expect(msg.ack).toBeCalled();
})
