// Hoist env imports
import "@utils/initializeEnv.js";

import { Inter } from "next/font/google";
import "@styles/globals.css";

import Nav from "@components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Macro Manager",
  description: "Track/plan your meals/macros",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " dark:bg-white dark:text-black"}>
        <div className="main">
          <div className="gradient" />
        </div>
        <Nav />
        <main className="app">{children}</main>
      </body>
    </html>
  );
}
