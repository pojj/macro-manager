"use server";

export default async function signUpUser(formData) {
  const response = await fetch(process.env.URL + "api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const message = {
    success: response.status == 201 ? true : false,
    body: await response.json(),
  };

  return message;
}
