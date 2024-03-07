import mongoose from "mongoose";

const { Schema } = mongoose;

const budgetCurrentSchema = new Schema({
    categoryName:{
        type: String,
        required: true,
        unique: true
    },
    currentAmount:{
        type: Number,
        required: true
    },
}, {timestamps: true});


const budgetTargetSchema = new Schema({
    categoryName: {
      type: String,
      required: true,
      unique: true
    },
    targetAmount: {
      type: Number,
      required: true,
    },
  }, { timestamps: true });

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    avatarUrl:{
        type: String,
        required: false
    },
    budgetTargets: [budgetTargetSchema],
    budgetCurrent: [budgetCurrentSchema]
})
const User = mongoose.model("User", userSchema);

export default User;