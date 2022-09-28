import Container from "react-bootstrap/esm/Container";

import FullRecipe from "../../components/recipe/FullRecipe";

function RecipeDetails(props) {
    return (
        <Container className="d-flex justify-content-center recipeInfo">
            <FullRecipe
                recipeID={1}
                name="This is a very long recipe name with many details in the name which is not good. Here are some more details to make the title even longer"
                ingredients={[
                    "Recipe one is very very very long which makes is hard to look at and understand, so it should be avoided",
                    "This is another very very llong ingredient name but this time it is even longer to make it span not one, not two but you guessed it three lines and possibly more which lets me check if it will be displayed correctly",
                    "Short ingredient",
                ]}
                description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
            />
        </Container>
    );
}

export default RecipeDetails;
