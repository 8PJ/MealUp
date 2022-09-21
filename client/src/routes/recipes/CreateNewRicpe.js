import { useState, useEffect } from "react";

import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/InputGroup";

import RecipeBreadcrumb from "../../components/recipe/RecipeBreadcrumb";
import RecipeDropdown from "../../components/recipe/RecipeDropdown";

function CreateNewRicpe(props) {
    // render Dropdown when window.innerWidth <= 464
    const [isDropdown, setIsDropdown] = useState(window.innerWidth <= 464);

    const [ingredientName, setIngredientName] = useState("");
    const [ingredients, setIngredients] = useState([]);

    const [measurement, setMeasurement] = useState("kg");
    const [amount, setAmount] = useState();

    const addIngredientToList = () => {
        // check if ingredient doesn't already exist
        for (const ingredient of ingredients) {
            if (ingredient.name === ingredientName) {
                return;
            }
        }

        if (ingredientName.length > 0) {
            const newIngredient = { name: ingredientName, amount, measurement };
            setIngredients((prev) => [...prev, newIngredient]);
            setIngredientName("");
            setAmount("");
        }
    };

    // update recipe page selectors based on screen size
    useEffect(() => {
        const handleWindowResize = () => setIsDropdown(window.innerWidth <= 464);

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return (
        <>
            <Container className="recipeNavigation d-flex justify-content-center">
                {isDropdown ? <RecipeDropdown /> : <RecipeBreadcrumb />}
            </Container>
            <Container id="inputFormContainer">
                <h1>Create new Recipe</h1>
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
                                onChange={(e) => setIngredientName(e.target.value)}
                            />
                            <Form.Control
                                style={{ "max-width": "15%" }}
                                type="number"
                                placeholder={0}
                                min={0}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <Form.Select
                                style={{ "max-width": "25%" }}
                                value={measurement}
                                onChange={(e) => setMeasurement(e.target.value)}
                            >
                                <option>kg</option>
                                <option>g</option>
                                <option>l</option>
                                <option>ml</option>
                                <option>pcs</option>
                                <option>x</option>
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
                            {ingredients.map((ingredient) => {
                                const { name, amount, measurement } = ingredient;
                                return <li key={name}>{`${name} ${amount}${measurement}`}</li>;
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
        </>
    );
}

export default CreateNewRicpe;
