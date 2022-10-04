import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";

import apiCalls from "../../api/apiCalls";

function Recipe(props) {
    const [recipeName, setRecipeName] = useState("");
    const [recipeInstructions, setRecipeInstructions] = useState("");
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const getInfoIfNotDefined = async () => {
            const { success, response } = await apiCalls.recipeByID(props.recipeID);
            if (success) {
                const { recipe_name, recipe_instructions } = response.data;

                setRecipeName(recipe_name);
                setRecipeInstructions(recipe_instructions);
            } else {
                console.log(response);
            }
        };
        if (!props.name || !props.description) {
            getInfoIfNotDefined();
        } else {
            setRecipeName(props.name);
            setRecipeInstructions(props.description);
        }
    }, [props.recipeID, props.name, props.description]);

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
            <h1 className="recipeName">{recipeName}</h1>
            <hr className="recipeDivider" />
            <Container className="recipeIngredients">
                <ul>
                    {ingredients.slice(0, 2).map(ingredient => (
                        <li key={ingredient.ingredient_id}>{ingredient.ingredient_name}</li>
                    ))}
                </ul>
            </Container>
            <hr className="recipeDivider" />
            <Container className="recipeDescription">
                {recipeInstructions.slice(0, 15) + "..."}
            </Container>
            <Container className="d-flex justify-content-center">
                <NavLink to={`/recipes/recipeInfo/${props.recipeID}`}>
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
