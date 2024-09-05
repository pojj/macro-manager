import MealSearch from "@components/MealSearch";

export default function Profile({ params }) {
  return (
    <section className="w-full">
      <span className="flex">
        <span className="text-center text-orange-500 text-4xl font-extrabold mr-auto my-auto ml-auto">
          Search Meals
        </span>
      </span>
      <MealSearch userId={params.id} />
    </section>
  );
}
