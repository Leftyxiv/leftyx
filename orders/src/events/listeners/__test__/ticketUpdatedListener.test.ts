import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@leftyx/common';
import { Message } from 'node-nats-streaming';


import { TicketUpdatedListener } from './../ticketUpdatedListener';
import { natsWrapper } from './../../../natsWrapper';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), price: 5, title: 'concert' })
  await ticket.save()

  const data: TicketUpdatedEvent['data'] = { 
    version: ticket.version + 1,
    id: ticket.id,
    title: 'concierto',
    price: 15,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('finds updates and saves the ticket', async () => {
  const { msg, data, ticket, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
})

it('acks the whatever', async () => {

})