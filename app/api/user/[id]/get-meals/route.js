import { NextResponse } from "next/server";
import User from "@models/user";
import connectToDB from "@lib/database";

await connectToDB;

export async function GET(req, { params }) {
  const userId = params.id;

  try {
    // Find the user by ID and populate their created recipes with ingredients
    const user = await User.findById(userId)
      .populate({
        path: "trackedMeals", // Populates the createdRecipes field
        populate: {
          path: "recipe", // Nested population of the ingredients within each recipe
          model: "Recipe", // Specify the model to populate
        },
      })
      .exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Send the populated meals back to the client
    return NextResponse.json({ meals: user.trackedMeals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
