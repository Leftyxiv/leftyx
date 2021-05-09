import { Publisher, Subjects, PaymentCreatedEvent } from '@leftyx/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}