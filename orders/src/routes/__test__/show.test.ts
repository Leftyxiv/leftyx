import request from 'supertest';
import { app } from '../../app';

import { Ticket } from '../../models/Ticket';

it('fetches the order', async () => {
  // create the ticket
  const ticket = Ticket.build({ title: 'this is the ticket', price: 15})
  await ticket.save()

  const user = global.signin()
  const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id}).expect(201);
  // make a request to build an order with this ticket

  // make a request to fetch the order
  await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200);
})

it('returns an error if a user tries to fetch the order of a different user', async () => {
  // create the ticket
  const ticket = Ticket.build({ title: 'this is the ticket', price: 15})
  await ticket.save()

  const user = global.signin()
  const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id}).expect(201);
  // make a request to build an order with this ticket

  // make a request to fetch the order
  await request(app).get(`/api/orders/${order.id}`).set('Cookie', global.signin()).send().expect(401);
})