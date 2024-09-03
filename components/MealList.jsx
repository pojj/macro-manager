"use client";

import authorizeUser from "@actions/authorizeUser";
import React, { useEffect, useState } from "react";

export default function MealList({ userId }) {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Fetch meals from the API
    const fetchMeals = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/get-meals`);
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }

        const data = await response.json();
        setMeals(data.meals);

        const user = await authorizeUser();
        if (user) {
          setIsAuthorized(true); // Adjust authorization logic as necessary
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [userId]);

  const handleDelete = async (mealId) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;

    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMeals(meals.filter((meal) => meal._id !== mealId));
      } else {
        const error = await response.json();
        setError(error.message);
      }
    } catch (error) {
      setError("Error deleting meal: " + error.message);
    }
  };

  if (isLoading) {
    return <p>Loading meals...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="mt-3">
      {meals.length > 0 ? (
        <ul className="space-y-4">
          {meals.map((meal) => (
            <li
              key={meal._id}
              className="p-4 bg-white border-orange-500 border-2 rounded-md"
            >
              <div className="flex">
                <span className="text-xl font-semibold">{meal.name}</span>
                {/* Display delete button if the user is authorized */}
                {isAuthorized && (
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="px-2 py-1 ml-auto mb-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-600">Calories: {meal.calories}</p>
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
