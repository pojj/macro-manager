export default function Home() {
  return (
    <section className="mt-16 w-full flex justify-center items-center flex-col">
      <h1 className="text-center mb-6 mt-20 px-4 font-extrabold text-7xl sm:text-8xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-yellow-400 from-orange-600">
          Macro Manager
        </span>
      </h1>
      <p className="text-center md:w-1/2 text-lg font-normal text-gray-500 lg:text-xl px-5">
        Track macros, recipes, and gainz
      </p>
    </section>
  );
}
