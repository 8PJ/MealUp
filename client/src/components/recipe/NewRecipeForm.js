import { useState } from "react";

import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/InputGroup";

import apiCalls from "../../api/apiCalls";

function NewRicpeForm(props) {
    const [errorMessage, setErrorMessage] = useState("");

    const [ingredients, setIngredients] = useState([]);

    const [ingredientName, setIngredientName] = useState("");

    const [measurement, setMeasurement] = useState("kg");
    const [amount, setAmount] = useState(1);

    const addIngredientToList = async () => {
        // check if ingredient doesn't already exist
        for (const ingredient of ingredients) {
            if (ingredient.name === ingredientName) {
                return;
            }
        }

        if (ingredientName.length > 0 && amount > 0) {
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
                const { success, response } = await apiCalls.createNewIngredient(ingredientName);

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
        }
    };

    return (
        <Container id="inputFormContainer">
            <h1>Create new Recipe</h1>
            <p className="formErrorMessage">{errorMessage}</p>
            <Form>
                {/* Recipe name input */}
                <Form.Group className="mb-3" controlId="formBasicRecipename">
                    <Form.Label>Recipe Name</Form.Label>
                    <Form.Control type="text" placeholder="Recipe Name" />
                </Form.Group>

                {/* Add ingredient input */}
                <Form.Group className="mb-3" controlId="formBasicRecipename">
                    <Form.Label>Add ingredients</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            value={ingredientName}
                            placeholder="Ingredient Name"
                            onChange={e => setIngredientName(e.target.value)}
                        />
                        <Form.Control
                            className="newRecipeFormSubfield"
                            type="number"
                            placeholder="0"
                            min={1}
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <Form.Select
                            className="newRecipeFormSubfield"
                            value={measurement}
                            onChange={e => setMeasurement(e.target.value)}
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
                    <Form.Control as="textarea" rows="4" />
                </Form.Group>
                <Button variant="outline-dark" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default NewRicpeForm;
