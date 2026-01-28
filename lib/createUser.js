import { NextResponse } from "next/server";

import connectToDB from "./database";
import User from "@models/user";

export default async function createUser(body) {
  await connectToDB();

  const { email, password, firstName, lastName } = body;

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }

  try {
    const newUser = new User({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ error: messages.join("\n") }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
