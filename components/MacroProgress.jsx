"use client";

import React, { useState, useEffect } from "react";

const MACRO_LABELS = {
  calories: { label: "Calories", unit: "kcal", color: "bg-amber-500" },
  protein: { label: "Protein", unit: "g", color: "bg-blue-500" },
  fat: { label: "Fat", unit: "g", color: "bg-orange-500" },
  carbs: { label: "Carbs", unit: "g", color: "bg-green-500" },
};

function getTodayBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function sumMacrosForToday(meals) {
  const { start, end } = getTodayBounds();
  return meals.reduce(
    (acc, meal) => {
      const d = new Date(meal.date);
      if (d >= start && d < end) {
        acc.calories += meal.calories ?? 0;
        acc.protein += meal.protein ?? 0;
        acc.fat += meal.fats ?? 0;
        acc.carbs += meal.carbs ?? 0;
      }
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export default function MacroProgress({ userId, user, isAuthorized, onTargetsUpdated }) {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [targetForm, setTargetForm] = useState({
    targetCalories: 2000,
    targetProtein: 150,
    targetFat: 65,
    targetCarbs: 250,
  });

  useEffect(() => {
    if (!userId) return;
    const fetchMeals = async () => {
      try {
        const res = await fetch(`/api/user/${userId}/get-meals`);
        const data = await res.json();
        if (res.ok) setMeals(data.meals ?? []);
      } catch (err) {
        console.error("Error fetching meals:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeals();
  }, [userId]);

  useEffect(() => {
    if (user) {
      setTargetForm({
        targetCalories: user.targetCalories ?? 2000,
        targetProtein: user.targetProtein ?? 150,
        targetFat: user.targetFat ?? 65,
        targetCarbs: user.targetCarbs ?? 250,
      });
    }
  }, [user]);

  const consumed = sumMacrosForToday(meals);
  const targets = {
    calories: user?.targetCalories ?? 2000,
    protein: user?.targetProtein ?? 150,
    fat: user?.targetFat ?? 65,
    carbs: user?.targetCarbs ?? 250,
  };

  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    setTargetForm((prev) => ({ ...prev, [name]: Math.max(0, Number(value) || 0) }));
  };

  const handleSaveTargets = async (e) => {
    e.preventDefault();
    if (!isAuthorized || !userId) return;
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetForm),
      });
      if (res.ok) {
        const updated = await res.json();
        onTargetsUpdated?.(updated);
        setIsEditingTargets(false);
      }
    } catch (err) {
      console.error("Error saving targets:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-500">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Today&apos;s Progress</h3>
        {isAuthorized && (
          <button
            type="button"
            onClick={() => setIsEditingTargets(!isEditingTargets)}
            className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {isEditingTargets ? "Cancel" : "Set Targets"}
          </button>
        )}
      </div>

      {isEditingTargets ? (
        <form onSubmit={handleSaveTargets} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calories (kcal)</label>
              <input
                type="number"
                name="targetCalories"
                value={targetForm.targetCalories}
                onChange={handleTargetChange}
                min={0}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
              <input
                type="number"
                name="targetProtein"
                value={targetForm.targetProtein}
                onChange={handleTargetChange}
                min={0}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
              <input
                type="number"
                name="targetFat"
                value={targetForm.targetFat}
                onChange={handleTargetChange}
                min={0}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
              <input
                type="number"
                name="targetCarbs"
                value={targetForm.targetCarbs}
                onChange={handleTargetChange}
                min={0}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Save Targets
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {(["calories", "protein", "fat", "carbs"]).map((key) => {
            const target = targets[key];
            const current = consumed[key];
            const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
            const { label, unit, color } = MACRO_LABELS[key];
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{label}</span>
                  <span className="text-gray-600">
                    {current} / {target} {unit}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
