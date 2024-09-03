import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import Recipe from "@models/recipe";
import User from "@models/user";
import authorizeUser from "@actions/authorizeUser";

await connectToDB();

// Handle recipe creation
export async function POST(req) {
  try {
    const { name, ingredients, instructions, createdBy } = await req.json();

    const activeUser = await authorizeUser();

    if (!activeUser || activeUser.id != createdBy) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name || !ingredients || !instructions || !createdBy) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create a new recipe
    const newRecipe = new Recipe({
      title: name,
      ingredients: ingredients,
      instructions: instructions,
      createdBy: createdBy,
    });

    const savedRecipe = await newRecipe.save();

    // Find the user and update their createdRecipes
    const updatedUser = await User.findByIdAndUpdate(
      createdBy,
      { $push: { createdRecipes: savedRecipe._id } },
      { new: true, runValidators: true }
    );

    return NextResponse.json(savedRecipe, { status: 201 }); // Return the saved recipe
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return NextResponse.json(
      { message: "Failed to create recipe." },
      { status: 500 }
    );
  }
}

// Get list of recipes for meal
export async function GET() {
  try {
    const recipes = await Recipe.find({});
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
