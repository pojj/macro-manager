"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete("authToken");
  redirect("/", "replace");
}
