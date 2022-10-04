CREATE TABLE IF NOT EXISTS app_user (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    time_created TIMESTAMPTZ NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS recipe (
    recipe_id BIGSERIAL PRIMARY KEY,
    creator_id BIGINT REFERENCES app_user (user_id) NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_instructions VARCHAR(2000) NOT NULL,
    is_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredient (
    ingredient_id BIGSERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) UNIQUE NOT NULL,
    is_approved_for_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
    recipe_id BIGINT REFERENCES recipe (recipe_id) ON DELETE CASCADE NOT NULL,
    ingredient_id BIGINT REFERENCES ingredient (ingredient_id) NOT NULL,
    amount REAL NOT NULL,
    measurement VARCHAR(30) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS followed_recipe (
    user_id BIGINT REFERENCES app_user (user_id) NOT NULL,
    recipe_id BIGINT REFERENCES recipe (recipe_id) ON DELETE CASCADE NOT NULL,
    is_used_for_meal_plan BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS user_ingredient_score (
    user_id BIGINT REFERENCES app_user (user_id) NOT NULL,
    ingredient_id BIGINT REFERENCES ingredient (ingredient_id) NOT NULL,
    is_favourite BOOLEAN NOT NULL,
    score BIGINT NOT NULL CHECK(score >= 0) DEFAULT 10,
    PRIMARY KEY (user_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS meal_plan (
    user_id BIGINT REFERENCES app_user (user_id) NOT NULL,
    recipe_id BIGINT REFERENCES recipe (recipe_id) ON DELETE CASCADE NOT NULL,
    time_created TIMESTAMPTZ NOT NULL
);