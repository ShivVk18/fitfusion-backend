import mongoose from "mongoose";

// Exercise Schema
const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: String,
    required: true
  },
  reps: {
    type: String,
    required: true
  },
  rest: {
    type: String,
    required: true
  }
}, { _id: false });

// Day Schema
const DaySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  focus: {
    type: String,
    required: true
  },
  exercises: [ExerciseSchema]
}, { _id: false });

// Main Workout Schema
const WorkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    plan_name: {
      type: String,
      required: true
    },

    split_type: {
      type: String,
      required: true
    },

    days: [DaySchema],

    created_by_AI: {
      type: Boolean,
      default: true
    },

    duration: {
      type: String // e.g., "6 weeks"
    }
  },
  {
    timestamps: true
  }
);

const WorkoutModel = mongoose.model("Workout", WorkoutSchema);

export default WorkoutModel;