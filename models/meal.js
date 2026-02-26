import mongoose from "mongoose";
const { Schema, models } = mongoose;

const mealSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  date: { type: Date, required: true, default: Date.now },
  recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Delete cached model in development to pick up schema changes (e.g. new protein/carbs/fats fields)
if (models.Meal) {
  mongoose.deleteModel("Meal");
}
const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
