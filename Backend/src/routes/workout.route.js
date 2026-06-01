import express from 'express';
import { createWorkout } from '../controllers/workout.controller.js';
import protect from '../middleware/auth.middleware.js';
const router = express.Router();
router.post("/",protect,createWorkout);

export default router;