import { SignJWT } from "jose";

export default async function generateAccessToken(id, firstName, lastName) {
  const token = await new SignJWT({ id, firstName, lastName })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN + "s")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return token;
}
