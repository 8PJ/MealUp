import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";

function Recipe(props) {
    return (
        <Container className="recipeBox" fluid>
            <h1 className="recipeName">{props.name}</h1>
            <hr className="recipeDivider" />
            <Container className="recipeIngredients">
                <ul>
                    {props.ingredients.slice(0,3).map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </Container>
            <hr className="recipeDivider" />
            <Container className="recipeDescription">
                {props.description.slice(0, 100) + "..."}
            </Container>
            <Container className="d-flex justify-content-center">
                <Button
                    variant="outline-dark"
                    type="button"
                    className="recipeExpandButton"
                    size="lg"
                >
                    Full Recipe
                </Button>
            </Container>
        </Container>
    );
}

export default Recipe;
