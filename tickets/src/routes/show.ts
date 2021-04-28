import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from "@leftyx/common"
import { Ticket } from '../models/Ticket';

const router = express.Router()