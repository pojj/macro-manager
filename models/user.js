import mongoose from "mongoose";
import { Schema, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already in use"],
    required: [true, "Email is required"],
  },
  password: { type: String, required: [true, "Password is required"] },
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String, required: [true, "Last name is required"] },
  createdAt: { type: Date, default: Date.now },
  age: { type: Number, required: false, min: [0, "Invalid age"] },
  weight: { type: Number, required: false, min: [0, "Invalid weight"] },
});

const User = (models.User = models.User || mongoose.model("User", userSchema));

export default User;
