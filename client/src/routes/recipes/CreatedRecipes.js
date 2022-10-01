import { useContext, useEffect, useState } from "react";

import { UserContext } from "../../contexts/userContext";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Recipe from "../../components/recipe/Recipe";
import apiCalls from "../../api/apiCalls";

function FollowedRecipes(props) {
    const userContext = useContext(UserContext);

    const [createdRecipes, setCreatedRecipes] = useState([]);

    useEffect(() => {
        const getCreatedRecipes = async () => {
            const { success, response } = await apiCalls.createdRecipes(userContext.authUserID);
            if (success) {
                setCreatedRecipes(response.data);
            } else {
                console.log(response);
            }
        };

        getCreatedRecipes();
    }, [userContext.authUserID]);

    return (
        <Row className="recipeWall">
            {createdRecipes.map(recipe => {
                return (
                    <Col className="recipeCol" xs={12} sm={6} lg={4} xl={3} key={recipe.recipe_id}>
                        <Recipe
                            recipeID={recipe.recipe_id}
                            name={recipe.recipe_name}
                            description={recipe.recipe_instructions}
                        />
                    </Col>
                );
            })}
        </Row>
    );
}

export default FollowedRecipes;
