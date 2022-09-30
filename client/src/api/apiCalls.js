import axios from "axios";

const axiosInstance = axios.create({ baseURL: "/api/v1" });

// if user is not authenticated, refreshes a page (used in api requests requiring authentication)
const isAuthenticated = async () => {
    try {
        const response = await axiosInstance.get("/loginStatus");

        if (!response.data.loggedIn) {
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
};

const apiCalls = {
    test: async () => {
        try {
            const testResult = await axiosInstance.get("/test");

            return testResult;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

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
            return { success: false, response: error };
        }
    }
};

export default apiCalls;
