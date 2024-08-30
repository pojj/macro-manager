import Link from "next/link";
import Image from "next/image";

import authorizeUser from "@actions/authorizeUser";
import signOut from "@actions/signOut";
import capitalizeName from "@lib/capitalizeName";

export default async function Nav() {
  const user = await authorizeUser();

  return (
    <nav className="w-full pt-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Image
            src="/assets/favicon.ico"
            alt="logo"
            width={75}
            height={75}
            className="object-contain"
          />
        </Link>

        {user ? (
          <div className="flex items-center gap-5">
            <Link
              href="/track-meal"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition"
            >
              Track Meal
            </Link>

            <form action={signOut}>
              <button
                type="submit"
                className="px-4 py-2 border border-red-700 text-red-700 rounded-md hover:bg-red-700 hover:text-white transition"
              >
                Sign Out
              </button>
            </form>

            <Link href={`/user/${user.id}`} className="flex items-center gap-2">
              <span className="text-gray-700">
                {capitalizeName(user.firstName)} {capitalizeName(user.lastName)}
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <Link
              href="/signup"
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md"
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
