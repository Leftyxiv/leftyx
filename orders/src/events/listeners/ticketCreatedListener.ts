import { Message } from "node-nats-streaming";

import { Subjects, Listener, TicketCreatedEvent } from "@leftyx/common";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queueGroupName";

export class TickertCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}
