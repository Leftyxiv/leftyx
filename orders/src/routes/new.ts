import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from "@leftyx/common";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";


import { natsWrapper } from '../natsWrapper';
import { OrderCreatedPublisher } from './../events/publishers/orderCreatedPublisher';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("a ticket id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // Make sure that the ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved!");
    }

    // calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({ 
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })

    // publish to other services that an order has been created
    res.status(201).send(order);
  },
);

export { router as newOrdersRouter };
