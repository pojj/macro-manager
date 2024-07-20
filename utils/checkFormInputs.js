"use client";

export default function checkFormInputs(formData) {
  const { email, password, confirmPassword, firstName, lastName } = formData;

  const errors = [];

  if (!isValidEmail(email)) {
    errors.push("Must be a valid email");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  if (firstName.trim() === "") {
    errors.push("First name is required");
  }

  if (lastName.trim() === "") {
    errors.push("Last name is required");
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

function isValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}
