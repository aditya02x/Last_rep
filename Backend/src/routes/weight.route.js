import express from 'express';
import { addWeight } from '../controllers/weight.controller.js';

const router = express.Router();


router.post('/',addWeight)
export default router;