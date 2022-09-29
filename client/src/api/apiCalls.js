import axios from "axios";

const axiosInstance = axios.create({ baseURL: "/api/v1" });

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
            const newUser = await axiosInstance.post("/users", {
                username,
                email,
                password
            });

            return newUser;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};

export default apiCalls;
