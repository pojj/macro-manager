"use client";

import React, { useState, useEffect } from "react";
import MealList from "@components/MealList";
import RecipeList from "@components/RecipeList";
import Link from "next/link";

const Dashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false); // To check if the user is authorized
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    weight: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);

          // Check if full data was returned (indicating the user is authorized)
          if (data.email) {
            setIsAuthorizedUser(true);
            setFormData({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email || "",
              age: data.age || "",
              weight: data.weight || "",
            });
          } else {
            setFormData({
              firstName: data.firstName,
              lastName: data.lastName,
            });
          }
        } else {
          console.error("Failed to fetch user:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthorizedUser) return; // Prevent updates if not authorized

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error("Failed to update user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-x-5">
        <div className="w-full md:w-4/12 gap-y-4 flex flex-col">
          {/* User Info Section */}
          <div className="w-full bg-white shadow-md rounded-lg p-6 h-fit">
            {!isEditing ? (
              <div>
                <p className="mb-2">
                  <strong className="font-semibold">Name:</strong>{" "}
                  {user.firstName} {user.lastName}
                </p>
                {isAuthorizedUser && (
                  <>
                    <p className="mb-2">
                      <strong className="font-semibold">Email:</strong>{" "}
                      {user.email}
                    </p>
                    <p className="mb-2">
                      <strong className="font-semibold">Age:</strong> {user.age}
                    </p>
                    <p className="mb-2">
                      <strong className="font-semibold">Weight:</strong>{" "}
                      {user.weight} pounds
                    </p>
                    <button
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Info
                    </button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                {isAuthorizedUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email:
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age:
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Weight:
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Save
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {isAuthorizedUser && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
              <div className="flex">
                <span className="text-2xl font-semibold my-auto">Meals</span>
                <Link
                  href="/track-meal"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition-color ml-auto"
                >
                  Track Meal
                </Link>
              </div>
              <MealList userId={userId} />
            </div>
          )}
        </div>

        {/* Tracked Meals and Recipes Section */}
        <div className="w-full md:w-7/12 flex-grow">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex">
              <span className="text-2xl font-semibold my-auto">Recipes</span>
              <Link
                href="/create-recipe"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition-color ml-auto"
              >
                Create Recipe
              </Link>
            </div>
            <RecipeList userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
