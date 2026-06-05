import Workout from "../models/Workout.model.js";

export const createWorkout = async (req, res) => {
  try {
    const { workoutName, exercises } = req.body;

    if (!workoutName || !exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a workout name and at least one exercise",
      });
    }

    const workout = await Workout.create({
      user: req.user._id,
      workoutName,
      exercises,
    });

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    console.error("Error in createWorkout controller:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error("Error in getWorkouts controller:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkoutLastSession = async (req, res) => {
  try {
    const { exerciseName } = req.params;

    const lastWorkout = await Workout.findOne({
      user: req.user._id,
      "exercises.exerciseName": exerciseName,
    }).sort({ createdAt: -1 });

    if (!lastWorkout) {
      return res.status(404).json({
        success: false,
        message: "No previous session found",
      });
    }

    const exercise = lastWorkout.exercises.find(
      (ex) => ex.exerciseName === exerciseName
    );

    res.status(200).json({
      success: true,
      exercise,
      workoutName: lastWorkout.workoutName,
      workoutDate: lastWorkout.createdAt,
    });
  } catch (error) {
    console.error(
      "Error in getWorkoutLastSession controller:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      });
    }

    res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    console.error("Error in getWorkoutById controller:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};