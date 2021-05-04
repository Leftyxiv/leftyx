import { Ticket } from '../Ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({ title: 'hi there', price: 5, userId: '123'})

  await ticket.save()

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();
  await secondInstance!.save();
})