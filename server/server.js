require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();

// middleware
app.use(express.json());

// root route for testing
app.get("/", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE user_id=$1",
            [1]
        );
        res.json(result.rows);
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
app.get("/users/:userId/createdRecipes", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            "SELECT * FROM recipes WHERE creator_id=$1",
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

// Get all recipes followed by a user
app.get("/users/:userId/followdRecipes", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            "SELECT * FROM followed_recipes WHERE user_id=$1",
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

// Get all favourited ingredients by a user
app.get("/users/:userId/favouriteIngredients", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            "SELECT * FROM user_ingredient_scores WHERE user_id=$1 AND is_favourite=TRUE",
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

// POST

// Create a new user
app.post("/users", async (req, res) => {
    const { username, email, password } = req.body;

    // TODO check if all inputs are defined and valid
    // TODO hash passwrods

    try {
        const result = await db.query(
            "INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *",
            [username, email, password]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

// NOTE - create new recipes using recipe APIs

// Add a recipe to user's followed recipes
app.post("/users/:userId/followdRecipes", (req, res) => {
    const { recipe_id, is_used_for_meal_plan } = req.body;
    const { userId } = req.params;

    // TODO check if all inputs are defined and valid

    try {
        const result = db.query(
            "INSERT INTO followed_recipes (user_id, recipe_id, is_used_for_meal_plan) VALUES ($1, $2, $3) RETURNING *",
            [userId, recipe_id, is_used_for_meal_plan]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

// PATCH

// Favourite/unfavourite an ingredient for a user
app.patch("favouriteIngredients/:ingredientId", async (req, res) => {
    const { is_favourite } = req.body;
    const { ingredientId } = req.params;

    // TODO check if all inputs are defined and valid

    try {
        const result = await db.query(
            "UPDATE user_ingredient_scores SET is_favourite=$1 WHERE ingredient_id=$2 RETURNING *",
            [is_favourite, ingredientId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

// DELETE

// Delete a recipe from user's followed recipes
app.delete("followdRecipes/:recipeId", async (req, res) => {
    const { user_id } = req.body;
    const { recipeId } = req.params;

    try {
        const result = await db.query(
            "DELETE FROM followed_recipes WEHRE user_id=$1 AND recipe_id=$2",
            [user_id, recipeId]
        );
        res.sendStatus(204); // no content
    } catch (error) {
        console.log(error);
    }
});

/////////////////
// recipe APIs //
/////////////////

// GET

// Get all recipes
app.get("/recipes", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM recipes");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

// Get specific recipe by id
app.get("/recipes/:recipeId", async (req, res) => {
    const { recipeId } = req.params;

    try {
        const result = await db.query(
            "SELECT * FROM recipes WHERE recipe_id=$1",
            [recipeId]
        );

        if (result.rows.length === 0) {
            res.sendStatus(404); // not found
        }
        else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.log(error);
    }
});

// Get all ingredients of a specified recipe
app.get("/recipes/:recipeId/recipeIngredients", async (req, res) => {
    const { recipeId } = req.params;

    try {
        const result = await db.query(
            `SELECT (ingredient_id, ingredient_name, is_approved_for_public)
             FROM recipe_ingredients INNER JOIN ingredients 
                USING (ingredient_id)
             WHERE recipe_id=$1`,
            [recipeId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

// POST

// Create a new recipe
app.post("/recipes", async (req, res) => {
    const { recipe_name, creator_id, is_public } = req.body;

    // TODO check if all inputs are defined and valid

    try {
        const result = await db.query(
            "INSERT INTO recipes (recipe_name, creator_id, is_public) VALUES($1, $2, $3) RETURNING *",
            [recipe_name, creator_id, is_public]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

// Add ingredient to recipe
app.post("/recipes/:recipeId/recipeIngredients", async (req, res) => {
    const { ingredient_id } = req.body;
    const { recipeId } = req.params;

    // TODO check if all inputs are defined and valid

    // Check if recipe is private
    try {
        const result = await db.query(
            "SELECT * FROM recipes WHERE recipe_id=$1",
            [recipeId]
        );

        if (result.rows.length === 0) {
            res.sendStatus(404); // not found
            return;
        }
        else if (result.rows[0].is_public) {
            res.sendStatus(403);
            return;
        }
    } catch (error) {
        console.log(error);
    }

    // Add ingredient to recipe
    try {
        const result = await db.query(
            "INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ($1, $2)",
            [recipeId, ingredient_id]
        );
        res.sendStatus(204); // no data
    } catch (error) {
        console.log(error);
    }
});

// PATCH

// Make recipe public or change its name (reject all other changes)
app.patch("/recipes/:recipeId", async (req, res) => {
    const { recipe_name, is_public } = req.body;
    const { recipeId } = req.params;

    // TODO check if all inputs are defined and valid
    if (recipe_name === undefined || is_public === undefined) {
        res.sendStatus(400); // bad request
        return;
    }

    // check if recipe is private (can't alter public recipe)
    try {
        const result = await db.query(
            "SELECT * FROM recipes WHERE recipe_id=$1",
            [recipeId]
        );

        if (result.rows.length === 0) {
            res.sendStatus(404); // not found
            return;
        }
        else if (result.rows[0].is_public) {
            res.sendStatus(403); // forbbiden
            return;
        }
    } catch (error) {
        console.log(error);
    }

    // check if is_public is true (can only set private recipe to public not vice versa)
    if (is_public === false) {
        res.sendStatus(403); // forbbiden
        return;
    }

    try {
        const result = await db.query(
            "UPDATE recipes SET recipe_name=$1, is_public=$2 WHERE recipe_id=$3 RETURNING *",
            [recipe_name, is_public, recipeId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

// DELETE

// Delete recipe
app.delete("/recipes/:recipeId", async (req, res) => {
    const { recipeId } = req.params;

    try {
        const result = await db.query(
            "DELETE FROM recipes WHERE recipe_id=$1",
            [recipeId]
        );
        res.sendStatus(204); // no content
    } catch (error) {
        console.log(error);
    }
});

// Delete ingredient from recipe
app.delete("/recipeIngredients/:ingredientId", async (req, res) => {
    const { recipe_id } = req.body;
    const { ingredientId } = req.params;

    try {
        const result = await db.query(
            "DELETE FROM recipe_ingredients WHERE recipe_id=$1 AND ingredient_id=$2",
            [recipe_id, ingredientId]
        );
        res.sendStatus(204); // no content
    } catch (error) {
        console.log(error);
    }
});

/////////////////////
// ingredient APIs //
/////////////////////

// GET

// Get all ingredients
app.get("/ingredients", async (req, res) => {
    try {
        const result = await db.query("SELECT FROM ingredients");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

// Get specific ingredient by id
app.get("/ingredients/:ingredientId", (req, res) => {
    const { ingredientId } = req.params;

    try {
        const result = await db.query(
            "SELECT FROM ingredients WHERE ingredient_id=$1",
            [ingredientId]
        );

        if (result.rows.length === 0) {
            res.sendStatus(404); // not found
        }
        else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.log(error);
    }
});

// POST

// Create a new ingredient
app.post("/ingredients", async (req, res) => {
    const { ingredient_name, is_approved_for_public } = req.body;

    // TODO check if all inputs are defined and valid

    try {
        const result = await db.query(
            "INSERT INTO ingredients (ingredient_name, is_approved_for_public) VALUES ($1, $2) RETURNING *",
            [ingredient_name, is_approved_for_public]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

// DELETE

// Delete an ingredient
app.delete("/ingredients/:ingredientId", (req, res) => {
    const { ingredientId } = req.params;

    try {
        const result = db.query(
            "DELETE FROM ingredients WHERE ingredient_id=$1",
            [ingredientId]
        );
        res.sendStatus(204); // no content
    } catch (error) {
        console.log(error);
    }
    // TODO delete an ingredient with id req.params.ingredientId
});

//////////////////
// Server stuff //
//////////////////

const port = process.env.PORT || 5000;
console.log(port);
app.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});