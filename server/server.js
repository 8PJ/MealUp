require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");

const passport = require("./auth/passportAuth");

const app = express();

require("./auth/sessionAuth")(app);

// middleware
app.use(express.json());

// root route for testing (will later serve react app)
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
        res.status(500).json({ message: "Server error." });
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
            `SELECT recipe_id, recipe_name, creator_id, is_public
             FROM recipe WHERE creator_id=$1`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all recipes followed by a user
app.get("/users/:userId/followedRecipes", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            `SELECT recipe_id, recipe_name, creator_id, is_public
             FROM followed_recipe INNER JOIN recipe 
                USING(recipe_id)
             WHERE user_id=$1`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all favourited ingredients by a user
app.get("/users/:userId/favouriteIngredients", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            `SELECT ingredient_id, ingredient_name
             FROM user_ingredient_score INNER JOIN ingredient 
                USING(ingredient_id)
             WHERE user_id=$1 AND is_favourite=TRUE`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
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
        res.status(500).json({ message: "Server error." });
        return;
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
        res.status(500).json({ message: "Failed to log in." });
        return;
    }

    // hash password
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);

    try {
        const result = await db.query(
            `INSERT INTO app_user (username, email, password, time_created, is_admin)
             VALUES($1, $2, $3, NOW(), $4)
             RETURNING user_id, username, email`,
            [username, email, hash, false]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// NOTE - create new recipes using recipe APIs

// Add a recipe to user's followed recipes
app.post("/users/:userId/followedRecipes", async (req, res) => {
    const { recipe_id, is_used_for_meal_plan } = req.body;
    const { userId } = req.params;

    // TODO check if all inputs are defined and valid
    // TODO check if the recipe is not already followed
    // TODO check if recipe exists

    try {
        const result = await db.query(
            "INSERT INTO followed_recipe (user_id, recipe_id, is_used_for_meal_plan) VALUES ($1, $2, $3)",
            [userId, recipe_id, is_used_for_meal_plan]
        );
        res.json({ message: "Recipe successfully followed." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// PATCH

// Favourite/unfavourite an ingredient for a user
app.patch("/favouriteIngredients/:ingredientId", async (req, res) => {
    const { user_id, is_favourite } = req.body;
    const { ingredientId } = req.params;

    // TODO check if all inputs are defined and valid
    // TODO check if ingredient exists

    try {
        // TODO if there is no entry for an ingredient, create one

        const result = await db.query(
            "UPDATE user_ingredient_score SET is_favourite=$1 WHERE user_id=$2 AND ingredient_id=$3",
            [is_favourite, user_id, ingredientId]
        );
        const change = is_favourite ? "favourited" : "unfavourited";
        res.json({ message: `Ingredient successfully ${change}.` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// DELETE

// Delete a recipe from user's followed recipes
app.delete("/followedRecipes/:recipeId", async (req, res) => {
    const { user_id } = req.body;
    const { recipeId } = req.params;

    // TODO check if all inputs are defined and valid

    try {
        const result = await db.query(
            "DELETE FROM followed_recipe WHERE user_id=$1 AND recipe_id=$2",
            [user_id, recipeId]
        );
        res.json({ message: "Recipe successfully unfollowed." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

/////////////////
// recipe APIs //
/////////////////

// GET

// Get all recipes
app.get("/recipes", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT recipe_id, recipe_name, creator_id, is_public 
             FROM recipe`
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get specific recipe by id
app.get("/recipes/:recipeId", async (req, res) => {
    const { recipeId } = req.params;

    try {
        const result = await db.query(
            `SELECT recipe_id, recipe_name, creator_id, is_public
             FROM recipe WHERE recipe_id=$1`,
            [recipeId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({message: "Recipe not found."}); // not found
        }
        else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all ingredients of a specified recipe
app.get("/recipes/:recipeId/recipeIngredients", async (req, res) => {
    const { recipeId } = req.params;

    try {
        const result = await db.query(
            `SELECT ingredient_id, ingredient_name
             FROM recipe_ingredient INNER JOIN ingredient
                USING (ingredient_id)
             WHERE recipe_id=$1`,
            [recipeId]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// POST

// Create a new recipe
app.post("/recipes", async (req, res) => {
    const { recipe_name, creator_id } = req.body;

    // TODO check if all inputs are defined and valid

    try {
        const result = await db.query(
            `INSERT INTO recipe (recipe_name, creator_id, is_public)
             VALUES($1, $2, $3)
             RETURNING recipe_id, recipe_name, creator_id, is_public`,
            [recipe_name, creator_id, false]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Add ingredient to recipe
app.post("/recipes/:recipeId/recipeIngredients", async (req, res) => {
    const { ingredient_id } = req.body;
    const { recipeId } = req.params;

    // TODO check if all inputs are defined and valid

    // check if recipe is public (cannot add ingredients to public recipes)
    try {
        const result = await db.query(
            "SELECT * FROM recipe WHERE recipe_id=$1",
            [recipeId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Recipe not found." }); // not found
            return;
        }

        if (result.rows[0].is_public) {
            res.status(403).json({ message: "Cannot add ingredients to public recipes." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // Add ingredient to recipe
    try {
        const result = await db.query(
            "INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)",
            [recipeId, ingredient_id]
        );
        res.json({ message: "Ingredient successfully added to the recipe." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// PUT

// Make recipe public or change its name (reject all other changes)
app.put("/recipes/:recipeId", async (req, res) => {
    const { recipe_name, creator_id, is_public } = req.body;
    const { recipeId } = req.params;

    // TODO check if all inputs are defined and valid
    if (recipe_name === undefined || creator_id === undefined || is_public === undefined) {
        res.status(400).json({message: "Must provide recipe_name, creator_id and is_public"}); // bad request
        return;
    }

    // check if recipe is private (can't alter public recipe)
    // check if recipe creator_is is not being changed
    try {
        const result = await db.query(
            "SELECT * FROM recipe WHERE recipe_id=$1",
            [recipeId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Recipe not found." }); // not found
            return;
        }

        if (result.rows[0].is_public) {
            res.status(403).json({ message: "Cannot alter public recipes." }); // forbbiden
            return;
        }

        // if creator id is being changed
        if (result.rows[0].creator_id !== creator_id) {
            res.status(403).json({ message: "Cannot change creator ID." }); // forbbiden
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            `UPDATE recipe 
             SET recipe_name=$1, is_public=$2 
             WHERE recipe_id=$3 
             RETURNING recipe_id, recipe_name, creator_id, is_public`,
            [recipe_name, is_public, recipeId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// DELETE

// Delete recipe
app.delete("/recipes/:recipeId", async (req, res) => {
    const { recipeId } = req.params;

    // check if recipe is public (cannot delete public recipes)
    try {
        const result = await db.query(
            "SELECT * FROM recipe WHERE recipe_id=$1",
            [recipeId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Recipe not found." }); // not found
            return;
        }

        if (result.rows[0].is_public) {
            res.status(403).json({ message: "Cannot delete public recipes" }); // forbbiden
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "DELETE FROM recipe WHERE recipe_id=$1",
            [recipeId]
        );
        res.json({ message: "Recipe successfully deleted." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Delete ingredient from recipe
app.delete("/recipeIngredients/:ingredientId", async (req, res) => {
    const { recipe_id } = req.body;
    const { ingredientId } = req.params;

    // check if recipe is public (cannot delete ingredients from public recipes)
    try {
        const result = await db.query(
            "SELECT * FROM recipe WHERE recipe_id=$1",
            [recipe_id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Recipe not found." }); // not found
            return;
        }

        if (result.rows[0].is_public) {
            res.status(403).json({ message: "Cannot delete public recipes" }); // forbbiden
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "DELETE FROM recipe_ingredient WHERE recipe_id=$1 AND ingredient_id=$2",
            [recipe_id, ingredientId]
        );
        res.json({ message: "Ingredient successfully removed from a recipe." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

/////////////////////
// ingredient APIs //
/////////////////////

// GET

// Get all ingredients
app.get("/ingredients", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT ingredient_id, ingredient_name 
             FROM ingredient`
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get specific ingredient by id
app.get("/ingredients/:ingredientId", async (req, res) => {
    const { ingredientId } = req.params;

    try {
        const result = await db.query(
            `SELECT ingredient_id, ingredient_name
             FROM ingredient
             WHERE ingredient_id=$1`,
            [ingredientId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Ingredient not found." }); // not found
        }
        else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// POST

// Create a new ingredient
app.post("/ingredients", async (req, res) => {
    const { ingredient_name } = req.body;

    // TODO check if all inputs are defined and valid
    // TODO if ingredient passes profanity check aprove it for public
    const isApproved = false;

    try {
        const result = await db.query(
            `INSERT INTO ingredient (ingredient_name, is_approved_for_public)
             VALUES ($1, $2)
             RETURNING ingredient_id, ingredient_name`,
            [ingredient_name, isApproved]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// DELETE

// Delete an ingredient
app.delete("/ingredients/:ingredientId", async (req, res) => {
    const { ingredientId } = req.params;

    // TODO can only be deleted by an admin
    // TODO check if ingredient is not used by any recipe

    // check if ingredient exists
    try {
        const result = await db.query(
            "SELECT * FROM ingredient WHERE ingredient_id=$1",
            [ingredientId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Ingredient not found." }); // not found
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "DELETE FROM ingredient WHERE ingredient_id=$1",
            [ingredientId]
        );
        res.status(200).json({ message: "Ingredient successfullt deleted." }); // no content
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

//////////////////
// Server stuff //
//////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started and listening on port ${PORT}`);
});