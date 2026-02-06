import mongoose from "mongoose";
const { Schema, models } = mongoose;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  image_url: { type: String, required: false },
});

const Ingredient =
  models.Ingredient || mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;
