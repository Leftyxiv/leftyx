import express, { Request, Response} from "express";
import { body } from 'express-validator';

import { User } from '../models/User';
import { validateRequest } from './../middlewares/validateRequest';

const router = express.Router();

router.post("/api/users/signin", [
  body('email').isEmail().withMessage('Email ,ust be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest, async (req: Request, res: Response) => {

  const user = await User.findOne({ email: req.body.email })

  res.send('good')
});

export { router as signinRouter };
