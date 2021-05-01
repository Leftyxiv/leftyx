import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@leftyx/common";
import { newOrdersRouter } from './routes/new';
import { showOrdersRouter } from './routes/show';
import { indexOrdersRouter } from './routes';
import { deleteOrdersRouter } from './routes/delete';

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  }),
);

app.use(currentUser);

app.use(newOrdersRouter)
app.use(showOrdersRouter)
app.use(indexOrdersRouter)
app.use(deleteOrdersRouter)

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
