import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/esm/Container";

import apiCalls from "../../api/apiCalls";

function FullRecipe(props) {
    const navigate = useNavigate();

    const { id: recipeID } = useParams();

    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [recipeInstructions, setRecipeInstructions] = useState("");

    useEffect(() => {
        const getRecipeInfo = async () => {
            const { success, response } = await apiCalls.recipeByID(recipeID);

            // get recipe info
            if (success) {
                const { recipe_name, recipe_instructions } = response.data;

                setRecipeName(recipe_name);
                setRecipeInstructions(recipe_instructions);
            } else {
                // if user in not authorised or recipe doesn't exist
                if (
                    response.response.data.message === "Unauthorised" ||
                    response.response.data.message === "Recipe not found."
                ) {
                    navigate("/notFound");
                }
                console.log(response);
            }
        };

        const getRecipeIngredients = async () => {
            const { success, response } = await apiCalls.recipeIngredients(recipeID);
            if (success) {
                setIngredients(response.data);
            } else {
                console.log(response);
            }
        };

        getRecipeInfo();
        getRecipeIngredients();
    }, [recipeID, navigate]);

    return (
        <Container className="d-flex justify-content-center recipeInfo">
            <Container className="recipeBoxFull" fluid>
                <h1 className="recipeNameFull">{recipeName}</h1>
                <hr className="recipeDivider" />
                <Container className="recipeIngredientsFull">
                    <ul>
                        {ingredients.map(ingredient => (
                            <li key={ingredient.ingredient_id}>{ingredient.ingredient_name}</li>
                        ))}
                    </ul>
                </Container>
                <hr className="recipeDivider" />
                <Container className="recipeDescriptionFull">{recipeInstructions}</Container>
            </Container>
        </Container>
    );
}

export default FullRecipe;
