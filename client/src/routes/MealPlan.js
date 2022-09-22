import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";

import Recipe from "../components/recipe/Recipe.js";

function MealPlan() {
    return (
        <Container className="mealPlanCarouselContainer">
            <Carousel wrap={false}>
                <Carousel.Item>
                    <Container>
                        <Recipe
                            recipeID={1}
                            name="Recipe name"
                            ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                            description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                        />
                    </Container>
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Recipe
                        recipeID={1}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />

                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Recipe
                        recipeID={1}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
}

export default MealPlan;
