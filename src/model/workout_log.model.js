import mongoose from "mongoose";



const exerciseLogSchema = new mongoose.Schema({
  name:String,
  sets:String,
  reps:String,
  Weight:String

})
const WorkoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    exercise:[exerciseLogSchema],
    duration:String,
    date:String,
    notes:String
  },
  {
    timestamps: true
  }
);

const WorkoutLogModel = mongoose.model("WorkoutLog", WorkoutLogSchema);

export default WorkoutLogModel;