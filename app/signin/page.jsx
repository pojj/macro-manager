import Image from "next/image";
import SignInForm from "@components/SignInForm";

export default function SignIn() {
  return (
    <div className="pt-10">
      <span className="flex">
        <span className="text-center text-orange-500 text-2xl font-extrabold mr-auto my-auto ml-auto">
          Sign In
        </span>
      </span>
      <SignInForm />
    </div>
  );
}
