import mongoose from "mongoose";



const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    weight:String,
    body_fat:String,
    chest:String,
    waist:String,
    biceps:String,
    date:String
 
  },
  {
    timestamps: true
  }
);

const ProgressModel = mongoose.model("Progress", ProgressSchema);

export default ProgressModel;