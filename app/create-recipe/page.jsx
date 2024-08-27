import RecipeForm from "@components/RecipeForm";
import authorizeUser from "@actions/authorizeUser";
import { redirect } from "next/navigation";

export default async function CreateRecipe() {
  const user = await authorizeUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="pt-10">
      <span className="flex">
        <span className="text-center text-orange-500 text-2xl font-extrabold mr-auto my-auto ml-auto">
          Create New Recipe
        </span>
      </span>
      <RecipeForm userId={user.id} />
    </div>
  );
}
