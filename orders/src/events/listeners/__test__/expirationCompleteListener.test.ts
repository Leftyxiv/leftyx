import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { ExpirationCompletEvent, OrderStatus } from '@leftyx/common';
import { ExpirationCompleteListener } from '../expirationCompleteListener';
import { natsWrapper } from './../../../natsWrapper';
import { Ticket } from '../../../models/Ticket';
import { Order } from '../../../models/Order';


const setup = async () => {

  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'yayaya',
    price: 20
  })
  await ticket.save()
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'whatevs',
    expiresAt: new Date(),
    ticket,

  })
  await order.save()
  const data: ExpirationCompletEvent['data'] = {
    orderId: order.id
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { ticket, data, order, listener }
}
