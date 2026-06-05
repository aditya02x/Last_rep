import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },

  reps: {
    type: Number,
    required: true,
  },
});

const exerciseSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true,
  },

  sets: [setSchema],
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workoutName: {
      type: String,
      required: true,
    },

    exercises: [exerciseSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Workout", workoutSchema);