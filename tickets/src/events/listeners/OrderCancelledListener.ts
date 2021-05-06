import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@leftyx/common';

import { Ticket } from '../../models/Ticket'
import { queueGroupName } from './queueGroupName';
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher';


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: undefined,
    });

    msg.ack();
  }
}