import mongoose from "mongoose";



const DietSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    calories:String,
    protien:String,
    carbs:String,
    fats:String,
    diet_type:String
    
  },
  {
    timestamps: true
  }
);

const DietModel = mongoose.model("Diet", DietSchema);

export default DietModel;