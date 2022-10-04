import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";

import Recipe from "../recipe/Recipe";

function MealPlanCarousel() {
    return (
        <Container className="mealPlanCarouselContainer">
            <Carousel wrap={false} interval={null}>
                <Carousel.Item>
                    <Recipe
                        recipeID={15}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />
                    <Carousel.Caption>
                        <h3>Today</h3>
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
                        <h3>Tomorrow</h3>
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
                        <h3>Tuesday, 27 Septempber</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
}

export default MealPlanCarousel;
