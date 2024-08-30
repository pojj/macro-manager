import Dashboard from "@components/Dashboard";

export default function Profile({ params }) {
  return (
    <section className="w-full">
      <span className="flex">
        <span className="text-center text-orange-500 text-4xl font-extrabold mr-auto my-auto ml-auto">
          Dashboard
        </span>
      </span>
      <Dashboard userId={params.id} />
    </section>
  );
}
