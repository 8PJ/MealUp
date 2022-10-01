import axios from "axios";

const axiosInstance = axios.create({ baseURL: "/api/v1" });

// if server response indicates use is not authenticated, refresh the page
const isUnauthenticated = errorResponse => {
    if (errorResponse.response.status === 401) {
        if (errorResponse.response.data.message === "You are not logged in.") {
            setTimeout(() => {
                window.location.reload();
            }, 5000);
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

    createdRecipes: async (userID) => {
        try {
            const response = await axiosInstance.get(`/users/${userID}/createdRecipes`);

            return { success: true, response };
        } catch (error) {
            console.log(error);
            return { success: false, response: error };
        }
    },

    followedRecipes: async (userID) => {
        try {
            const response = await axiosInstance.get(`/users/${userID}/followedRecipes`);

            return { success: true, response };
        } catch (error) {
            console.log(error);
            return { success: false, response: error };
        }
    },

    recipeIngredients: async (recipeID) => {
        try {
            const response = await axiosInstance.get(`/recipes/${recipeID}/recipeIngredients`);

            return { success: true, response };
        } catch (error) {
            console.log(error);
            return { success: false, response: error };
        }
    }
};

export default apiCalls;
