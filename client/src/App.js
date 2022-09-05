import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css";

import NavbarComp from "./components/NavbarComp";
import Home from "./routes/Home";

function App() {
  return (
    <>
      <NavbarComp />
      <Home />
    </>
  );
}

export default App;
