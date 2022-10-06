import { useContext, useEffect, useState } from "react";

import { UserContext } from "../../contexts/userContext";

import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";

import Recipe from "../recipe/Recipe";
import NoData from "../NoData";

import apiCalls from "../../api/apiCalls";

function MealPlanCarousel() {
    const userContext = useContext(UserContext);
    const [mealPlan, setMealPlan] = useState([]);

    useEffect(() => {
        const getMealPlan = async () => {
            const { success, response } = await apiCalls.userMealPlan(userContext.authUserID);
            if (success) {
                setMealPlan(response.data);
            } else {
                console.log(response);
            }
        };
        getMealPlan();
    }, [userContext]);

    const dateToWord = date => {
        const now = new Date("2022-10-05");
        now.setHours(0, 0, 0);

        // const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
        const diffDays = Math.floor((date - now) / (1000 * 3600 * 24));

        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Tomorrow";
        }

        return date.toLocaleDateString();
    };

    return mealPlan.length !== 0 ? (
        <Container className="mealPlanCarouselContainer">
            <Carousel wrap={false} interval={null}>
                {mealPlan.map(recipe => {
                    return (
                        <Carousel.Item key={recipe.day_to_make}>
                            <Recipe recipeID={recipe.recipe_id} />
                            <Carousel.Caption>
                                <h3>{dateToWord(new Date(recipe.day_to_make))}</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                    );
                })}
            </Carousel>
        </Container>
    ) : (
        <NoData
            message="You currently don't follow any recipes, you 
            need to follow at least one recipe to generate a meal plan.
            You can do so by creating a new recipe."
            link="/recipes/createNew"
            linkText="Create new recipe"
        />
    );
}

export default MealPlanCarousel;
