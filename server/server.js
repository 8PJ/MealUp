require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");

const passport = require("./auth/passportAuth");

const app = express();

require("./auth/sessionAuth")(app);

// middleware
app.use(express.json());

// root route for testing
app.get("/", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM app_user WHERE user_id=$1",
            [1]
        );
        console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

////////////////////
// non API routes //
////////////////////

// Log in user
app.post("/login", async (req, res, next) => {
    if (req.isAuthenticated()) {
        res.json({ message: "You are already logged in." });
        return;
    }
    
    // authenticate a user usning local passport strategy
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to log in." });
            return;
        }
        if (!user) {
            res.status(401).json({ message: info.message });
            return;
        }

        // if authenticated successfully, log them in
        req.logIn(user, (error2) => {
            if (error2) {
                res.status(500).json({ message: "Failed to log in." });
                return;
            }
            res.json({ message: "You have successfylly logged in" });
        });
    })(req, res, next);
});

///////////////
// user APIs //
///////////////

// TODO add all user API endpoints

// GET

// Get all recipes created by a user
app.get("/users/:userId/createdRecipes", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            "SELECT * FROM recipe WHERE creator_id=$1",
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
            "SELECT * FROM followed_recipe WHERE user_id=$1",
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
            "SELECT * FROM user_ingredient_score WHERE user_id=$1 AND is_favourite=TRUE",
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

    // check if password has at least 8 characters
    if (password.length < 8) {
        res.status(400).json({ message: "Password must be at least 8 characters long." });
        return;
    }

    // check if password is at most 60 characters
    if (password.length > 60) {
        res.status(400).json({ message: "Password must not contain more than 60 characters." });
        return;
    }

    // check if password only contains letters, numbers and the following symbols: ! "#$%&'()*+,-./:;<=>?@[\]^_{|}~
    if (!/^[ -~]*$/.test(password.test)) {
        res.status(400).json({ message: "Password may only contain letters, numbers and the following symbols: ! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~" });
        return;
    }

    // check if username is available
    try {
        const result = await db.query(
            "SELECT * FROM app_user WHERE username=$1",
            [username]
        );
        if (result.rows.length > 0) {
            res.status(400).json({ message: "Username already used." });
            return;
        }
    } catch (error) {
        console.log(error);
    }

    // check if email is available
    try {
        const result = await db.query(
            "SELECT * FROM app_user WHERE email=$1",
            [email]
        );
        if (result.rows.length > 0) {
            res.status(400).json({ message: "Email already used." });
            return;
        }
    } catch (error) {
        console.log(error);
    }

    // hash password
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);

    try {
        const result = await db.query(
            "INSERT INTO app_user (username, email, password, time_created) VALUES($1, $2, $3, NOW()) RETURNING *",
            [username, email, hash]
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
            "INSERT INTO followed_recipe (user_id, recipe_id, is_used_for_meal_plan) VALUES ($1, $2, $3) RETURNING *",
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
            "UPDATE user_ingredient_score SET is_favourite=$1 WHERE ingredient_id=$2 RETURNING *",
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
            "DELETE FROM followed_recipe WEHRE user_id=$1 AND recipe_id=$2",
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
        const result = await db.query("SELECT * FROM recipe");
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
            "SELECT * FROM recipe WHERE recipe_id=$1",
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
             FROM recipe_ingredient INNER JOIN ingredient
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
            "INSERT INTO recipe (recipe_name, creator_id, is_public) VALUES($1, $2, $3) RETURNING *",
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
            "SELECT * FROM recipe WHERE recipe_id=$1",
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
            "INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)",
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
            "SELECT * FROM recipe WHERE recipe_id=$1",
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
            "UPDATE recipe SET recipe_name=$1, is_public=$2 WHERE recipe_id=$3 RETURNING *",
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
            "DELETE FROM recipe WHERE recipe_id=$1",
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
            "DELETE FROM recipe_ingredient WHERE recipe_id=$1 AND ingredient_id=$2",
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
        const result = await db.query("SELECT FROM ingredient");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
});

// Get specific ingredient by id
app.get("/ingredients/:ingredientId", async (req, res) => {
    const { ingredientId } = req.params;

    try {
        const result = await db.query(
            "SELECT FROM ingredient WHERE ingredient_id=$1",
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
            "INSERT INTO ingredient (ingredient_name, is_approved_for_public) VALUES ($1, $2) RETURNING *",
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
            "DELETE FROM ingredient WHERE ingredient_id=$1",
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started and listening on port ${PORT}`);
});