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

  // Daily macro targets (calories, protein g, fat g, carbs g)
  targetCalories: { type: Number, default: 2000, min: [0, "Target must be non-negative"] },
  targetProtein: { type: Number, default: 150, min: [0, "Target must be non-negative"] },
  targetFat: { type: Number, default: 65, min: [0, "Target must be non-negative"] },
  targetCarbs: { type: Number, default: 250, min: [0, "Target must be non-negative"] },

  // Referenced documents for tracked meals
  trackedMeals: [{ type: Schema.Types.ObjectId, ref: "Meal", required: false }],

  // Referenced documents for created recipes
  createdRecipes: [
    { type: Schema.Types.ObjectId, ref: "Recipe", required: false },
  ],
});

// Delete cached model in development to pick up schema changes (e.g. new target fields)
if (models.User) {
  mongoose.deleteModel("User");
}
const User = mongoose.model("User", userSchema);
export default User;
