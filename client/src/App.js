import { useContext, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { UserContext } from "./contexts/userContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FooterComp from "./components/FooterComp";
import NavbarComp from "./components/NavbarComp";

import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import FollowedRecipes from "./routes/recipes/FollowedRecipes";
import CreatedRecipes from "./routes/recipes/CreatedRecipes";
import CreateNewRecipe from "./routes/recipes/CreateNewRicpe";
import MealPlan from "./routes/MealPlan";
import RecipeSectionSelection from "./components/recipe/RecipeSectionSelection";
import RecipeDetails from "./routes/recipes/RecipeDetails";

import apiCalls from "./api/apiCalls";

function App() {
    const userContextRef = useRef(useContext(UserContext));

    useEffect(() => {
        const getLoginStatus = async () => {
            const { success, response } = await apiCalls.loginStatus();

            if (success) {
                // if user is logged in, set their details in user context
                if (response.data.loggedIn) {
                    const { setIsLoggedIn, setAuthUsername, setAuthEmail, setAuthUserID } =
                        userContextRef.current;

                    const { email, user_id, username } = response.data.user;

                    setIsLoggedIn(true);
                    setAuthUsername(username);
                    setAuthEmail(email);
                    setAuthUserID(user_id);
                }
            } else {
                console.log(response);
            }
        };

        getLoginStatus();
    }, []);

    return (
        <BrowserRouter>
            <div id="siteWrapper">
                <NavbarComp />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="recipes" element={<RecipeSectionSelection />}>
                        <Route path="followed" element={<FollowedRecipes />} />
                        <Route path="created" element={<CreatedRecipes />} />
                        <Route path="createNew" element={<CreateNewRecipe />} />
                        <Route path="recipeInfo/:id" element={<RecipeDetails />} />
                    </Route>
                    <Route path="mealPlan" element={<MealPlan />} />
                </Routes>
            </div>
            <FooterComp />
        </BrowserRouter>
    );
}

export default App;
