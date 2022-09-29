import axios from "axios";

const axiosInstance = axios.create();

const apiCalls = {
    test: async () => {
        try {
            const testResult = await axiosInstance.get("/api/v1/test");
            console.log("returning", testResult.data);

            return testResult
        } catch (error) {
            console.log(error);
            return null
        }
    },

    createUser: async (username, email, password) => {
        try {
            const newUser = await axiosInstance.post("users", {
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
