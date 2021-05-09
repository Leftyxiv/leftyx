import { Message } from "node-nats-streaming";

import { Subjects, Listener, PaymentCreatedEvent, OrderStatus, NotFoundError } from "@leftyx/common";
import { queueGroupName } from "./queueGroupName";
import { Order } from '../../models/Order';


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id, orderId, stripeId } = data;
    const order = await Order.findById(orderId);
    if (!order){
      throw new NotFoundError()
    }

    order.set({ status: OrderStatus.Complete })
    await order.save();
    
    msg.ack();
  }
}
