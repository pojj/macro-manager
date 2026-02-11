import mongoose from "mongoose";
const { Schema, models } = mongoose;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [
    { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
  ],
  instructions: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = models.Recipe || mongoose.model("Recipe", recipeSchema);
export default Recipe;
