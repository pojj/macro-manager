import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import Recipe from "@models/recipe";
import User from "@models/user";

// Connect to the database
await connectToDB();

// Define the DELETE function for handling recipe deletion
export async function DELETE(req, { params }) {
  const recipeId = params.id; // Recipe ID to delete

  try {
    // Find and delete the recipe
    const recipe = await Recipe.findByIdAndDelete(recipeId);

    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    // Remove the reference from the user
    await User.updateOne(
      { createdRecipes: recipeId },
      { $pull: { createdRecipes: recipeId } }
    );

    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
