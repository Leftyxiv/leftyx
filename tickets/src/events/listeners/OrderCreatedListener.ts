import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@leftyx/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/Ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket){
      throw new Error('Ticket not found')
    }
    ticket.set({ orderId: data.id });
    await ticket.save();
    msg.ack();
  }
}