import axios from "axios";

const axiosInstance = axios.create({ baseURL: "/api/v1" });

// if server response indicates use is not authenticated, refresh the page
const isUnauthenticated = errorResponse => {
    if (errorResponse.response.status === 401) {
        if (errorResponse.response.data.message === "You are not logged in.") {
            window.location.reload();
        }
    }
};

const apiCalls = {
    test: async () => {
        try {
            const testResult = await axiosInstance.get("/test");

            return testResult;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    // Authentication

    createUser: async (username, email, password) => {
        try {
            const response = await axiosInstance.post("/users", {
                username,
                email,
                password
            });

            return { success: true, response };
        } catch (error) {
            console.log(error);
            return { success: false, response: error };
        }
    },

    loginUser: async (username, password) => {
        try {
            const response = await axiosInstance.post("/login", {
                username,
                password
            });

            return { success: true, response };
        } catch (error) {
            console.log(error);
            return { success: false, response: error };
        }
    },

    loginStatus: async () => {
        try {
            const response = await axiosInstance.get("/loginStatus");

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    // Recipes

    recipeByID: async recipeID => {
        try {
            const response = await axiosInstance.get(`/recipes/${recipeID}`);

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    createdRecipes: async userID => {
        try {
            const response = await axiosInstance.get(`/users/${userID}/createdRecipes`);

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    followedRecipes: async userID => {
        try {
            const response = await axiosInstance.get(`/users/${userID}/followedRecipes`);

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    recipeIngredients: async recipeID => {
        try {
            const response = await axiosInstance.get(`/recipes/${recipeID}/recipeIngredients`);

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    createRecipe: async (recipeName, creatorID, recipeInstructions) => {
        try {
            const response = await axiosInstance.post("/recipes", {
                recipe_name: recipeName,
                creator_id: creatorID,
                recipe_instructions: recipeInstructions
            });

            // follow a newly created recipe
            apiCalls.followRecipe(creatorID, response.data.recipe_id, true);

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    followRecipe: async (userID, recipeID, isUsedForMealPlan) => {
        try {
            const response = await axiosInstance.post(`users/${userID}/followedRecipes`, {
                recipe_id: recipeID,
                is_used_for_meal_plan: isUsedForMealPlan
            });

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    addIngredientToRecipe: async (ingredientID, amount, measurement, recipeID) => {
        try {
            const response = await axiosInstance.post(`/recipes/${recipeID}/recipeIngredients`, {
                ingredient_id: ingredientID,
                amount,
                measurement
            });

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    // Ingredients

    ingredientByName: async ingredientName => {
        try {
            const response = await axiosInstance.get(`/ingredients/find?name=${ingredientName}`);

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    },

    createIngredient: async ingredientName => {
        try {
            const response = await axiosInstance.post("/ingredients", {
                ingredient_name: ingredientName
            });

            return { success: true, response };
        } catch (error) {
            console.log(error);

            isUnauthenticated(error);

            return { success: false, response: error };
        }
    }
};

export default apiCalls;
