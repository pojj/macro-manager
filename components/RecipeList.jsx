"use client";

import authorizeUser from "@actions/authorizeUser";
import React, { useEffect, useState } from "react";

export default function RecipeList({ userId }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

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
        setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
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

  if (isLoading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="mt-3">
      {recipes.length > 0 ? (
        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <li
              key={recipe._id}
              className="p-4 bg-white border-orange-500 border-2 rounded-md"
            >
              <div className="flex">
                <span className="text-xl font-semibold">{recipe.title}</span>
                {/* Display delete button if the user is authorized */}
                {isAuthorized && (
                  <button
                    onClick={() => handleDelete(meal._id)}
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
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}
