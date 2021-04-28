import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from "@leftyx/common"
import { Ticket } from '../models/Ticket';
import { showTicketRouter } from './show';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket){
    throw new NotFoundError();
  }
  if(ticket.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  }
  res.send(ticket)
})

export { router as updateTicketRouter };