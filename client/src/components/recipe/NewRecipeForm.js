import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../contexts/userContext";

import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/InputGroup";

import apiCalls from "../../api/apiCalls";

function NewRicpeForm(props) {
    const navigate = useNavigate();

    const userContext = useContext(UserContext);

    const [errorMessage, setErrorMessage] = useState("");

    const [ingredients, setIngredients] = useState([]);

    // recipe input states
    const [recipeName, setRecipeName] = useState("");
    const [isInvalidRecipeName, setIsInvalidRecipeName] = useState();

    const [instructions, setInstructions] = useState("");
    const [isInvalidInstructions, setIsInvalidInstructions] = useState();

    // ingredient input states
    const [ingredientName, setIngredientName] = useState("");
    const [isInvalidIngredientName, setIsInvalidIngredientName] = useState();

    const [measurement, setMeasurement] = useState("kg");
    const [isInvalidMeasurement, setIsInvalidMeasurement] = useState();

    const [amount, setAmount] = useState(1);
    const [isInvalidAmount, setIsInvalidAmount] = useState();

    const [invalidIngredientError, setInvalidIngredientError] = useState("");

    const addIngredientToList = async () => {
        // check if ingredient doesn't already exist
        for (const ingredient of ingredients) {
            if (ingredient.name === ingredientName) {
                return;
            }
        }

        // check if ingredient name is at least 2 and at most 35 characters long and only contains letters and numbers
        if (
            !/^[A-Za-z0-9]*$/.test(ingredientName) ||
            ingredientName.length < 2 ||
            ingredientName.length > 35
        ) {
            setIsInvalidIngredientName(true);
            setInvalidIngredientError(
                "Ingredient name must only contain letters and numbers and be at least 2 and at most 35 characters long."
            );
            return;
        }

        // check if amount is above 0
        if (amount <= 0) {
            setIsInvalidAmount(true);
            setInvalidIngredientError("Amount must be greater than 0.");
            return;
        }

        // check if measurement type is valid
        if (!["x", "kg", "g", "l", "ml", "tbsp", "tsp"].includes(measurement)) {
            setIsInvalidMeasurement(true);
            setInvalidIngredientError("Please select the measurement from the ones provided");
            return;
        }

        // if all checks pass, add the ingredient
        const { success, response } = await apiCalls.ingredientByName(ingredientName);

        // if ingredient already exists in DB retrive it, else create a new one
        if (success) {
            const { ingredient_name, ingredient_id } = response.data;

            const newIngredient = {
                id: ingredient_id,
                name: ingredient_name,
                amount,
                measurement
            };
            setIngredients(prev => [...prev, newIngredient]);
        } else {
            const { success, response } = await apiCalls.createIngredient(ingredientName);

            if (success) {
                const { ingredient_name, ingredient_id } = response.data;

                const newIngredient = {
                    id: ingredient_id,
                    name: ingredient_name,
                    amount,
                    measurement
                };
                setIngredients(prev => [...prev, newIngredient]);
            } else {
                setErrorMessage("Error: " + response.response.data.message);
            }
        }

        setIngredientName("");
        setAmount("1");
        setMeasurement("kg");
    };

    const createNewRecipe = async () => {
        const { authUserID } = userContext;
        const { success, response } = await apiCalls.createRecipe(
            recipeName,
            authUserID,
            instructions
        );

        const recipeID = response.data.recipe_id;

        // if recipe creation was successful, add all ingredients to the recipe
        if (success) {
            for (const ingredient of ingredients) {
                const { id, amount, measurement } = ingredient;
                apiCalls.addIngredientToRecipe(id, amount, measurement, recipeID);
            }
        } else {
            setErrorMessage("Error: " + response.response.data.message);
        }

        navigate("../created");
    };

    const handleSubmit = event => {
        event.preventDefault();

        // clear server error message
        setErrorMessage("");

        let valid = true;

        // check if there is at least one ingredient
        if (ingredients.length < 1) {
            setErrorMessage("Error: must add at least one ingredient.")
            valid = false
        }

        // chech if recipe name of letters, numbers and ! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~ at least 3 and at most 100 characters long
        if (!/^[ -~]*$/.test(recipeName) || recipeName.length < 3 || recipeName.length > 100) {
            setIsInvalidRecipeName(true);
            valid = false;
        }

        if (!/^[ -~|\n]*$/.test(instructions) || instructions.length > 2000) {
            setIsInvalidInstructions(true);
            valid = false;
        }

        if (valid) {
            createNewRecipe();
        }
    };

    // set isInvalidRecipeName to false when it becomes valid
    useEffect(() => {
        if (/^[ -~]*$/.test(recipeName) && recipeName.length >= 4 && recipeName.length <= 100) {
            setIsInvalidRecipeName(false);
        }
    }, [recipeName]);

    // set isInvalidRecipeName to false when it becomes valid
    useEffect(() => {
        if (/^[ -~|\n]*$/.test(instructions) && instructions.length <= 2000) {
            setIsInvalidInstructions(false);
        }
    }, [instructions]);

    return (
        <Container id="inputFormContainer">
            <h1>Create new Recipe</h1>
            <p className="formErrorMessage">{errorMessage}</p>
            <Form onSubmit={handleSubmit}>
                {/* Recipe name input */}
                <Form.Group className="mb-3" controlId="formBasicRecipename">
                    <Form.Label>Recipe Name</Form.Label>
                    <Form.Control
                        isInvalid={isInvalidRecipeName}
                        type="text"
                        placeholder="Recipe Name"
                        value={recipeName}
                        onChange={e => setRecipeName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Recipe name must only contain letters, numbers and the following symbols:{" "}
                        {"! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"} and must be at least 4 and at most
                        100 characters long.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Add ingredient input */}
                <Form.Group className="mb-3" controlId="formBasicRecipename">
                    <Form.Label>Add ingredients</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            isInvalid={isInvalidIngredientName}
                            type="text"
                            value={ingredientName}
                            placeholder="Ingredient Name"
                            onChange={e => {
                                setIngredientName(e.target.value);
                                setIsInvalidIngredientName(false);
                            }}
                        />
                        <Form.Control
                            isInvalid={isInvalidAmount}
                            className="newRecipeFormSubfield"
                            type="number"
                            placeholder="0"
                            min={1}
                            value={amount}
                            onChange={e => {
                                setAmount(e.target.value);
                                setIsInvalidAmount(false);
                            }}
                        />
                        <Form.Select
                            isInvalid={isInvalidMeasurement}
                            className="newRecipeFormSubfield"
                            value={measurement}
                            onChange={e => {
                                setMeasurement(e.target.value);
                                setIsInvalidMeasurement(false);
                            }}
                        >
                            <option>x</option>
                            <option>kg</option>
                            <option>g</option>
                            <option>l</option>
                            <option>ml</option>
                            <option>tbsp</option>
                            <option>tsp</option>
                        </Form.Select>
                        <Button
                            variant="outline-dark"
                            id="addRecipeButton"
                            onClick={addIngredientToList}
                        >
                            Add
                        </Button>
                        <Form.Control.Feedback type="invalid">
                            {invalidIngredientError}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                {/* List of added ingredients */}
                <Container className="NewRecipeIngredientList">
                    <ul>
                        {ingredients.map(ingredient => {
                            const { name, amount, measurement } = ingredient;
                            return <li key={name}>{`${amount}${measurement} ${name}`}</li>;
                        })}
                    </ul>
                </Container>

                {/* Recipe instruction input */}
                <Form.Group className="mb-4" controlId="formBasicRecipeInstructions">
                    <Form.Label>Recipe Instructions</Form.Label>
                    <Form.Control
                        isInvalid={isInvalidInstructions}
                        as="textarea"
                        rows="4"
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Instructions must only contain letters, numbers and the following symbols:{" "}
                        {"! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"} and must be at most 2000 characters
                        long.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="outline-dark" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default NewRicpeForm;
