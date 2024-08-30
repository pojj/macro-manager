import mongoose from "mongoose";
const { Schema, models } = mongoose;

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

  // Referenced documents for tracked meals
  trackedMeals: [{ type: Schema.Types.ObjectId, ref: "Meal", required: false }],

  // Referenced documents for created recipes
  createdRecipes: [
    { type: Schema.Types.ObjectId, ref: "Recipe", required: false },
  ],
});

const User = models.User || mongoose.model("User", userSchema);
export default User;
