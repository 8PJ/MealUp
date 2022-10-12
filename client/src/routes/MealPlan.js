import { useState } from "react";

import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

import MealPlanCarousel from "../components/mealPlan/MealPlanCarousel";

function MealPlan() {
    const [showMealPlan, setShowMealPlan] = useState(false);

    return showMealPlan ? (
        <MealPlanCarousel />
    ) : (
        <>
            <Container className="d-flex justify-content-center mealPlanWarning">
                If this is your first time getting a meal plan, make sure you've added all the
                recipes that you want to use in your meal plan.
            </Container>
            <Container className="d-flex justify-content-center mealPlanButtoncontainer">
                <Button
                    variant="outline-dark"
                    type="button"
                    className="showMealplanButton"
                    size="lg"
                    onClick={() => {
                        setShowMealPlan(true);
                    }}
                >
                    Get Meal Plan
                </Button>
            </Container>
        </>
    );
}

export default MealPlan;
