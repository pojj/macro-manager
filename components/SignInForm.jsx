"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import signInUser from "@lib/signInUser";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
      email,
      password,
    };

    try {
      const message = await signInUser(formData);
      if (message.success == false) {
        throw new Error(message.body.error);
      }
      router.replace("user/" + message.body.id);
      router.refresh();
    } catch (error) {
      // Display only 1 error at a time
      let errors = error.message.split("\n");
      setError(errors[0]);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 grid">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            className="block py-1.5 my-1 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              focus:outline-none focus:ring-0 focus:border-orange-300 peer"
            placeholder=" "
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
              peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-orange-300 peer-placeholder-shown:scale-100
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 select-none"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="floating_password"
            id="floating_password"
            className="block py-1.5 my-1 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              focus:outline-none focus:ring-0 focus:border-orange-300 peer"
            placeholder=" "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
              peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-orange-300 peer-placeholder-shown:scale-100
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 select-none"
          >
            Password
          </label>
        </div>
        <div className="flex">
          <button
            type="submit"
            className="text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:focus:ring-orange-900 font-medium rounded-lg
            text-sm w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
          {error && <p className="ml-3 text-sm text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
}
