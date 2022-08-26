CREATE TABLE IF NOT EXISTS app_user (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    time_created TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe (
    recipe_id BIGSERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    creator_id BIGINT REFERENCES app_user (user_id) NOT NULL,
    is_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredient (
    ingredient_id BIGSERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL,
    is_approved_for_public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
    recipe_id BIGINT REFERENCES recipe (recipe_id) NOT NULL,
    ingredient_id BIGINT REFERENCES ingredient (ingredient_id) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS followed_recipe (
    user_id BIGINT REFERENCES app_user (user_id) NOT NULL,
    recipe_id BIGINT REFERENCES recipe (recipe_id) NOT NULL,
    is_used_for_meal_plan BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS user_ingredient_score (
    user_id BIGINT REFERENCES app_user (user_id) NOT NULL,
    ingredient_id BIGINT REFERENCES ingredient (ingredient_id) NOT NULL,
    is_favourite BOOLEAN NOT NULL,
    score BIGINT NOT NULL,
    PRIMARY KEY (user_id, ingredient_id)
);