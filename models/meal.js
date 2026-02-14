import mongoose from "mongoose";
const { Schema, models } = mongoose;

const mealSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Meal = models.Meal || mongoose.model("Meal", mealSchema);
export default Meal;
