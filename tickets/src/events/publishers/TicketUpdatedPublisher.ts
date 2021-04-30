import { Publisher, Subjects, TicketUpdatedEvent } from '@leftyx/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}