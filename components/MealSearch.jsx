"use client";

import React, { useEffect, useState } from "react";

export default function MealSearch({ userId }) {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/get-meals`);
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }

        const data = await response.json();
        setMeals(data.meals);
        setFilteredMeals(data.meals);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [userId]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const queries = query.split(",").map((q) => q.trim().toLowerCase());

    const filtered = meals.filter((meal) => {
      return queries.every((q) => {
        const nameMatch = meal.name.toLowerCase().includes(q);
        const descriptionMatch = meal.description
          ? meal.description.toLowerCase().includes(q)
          : false;
        const caloriesMatch = meal.calories.toString().includes(q);
        const dateMatch = new Date(meal.date).toLocaleDateString().includes(q);
        const recipeMatch = meal.recipe
          ? meal.recipe.title.toLowerCase().includes(q)
          : false;

        return (
          nameMatch ||
          descriptionMatch ||
          caloriesMatch ||
          dateMatch ||
          recipeMatch
        );
      });
    });

    setFilteredMeals(filtered);
  };

  if (isLoading) {
    return <p>Loading meals...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="mt-3 max-w-3xl mx-auto p-4">
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by name, description, calories, date, recipe (comma-separated)"
        className="p-2 border-2 border-gray-300 rounded-md w-full mb-2 mx-auto"
      />

      {/* Render filtered meals */}
      {filteredMeals.length > 0 ? (
        <ul className="space-y-4">
          {filteredMeals.map((meal) => (
            <li
              key={meal._id}
              className="p-4 bg-white border-orange-500 border-2 rounded-md"
            >
              <div className="flex">
                <span className="text-xl font-semibold">{meal.name}</span>
              </div>
              <p className="text-gray-600">Calories: {meal.calories}</p>
              {meal.description && (
                <p className="mt-2 text-gray-700">{meal.description}</p>
              )}
              <p className="mt-2 text-gray-700">
                Date:{" "}
                {new Date(meal.date).toLocaleDateString() +
                  ", " +
                  new Date(meal.date).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
              {meal.recipe && (
                <p className="mt-2 text-gray-700">
                  Recipe: {meal.recipe.title}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No meals found.</p>
      )}
    </div>
  );
}
