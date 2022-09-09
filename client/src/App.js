import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FooterComp from "./components/FooterComp";
import NavbarComp from "./components/NavbarComp";

import Home from "./routes/Home";
import Login from "./routes/Login";
import Recipes from "./routes/Recipes";
import Register from "./routes/Register";

function App() {
    return (
        <>
            <div id="siteWrapper">
                <NavbarComp />
                {/* <Home />
                <Register />
                <Login /> */}
                <Recipes />
            </div>
            <FooterComp />
        </>
    );
}

export default App;
