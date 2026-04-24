import mongoose, { Mongoose, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    id:Schema.ObjectId,
    FirstName:String,
    SecondName:String,
    email:String,
    age:String,
    gender:String,
    username:String,
    password:String,
    Weight:String,
    Height:String,
    FitnessGoal:String,
    ExperienceLevel:String,
    Injuries:String,
    refreshToken:String,
    signInType:{
        type:Number,
        enum:[1,2], // 1 for email and password, 2 for username. and password, 3 for Google sign in
         default:1
    },
    isProfileSetup:Boolean
},{timestamps:true})


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model("User",UserSchema) 

export default UserModel