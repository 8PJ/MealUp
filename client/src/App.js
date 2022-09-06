import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import FooterComp from "./components/FooterComp";

import NavbarComp from "./components/NavbarComp";
import Home from "./routes/Home";

function App() {
    return (
        <>
            <div id="siteWrapper">
                <NavbarComp />
                <Home />
            </div>
            <FooterComp />
        </>
    );
}

export default App;
