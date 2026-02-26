/**
 * Seed script for meals
 * Run with: node scripts/seed-meals.js
 * Requires: Recipes seeded for user. Run seed:recipes first.
 */

const path = require("path");
const mongoose = require("mongoose");

try {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
} catch {}

const USER_ID = new mongoose.Types.ObjectId("69b713cc430c67e45cbaca6a");

// Meal type templates: { name, calRange, proteinRange, carbsRange, fatsRange }
const MEAL_TEMPLATES = [
  // Generic meals
  { name: "Breakfast", cal: [300, 550], p: [12, 25], c: [30, 55], f: [8, 22] },
  { name: "Lunch", cal: [400, 650], p: [20, 40], c: [35, 60], f: [12, 28] },
  { name: "Dinner", cal: [500, 850], p: [25, 50], c: [40, 75], f: [15, 35] },
  { name: "Snack", cal: [100, 280], p: [2, 12], c: [10, 35], f: [2, 15] },
  { name: "Morning snack", cal: [120, 250], p: [3, 10], c: [12, 30], f: [3, 12] },
  { name: "Afternoon snack", cal: [150, 300], p: [5, 15], c: [15, 40], f: [5, 18] },
  { name: "Late night snack", cal: [80, 220], p: [2, 8], c: [8, 25], f: [2, 10] },
  { name: "Brunch", cal: [450, 700], p: [18, 35], c: [40, 65], f: [15, 30] },
  { name: "Pre-workout", cal: [200, 400], p: [10, 25], c: [25, 50], f: [2, 10] },
  { name: "Post-workout", cal: [350, 600], p: [25, 45], c: [40, 70], f: [5, 20] },
  // Fast food
  { name: "McDonald's Big Mac meal", cal: [900, 1100], p: [28, 38], c: [95, 120], f: [45, 60] },
  { name: "Subway footlong", cal: [700, 1000], p: [35, 55], c: [80, 120], f: [18, 35] },
  { name: "Burger King Whopper", cal: [657, 800], p: [28, 35], c: [48, 60], f: [37, 48] },
  { name: "Wendy's Combo", cal: [950, 1100], p: [55, 65], c: [45, 55], f: [60, 75] },
  { name: "Taco Bell tacos", cal: [170, 220], p: [8, 12], c: [12, 18], f: [10, 14] },
  { name: "Chipotle burrito", cal: [900, 1100], p: [45, 60], c: [95, 120], f: [35, 50] },
  { name: "Chipotle bowl", cal: [650, 850], p: [40, 55], c: [70, 95], f: [25, 40] },
  { name: "Pizza", cal: [250, 380], p: [10, 16], c: [28, 42], f: [10, 18] },
  // Ice cream & sweets
  { name: "Ice cream cone", cal: [200, 350], p: [4, 8], c: [28, 45], f: [10, 18] },
  { name: "McFlurry", cal: [510, 650], p: [10, 14], c: [70, 90], f: [20, 28] },
  { name: "Chocolate bar", cal: [220, 280], p: [3, 5], c: [25, 35], f: [12, 18] },
  { name: "Donut", cal: [250, 380], p: [4, 7], c: [28, 45], f: [12, 22] },
  { name: "Muffin", cal: [350, 500], p: [6, 12], c: [45, 65], f: [14, 25] },
  { name: "Cookie", cal: [140, 250], p: [2, 4], c: [18, 32], f: [6, 14] },
  { name: "Brownie", cal: [180, 320], p: [2, 5], c: [25, 45], f: [8, 18] },
  // Fruits
  { name: "Banana", cal: [90, 120], p: [1, 2], c: [23, 28], f: [0, 1] },
  { name: "Apple", cal: [80, 110], p: [0, 1], c: [21, 28], f: [0, 1] },
  { name: "Orange", cal: [60, 80], p: [1, 2], c: [15, 20], f: [0, 1] },
  { name: "Grapes", cal: [60, 100], p: [0, 1], c: [15, 26], f: [0, 1] },
  { name: "Strawberries", cal: [45, 65], p: [1, 2], c: [10, 16], f: [0, 1] },
  { name: "Blueberries", cal: [80, 110], p: [1, 2], c: [20, 28], f: [0, 1] },
  { name: "Watermelon", cal: [45, 85], p: [0, 1], c: [11, 21], f: [0, 1] },
  { name: "Mango", cal: [100, 135], p: [1, 2], c: [25, 35], f: [0, 1] },
  { name: "Peach", cal: [55, 75], p: [1, 2], c: [14, 19], f: [0, 1] },
  { name: "Pear", cal: [95, 115], p: [0, 1], c: [25, 30], f: [0, 1] },
  { name: "Avocado", cal: [240, 320], p: [3, 4], c: [12, 18], f: [22, 30] },
  { name: "Smoothie", cal: [150, 350], p: [2, 12], c: [30, 55], f: [0, 8] },
  { name: "Dried fruit mix", cal: [120, 200], p: [1, 3], c: [28, 45], f: [0, 2] },
  // Salads
  { name: "Caesar salad", cal: [350, 550], p: [12, 22], c: [18, 35], f: [25, 45] },
  { name: "Chicken salad", cal: [350, 500], p: [25, 40], c: [15, 30], f: [20, 35] },
  { name: "Tuna salad", cal: [280, 420], p: [22, 35], c: [8, 18], f: [18, 30] },
  { name: "Coleslaw", cal: [120, 220], p: [1, 3], c: [15, 25], f: [6, 16] },
  // Snacks
  { name: "Trail mix", cal: [170, 280], p: [5, 10], c: [18, 28], f: [10, 20] },
  { name: "Peanut butter sandwich", cal: [250, 380], p: [10, 16], c: [22, 35], f: [14, 24] },
  { name: "Chips", cal: [150, 280], p: [2, 4], c: [15, 28], f: [10, 18] },
  { name: "Granola bar", cal: [100, 200], p: [2, 6], c: [18, 32], f: [3, 10] },
  { name: "Protein bar", cal: [180, 280], p: [18, 30], c: [18, 35], f: [5, 12] },
  { name: "Yogurt cup", cal: [100, 180], p: [5, 12], c: [15, 28], f: [0, 5] },
  { name: "String cheese", cal: [80, 100], p: [6, 8], c: [0, 1], f: [6, 8] },
  { name: "Carrots", cal: [25, 50], p: [0, 1], c: [6, 12], f: [0, 1] },
  { name: "Hard boiled eggs", cal: [70, 155], p: [6, 13], c: [0, 1], f: [5, 11] },
  { name: "Beef jerky", cal: [80, 130], p: [12, 18], c: [2, 6], f: [2, 6] },
  // Coffee & drinks
  { name: "Coffee with milk", cal: [25, 80], p: [1, 4], c: [2, 8], f: [1, 4] },
  { name: "Latte", cal: [120, 250], p: [6, 12], c: [10, 25], f: [4, 12] },
  { name: "Frappuccino", cal: [250, 400], p: [4, 8], c: [45, 65], f: [6, 14] },
  { name: "Smoothie bowl", cal: [350, 550], p: [8, 18], c: [55, 85], f: [8, 22] },
  { name: "Protein shake", cal: [120, 250], p: [20, 35], c: [3, 25], f: [2, 8] },
  { name: "Diet Coke", cal: [140, 200], p: [0, 0], c: [39, 55], f: [0, 0] },
  // Other common meals
  { name: "Cereal with milk", cal: [200, 350], p: [6, 12], c: [35, 55], f: [4, 10] },
  { name: "Eggs and toast", cal: [350, 500], p: [18, 28], c: [28, 45], f: [16, 28] },
  { name: "Avocado toast", cal: [250, 400], p: [8, 14], c: [25, 45], f: [14, 28] },
  { name: "Wrap", cal: [350, 550], p: [18, 30], c: [38, 58], f: [10, 22] },
  { name: "Soup", cal: [150, 350], p: [6, 18], c: [18, 45], f: [4, 18] },
  { name: "Ramen", cal: [400, 650], p: [14, 25], c: [55, 85], f: [14, 28] },
  { name: "Hot dog", cal: [250, 380], p: [10, 14], c: [18, 28], f: [16, 28] },
  { name: "Burrito bowl", cal: [550, 750], p: [28, 42], c: [65, 90], f: [18, 32] },
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DBNAME;
  if (!uri || !dbName) {
    console.error("Missing MONGODB_URI or DBNAME. Set them in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName });

    const Meal = mongoose.models.Meal || mongoose.model(
      "Meal",
      new mongoose.Schema({
        name: String,
        description: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
        date: Date,
        recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      })
    );
    const Recipe = mongoose.models.Recipe || mongoose.model(
      "Recipe",
      new mongoose.Schema({
        title: String,
        ingredients: [],
        instructions: String,
        createdBy: mongoose.Schema.Types.ObjectId,
      })
    );
    const User = mongoose.models.User || mongoose.model(
      "User",
      new mongoose.Schema({
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        trackedMeals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
      })
    );

    const recipes = await Recipe.find({ createdBy: USER_ID }).select("_id title").lean();
    const recipeIds = recipes.map((r) => r._id);
    const recipeTitles = Object.fromEntries(recipes.map((r) => [r._id.toString(), r.title]));

    if (recipeIds.length === 0) {
      console.error("No recipes found for user. Run seed:recipes first.");
      process.exit(1);
    }

    const startDate = new Date("2025-01-01T00:00:00");
    const endDate = new Date("2025-03-30T23:59:59");
    const numMeals = 332;
    const numWithRecipe = Math.floor(numMeals / 2);

    const existingCount = await Meal.countDocuments({ createdBy: USER_ID });
    if (existingCount >= numMeals) {
      console.log(`User already has ${existingCount} meals. Skipping seed.`);
      process.exit(0);
    }

    const toCreate = numMeals - existingCount;
    const mealsToCreate = [];

    for (let i = 0; i < toCreate; i++) {
      const useRecipe = i < numWithRecipe && recipeIds.length > 0;
      const template = pickRandom(MEAL_TEMPLATES);

      let name, description, recipeId;
      if (useRecipe) {
        recipeId = pickRandom(recipeIds);
        name = recipeTitles[recipeId.toString()] || template.name;
        description = `Tracked meal based on ${name}`;
      } else {
        name = template.name;
        description = `Tracked ${name.toLowerCase()}`;
      }
      description = ""

      const calories = rand(template.cal[0], template.cal[1]);
      const protein = rand(template.p[0], template.p[1]);
      const carbs = rand(template.c[0], template.c[1]);
      const fats = rand(template.f[0], template.f[1]);
      const date = randomDate(startDate, endDate);

      mealsToCreate.push({
        name,
        description,
        calories,
        protein,
        carbs,
        fats,
        date,
        recipe: recipeId || undefined,
        createdBy: USER_ID,
      });
    }

    const created = await Meal.insertMany(mealsToCreate);
    const mealIds = created.map((m) => m._id);
    await User.findByIdAndUpdate(USER_ID, { $push: { trackedMeals: { $each: mealIds } } });

    const withRecipe = mealsToCreate.filter((m) => m.recipe).length;
    console.log(`Seeded ${created.length} meals (${withRecipe} with recipes).`);
    console.log(`Total meals for user: ${await Meal.countDocuments({ createdBy: USER_ID })}`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
