import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";

import apiCalls from "../../api/apiCalls";

function Recipe(props) {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const getRecipeIngredients = async () => {
            const { success, response } = await apiCalls.recipeIngredients(props.recipeID);
            if (success) {
                setIngredients(response.data);
            } else {
                console.log(response);
            }
        };

        getRecipeIngredients();
    }, [props.recipeID]);

    return (
        <Container className="recipeBox" fluid>
            <h1 className="recipeName">{props.name}</h1>
            <hr className="recipeDivider" />
            <Container className="recipeIngredients">
                <ul>
                    {ingredients.slice(0, 2).map((ingredient) => (
                        <li key={ingredient.ingredient_id}>{ingredient.ingredient_name}</li>
                    ))}
                </ul>
            </Container>
            <hr className="recipeDivider" />
            <Container className="recipeDescription">
                {props.description.slice(0, 15) + "..."}
            </Container>
            <Container className="d-flex justify-content-center">
                <NavLink to={"../recipeInfo/1"}>
                    <Button
                        variant="outline-dark"
                        type="button"
                        className="recipeExpandButton"
                        size="lg"
                    >
                        Full Recipe
                    </Button>
                </NavLink>
            </Container>
        </Container>
    );
}

export default Recipe;
