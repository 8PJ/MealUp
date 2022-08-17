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
            - `users` (will add more)
                | user_id | username | password |
                |---------|----------|----------|
                | 1       | user1    | s0m$H@sh |

            - `recipes`
                | recipe_id | recipe_name | creator_id (references user_id) | is_public |
                |-----------|-------------|---------------------------------|-----------|
                |1          |recipe1      |1                                |TRUE       |

            - `ingredients`
                | ingredient_id | ingredient_name |
                |---------------|-----------------|
                | 1             | ingredient1     |

            - `recipe_ingredients`
                | recipe_id | ingredient_id |
                |-----------|---------------|
                | 1         | 1             |

            - `followed_recipes`
                | user_id | recipe_id |
                |---------|-----------|
                | 1       | 1         |

            - `user_ingredient_scores`
                | user_id | ingredient_id | score |
                |---------|---------------|-------|
                | 1       | 1             | 12    |

    - 3.2. Server
        - Connect to Database (find secure way)
        - Make RestAPI to interact with Database

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

