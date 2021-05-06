import { Message } from "node-nats-streaming";

import { Subjects, Listener, ExpirationCompletEvent, OrderStatus } from "@leftyx/common";
import { Order } from "../../models/Order";
import { queueGroupName } from "./queueGroupName";
import { OrderCancelledPublisher } from './../publishers/orderCancelledPublisher';
import { natsWrapper } from '../../natsWrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompletEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompletEvent["data"], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order){
      throw new Error('Order not found!')
    }
    order.set({ status: OrderStatus.Cancelled })
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({ id: order.id, version: order.version, ticket: { id: order.ticket.id }});
    msg.ack();
  }
}
