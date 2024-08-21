import mongoose from "mongoose";
const { Schema, models } = mongoose;

const mealSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: false },
});

const Meal = models.Meal || mongoose.model("Meal", mealSchema);
export default Meal;
