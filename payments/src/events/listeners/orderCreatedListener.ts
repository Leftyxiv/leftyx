import { Message } from "node-nats-streaming";

import { Subjects, Listener, OrderCreatedEvent } from "@leftyx/common";
import { queueGroupName } from "./queueGroupName";
import { Order } from '../../models/Order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, version, status, userId } = data;
    const order = Order.build({ id, version, price: data.ticket.price, userId, status });
    await order.save();

    msg.ack();
  }
}
