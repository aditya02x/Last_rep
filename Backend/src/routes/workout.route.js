import express from 'express';
import { craeteWorkout } from '../controllers/workout.controller.js';
import protect from '../middleware/auth.middleware.js';
const router = express.Router();
router.post("/",protect,craeteWorkout);

export default router;