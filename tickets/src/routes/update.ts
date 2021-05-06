import express, { Request, Response } from "express";
import { body } from "express-validator";


import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from "@leftyx/common";
import { Ticket } from "../models/Ticket";
import { TicketUpdatedPublisher } from './../events/publishers/TicketUpdatedPublisher';
import { natsWrapper } from './../natsWrapper';


const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("A title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Must have a valid price"),
  ], validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId){
      throw new BadRequestError('Cannot edit a ticket that is pending sale')
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price
    })
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })
    res.send(ticket);
  },
);

export { router as updateTicketRouter };
