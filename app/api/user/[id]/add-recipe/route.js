import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import User from "@models/user";

await connectToDB();

export async function PUT(req, { params }) {
  const userId = params.id;

  try {
    const { recipeId } = await req.json();
    if (!userId || !recipeId) {
      return NextResponse.json(
        { message: "User ID and Recipe ID are required." },
        { status: 400 }
      );
    }

    // Find the user and update their createdRecipes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { createdRecipes: recipeId } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Recipe added to user successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user's recipes:", error);
    return NextResponse.json(
      { message: "Failed to update user's recipes." },
      { status: 500 }
    );
  }
}
