import { NextResponse } from "next/server";
import connectToDB from "@lib/database";
import bcrypt from "bcrypt";
import User from "@models/user";
import generateAccessToken from "@lib/generateAccessToken";

export default async function authenticateUser(body) {
  await connectToDB();

  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const jwt = await generateAccessToken(
    user._id,
    user.firstName,
    user.lastName
  );
  const response = NextResponse.json({ id: user._id }, { status: 200 });

  // Set the cookie in the response
  response.cookies.set("authToken", jwt, {
    httpOnly: true,
    maxAge: Number(process.env.JWT_EXPIRES_IN),
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "production",
    path: "/",
  });

  return response;
}
