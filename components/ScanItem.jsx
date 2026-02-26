"use client";

import React, { useState, useRef } from "react";

export default function ScanItem() {
  const [imagePreview, setImagePreview] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNutritionData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/scan-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview }),
      });
      if (!response.ok) {
        throw new Error("Endpoint refused to connect");
      }
      const data = await response.json();
      setNutritionData(data);
    } catch (err) {
      const errorMessage =
        err.message === "Failed to fetch"
          ? "Endpoint refused to connect"
          : err.message;
      setNutritionData({
        mealItemGuess: errorMessage,
        servingSizeApprox: "Failed to fetch",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        webSearchQuery: "null",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setNutritionData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getWebSearchUrl = (query) => {
    const encoded = encodeURIComponent(query);
    return `https://www.google.com/search?q=${encoded}`;
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side - Image upload */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Upload Food Image
        </h2>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-[320px] bg-gray-50 hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative w-full max-h-[400px] flex justify-center">
              <img
                src={imagePreview}
                alt="Food preview"
                className="max-h-[400px] object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg font-medium">Click to upload or drag and drop</p>
              <p className="text-sm mt-1">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!imagePreview || isAnalyzing}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!imagePreview}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Right side - Nutrition information */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Nutrition Information
        </h2>
        <div className="border border-gray-200 rounded-lg p-6 bg-white min-h-[320px] shadow-sm relative">
          {nutritionData?.webSearchQuery && (
            <div className="absolute top-4 right-4">
              <a
                href={getWebSearchUrl(nutritionData.webSearchQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition text-sm font-medium inline-flex items-center gap-2"
              >
                Web Search
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Meal Item Guess
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1 min-h-[1.5rem]">
                {nutritionData?.mealItemGuess ?? ""}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Serving Size Approximation
              </p>
              <p className="text-gray-800 mt-1 min-h-[1.5rem]">
                {nutritionData?.servingSizeApprox ?? ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500">Calories</p>
                <p className="text-2xl font-bold text-orange-600 min-h-[2rem]">
                  {nutritionData?.calories ?? ""}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500">Protein (g)</p>
                <p className="text-2xl font-bold text-orange-600 min-h-[2rem]">
                  {nutritionData?.protein ?? ""}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500">Carbs (g)</p>
                <p className="text-2xl font-bold text-orange-600 min-h-[2rem]">
                  {nutritionData?.carbs ?? ""}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500">Fats (g)</p>
                <p className="text-2xl font-bold text-orange-600 min-h-[2rem]">
                  {nutritionData?.fats ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
