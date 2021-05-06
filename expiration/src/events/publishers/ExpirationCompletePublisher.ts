import { Publisher, ExpirationCompletEvent, Subjects } from '@leftyx/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompletEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
