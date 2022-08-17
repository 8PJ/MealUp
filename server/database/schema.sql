CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    creator_id INTEGER REFERENCES users (user_id) NOT NULL,
    is_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INTEGER REFERENCES recipes (recipe_id) NOT NULL,
    ingredient_id INTEGER REFERENCES ingredients (ingredient_id) NOT NULL
);

CREATE TABLE IF NOT EXISTS followed_recipes (
    user_id INTEGER REFERENCES users (user_id) NOT NULL,
    recipe_id INTEGER REFERENCES recipes (recipe_id) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_ingredient_scores (
    user_id INTEGER REFERENCES users (user_id) NOT NULL,
    ingredient_id INTEGER REFERENCES ingredients (ingredient_id) NOT NULL,
    score INTEGER NOT NULL
);