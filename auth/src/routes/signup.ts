import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router()

router.post('/api/user/signup', [
  body('email')
    .isEmail()
    .withMessage('Not a valid email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20})
    .withMessage('Password must be between 4 and 20 characters')
], (req: Request, res: Response) => {
  const { email, password } = req.body;


})

export { router as signupRouter };