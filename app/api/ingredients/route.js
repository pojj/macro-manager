import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import Ingredient from "@models/ingredient";

await connectToDB();
export async function GET() {
  try {
    const ingredients = await Ingredient.find({});
    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    const newIngredient = new Ingredient({ name });
    await newIngredient.save();

    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create ingredient" },
      { status: 500 }
    );
  }
}
