import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true,
  },

  sets: {
    type: Number,
    required: true,
  },

  reps: {
    type: Number,
    required: true,
  },

  weight: {
    type: Number,
    required: true,
  },
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
      notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },

    exercises: [exerciseSchema],
  },
  
  {
    timestamps: true,
  }
);

export default mongoose.model("Workout", workoutSchema);