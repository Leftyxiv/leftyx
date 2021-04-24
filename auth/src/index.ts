import express from "express";

import { currentUserRouter } from './routes/currentUser'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);


app.listen(9000, () => {
  console.log("listening on port 9000 **LOVE**");
});
