import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import Meal from "@models/meal";
import User from "@models/user";

await connectToDB();

export async function POST(req) {
  try {
    const { name, description, calories, recipe, createdBy } = await req.json();

    // Validate required fields
    if (!name || !calories || !createdBy) {
      return NextResponse.json(
        { message: "Name, calories, and createdBy are required fields." },
        { status: 400 }
      );
    }

    // Create a new meal object
    const newMeal = new Meal({
      name,
      description: description || "", // Use empty string if description is not provided
      calories,
      recipe: recipe || null, // Optional field, use null if not provided
      createdBy,
    });

    // Save the new meal to the database
    const savedMeal = await newMeal.save();

    // Update the user's list of meals
    await User.findByIdAndUpdate(
      createdBy,
      { $push: { trackedMeals: savedMeal._id } }, // Assuming the User schema has a meals field
      { new: true }
    );

    // Return the saved meal object as a response
    return NextResponse.json(savedMeal, { status: 201 });
  } catch (error) {
    console.error("Failed to create meal:", error);
    return NextResponse.json(
      { message: "Failed to create meal." },
      { status: 500 }
    );
  }
}
