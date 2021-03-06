import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@leftyx/common';
import { Order } from '../models/Order';
import { stripe } from '../stripe';
import { Payment } from '../models/Payment';
import { PaymentCreatedPublisher } from './../events/publishers/PaymentCreatedPublisher';
import { natsWrapper } from '../natsWrapper';


const router = express.Router()

router.post('/api/payments', requireAuth, [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty()
], validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order){
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser!.id){
    throw new NotAuthorizedError()
  }
  if(order.status === OrderStatus.Cancelled){
    throw new BadRequestError('Order was already cancelled.')
  }

  const stripeRes = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });
  const payment = Payment.build({ orderId, stripeId: stripeRes.id })
  await payment.save()

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  })
  
  res.status(201).send({ status: 'success', id: payment.id })
})

export { router as createChargeRouter };