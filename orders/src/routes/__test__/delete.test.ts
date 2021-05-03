
import request  from 'supertest';
import { app } from '../../app'
import { Ticket } from '../../models/Ticket';
import { Order, OrderStatus} from '../../models/Order'
import { natsWrapper} from '../../__mocks__/natsWrapper'

it('successfully cancels an order', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 25
  })
  await ticket.save()

  const user = global.signin();

  const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201)

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 25
  })
  await ticket.save()

  const user = global.signin();

  const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201)

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
  expect(natsWrapper.client.publish).toHaveBeenCalled();

})