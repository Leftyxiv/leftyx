import request from 'supertest';
import { app } from '../../app'
import mongoose from 'mongoose';
import { Order } from '../../models/Order';
import { OrderStatus } from '@leftyx/common';

it('returns an error when the order does not exist', async() => {
  await request(app).post('/api/payments').set('Cookie', global.signin()).send({ token: '567567', orderId: mongoose.Types.ObjectId().toHexString()}).expect(404)
})


it('returns an error when trying to pay for someone elses order', async() => {
 const order = Order.build({ id: mongoose.Types.ObjectId().toHexString(), userId: mongoose.Types.ObjectId().toHexString(), version: 0, price: 20, status: OrderStatus.Created})
 await order.save()

 await request(app).post('/api/payments').set('Cookie', global.signin()).send({ token: '567567', orderId: order.id }).expect(401)
})


it('returns an error when purchasing a cancelled order', async() => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({ id: mongoose.Types.ObjectId().toHexString(), userId, version: 0, price: 20, status: OrderStatus.Cancelled});
  await order.save()

  await request(app).post('/api/payments').set('Cookie', global.signin(userId)).send({ orderId: order.id, token: '4534'}).expect(400);
})