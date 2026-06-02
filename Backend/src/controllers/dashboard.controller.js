import User from "../models/user.model.js";
import Workout from "../models/Workout.model.js";
import Weight from "../models/weight.model.js";

export const getDashboard = async (req, res) => {
  try {
    const totalWorkouts = await Workout.countDocuments({
      user: req.user._id,
    });

    const user = await User.findById(req.user._id);

    const recentWorkout = await Workout.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    const latestWeight = await Weight.findOne({
      user: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      dashboard: {
        totalWorkouts,

        currentWeight:
          latestWeight?.weight ||
          user.currentWeight ||
          null,

        goalWeight:
          user.goalWeight || null,

        recentWorkout:
          recentWorkout?.workoutName ||
          null,
      },
    });
  } catch (error) {
    console.error("Error in getDashboard:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};