import express from 'express';
import { 
  createWorkout, 
  getWorkouts, 
  getWorkoutLastSession, 
  getWorkoutById, 
  updateWorkout, 
  deleteWorkout 
} from '../controllers/workout.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", protect, createWorkout);
router.get("/", protect, getWorkouts);
router.get("/last-session/:exerciseName", protect, getWorkoutLastSession);
router.get("/:id", protect, getWorkoutById);
router.put("/:id", protect, updateWorkout);
router.delete("/:id", protect, deleteWorkout);

export default router;