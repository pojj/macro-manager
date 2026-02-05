"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export default async function authorizeUser() {
  // Parse cookies from the request header
  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken");

  if (!authToken) {
    return null;
  }

  try {
    // Verify the token
    const token = authToken.value;
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const user = verified.payload;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
