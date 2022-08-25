CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
    recipe_id BIGSERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    creator_id BIGINT REFERENCES users (user_id) NOT NULL,
    is_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id BIGSERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL,
    is_approved_for_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id BIGINT REFERENCES recipes (recipe_id) NOT NULL,
    ingredient_id BIGINT REFERENCES ingredients (ingredient_id) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS followed_recipes (
    user_id BIGINT REFERENCES users (user_id) NOT NULL,
    recipe_id BIGINT REFERENCES recipes (recipe_id) NOT NULL,
    is_used_for_meal_plan BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS user_ingredient_scores (
    user_id BIGINT REFERENCES users (user_id) NOT NULL,
    ingredient_id BIGINT REFERENCES ingredients (ingredient_id) NOT NULL,
    is_favourite BOOLEAN NOT NULL,
    score BIGINT NOT NULL,
    PRIMARY KEY (user_id, ingredient_id)
);