"use client";

import React, { useState, useEffect } from "react";

const MealForm = ({ userId }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Allow for optional recipe selection
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState(""); // State for meal description
  const [calories, setCalories] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch existing recipes from the server
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the new meal
      const mealResponse = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mealName,
          description: description, // Include the description in the payload
          calories: parseInt(calories, 10),
          recipe: selectedRecipe ? selectedRecipe : null,
          createdBy: userId, // Assuming the userId should be associated with the meal
        }),
      });

      if (mealResponse.ok) {
        const meal = await mealResponse.json();
        alert("Meal created successfully!");
        // Reset form
        setMealName("");
        setDescription(""); // Reset description field
        setCalories("");
        setSelectedRecipe(null);
      } else {
        const errorData = await mealResponse.json();
        alert(`Failed to create meal: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating meal:", error);
      alert("Failed to create meal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Meal Name:
        </label>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
          placeholder="Add a description for the meal"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Calories:
        </label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Recipe (Optional):
        </label>
        <select
          value={selectedRecipe}
          onChange={(e) => setSelectedRecipe(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">None</option>
          {recipes.map((recipe) => (
            <option key={recipe._id} value={recipe._id}>
              {recipe.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Track Meal"}
        </button>
      </div>
    </form>
  );
};

export default MealForm;
