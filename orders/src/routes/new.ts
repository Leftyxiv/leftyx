import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError } from "@leftyx/common"
import { body } from 'express-validator';

import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';


const router = express.Router()

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('a ticket id must be provided')
  
], validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  // find the ticket the user is trying to order
  const ticket = await Ticket.findById(ticketId);
  if (!ticket){
    throw new NotFoundError;
  }

  // Make sure that the ticket is not already reserved

  // calculate an expiration date for this order

  // build the order and save it to the database

  // publish to other services that an order has been created
  res.send({})
})

export { router as newOrdersRouter }