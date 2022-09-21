import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FooterComp from "./components/FooterComp";
import NavbarComp from "./components/NavbarComp";

import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import FollowedRecipes from "./routes/recipes/FollowedRecipes";
import CreateNewRecipe from "./routes/recipes/CreateNewRicpe"
import CreatedRecipes from "./routes/recipes/CreatedRecipes"

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
                <CreateNewRecipe />
            </div>
            <FooterComp />
        </>
    );
}

export default App;
