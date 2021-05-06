import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@leftyx/common";
import { queueGroupName } from "./queueGroupName";
import { expirationQueue } from "../../queues/expiratingQueue";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting ${delay} ms to process the job`)
    await expirationQueue.add({
      orderId: data.id,
    }, {
      delay
    });

    msg.ack();
  }
}
