# MealUp Plan

## Steps

1. Install everything needed
    - 1.1. ~~Install Postgresql~~

2. Make a structure for the project
    - 2.1. Make Client
        - npx create-react-app MealUp   
    - 2.2. Make Server
        - server.js
        - npm init

3. Make Backend
    - 3.1. Database
        - Create Database
        - Make Schema (Add users later)
            - `Profanity filter for`:
                - username
                - recipe_name
                - ingredient_name
            - `users` (will add more)
                | user_id | username | email    | password |
                |---------|----------|----------|----------|
                | 1       | user1    | mail@com | s0m$H@sh |

            - `recipes`
                | recipe_id | recipe_name | creator_id (references user_id) | is_public |
                |-----------|-------------|---------------------------------|-----------|
                |1          |recipe1      |1                                |TRUE       |

            - `ingredients`
                | ingredient_id | ingredient_name | is_approved_for_public |
                |---------------|-----------------|------------------------|
                | 1             | ingredient1     | TRUE                   |

            - `recipe_ingredients`
                | recipe_id | ingredient_id |
                |-----------|---------------|
                | 1         | 1             |

            - `followed_recipes`
                | user_id | recipe_id | is_used_for_meal_plan |
                |---------|-----------|-----------------------|
                | 1       | 1         | TRUE                  |

            - `user_ingredient_scores`
                | user_id | ingredient_id | score |
                |---------|---------------|-------|
                | 1       | 1             | 12    |

    - 3.2. Server
        - Connect to Database (find secure way) (for later)
        - Make RestAPI to interact with Database
            - `Everything user` (for later, will add more)
                - Create a new user
                - Get created recipes
                - Get followed recipes
                - Get favourite ingredients
                - Follow recipe
                - Unfollow recipe
                - Select ingredient as favourite/no longer favourite
            - `Recipes`
                - Get all recipes
                - Get recipe by ID
                - Get recipe ingredients
                - Create a new recipe
                - Add ingredient to a recipe (only for private)
                - Make recipe public (can't make private after)
                - Change recipe name (only for private)
                - Delete a recipe (only for private)
                - Delete ingredient from recipe (only for private)
            - `Ingredients`
                - Get all ingredients
                - Get ingredient by ID
                - Create an ingredient
                - Delete an ingredient

4. Make FrontEnd
    - 4.1. Display data from backend
    - 4.2. Send data to backend

# Useful

## Commands

1. Database (Postgresql)
    - 1.1. Starting
        - sudo service postgresql status - for checking the status of your database
        - sudo service postgresql start - to start running your database
        - sudo service postgresql stop - to stop running your database
    - 1.2. Terminal
        - sudo -u postgres psql - to open postgres terminal
    - 1.3. Tables
        - ALTER SEQUENCE product_id_seq RESTART WITH 1453 - change serial number

2. Environment
    = 2.2. Kill a process at a specific port
        - sudo kill -9 $(sudo lsof -t -i:5000)

