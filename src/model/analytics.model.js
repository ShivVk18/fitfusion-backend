// import mongoose from "mongoose";

// const WorkoutSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     plan_name:String,
//     split_type:{
//         type:String,
//         enum:["Full Body","Upper-Lower","Bro-Split","Push-Pull-Leg","Arnold-Split"]
//     },
     
//     created_by_AI:{
//         type:Boolean
//     },
//     duration:String
 
//   },
//   {
//     timestamps: true
//   }
// );

// const WorkoutModel = mongoose.model("Workout", WorkoutSchema);

// export default WorkoutModel;