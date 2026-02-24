# Meal and Recipe Tracker

A simple web application for tracking meals and managing recipes, built with Next.js and MongoDB. The app allows users to log their meals, track calorie intake, and store recipes.

## Features

- **User Profile Management**: Users can create and edit their profiles, including details like name, email, age, and weight.
- **Meal Tracking**: Users can log their meals, including details such as meal name, calories, date, and associated recipe.
- **Recipe Management**: Users can create, view, and delete recipes. Each recipe contains ingredients and preparation instructions.
- **Dashboard View**: A comprehensive dashboard to view user profile details, tracked meals, and stored recipes.

## Technologies Used

- **Frontend**: Next.js (App router)
- **Backend**: Next.js route handlers
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Authentication**: JWT/cookies

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.
- MongoDB instance cloud-based dev on MongoDB Atlas.
- A `.env.local` file with necessary environment variables (MongoDB connection string, secret keys).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pojj/macro-manager.git
   ```

2. Change into the project directory:

   ```bash
   cd macro-manager
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root of your project and add the following environment variables:

   ```plaintext
   URL
   NODE_ENV
   MONGODB_URI
   DBNAME
   SALT_WORK_FACTOR
   JWT_SECRET
   JWT_EXPIRES_IN
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

7. To run in a docker container:

   `docker build -t nextjs-docker .`

   then

   `docker run -p 3000:3000 --env-file .env.local nextjs-docker`

## Usage

- **User Account**: Sign up by creating an account optionally tracking weight or other metrics.
- **Dashboard**: View user details, track meals, and recipes.
- **Track Meal**: Click on the "Track Meal" button to log a new meal, inputting meal details like name, calories, and associated recipe.
- **Create Recipe**: Use the "Create Recipe" button to add a new recipe, specifying ingredients and instructions.
- **Edit and Delete**: Edit your profile details or delete meals and recipes using the provided buttons on the dashboard.
