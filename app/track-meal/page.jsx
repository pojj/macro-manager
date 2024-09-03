import MealForm from "@components/MealForm";
import authorizeUser from "@actions/authorizeUser";
import { redirect } from "next/navigation";

export default async function TrackMeal() {
  const user = await authorizeUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="pt-10">
      <span className="flex">
        <span className="text-center text-orange-500 text-2xl font-extrabold mr-auto my-auto ml-auto">
          Track New Meal
        </span>
      </span>
      <MealForm userId={user.id} />
    </div>
  );
}
