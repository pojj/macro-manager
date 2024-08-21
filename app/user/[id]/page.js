import Dashboard from "@components/Dashboard";

export default function Profile({ params }) {
  return (
    <section className="w-full">
      <Dashboard userId={params.id} />
    </section>
  );
}
