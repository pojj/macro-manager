import Image from "next/image";
import SignInForm from "@components/SignInForm";

export default function SignIn() {
  return (
    <div className="pt-10">
      <span className="flex">
        <Image
          src="/assets/favicon.ico"
          width={50}
          height={50}
          alt="Macro icon"
          className="ml-auto"
        />
        <span className="text-center text-orange-500 text-2xl font-extrabold mr-auto my-auto ml-1">
          Sign In
        </span>
      </span>
      <SignInForm />
    </div>
  );
}
