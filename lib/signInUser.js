"use server";

export default async function signInUser(formData) {
  const response = await fetch("http://localhost:3000/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const message = {
    success: response.status == 200 ? true : false,
    body: await response.json(),
  };

  return message;
}
