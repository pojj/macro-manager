"use client";

import authorizeUser from "@actions/authorizeUser";
import React, { useEffect, useState } from "react";

const MEALS_PER_PAGE = 5;

export default function MealList({ userId }) {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
        setCurrentPage(1);

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
        const updated = meals.filter((meal) => meal._id !== mealId);
        setMeals(updated);
        setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil(updated.length / MEALS_PER_PAGE))));
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

  const sortedMeals = [...meals].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sortedMeals.length / MEALS_PER_PAGE);
  const startIndex = (currentPage - 1) * MEALS_PER_PAGE;
  const paginatedMeals = sortedMeals.slice(startIndex, startIndex + MEALS_PER_PAGE);

  return (
    <div className="mt-3">
      {meals.length > 0 ? (
        <>
        <ul className="space-y-4">
          {paginatedMeals.map((meal) => (
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
              <p className="text-gray-600">
                Calories: {meal.calories}
                {(meal.protein != null || meal.carbs != null || meal.fats != null) && (
                  <span className="ml-2 text-gray-500">
                    | P: {meal.protein ?? 0}g C: {meal.carbs ?? 0}g F: {meal.fats ?? 0}g
                  </span>
                )}
              </p>
              <p className="mt-2 text-gray-700">
                Date: {new Date(meal.date).toLocaleDateString()}
              </p>
              {meal.recipe && (
                <p className="mt-2 text-gray-700">
                  Recipe: {meal.recipe.title}
                </p>
              )}
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {"<"}
            </button>
            <span className="text-gray-600">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {">"}
            </button>
          </div>
        )}
        </>
      ) : (
        <p>No meals found.</p>
      )}
    </div>
  );
}
