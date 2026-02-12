import SignUpForm from "@components/SignUpForm";

export default function SignUp() {
  return (
    <div className="mt-16 pt-10">
      <span className="flex">
        <span className="text-center text-orange-500 text-2xl font-extrabold mr-auto my-auto ml-auto">
          Sign Up
        </span>
      </span>
      <SignUpForm />
    </div>
  );
}
