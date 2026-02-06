import mongoose from "mongoose";
const { Schema, models } = mongoose;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [
    { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
  ],
  instructions: { type: String, required: true },
});

const Recipe = models.Recipe || mongoose.model("Recipe", recipeSchema);
export default Recipe;
