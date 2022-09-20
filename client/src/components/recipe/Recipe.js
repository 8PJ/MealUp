import Container from "react-bootstrap/esm/Container";

function Recipe(props) {
    return (
        <Container className="recipeBox">
            <h1 className="recipeName">Recipe Name</h1>
            <hr className="recipeDivider" />
            <Container className="recipeIngredients">
                <ul>
                    <li>Ingredient 1</li>
                    <li>Ingredient 2</li>
                    <li>Ingredient 3</li>
                </ul>
            </Container>
            <hr className="recipeDivider" />
            <Container className="recipeDescription">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
            </Container>
        </Container>
    );
}

export default Recipe;
