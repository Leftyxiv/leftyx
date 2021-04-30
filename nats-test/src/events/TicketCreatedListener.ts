import { Message } from 'node-nats-streaming';
import { Listener } from './baseListener';


export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'paymentsService';
  onMessage(data: any, msg: Message){
    console.log('event data', data)
    msg.ack()
  }
}