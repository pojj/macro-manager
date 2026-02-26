"use client";

import authorizeUser from "@actions/authorizeUser";
import React, { useEffect, useState } from "react";

const RECIPES_PER_PAGE = 5;

export default function RecipeList({ userId }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch recipes from the API
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/get-recipes`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data.recipes);
        setCurrentPage(1);
        const user = await authorizeUser();
        if (user) {
          setIsAuthorized(user.id == userId);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  const handleDelete = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updated = recipes.filter((recipe) => recipe._id !== recipeId);
        setRecipes(updated);
        setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil(updated.length / RECIPES_PER_PAGE))));
      } else {
        const error = await response.json();
        setError(error.message);
      }
    } catch (error) {
      setError("Error deleting recipe: " + error.message);
    }
  };

  if (isLoading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const paginatedRecipes = recipes.slice(startIndex, startIndex + RECIPES_PER_PAGE);

  return (
    <div className="mt-3">
      {recipes.length > 0 ? (
        <>
        <ul className="space-y-4">
          {paginatedRecipes.map((recipe) => (
            <li
              key={recipe._id}
              className="p-4 bg-white border-orange-500 border-2 rounded-md"
            >
              <div className="flex">
                <span className="text-xl font-semibold">{recipe.title}</span>
                {/* Display delete button if the user is authorized */}
                {isAuthorized && (
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="px-2 py-1 ml-auto bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              {recipe.ingredients.length > 0 && (
                <ul className="mt-2 list-disc list-inside">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-600">
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-gray-700">{recipe.instructions}</p>
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
        <p>No recipes found.</p>
      )}
    </div>
  );
}
