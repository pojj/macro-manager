import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import User from "@models/user";
import authorizeUser from "@actions/authorizeUser";

await connectToDB();

// GET: Fetch user data
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await authorizeUser(); // Retrieve the authorized user

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user == null || user.id != id) {
      // If the user is not the same as the requested user, return limited info
      return NextResponse.json(
        {
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
        },
        { status: 200 }
      );
    }

    // Return full user data if the IDs match
    return NextResponse.json(targetUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT: Update user data
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();

  const user = await authorizeUser();

  if (id != user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
