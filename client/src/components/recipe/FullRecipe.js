import Container from "react-bootstrap/esm/Container";

function FullRecipe(props) {
    return (
        <Container className="recipeBoxFull" fluid>
            <h1 className="recipeNameFull">{props.name}</h1>
            <hr className="recipeDivider" />
            <Container className="recipeIngredientsFull">
                <ul>
                    {props.ingredients.slice(0, 3).map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </Container>
            <hr className="recipeDivider" />
            <Container className="recipeDescription">
                {props.description}
            </Container>
        </Container>
    );
}

export default FullRecipe;
