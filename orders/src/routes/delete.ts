import { natsWrapper } from "../natsWrapper";
import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@leftyx/common";
import { Order, OrderStatus } from "../models/Order";
import { OrderCancelledPublisher } from "./../events/publishers/orderCancelledPublisher";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({ id: order.id, version: order.version, ticket: { id: order.ticket.id } });

  res.status(204).send(order);
});

export { router as deleteOrdersRouter };
