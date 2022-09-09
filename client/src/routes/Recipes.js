import { useState, useEffect } from "react";

import Container from "react-bootstrap/esm/Container";
import RecipeBreadcrumb from "../components/RecipeBreadcrumb";
import RecipeDropdown from "../components/RecipeDropdown";

function Recipes(props) {
    // render Dropdown when window.innerWidth <= 464
    const [isDropdown, setIsDropdown] = useState(window.innerWidth <= 464);

    useEffect(() => {
        const handleWindowResize = () => setIsDropdown(window.innerWidth <= 464);

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return (
        <Container className="recipeNavigation d-flex justify-content-center">
            {isDropdown ? <RecipeDropdown /> : <RecipeBreadcrumb />}
        </Container>
    );
}

export default Recipes;
