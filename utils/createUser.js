"use server";

export default async function createUser(formData) {
  const response = await fetch("http://localhost:3001/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (response.status != 201) {
    const responseData = await response.json();
    throw new Error(responseData.error);
  }
}
