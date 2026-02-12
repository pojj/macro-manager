import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import User from "@models/user";

// Connect to the database
await connectToDB();

// Define the GET function for handling the request
export async function GET(req, { params }) {
  const userId = params.id; // Note: Assuming params.id is how userId is accessed, align with your route setup.

  try {
    // Find the user by ID and populate their created recipes with ingredients
    const user = await User.findById(userId)
      .populate({
        path: "createdRecipes", // Populates the createdRecipes field
        populate: {
          path: "ingredients", // Nested population of the ingredients within each recipe
          model: "Ingredient", // Specify the model to populate
        },
      })
      .exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Send the populated recipes back to the client
    return NextResponse.json({ recipes: user.createdRecipes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
