import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import generateAccessToken from "@lib/auth/generateAccessToken";

// Middleware to renew auth token
export default async function middleware(req) {
  const authToken = req.cookies.get("authToken");
  const url = req.nextUrl.clone();

  if (authToken) {
    try {
      // Verify the token
      const token = authToken.value;
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      // Assuming your verified object contains user information
      const user = verified.payload; // Adjust based on the actual structure

      // Renew the token (e.g., extend the expiration time)
      const newjwt = await generateAccessToken(
        user.id,
        user.firstName,
        user.lastName
      );

      const response = NextResponse.next();

      // Set the new token in the cookies
      response.cookies.set("authToken", newjwt, {
        httpOnly: true,
        maxAge: Number(process.env.JWT_EXPIRES_IN),
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "production",
        path: "/",
      });

      // Redirect user to user page if they are already logged in and trying to access sign in/up
      if (url.pathname == "/signin" || url.pathname == "/signup") {
        return NextResponse.redirect(
          new URL("/user/" + user.id, req.url),
          "replace"
        );
      }

      return response;
    } catch (error) {
      // If token verification fails, clear the cookie and redirect to login
      const response = NextResponse.redirect(process.env.URL + "signin");
      response.cookies.set("authToken", "", { maxAge: 0 });
      return response;
    }
  }

  return NextResponse.next();
}
