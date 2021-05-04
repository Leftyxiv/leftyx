import { Message } from "node-nats-streaming";

import { Subjects, Listener, TicketUpdatedEvent } from "@leftyx/common";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findById(data.id);
    if(!ticket){
      throw new Error('Ticket not found');
    }
    ticket.set({ title, price });
    await ticket.save();


    msg.ack();
  }
}
