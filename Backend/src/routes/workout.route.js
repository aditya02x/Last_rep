import express from 'express';
import { createWorkout ,getWorkouts  , getWorkoutLastSession} from '../controllers/workout.controller.js';
import protect from '../middleware/auth.middleware.js';
const router = express.Router();
router.post("/",protect,createWorkout);
router.get("/" ,protect,getWorkouts);
router.get("/last-session/:exerciseName", protect, getWorkoutLastSession);

export default router;