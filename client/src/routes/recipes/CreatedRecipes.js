import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RecipeSectionSelection from "../../components/recipe/RecipeSectionSelection";
import Recipe from "../../components/recipe/Recipe";

function FollowedRecipes(props) {
    return (
        <>
            <RecipeSectionSelection />
            <Row className="recipeWall">
                <Col xs={12} sm={6} lg={4} xl={3}>
                    <Recipe
                        recipeID={1}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3}>
                    <Recipe
                        recipeID={1}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3}>
                    <Recipe
                        recipeID={1}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3}>
                    <Recipe
                        recipeID={1}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3}>
                    <Recipe
                        recipeID={1}
                        name="Recipe name"
                        ingredients={["Ingredient1", "Ingredient2", "Ingredient3"]}
                        description="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book."
                    />
                </Col>
            </Row>
        </>
    );
}

export default FollowedRecipes;
