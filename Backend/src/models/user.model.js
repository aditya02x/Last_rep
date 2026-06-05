import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
      min: 0,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    height: {
      type: Number,
      min: 0,
    },

    currentWeight: {
      type: Number,
      min: 0,
    },

    goalWeight: {
      type: Number,
      min: 0,
    },

    goal: {
      type: String,
      enum: ["muscle_gain", "fat_loss", "maintenance"],
    },

    activityLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;