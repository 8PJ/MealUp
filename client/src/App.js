import { BrowserRouter, Route, Routes } from "react-router-dom";

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

function App() {
    return (
        <BrowserRouter>
            <div id="siteWrapper">
                <NavbarComp />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="recipes" element={<RecipeSectionSelection />}>
                        <Route path="followedRecipes" element={<FollowedRecipes />} />
                        <Route path="createdRecipes" element={<CreatedRecipes />} />
                        <Route path="createNewRecipe" element={<CreateNewRecipe />} />
                    </Route>
                    <Route path="mealPlan" element={<MealPlan />} />
                </Routes>
            </div>
            <FooterComp />
        </BrowserRouter>
    );
}

export default App;
