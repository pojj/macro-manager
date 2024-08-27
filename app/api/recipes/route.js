import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import Recipe from "@models/recipe";

await connectToDB();

export async function POST(req) {
  try {
    const { name, ingredients, instructions, createdBy } = await req.json();

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

    return NextResponse.json(savedRecipe, { status: 201 }); // Return the saved recipe
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return NextResponse.json(
      { message: "Failed to create recipe." },
      { status: 500 }
    );
  }
}
