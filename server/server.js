require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");

const passport = require("./authSetup/passportAuth");
const { isDefined, existsInDB } = require("./functions/validation");
const { checkAuthenticated, checkAdmin } = require("./functions/auth");
const { handleReqestSyntaxError } = require("./functions/middleware");

const app = express();

require("./authSetup/sessionAuth")(app);

// middleware
app.use(express.json());

// handle JSON.parse errors
app.use(handleReqestSyntaxError);

// root route for testing (will later serve react app)
app.get("/api/v1/test", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM app_user WHERE user_id=$1", [1]);
        // console.log(result.rows);
        res.json({ message: "it's working" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

////////////////////
// non API routes //
////////////////////

// Check if user is logged in
app.get("/api/v1/loginStatus", (req, res) => {
    if (req.isAuthenticated()) {
        const { email, userID: user_id, username } = req.user;
        res.json({ loggedIn: true, user: { email, user_id, username } });
    } else {
        res.json({ loggedIn: false });
    }
});

// Log in user
app.post("/api/v1/login", async (req, res, next) => {
    if (req.isAuthenticated()) {
        const { email, userID: user_id, username } = req.user;
        res.json({ message: "You are already logged in.", user: { email, user_id, username } });
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
        req.logIn(user, error2 => {
            if (error2) {
                res.status(500).json({ message: "Failed to log in." });
                return;
            }
            const { email, user_id, username } = user;
            res.json({ message: "Successfylly logged in", user: { email, user_id, username } });
        });
    })(req, res, next);
});

// Log in user
app.post("/api/v1/logout", async (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.json({ message: "You are not logged in." });
        return;
    }

    req.logOut(error => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to log out." });
            return;
        }
        res.json({ message: "You have successfylly logged out" });
    });
});

///////////////
// user APIs //
///////////////

// TODO add all user API endpoints (create meal plan, etc.)

// GET

// Get all recipes created by a user
app.get("/api/v1/users/:userID/createdRecipes", checkAuthenticated, async (req, res) => {
    const { userID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== userID.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if userID is defined and of the right type
    if (!isDefined(userID) || isNaN(userID)) {
        res.status(400).json({ message: "Must provide a valid userID" });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [userID]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            `SELECT recipe_id, creator_id, recipe_name, recipe_instructions, is_public
             FROM recipe WHERE creator_id=$1`,
            [userID]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all recipes followed by a user
app.get("/api/v1/users/:userID/followedRecipes", checkAuthenticated, async (req, res) => {
    const { userID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== userID.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if userID is defined and of the right type
    if (!isDefined(userID) || isNaN(userID)) {
        res.status(400).json({ message: "Must provide a valid userID" });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [userID]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            `SELECT recipe_id, creator_id, recipe_name, recipe_instructions, is_used_for_meal_plan, is_public
             FROM followed_recipe INNER JOIN recipe 
                USING(recipe_id)
             WHERE user_id=$1`,
            [userID]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all recipes that are used for a meal plan by a user
app.get("/api/v1/users/:userID/mealPlanRecipes", checkAuthenticated, async (req, res) => {
    const { userID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== userID.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if all parameters are defined and of the right type
    if (!isDefined(userID) || isNaN(userID)) {
        res.status(400).json({ message: "Must provide a valid userID" });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [userID]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            `SELECT recipe_id, creator_id, recipe_name, recipe_instructions, is_used_for_meal_plan, is_public
             FROM followed_recipe INNER JOIN recipe 
                USING(recipe_id)
             WHERE user_id=$1 AND is_used_for_meal_plan=$2`,
            [userID, true]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all favourited ingredients by a user
app.get("/api/v1/users/:userID/favouriteIngredients", checkAuthenticated, async (req, res) => {
    const { userID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== userID.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if all parameters are defined and of the right type
    if (!isDefined(userID) || isNaN(userID)) {
        res.status(400).json({ message: "Must provide a valid userID" });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [userID]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            `SELECT ingredient_id, ingredient_name
             FROM user_ingredient_score INNER JOIN ingredient 
                USING(ingredient_id)
             WHERE user_id=$1 AND is_favourite=$2`,
            [userID, true]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// POST

// Create a new user
app.post("/api/v1/users", async (req, res) => {
    const { username, email, password } = req.body;

    // check if all parameters are defined
    if (!isDefined(username, email, password)) {
        res.status(400).json({ message: "Must provide a username, email and password" });
        return;
    }

    // ----- username checks -----

    // check if username is only made up of letters and numbers
    if (!/^[A-Za-z0-9]*$/.test(username)) {
        res.status(400).json({ message: "Username must only contain letters and numbers." });
        return;
    }

    // check if username has at least 4 and at most 35 characters
    if (username.length < 4 || username.length > 35) {
        res.status(400).json({
            message: "Username must be at least 4 and at most 35 characters long."
        });
        return;
    }

    // ----- email checks -----

    // TODO implement email verification with a link

    // check if the email is of mostly valid form
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        res.status(400).json({ message: "Email must be valid." });
        return;
    }

    // ----- password checks -----

    // check if password has at least 8 and at most 60 characters
    if (password.length < 8 || password.length > 60) {
        res.status(400).json({
            message: "Password must be at least 8 and at most 60 characters long."
        });
        return;
    }

    // check if password only contains letters, numbers and the following symbols: ! "#$%&'()*+,-./:;<=>?@[\]^_{|}~
    if (!/^[ -~]*$/.test(password)) {
        res.status(400).json({
            message:
                "Password must only contain letters, numbers and the following symbols: ! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"
        });
        return;
    }

    // ----- check username and email availability -----

    // check if username is available
    try {
        const queryString = "SELECT * FROM app_user WHERE username=$1";

        if (await existsInDB(queryString, [username])) {
            res.status(400).json({ message: "Username already taken." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if email is available
    try {
        const queryString = "SELECT * FROM app_user WHERE email=$1";

        if (await existsInDB(queryString, [email])) {
            res.status(400).json({ message: "Email already used." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // ----- create user -----

    // hash password
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);

    // create user
    try {
        const result = await db.query(
            `INSERT INTO app_user (username, email, password, time_created, is_admin)
             VALUES($1, $2, $3, NOW(), $4)
             RETURNING user_id, username, email, is_admin`,
            [username, email, hash, false]
        );

        // log user in after registering
        req.logIn(result.rows[0], error2 => {
            if (error2) {
                res.status(500).json({ message: "Failed to log in after registering." });
                return;
            }
            const { user_id, username, email } = result.rows[0];
            res.json({ user_id, username, email });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Add a recipe to user's followed recipes
app.post("/api/v1/users/:userID/followedRecipes", checkAuthenticated, async (req, res) => {
    const { recipe_id, is_used_for_meal_plan } = req.body;
    const { userID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== userID.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if all parameters are defined and of correct type
    if (
        !isDefined(userID, recipe_id, is_used_for_meal_plan) ||
        isNaN(userID) ||
        isNaN(recipe_id) ||
        typeof is_used_for_meal_plan !== "boolean"
    ) {
        res.status(400).json({
            message: "Must provide a valid userID, recipe_id and is_used_for_meal_plan."
        });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [userID]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if recipe exists
    try {
        const queryString = "SELECT * FROM recipe WHERE recipe_id=$1";

        if (!(await existsInDB(queryString, [recipe_id]))) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if recipe is not already followed
    try {
        const queryString = "SELECT * FROM followed_recipe WHERE user_id=$1 AND recipe_id=$2";

        if (await existsInDB(queryString, [userID, recipe_id])) {
            res.status(400).json({ message: "Recipe already followed." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "INSERT INTO followed_recipe (user_id, recipe_id, is_used_for_meal_plan) VALUES ($1, $2, $3)",
            [userID, recipe_id, is_used_for_meal_plan]
        );
        res.json({ message: "Recipe successfully followed." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// PATCH

// Add/Remove a recipe from user's meal plan recipes
app.patch("/api/v1/mealPlanRecipes/:recipeID", checkAuthenticated, async (req, res) => {
    const { user_id, is_used_for_meal_plan } = req.body;
    const { recipeID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== user_id.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if all parameters are defined and of correct type
    if (
        !isDefined(user_id, recipeID, is_used_for_meal_plan) ||
        isNaN(user_id) ||
        isNaN(recipeID) ||
        typeof is_used_for_meal_plan !== "boolean"
    ) {
        res.status(400).json({
            message: "Must provide a valid user_id, recipeID and is_used_for_meal_plan."
        });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [user_id]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if recipe exists
    try {
        const queryString = "SELECT * FROM recipe WHERE recipe_id=$1";

        if (!(await existsInDB(queryString, [recipeID]))) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if user follows the recipe
    try {
        const result = await db.query(
            "SELECT * FROM followed_recipe WHERE user_id=$1 AND recipe_id=$2",
            [user_id, recipeID]
        );

        if (result.rowCount === 0) {
            res.status(404).json({
                message:
                    "Cannot use a recipe for a meal plan that is not in the user's followed recipes"
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "UPDATE followed_recipe SET is_used_for_meal_plan=$1 WHERE user_id=$2 AND recipe_id=$3",
            [is_used_for_meal_plan, user_id, recipeID]
        );
        const change = is_used_for_meal_plan ? "added to" : "removed to not";
        res.json({ message: `Recipe ${change} be used for a meal plan.` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Favourite/unfavourite an ingredient for a user
app.patch("/api/v1/favouriteIngredients/:ingredientID", checkAuthenticated, async (req, res) => {
    const { user_id, is_favourite } = req.body;
    const { ingredientID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== user_id.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if all parameters are defined and of correct type
    if (
        !isDefined(user_id, ingredientID, is_favourite) ||
        isNaN(user_id) ||
        isNaN(ingredientID) ||
        typeof is_favourite !== "boolean"
    ) {
        res.status(400).json({
            message: "Must provide a valid user_id, ingredientID and is_favourite."
        });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [user_id]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if ingredient exists
    try {
        const queryString = "SELECT * FROM ingredient WHERE ingredient_id=$1";

        if (!(await existsInDB(queryString, [ingredientID]))) {
            res.status(404).json({ message: "Ingredient not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // if there is no entry for an ingredient for this user, create one
    try {
        const result = await db.query(
            "SELECT * FROM user_ingredient_score WHERE user_id=$1 AND ingredient_id=$2",
            [user_id, ingredientID]
        );

        if (result.rowCount === 0) {
            const resultInsert = await db.query(
                `INSERT INTO user_ingredient_score (user_id, ingredient_id, is_favourite, score)
                 VALUES($1, $2, $3, DEFAULT)`,
                [user_id, ingredientID, is_favourite]
            );
            const change = is_favourite ? "favourited" : "unfavourited";
            res.json({ message: `Ingredient successfully ${change}.` });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "UPDATE user_ingredient_score SET is_favourite=$1 WHERE user_id=$2 AND ingredient_id=$3",
            [is_favourite, user_id, ingredientID]
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
app.delete("/api/v1/followedRecipes/:recipeID", checkAuthenticated, async (req, res) => {
    const { user_id } = req.body;
    const { recipeID } = req.params;

    // check if logged in user is authorised (has correct ID or is an admin)
    if (req.user.userID !== user_id.toString() && !req.user.isAdmin) {
        res.status(403).json({ message: "Unauthorised" });
        return;
    }

    // check if all parameters are defined and of correct type
    if (!isDefined(user_id, recipeID) || isNaN(user_id) || isNaN(recipeID)) {
        res.status(400).json({ message: "Must provide a valid user_id and recipeID." });
        return;
    }

    // check if user exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [user_id]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if recipe exists
    try {
        const queryString = "SELECT * FROM recipe WHERE recipe_id=$1";

        if (!(await existsInDB(queryString, [recipeID]))) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if user follows the recipe
    try {
        const queryString = "SELECT * FROM followed_recipe WHERE user_id=$1 AND recipe_id=$2";

        if (!(await existsInDB(queryString, [user_id, recipeID]))) {
            res.status(404).json({ message: "User doesn't follow this recipe." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "DELETE FROM followed_recipe WHERE user_id=$1 AND recipe_id=$2",
            [user_id, recipeID]
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
app.get("/api/v1/recipes", checkAuthenticated, async (req, res) => {
    // return all recipes for an admin or public (and self created) for a regular user
    try {
        if (req.user.isAdmin) {
            const result = await db.query(
                `SELECT recipe_id, creator_id, recipe_name, recipe_instructions, is_public 
                 FROM recipe`
            );
            res.json(result.rows);
        } else {
            const result = await db.query(
                `SELECT recipe_id, creator_id, recipe_name, recipe_instructions, is_public 
                 FROM recipe
                 WHERE creator_id=$1 OR is_public=$2`,
                [req.user.userID, true]
            );
            res.json(result.rows);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get specific recipe by id
app.get("/api/v1/recipes/:recipeID", checkAuthenticated, async (req, res) => {
    const { recipeID } = req.params;

    // check if all parameters are defined and of correct type
    if (!isDefined(recipeID) || isNaN(recipeID)) {
        res.status(400).json({ message: "Must provide a valid recipeID." });
        return;
    }

    try {
        const result = await db.query(
            `SELECT recipe_id, creator_id, recipe_name, recipe_instructions, is_public
             FROM recipe WHERE recipe_id=$1`,
            [recipeID]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }

        if (!result.rows[0].is_public) {
            // check if logged in user is authorised (has correct ID or is an admin)
            if (req.user.userID !== result.rows[0].creator_id.toString() && !req.user.isAdmin) {
                res.status(403).json({ message: "Unauthorised" });
                return;
            }
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all ingredients of a specified recipe
app.get("/api/v1/recipes/:recipeID/recipeIngredients", checkAuthenticated, async (req, res) => {
    const { recipeID } = req.params;

    // check if all parameters are defined and of correct type
    if (!isDefined(recipeID) || isNaN(recipeID)) {
        res.status(400).json({ message: "Must provide a valid recipeID." });
        return;
    }

    // check if recipe exists and user is authorised to access it
    try {
        const result = await db.query("SELECT * FROM recipe WHERE recipe_id=$1", [recipeID]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }

        if (!result.rows[0].is_public) {
            // check if logged in user is authorised (has correct ID or is an admin)
            if (req.user.userID !== result.rows[0].creator_id.toString() && !req.user.isAdmin) {
                res.status(403).json({ message: "Unauthorised" });
                return;
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            `SELECT ingredient_id, ingredient_name, amount, measurement
             FROM recipe_ingredient INNER JOIN ingredient
                USING (ingredient_id)
             WHERE recipe_id=$1`,
            [recipeID]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// POST

// Create a new recipe
app.post("/api/v1/recipes", checkAuthenticated, async (req, res) => {
    const { recipe_name, creator_id, recipe_instructions } = req.body;

    // check if all parameters are defined and of correct type
    if (!isDefined(recipe_name, creator_id, recipe_instructions) || isNaN(creator_id)) {
        res.status(400).json({
            message: "Must provide a valid recipe_name, creator_id and recipe_instructions."
        });
        return;
    }

    // ----- recipe_name checks -----

    // check if recipe_name is at least 3 characters and at most 100 characters long
    if (recipe_name.length < 3 || recipe_name.length > 100) {
        res.status(400).json({
            message: "Recipe name must be at least 3 and at most 100 characters long."
        });
        return;
    }

    // check if recipe_name only contains letters, numbers and the following symbols: ! "#$%&'()*+,-./:;<=>?@[\]^_{|}~
    if (!/^[ -~]*$/.test(recipe_name)) {
        res.status(400).json({
            message:
                "Recipe name must only contain letters, numbers and the following symbols: ! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"
        });
        return;
    }

    // ----- recipe_instructions checks -----

    // check if recipe_instructions is at most 2000 characters long
    if (recipe_instructions.length > 2000) {
        res.status(400).json({
            message: "Recipe description must be at most 2000 characters long."
        });
        return;
    }

    // check if recipe_instructions only contains letters, numbers and the following symbols: ! "#$%&'()*+,-./:;<=>?@[\]^_{|}~
    if (!/^[ -~]*$/.test(recipe_instructions)) {
        res.status(400).json({
            message:
                "Recipe instructions must only contain letters, numbers and the following symbols: ! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"
        });
        return;
    }

    // check if user (creator) exists
    try {
        const queryString = "SELECT * FROM app_user WHERE user_id=$1";

        if (!(await existsInDB(queryString, [creator_id]))) {
            res.status(404).json({ message: "User not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            `INSERT INTO recipe (creator_id, recipe_name, recipe_instructions, is_public)
             VALUES($1, $2, $3, $4)
             RETURNING recipe_id, creator_id, recipe_name, recipe_instructions, is_public`,
            [creator_id, recipe_name, recipe_instructions, false]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Add ingredient to recipe
app.post("/api/v1/recipes/:recipeID/recipeIngredients", checkAuthenticated, async (req, res) => {
    const { ingredient_id, amount, measurement } = req.body;
    const { recipeID } = req.params;

    // check if all parameters are defined and of correct type
    if (
        !isDefined(ingredient_id, recipeID, amount, measurement) ||
        isNaN(ingredient_id) ||
        isNaN(recipeID) ||
        isNaN(amount)
    ) {
        res.status(400).json({
            message: "Must provide a valid ingredient_id, recipeID, amount and measurement."
        });
        return;
    }

    if (!/^[A-Za-z]*$/.test(measurement)) {
        res.status(400).json({ message: "Measurement must only contain letters." });
        return;
    }

    // check if ingredient exists
    try {
        const queryString = "SELECT * FROM ingredient WHERE ingredient_id=$1";

        if (!(await existsInDB(queryString, [ingredient_id]))) {
            res.status(404).json({ message: "Ingredient not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if recipe exists and is private (cannot add ingredients to public recipes)
    try {
        const result = await db.query("SELECT * FROM recipe WHERE recipe_id=$1", [recipeID]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }

        if (!result.rows[0].is_public) {
            // check if logged in user is authorised (has correct ID or is an admin)
            if (req.user.userID !== result.rows[0].creator_id.toString() && !req.user.isAdmin) {
                res.status(403).json({ message: "Unauthorised" });
                return;
            }
        } else {
            res.status(403).json({ message: "Cannot add ingredients to public recipes." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if ingredient is not already in the recipe
    try {
        const queryString =
            "SELECT * FROM recipe_ingredient WHERE recipe_id=$1 AND ingredient_id=$2";

        if (await existsInDB(queryString, [recipeID, ingredient_id])) {
            res.status(400).json({ message: "Ingredient is already in the recipe." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query(
            "INSERT INTO recipe_ingredient (recipe_id, ingredient_id, amount, measurement) VALUES ($1, $2, $3, $4)",
            [recipeID, ingredient_id, amount, measurement]
        );
        res.json({ message: "Ingredient successfully added to the recipe." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// PUT

// Make recipe public, change its name or instructions (reject all other changes)
app.put("/api/v1/recipes/:recipeID", checkAuthenticated, async (req, res) => {
    const { creator_id, recipe_name, recipe_instructions, is_public } = req.body;
    const { recipeID } = req.params;

    // check if all inputs are defined and valid
    if (
        !isDefined(creator_id, recipe_name, recipe_instructions, is_public) ||
        isNaN(creator_id) ||
        isNaN(recipeID) ||
        typeof is_public !== "boolean"
    ) {
        res.status(400).json({
            message:
                "Must provide a valid recipeID, recipe_name, creator_id, is_public and recipe_instructions"
        });
        return;
    }

    // ----- recipe_name checks -----

    // check if recipe_name is at least 3 characters and at most 100 characters long
    if (recipe_name.length < 3 || recipe_name.length > 100) {
        res.status(400).json({
            message: "Recipe name must be at least 3 and at most 100 characters long."
        });
        return;
    }

    // check if recipe_name only contains letters, numbers and the following symbols: ! "#$%&'()*+,-./:;<=>?@[\]^_{|}~
    if (!/^[ -~]*$/.test(recipe_name)) {
        res.status(400).json({
            message:
                "Recipe name must only contain letters, numbers and the following symbols: ! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"
        });
        return;
    }

    // ----- recipe_instructions checks -----

    // check if recipe_instructions is at most 2000 characters long
    if (recipe_instructions.length > 2000) {
        res.status(400).json({
            message: "Recipe description must be at most 2000 characters long."
        });
        return;
    }

    // check if recipe_instructions only contains letters, numbers and the following symbols: ! "#$%&'()*+,-./:;<=>?@[\]^_{|}~
    if (!/^[ -~]*$/.test(recipe_instructions)) {
        res.status(400).json({
            message:
                "Recipe instructions must only contain letters, numbers and the following symbols: ! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"
        });
        return;
    }

    // check if recipe exists
    // check if recipe is private (can't alter public recipe)
    // check if recipe creator_id is not being changed
    try {
        const result = await db.query("SELECT * FROM recipe WHERE recipe_id=$1", [recipeID]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }

        // check if logged in user is authorised (has correct ID or is an admin)
        if (req.user.userID !== result.rows[0].creator_id.toString() && !req.user.isAdmin) {
            res.status(403).json({ message: "Unauthorised" });
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
             SET recipe_name=$1, recipe_instructions=$2, is_public=$3 
             WHERE recipe_id=$4 
             RETURNING recipe_id, creator_id, recipe_name, recipe_instructions, is_public`,
            [recipe_name, recipe_instructions, is_public, recipeID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// DELETE

// Delete recipe
app.delete("/api/v1/recipes/:recipeID", checkAuthenticated, async (req, res) => {
    const { recipeID } = req.params;

    // check if all parameters are defined and of correct type
    if (!isDefined(recipeID) || isNaN(recipeID)) {
        res.status(400).json({ message: "Must provide a valid recipeID." });
        return;
    }

    // check if recipe exists and is not public (cannot delete public recipes)
    try {
        const result = await db.query("SELECT * FROM recipe WHERE recipe_id=$1", [recipeID]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }

        // check if logged in user is authorised (has correct ID or is an admin)
        if (req.user.userID !== result.rows[0].creator_id.toString() && !req.user.isAdmin) {
            res.status(403).json({ message: "Unauthorised" });
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
        const result = await db.query("DELETE FROM recipe WHERE recipe_id=$1", [recipeID]);
        res.json({ message: "Recipe successfully deleted." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Delete ingredient from recipe
app.delete("/api/v1/recipeIngredients/:ingredientID", checkAuthenticated, async (req, res) => {
    const { recipe_id } = req.body;
    const { ingredientID } = req.params;

    // check if all parameters are defined and of correct type
    if (!isDefined(recipe_id, ingredientID) || isNaN(recipe_id) || isNaN(ingredientID)) {
        res.status(400).json({ message: "Must provide a valid recipe_id and ingredientID." });
        return;
    }

    // check if recipe exists and is not public (cannot delete ingredients from public recipes)
    try {
        const result = await db.query("SELECT * FROM recipe WHERE recipe_id=$1", [recipe_id]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Recipe not found." });
            return;
        }

        // check if logged in user is authorised (has correct ID or is an admin)
        if (req.user.userID !== result.rows[0].creator_id.toString() && !req.user.isAdmin) {
            res.status(403).json({ message: "Unauthorised" });
            return;
        }

        if (result.rows[0].is_public) {
            res.status(403).json({ message: "Cannot alter public recipes." }); // forbbiden
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if ingredient exists
    try {
        const queryString = "SELECT * FROM ingredient WHERE ingredient_id=$1";

        if (!(await existsInDB(queryString, [ingredientID]))) {
            res.status(404).json({ message: "Ingredient not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if ingredient is in the recipe
    try {
        const queryString =
            "SELECT * FROM recipe_ingredient WHERE recipe_id=$1 AND ingredient_id=$2";

        if (!(await existsInDB(queryString, [recipe_id, ingredientID]))) {
            res.status(404).json({ message: "Ingredient is not in the recipe." });
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
            [recipe_id, ingredientID]
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
app.get("/api/v1/ingredients", checkAuthenticated, async (req, res) => {
    // return all ingredients for an admin and only approved for public to regular ones
    try {
        if (req.user.isAdmin) {
            const result = await db.query(
                `SELECT ingredient_id, ingredient_name 
                 FROM ingredient`
            );
            res.json(result.rows);
        } else {
            const result = await db.query(
                `SELECT ingredient_id, ingredient_name 
                 FROM ingredient
                 WHERE is_approved_for_public=$1`,
                [true]
            );
            res.json(result.rows);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get specific ingredient by id
app.get("/api/v1/ingredients/:ingredientID", checkAuthenticated, async (req, res) => {
    const { ingredientID } = req.params;

    if (!isDefined(ingredientID) || isNaN(ingredientID)) {
        res.status(400).json({ message: "Must provide a valid ingredientID." });
        return;
    }

    try {
        const result = await db.query(
            `SELECT ingredient_id, ingredient_name
             FROM ingredient
             WHERE ingredient_id=$1`,
            [ingredientID]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Ingredient not found." });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
});

// POST

// Create a new ingredient
app.post("/api/v1/ingredients", checkAuthenticated, async (req, res) => {
    const { ingredient_name } = req.body;

    if (!isDefined(ingredient_name)) {
        res.status(400).json({ message: "Must provide a valid ingredient_name." });
        return;
    }

    // check if ingredient_name has at least 2 and at most 35 characters
    if (ingredient_name.length < 2 || ingredient_name.length > 35) {
        res.status(400).json({
            message: "Ingredient name must be at least 2 and at most 35 characters long."
        });
        return;
    }

    // check if ingredient_name only contains letters
    if (!/^[A-Za-z0-9]*$/.test(ingredient_name)) {
        res.status(400).json({ message: "Ingredient name must only contain letters and numbers" });
        return;
    }

    // check if ingredient with the same name already exists
    try {
        const queryString = "SELECT * FROM ingredient WHERE ingredient_name=$1";

        if (await existsInDB(queryString, [ingredient_name])) {
            res.status(400).json({ message: "Ingredient already exists." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

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
app.delete("/api/v1/ingredients/:ingredientID", checkAdmin, async (req, res) => {
    const { ingredientID } = req.params;

    if (!isDefined(ingredientID) || isNaN(ingredientID)) {
        res.status(400).json({ message: "Must provide a valid ingredientID." });
        return;
    }

    // check if ingredient exists
    try {
        const queryString = "SELECT * FROM ingredient WHERE ingredient_id=$1";

        if (!(await existsInDB(queryString, [ingredientID]))) {
            res.status(404).json({ message: "Ingredient not found." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    // check if ingredient is not used bv any recipe
    try {
        const queryString = "SELECT * FROM recipe_ingredient WHERE ingredient_id=$1";

        if (await existsInDB(queryString, [ingredientID])) {
            res.status(400).json({ message: "Ingredient is used by a recipe." });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
        return;
    }

    try {
        const result = await db.query("DELETE FROM ingredient WHERE ingredient_id=$1", [
            ingredientID
        ]);
        res.status(200).json({ message: "Ingredient successfullt deleted." });
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
