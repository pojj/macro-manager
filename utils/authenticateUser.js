"use server";

export default async function authenticateUser(formData) {
  const response = await fetch("http://localhost:3001/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  if (response.status != 200) {
    const responseData = await response.json();
    throw new Error(responseData.error);
  }
}
