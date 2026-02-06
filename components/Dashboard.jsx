"use client";

import React, { useState, useEffect } from "react";

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
    <div>
      <h1>Dashboard</h1>
      {!isEditing ? (
        <div>
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          {isAuthorizedUser && (
            <>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Age:</strong> {user.age}
              </p>
              <p>
                <strong>Weight:</strong> {user.weight}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit Info</button>
            </>
          )}
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          {isAuthorizedUser && (
            <>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Weight:</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Save</button>
            </>
          )}
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
