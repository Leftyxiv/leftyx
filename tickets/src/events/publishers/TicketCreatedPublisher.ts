import { Publisher, Subjects, TicketCreatedEvent } from '@leftyx/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
 
}