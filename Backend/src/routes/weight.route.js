import express from 'express';
import { addWeight } from '../controllers/weight.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();


router.post('/', protect, addWeight)
export default router;