import { Subjects } from './subjects';
import { Message } from 'node-nats-streaming';
import { Listener } from './baseListener';
import { TicketCreatedEvent } from './TicketCreatedEvent';



export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'paymentsService';
  onMessage(data: any, msg: Message){
    console.log('event data', data)
    msg.ack()
  }
}