import { NextResponse } from "next/server";
import Meal from "@models/meal"; // Make sure the path is correct to your Meal model
import User from "@models/user";
import connectToDB from "@lib/database";

await connectToDB;

export async function DELETE(req, { params }) {
  const mealId = params.id; // Meal ID to delete

  try {
    const deletedMeal = await Meal.findByIdAndDelete(mealId);

    if (!deletedMeal) {
      return NextResponse.json({ message: "Meal not found" }, { status: 404 });
    }

    // Remove the reference from the user
    await User.updateOne(
      { trackedMeals: mealId },
      { $pull: { trackedMeals: mealId } }
    );

    return NextResponse.json(
      { message: "Meal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
