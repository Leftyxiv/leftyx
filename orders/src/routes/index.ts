import express, { Request, Response } from 'express';
import { requireAuth } from '@leftyx/common';
import { Order } from '../models/Order';

const router = express.Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = Order.find({ userId: req.currentUser!.id }).populate('ticket');
  res.send({})
})

export { router as indexOrdersRouter }