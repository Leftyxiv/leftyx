import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@leftyx/common';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
subject: Subjects.OrderCreated = Subjects.OrderCreated;
queueGroupName = queueGroupName;

async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
  
}
}