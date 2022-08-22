require('dotenv').config();
const express = require("express");
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 5432,
});

// root route for testing
app.get("/", async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users WHERE user_id=$1", [1]);
        res.json(users.rows);
    } catch (error) {
        console.log(error);
    }
});

//////////////
// user APIs//
//////////////

// TODO add all user API endpoints

// GET

// Get all recipes created by a user
app.get("/users/:userId/createdRecipes/", (req, res) => {
    // TODO return all recipes created by a
    // user with id req.params.userId
});

// Get all recipes followed by a user
app.get("/users/:userId/followdRecipes/", (req, res) => {
    // TODO return all recipes followed by a
    // user with id req.params.userId
});

// Get all favourited ingredients by a user
app.get("/users/:userId/favouriteIngredients/", (req, res) => {
    // TODO return all ingredients favourited by a
    // user with id req.params.userId
});

// POST
// NOTE - create new recipes using recipe APIs

// Add a recipe to user's followed recipes
app.post("/users/:userId/followdRecipes/", (req, res) => {
    // add a recipe to user's (id: req.params.userId) followed recipes
});

// PATCH

// Favourite/unfavourite an ingredient for a user
app.patch("favouriteIngredients/:ingredientId", (req, res) => {
    // make ingredient with id req.params.ingredientId favourite
    // or no longer favourite for a user with id req.body.userId
});

// DELETE

// Delete a recipe from user's followed recipes
app.delete("followdRecipes/:recipeId", (req, res) => {
    // delete a recipe with id req.params.recipeId
    // from a user with id req.body.userId
});

/////////////////
// recipe APIs //
/////////////////

// GET

// Get all recipes
app.get("/recipes", (req, res) => {
    // TODO return all recipes
});

// Get specific recipe by id
app.get("/recipes/:recipeId", (req, res) => {
    // TODO return recipe with id req.params.recipeId
});

// Get all ingredients of a specified recipe
app.get("/recipes/:recipeId/recipeIngredients", (req, res) => {
    // TODO return all ingredients of a recipe with id req.params.recipeId
});

// POST

// Create a new recipe
app.post("/recipes", (req, res) => {
    // TODO create a new recipe
});

// Add ingredient to recipe
app.post("/recipes/:recipeId/recipeIngredients", (req, res) => {
    // TODO add ingredient with id req.body.ingredientId
    // to recipe with id req.params.recipeId
});

// PATCH

// Make recipe public or change its name (reject all other changes)
app.patch("/recipes/:recipeId", (req, res) => {
    // TODO make recipe with id req.params.recipeId public
    // or change its name (depending on request)
});

// DELETE

// Delete recipe
app.delete("/recipes/:recipeId", (req, res) => {
    // TODO delete recipe with id req.params.recipeId
});

// Delete ingredient from recipe
app.delete("/recipeIngredients/:ingredientId", (req, res) => {
    // TODO delete ingredient with id req.params.ingredientId
    // from recipe with id req.body.recipeId
});

/////////////////////
// ingredient APIs //
/////////////////////

// GET

// Get all ingredients
app.get("/ingredients", (req, res) => {
    // TODO return all ingredients
});

// Get specific ingredient by id
app.get("/ingredients/:ingredientId", (req, res) => {
    // TODO return ingredient with id req.params.ingredientId
});

// POST

// Create a new ingredient
app.post("/ingredients", (req, res) => {
    // TODO create a new ingredient
});

// DELETE

// Delete an ingredient
app.delete("/ingredients/:ingredientId", (req, res) => {
    // TODO delete an ingredient with id req.params.ingredientId
});

//////////////////
// Server stuff //
//////////////////

app.listen(5000, () => {
    console.log("Server started on port 5000");
});