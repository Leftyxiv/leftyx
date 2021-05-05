import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { Order } from '../../models/Order';
import { Ticket } from '../../models/Ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save();
  return ticket;
}

it('fetches orders for a particular user', async () => {
const t1 = await buildTicket();
const t2 = await buildTicket();
const t3 = await buildTicket();

const u1 = global.signin();
const u2 = global.signin();

  await request(app).post('/api/orders').set('Cookie', u1).set({ ticketId: t1.id }).expect(201)
  const { body: orderOne } = await request(app).post('/api/orders').set('Cookie', u2).set({ ticketId: t2.id }).expect(201)
  const { body: orderTwo } = await request(app).post('/api/orders').set('Cookie', u2).set({ ticketId: t3.id }).expect(201)

  const res = await request(app).get('/api/orders').set('Cookie', u2).expect(200)
  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id)
  expect(res.body[1].id).toEqual(orderTwo.id)
})