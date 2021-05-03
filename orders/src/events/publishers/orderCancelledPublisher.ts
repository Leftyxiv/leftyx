import { Publisher, OrderCancelledEvent, Subjects } from '@leftyx/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
