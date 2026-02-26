"use client";

import React, { useState, useEffect } from "react";

const MealForm = ({ userId }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Allow for optional recipe selection
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState(""); // State for meal description
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
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
          protein: protein ? parseInt(protein, 10) : 0,
          carbs: carbs ? parseInt(carbs, 10) : 0,
          fats: fats ? parseInt(fats, 10) : 0,
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
        setProtein("");
        setCarbs("");
        setFats("");
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
          min="0"
          placeholder="0"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Protein (g):
          </label>
          <input
            type="number"
            min="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Carbs (g):
          </label>
          <input
            type="number"
            min="0"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fats (g):
          </label>
          <input
            type="number"
            min="0"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="0"
          />
        </div>
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
