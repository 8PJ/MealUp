import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FooterComp from "./components/FooterComp";
import NavbarComp from "./components/NavbarComp";

import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import FollowedRecipes from "./routes/recipes/FollowedRecipes";
import CreatedRecipes from "./routes/recipes/CreatedRecipes"
import CreateNewRecipe from "./routes/recipes/CreateNewRicpe"
import MealPlan from "./routes/MealPlan";


function App() {
    return (
        <>
            <div id="siteWrapper">
                <NavbarComp />
                {/* <Home /> */}
                {/* <Register /> */}
                {/* <Login /> */}
                {/* <FollowedRecipes /> */}
                {/* <CreatedRecipes /> */}
                {/* <CreateNewRecipe /> */}
                <MealPlan />
            </div>
            <FooterComp />
        </>
    );
}

export default App;
