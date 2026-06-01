import express from 'express';
import { addWeight, getWeightsHistory } from '../controllers/weight.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();


router.post('/', protect, addWeight)
router.get('/',protect,getWeightsHistory)
export default router;