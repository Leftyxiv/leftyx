import express, { Request, Response} from "express";
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { validateRequest, BadRequestError } from '@leftyx/common';
import { Password } from '../services/password';

const router = express.Router();

router.post("/api/users/signin", [
  body('email').isEmail().withMessage('Email ,ust be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email })
  if (!existingUser){
    throw new BadRequestError('Login attempt failed!  Please try again')
  }
  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch){
    throw new BadRequestError('Login attempt failed!  Please try again')
  }

  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.jwt_key! )

  req.session= {
    jwt: userJwt
  };
  res.status(200).send(existingUser);
});

export { router as signinRouter };
