import ScanItem from "@components/ScanItem";
import authorizeUser from "@actions/authorizeUser";
import { redirect } from "next/navigation";

export default async function ScanPage() {
  const user = await authorizeUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="pt-10">
      <span className="flex">
        <span className="text-center text-orange-500 text-2xl font-extrabold mr-auto my-auto ml-auto">
          Scan Food Item
        </span>
      </span>
      <p className="text-center text-gray-600 mt-2 mb-6">
        Upload a photo of your food to get nutrition estimates
      </p>
      <ScanItem />
    </div>
  );
}
