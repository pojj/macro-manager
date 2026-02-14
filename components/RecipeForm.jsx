"use client";

import React, { useState, useEffect, useMemo } from "react";

const RecipeForm = ({ userId }) => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch existing ingredients from the server
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/api/ingredients");
        const data = await response.json();
        setIngredients(data);
        setFilteredIngredients(data); // Initialize with all ingredients
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  const handleCheckboxChange = (ingredientId) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientId)) {
        // Remove from selected ingredients
        return prevSelected.filter((id) => id !== ingredientId);
      } else {
        // Add to selected ingredients
        return [...prevSelected, ingredientId];
      }
    });
  };

  const handleNewIngredientChange = (e) => {
    setNewIngredient(e.target.value);

    // Filter the existing ingredients based on input
    const searchQuery = e.target.value.toLowerCase();
    const filtered = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery)
    );
    setFilteredIngredients(filtered);
  };

  const handleAddIngredient = async () => {
    if (newIngredient.trim() === "") return;

    try {
      // Create new ingredient if one is provided
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newIngredient }),
      });

      const ingredient = await response.json();
      const updatedIngredients = [...ingredients, ingredient];

      setIngredients(updatedIngredients); // Add to the ingredients list
      setFilteredIngredients(updatedIngredients); // Update filtered list
      setSelectedIngredients([...selectedIngredients, ingredient._id]); // Select the newly added ingredient
      setNewIngredient(""); // Reset the new ingredient field
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the new recipe
      const recipeResponse = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: recipeName,
          ingredients: selectedIngredients,
          instructions,
          createdBy: userId,
        }),
      });

      // Reset form
      setRecipeName("");
      setSelectedIngredients([]);
      setNewIngredient("");
      setInstructions("");

      alert("Recipe created successfully!");
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Failed to create recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort ingredients with selected ones at the top and then alphabetically
  const sortedFilteredIngredients = useMemo(() => {
    return [...filteredIngredients].sort((a, b) => {
      const isSelectedA = selectedIngredients.includes(a._id);
      const isSelectedB = selectedIngredients.includes(b._id);

      if (isSelectedA && !isSelectedB) return -1; // Selected ingredient appears before non-selected
      if (!isSelectedA && isSelectedB) return 1; // Non-selected ingredient appears after selected

      return a.name.localeCompare(b.name); // Sort alphabetically by name
    });
  }, [filteredIngredients, selectedIngredients]);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Recipe Name:
        </label>
        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Ingredients:
        </label>
        <div className="flex justify-center">
          <input
            type="text"
            value={newIngredient}
            onChange={handleNewIngredientChange}
            placeholder="Search Ingredients"
            className="shadow appearance-none border rounded w-4/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-orange-500 hover:bg-orange-700 rounded text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
          >
            Add Ingredient
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="border rounded p-2 shadow max-h-40 overflow-y-auto bg-white">
          {sortedFilteredIngredients.map((ingredient) => (
            <div key={ingredient._id} className="flex items-center mb-1">
              <input
                type="checkbox"
                id={`ingredient-${ingredient._id}`}
                checked={selectedIngredients.includes(ingredient._id)}
                onChange={() => handleCheckboxChange(ingredient._id)}
                className="mr-2"
              />
              <label htmlFor={`ingredient-${ingredient._id}`}>
                {ingredient.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Instructions:
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="5"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Recipe"}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
